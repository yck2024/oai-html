'use strict';

const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const test = require('node:test');
const { generate } = require('./generate-audio-timing.js');

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
