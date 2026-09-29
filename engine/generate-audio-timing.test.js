'use strict';

const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const test = require('node:test');
const { generate } = require('./generate-audio-timing.js');
const C = require('./continuous.js');

// A tiny fixture independent of any real series: `exists`/`probe` are both injected, so this
// exercises the manifest-shape logic (which clips are included, how silence/story timings are
// keyed) without touching a real ffprobe binary or real audio files on disk.
const STORIES = [
  {
    id: 'book-a',
    pages: [
      { id: 'cover', lines: [] },
      {
        id: 'p01',
        lines: [
          { id: 'p01-1', ja: '一', zh: '一' },
          { id: 'p01-2', ja: '二' }, // zh line missing entirely: never probed
        ],
      },
    ],
  },
];

function fixture({ missingClip = null } = {}) {
  const probed = [];
  const exists = filePath => filePath !== missingClip;
  const probe = filePath => {
    probed.push(filePath);
    return 1234; // a fixed, recognizable duration so tests can assert it flowed through untouched
  };
  const manifest = generate({ write: false, stories: STORIES, languages: ['ja', 'zh'], probe, exists });
  return { manifest, probed };
}

test('generate(): probes every silence kind exactly once, keyed by kind', () => {
  const { manifest, probed } = fixture();
  assert.deepEqual(manifest.silence, { language: 1234, sentence: 1234, page: 1234 });
  assert.equal(probed.filter(p => p.includes('silence')).length, 3);
});

test('generate(): probes exactly the clips a page/line/language combination actually declares, skipping languages the line omits', () => {
  const { manifest } = fixture();
  assert.deepEqual(manifest.stories, {
    'book-a': {
      'p01-1': { ja: 1234, zh: 1234 },
      'p01-2': { ja: 1234 }, // no zh key: p01-2 never declares a zh line
    },
  });
});

test('generate(): a clip missing from disk (exists() false) is silently omitted rather than probed or crashing', () => {
  const missingClip = require('node:path').join(__dirname, 'audio', 'book-a', 'zh', 'p01-1.mp3');
  const { manifest, probed } = fixture({ missingClip });
  assert.equal(manifest.stories['book-a']['p01-1'].zh, undefined);
  assert.equal(manifest.stories['book-a']['p01-1'].ja, 1234);
  assert.ok(!probed.includes(missingClip));
});

test('generate(): a story with zero clips on disk (a series with no narration yet) still produces a valid, empty manifest', () => {
  const manifest = generate({
    write: false,
    stories: [{ id: 'empty-book', pages: [{ id: 'cover', lines: [] }] }],
    languages: ['ja'],
    probe: () => { throw new Error('should never be called'); },
    exists: () => false,
  });
  assert.deepEqual(manifest.stories, { 'empty-book': {} });
  assert.deepEqual(manifest.silence, { language: 0, sentence: 0, page: 0 });
});

function hasFfprobe() {
  try {
    execFileSync('ffprobe', ['-version'], { stdio: 'ignore' });
    return true;
  } catch (_error) {
    return false;
  }
}

test('defaultProbe(): reads a real duration from ffprobe, in whole milliseconds', { skip: !hasFfprobe() && 'ffprobe not found on PATH' }, () => {
  const { defaultProbe } = require('./generate-audio-timing.js');
  const path = require('node:path');
  const ms = defaultProbe(path.join(__dirname, 'silence', 'page.mp3'));
  assert.equal(typeof ms, 'number');
  assert.ok(ms > 0 && ms < 5000, `expected a small positive duration, got ${ms}`);
});

test('defaultProbe(): excludes the first Xing frame duration when continuous assembly strips that frame', {
  skip: (!hasFfprobe() || require('node:child_process').spawnSync('ffmpeg', ['-version'], { stdio: 'ignore' }).status !== 0)
    && 'ffprobe/ffmpeg not found on PATH',
}, () => {
  const fs = require('node:fs');
  const path = require('node:path');
  const os = require('node:os');
  // Production clips are now CBR without Xing headers. Transcode one temporary legacy VBR
  // fixture to keep testing the generator's handling of older/header-bearing inputs.
  const source = path.join(__dirname, '..', 'taiwan-ehon', 'audio', 'bai-zei-qi', 'ja', 'p01-1.mp3');
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'ehon-vbr-'));
  const clip = path.join(directory, 'legacy.mp3');
  execFileSync('ffmpeg', ['-nostdin', '-loglevel', 'error', '-i', source, '-q:a', '4', clip]);
  const bytes = new Uint8Array(fs.readFileSync(clip));
  const withoutId3 = C.stripId3v2(bytes);
  const withoutVbrHeader = C.stripVbrHeaderFrame(withoutId3);
  assert.ok(withoutVbrHeader.byteLength < withoutId3.byteLength, 'fixture must contain a Xing/Info frame removed during assembly');

  const metadata = JSON.parse(execFileSync('ffprobe', [
    '-v', 'error', '-show_entries', 'format=duration:packet=duration_time', '-of', 'json', clip,
  ], { encoding: 'utf8' }));
  const expectedMs = Math.round(
    parseFloat(metadata.format.duration) * 1000 - parseFloat(metadata.packets[0].duration_time) * 1000,
  );
  const { defaultProbe } = require('./generate-audio-timing.js');
  assert.equal(defaultProbe(clip), expectedMs);
  fs.rmSync(directory, { recursive: true, force: true });
});
