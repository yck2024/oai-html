'use strict';

const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const E = require('./ehon.js');
const C = require('./continuous.js');

// A tiny three-page story fixture, independent of any real series' content: a cover with no
// narrated lines, one page with two narrated lines (each in two languages), and one page with a
// single line narrated in only one language — enough to exercise every kind of segment
// buildContinuousTimeline produces (language gaps, sentence gaps, page gaps, a silent cover).
const STORY = {
  id: 'fixture-book',
  pages: [
    { id: 'cover', lines: [] },
    {
      id: 'p01',
      lines: [
        { id: 'p01-1', ja: '{一|いち}', zh: '一' },
        { id: 'p01-2', ja: '{二|に}', zh: '二' },
      ],
    },
    { id: 'p02', lines: [{ id: 'p02-1', ja: '{三|さん}' }] },
  ],
};

const MODES = E.buildListenModes(['ja', 'zh']);

const TIMING = {
  silence: { language: 300, sentence: 600, page: 900 },
  stories: {
    'fixture-book': {
      'p01-1': { ja: 1000, zh: 1100 },
      'p01-2': { ja: 1200, zh: 1300 },
      'p02-1': { ja: 1400 },
    },
  },
};

test('buildContinuousTimeline: ja-zh mode interleaves both languages per sentence, with language/sentence/page gaps in between', () => {
  const timeline = C.buildContinuousTimeline(E, STORY, MODES, 'ja-zh', 'ja-zh', TIMING);
  assert.deepEqual(
    timeline.segments.map(segment => (segment.kind === 'clip' ? `${segment.lineId}/${segment.lang}` : `gap:${segment.which}`)),
    [
      'gap:page', // leading pause before the first narrated page (also separates it from the silent cover)
      'p01-1/ja', 'gap:language', 'p01-1/zh', 'gap:sentence',
      'p01-2/ja', 'gap:language', 'p01-2/zh',
      'gap:page',
      'p02-1/ja',
    ],
  );
});

test('buildContinuousTimeline: a single-language mode drops every language gap but keeps sentence/page gaps', () => {
  const timeline = C.buildContinuousTimeline(E, STORY, MODES, 'ja-zh', 'ja', TIMING);
  assert.deepEqual(
    timeline.segments.map(segment => (segment.kind === 'clip' ? `${segment.lineId}/${segment.lang}` : `gap:${segment.which}`)),
    ['gap:page', 'p01-1/ja', 'gap:sentence', 'p01-2/ja', 'gap:page', 'p02-1/ja'],
  );
});

test('buildContinuousTimeline: zh mode only plays the lines that have a zh clip, skipping the zh-less last page', () => {
  const timeline = C.buildContinuousTimeline(E, STORY, MODES, 'ja-zh', 'zh', TIMING);
  assert.deepEqual(
    timeline.segments.map(segment => (segment.kind === 'clip' ? `${segment.lineId}/${segment.lang}` : `gap:${segment.which}`)),
    ['gap:page', 'p01-1/zh', 'gap:sentence', 'p01-2/zh'],
  );
});

test('buildContinuousTimeline: every page (including the silent cover) gets a distinct, seekable startMs', () => {
  const timeline = C.buildContinuousTimeline(E, STORY, MODES, 'ja-zh', 'ja-zh', TIMING);
  const starts = timeline.pages.map(page => page.startMs);
  assert.deepEqual(starts, [0, 900, 900 + 1000 + 300 + 1100 + 600 + 1200 + 300 + 1300 + 900]);
  assert.equal(new Set(starts).size, starts.length, 'no two pages should share a start time');
  assert.equal(timeline.totalMs, starts[2] + 1400);
});

test('mapTimeToPage: lands on the last page whose slot has already started, and clamps to the final page past the end', () => {
  const timeline = C.buildContinuousTimeline(E, STORY, MODES, 'ja-zh', 'ja-zh', TIMING);
  const [coverStart, p01Start, p02Start] = timeline.pages.map(page => page.startMs);
  assert.equal(C.mapTimeToPage(timeline.pages, coverStart), 0);
  assert.equal(C.mapTimeToPage(timeline.pages, p01Start), 1);
  assert.equal(C.mapTimeToPage(timeline.pages, p01Start + 500), 1);
  assert.equal(C.mapTimeToPage(timeline.pages, p02Start), 2);
  assert.equal(C.mapTimeToPage(timeline.pages, timeline.totalMs + 10_000), 2);
});

test('mapTimeToPage: seeking to a page (its own startMs) always reports that same page back, never its neighbor', () => {
  const timeline = C.buildContinuousTimeline(E, STORY, MODES, 'ja-zh', 'ja-zh', TIMING);
  for (const [index, page] of timeline.pages.entries()) {
    assert.equal(C.mapTimeToPage(timeline.pages, page.startMs), index, `page ${index}'s own startMs must map back to page ${index}`);
  }
});

test('mapTimeToLine: reports the sounding line inside its window and null inside a gap', () => {
  const timeline = C.buildContinuousTimeline(E, STORY, MODES, 'ja-zh', 'ja-zh', TIMING);
  const first = timeline.lines[0]; // p01-1/ja
  assert.deepEqual(
    { lineId: first.lineId, lang: first.lang },
    { lineId: 'p01-1', lang: 'ja' },
  );
  assert.equal(C.mapTimeToLine(timeline.lines, first.startMs), first);
  assert.equal(C.mapTimeToLine(timeline.lines, first.endMs - 1), first);
  assert.equal(C.mapTimeToLine(timeline.lines, first.endMs), null, 'the instant a clip ends is already inside the following gap');
  assert.equal(C.mapTimeToLine(timeline.lines, -1), null);
});

test('next/previous seeking: createContinuousPlayer.seekToPage jumps the shared audio element straight to that page\'s start time', () => {
  const timeline = C.buildContinuousTimeline(E, STORY, MODES, 'ja-zh', 'ja-zh', TIMING);
  const audio = { currentTime: 0, play: () => Promise.resolve(), pause() {} };
  const player = C.createContinuousPlayer(audio, {});
  // seekToPage before anything has ever played (no timeline attached yet) safely no-ops.
  assert.equal(player.seekToPage(1), false);

  return player.play(new Blob(['x']), timeline, { startAtMs: timeline.pages[1].startMs }).then(() => {
    assert.ok(player.seekToPage(2));
    assert.equal(audio.currentTime, timeline.pages[2].startMs / 1000);
    assert.ok(player.seekToPage(0));
    assert.equal(audio.currentTime, timeline.pages[0].startMs / 1000);
    assert.equal(player.seekToPage(99), false, 'seeking past the last page is a no-op, not a crash');
  });
});

test('createContinuousPlayer: play/pause/resume/stop track state the same shape as ehon.js\'s narrator', () => {
  const timeline = C.buildContinuousTimeline(E, STORY, MODES, 'ja-zh', 'ja-zh', TIMING);
  const audio = { currentTime: 0, play: () => Promise.resolve(), pause() {} };
  const player = C.createContinuousPlayer(audio, {});
  assert.equal(player.state, 'idle');

  player.loading();
  assert.equal(player.state, 'loading');

  return player.play(new Blob(['x']), timeline).then(() => {
    assert.equal(player.state, 'playing');
    assert.ok(player.pause());
    assert.equal(player.state, 'paused');
    assert.equal(player.pause(), false, 'pausing twice in a row is a no-op');
    assert.ok(player.resume());
    assert.equal(player.state, 'playing');
    player.stop();
    assert.equal(player.state, 'idle');
    assert.equal(player.timeline, null);
  });
});

test('createContinuousPlayer: an ended playback reports idle and fires onEnded once', () => {
  const timeline = C.buildContinuousTimeline(E, STORY, MODES, 'ja-zh', 'ja-zh', TIMING);
  const audio = { currentTime: 0, play: () => Promise.resolve(), pause() {} };
  let endedCount = 0;
  const player = C.createContinuousPlayer(audio, { onEnded: () => { endedCount += 1; } });
  return player.play(new Blob(['x']), timeline).then(() => {
    audio.onended();
    assert.equal(player.state, 'idle');
    assert.equal(endedCount, 1);
  });
});

test('stripId3v2/stripId3v1/stripTags: removes a leading ID3v2 tag and a trailing ID3v1 tag, leaving pure MP3 frame bytes', () => {
  const id3Body = new Uint8Array(20).fill(0x99); // arbitrary tag payload, not a valid frame
  const size = id3Body.length;
  const id3Header = Uint8Array.from([
    0x49, 0x44, 0x33, 4, 0, 0, // 'ID3', version, flags
    (size >> 21) & 0x7f, (size >> 14) & 0x7f, (size >> 7) & 0x7f, size & 0x7f, // synchsafe size
  ]);
  const frame = Uint8Array.from([0xff, 0xf3, 0x14, 0xc4, 1, 2, 3, 4]); // a plausible MP3 frame
  const id3v1 = new Uint8Array(128);
  id3v1.set([0x54, 0x41, 0x47], 0); // 'TAG'

  const withLeadingTag = new Uint8Array([...id3Header, ...id3Body, ...frame]);
  assert.deepEqual([...C.stripId3v2(withLeadingTag)], [...frame]);

  const withTrailingTag = new Uint8Array([...frame, ...id3v1]);
  assert.deepEqual([...C.stripId3v1(withTrailingTag)], [...frame]);

  const withBoth = new Uint8Array([...id3Header, ...id3Body, ...frame, ...id3v1]);
  assert.deepEqual([...C.stripTags(withBoth)], [...frame]);

  // A clip with neither tag (like every silence clip generated with -id3v2_version 0) passes
  // through unchanged.
  assert.deepEqual([...C.stripTags(frame)], [...frame]);
});

test('assembleContinuousBlob: reads every segment through loadBytes, in the exact timeline order, for each listening mode', async () => {
  async function orderFor(mode) {
    const timeline = C.buildContinuousTimeline(E, STORY, MODES, 'ja-zh', mode, TIMING);
    const calls = [];
    const loadBytes = segment => {
      calls.push(segment.kind === 'clip' ? `${segment.lineId}/${segment.lang}` : `gap:${segment.which}`);
      return Promise.resolve(new Uint8Array([calls.length]).buffer);
    };
    const blob = await C.assembleContinuousBlob(timeline, loadBytes);
    assert.equal(blob.size, timeline.segments.length); // one stripped byte per segment in this fixture
    return calls;
  }

  assert.deepEqual(await orderFor('ja-zh'), [
    'gap:page', 'p01-1/ja', 'gap:language', 'p01-1/zh', 'gap:sentence', 'p01-2/ja', 'gap:language', 'p01-2/zh', 'gap:page', 'p02-1/ja',
  ]);
  assert.deepEqual(await orderFor('zh-ja'), [
    'gap:page', 'p01-1/zh', 'gap:language', 'p01-1/ja', 'gap:sentence', 'p01-2/zh', 'gap:language', 'p01-2/ja', 'gap:page', 'p02-1/ja',
  ]);
  assert.deepEqual(await orderFor('ja'), ['gap:page', 'p01-1/ja', 'gap:sentence', 'p01-2/ja', 'gap:page', 'p02-1/ja']);
});

test('createByteLoader: fetches each clip once and memoizes each silence kind instead of refetching it for every gap', async () => {
  const timeline = C.buildContinuousTimeline(E, STORY, MODES, 'ja-zh', 'ja-zh', TIMING);
  const fetched = [];
  const fetchFn = url => {
    fetched.push(url);
    return Promise.resolve({ arrayBuffer: () => Promise.resolve(new ArrayBuffer(4)) });
  };
  const loadBytes = C.createByteLoader(fetchFn, '/taiwan-ehon/', STORY.id);
  for (const segment of timeline.segments) await loadBytes(segment); // sequential, like assembleContinuousBlob

  assert.deepEqual(fetched, [
    '/taiwan-ehon/silence/page.mp3',
    '/taiwan-ehon/audio/fixture-book/ja/p01-1.mp3',
    '/taiwan-ehon/silence/language.mp3',
    '/taiwan-ehon/audio/fixture-book/zh/p01-1.mp3',
    '/taiwan-ehon/silence/sentence.mp3',
    '/taiwan-ehon/audio/fixture-book/ja/p01-2.mp3',
    '/taiwan-ehon/audio/fixture-book/zh/p01-2.mp3',
    '/taiwan-ehon/audio/fixture-book/ja/p02-1.mp3',
  ]);
});

function hasFfprobe() {
  try {
    execFileSync('ffprobe', ['-version'], { stdio: 'ignore' });
    return true;
  } catch (_error) {
    return false;
  }
}

// The one check in this file that touches real files: takes two real taiwan-ehon clips and the
// real checked-in silence clips, assembles them exactly as the browser would (fetch bytes ->
// strip tags -> concatenate into one Blob), and hands the result to ffprobe — the same tool a
// human would use to ask "does this file actually decode, and for how long?" Guards the core
// risk this whole feature depends on: that byte-concatenated MP3 clips actually play in Chrome.
test('assembleContinuousBlob output is a single MP3 ffprobe can decode, with the expected total duration', { skip: !hasFfprobe() && 'ffprobe not found on PATH' }, async () => {
  const TAIWAN_DIR = path.join(__dirname, '..', 'taiwan-ehon');
  const stories = require(path.join(TAIWAN_DIR, 'stories.js'));
  const timing = require(path.join(TAIWAN_DIR, 'audio-timing.js'));
  const story = stories[0];
  const page = story.pages.find(candidate => candidate.lines.length >= 2);
  const smallStory = { id: story.id, pages: [{ id: 'cover', lines: [] }, page] };

  const timeline = C.buildContinuousTimeline(E, smallStory, MODES, 'ja-zh', 'ja-zh', timing);
  const loadBytes = segment => {
    const filePath = segment.kind === 'clip'
      ? path.join(TAIWAN_DIR, 'audio', story.id, segment.lang, `${segment.lineId}.mp3`)
      : path.join(__dirname, 'silence', `${segment.which}.mp3`);
    const buffer = fs.readFileSync(filePath);
    // Buffer#buffer is the whole (possibly pooled, over-sized) ArrayBuffer backing it; slice to
    // this buffer's own byteOffset/length or Node's internal pool can leak unrelated bytes in.
    return Promise.resolve(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength));
  };
  const blob = await C.assembleContinuousBlob(timeline, loadBytes);

  const tmpFile = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'continuous-')), 'joined.mp3');
  fs.writeFileSync(tmpFile, Buffer.from(await blob.arrayBuffer()));
  // A plain `ffprobe -show_entries format=duration` on a bare MP3 elementary stream can be
  // fooled by stray VBR-header-style metadata into reporting a wrong estimate without actually
  // decoding anything — exactly the failure mode this test exists to catch, so it can't also be
  // how the test measures success. Summing every packet's own decoded duration (equivalent to
  // fully decoding the file, e.g. via `ffmpeg -f null -`) is what actually proves playback works.
  const packetDurations = execFileSync('ffprobe', [
    '-v', 'error', '-show_entries', 'packet=duration_time', '-of', 'csv=p=0', tmpFile,
  ], { encoding: 'utf8' }).trim().split('\n').filter(Boolean).map(Number);
  const decodedMs = Math.round(packetDurations.reduce((sum, seconds) => sum + seconds, 0) * 1000);
  fs.rmSync(path.dirname(tmpFile), { recursive: true, force: true });

  // ffprobe successfully decoded real audio packets (not just read a header) covering close to
  // the manifest's own sum — decoder frame-boundary rounding, not silent truncation or garbage
  // past a bad splice point.
  assert.ok(packetDurations.length > 0);
  assert.ok(
    Math.abs(decodedMs - timeline.totalMs) < 500,
    `decoded duration ${decodedMs}ms should be within 500ms of the manifest's ${timeline.totalMs}ms`,
  );
});
