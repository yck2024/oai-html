'use strict';

// Exercises the shared engine's pure logic against the taiwan-ehon dataset — the only series
// with a full, real story catalog today. See multi-series.test.js for the generic checks that
// run against every registered series (including one, like japan-ehon, with zero stories yet).

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const E = require('./ehon.js');

const TAIWAN_DIR = path.join(__dirname, '..', 'taiwan-ehon');
const stories = require(path.join(TAIWAN_DIR, 'stories.js'));
const SERIES = require(path.join(TAIWAN_DIR, 'series.config.js'));
const LISTEN_MODES = E.buildListenModes(SERIES.languages);
const DEFAULT_MODE = SERIES.defaultMode;

const HAN = /\p{Script=Han}/u;
const storyById = id => stories.find(story => story.id === id);

test('each data-driven book has a cover, numbered illustrated story pages, and an ending', () => {
  assert.deepEqual(stories.map(story => story.id), [
    'bai-zei-qi', 'shooting-the-sun', 'shao-white-deer', 'xinpu-shi-ye', 'dajia-mazu-pilgrimage',
    'hu-gu-po', 'qing-mi-long-she', 'a-la-ba-nai',
  ]);
  for (const story of stories) {
    const storyPages = story.pages.slice(1, -1).map(page => page.id);
    assert.equal(story.pages[0].id, 'cover');
    assert.equal(story.pages.at(-1).id, 'end');
    assert.ok(storyPages.length >= 10, `${story.id} has at least ten story pages`);
    assert.deepEqual(storyPages, storyPages.map((_, index) => `p${String(index + 1).padStart(2, '0')}`), `${story.id} story pages are numbered in order`);
    assert.ok(story.title.ja && story.title.zh && story.title.zhuyin);

    for (const page of story.pages) {
      assert.ok(page.alt.ja && page.alt.zh, `${story.id}/${page.id} has bilingual alt text`);
      assert.ok(fs.existsSync(path.join(TAIWAN_DIR, page.image)), `${story.id}/${page.id} illustration exists`);
      const image = fs.readFileSync(path.join(TAIWAN_DIR, page.image));
      assert.equal(image.toString('latin1', 0, 4), 'RIFF', `${story.id}/${page.id} image is RIFF`);
      assert.equal(image.toString('latin1', 8, 12), 'WEBP', `${story.id}/${page.id} image is WebP`);
      assert.ok(page.lines.length >= 1 && page.lines.length <= 3, `${story.id}/${page.id} has one to three sentence clips`);

      for (const line of page.lines) {
        assert.ok(line.ja && line.zh && line.zhuyin, `${story.id}/${line.id} has Japanese, Chinese, and 注音`);
        assert.doesNotThrow(() => E.zhuyinSegments(line.zh, line.zhuyin), `${story.id}/${line.id} 注音 matches Han characters`);
        for (const segment of E.parseRuby(line.ja)) {
          if (!segment.ruby) assert.ok(![...segment.text].some(char => HAN.test(char)), `${story.id}/${line.id} has kana-first Japanese or explicit furigana`);
        }
        for (const language of SERIES.languages) {
          const clip = path.join(TAIWAN_DIR, 'audio', story.id, language, `${line.id}.mp3`);
          assert.ok(fs.existsSync(clip), `${story.id}/${language}/${line.id}.mp3 exists`);
          assert.ok(fs.statSync(clip).size > 1024, `${story.id}/${language}/${line.id}.mp3 is non-empty`);
        }
      }
    }
  }
});

test('the four listening modes keep matching sentences adjacent and use Japanese then Chinese by default', () => {
  const page = storyById('bai-zei-qi').pages.find(item => item.id === 'p02');
  assert.equal(DEFAULT_MODE, 'ja-zh');
  assert.deepEqual(E.languagesFor(LISTEN_MODES, DEFAULT_MODE, 'ja-zh'), ['ja', 'zh']);
  assert.deepEqual(E.languagesFor(LISTEN_MODES, DEFAULT_MODE, 'zh-ja'), ['zh', 'ja']);
  assert.deepEqual(E.languagesFor(LISTEN_MODES, DEFAULT_MODE, 'ja'), ['ja']);
  assert.deepEqual(E.languagesFor(LISTEN_MODES, DEFAULT_MODE, 'zh'), ['zh']);
  assert.equal(E.isMode(LISTEN_MODES, 'other'), false);
  assert.deepEqual(E.languagesFor(LISTEN_MODES, DEFAULT_MODE, 'other'), ['ja', 'zh']);

  const pairs = page.lines.flatMap(line => [
    { lineId: line.id, lang: 'ja' },
    { lineId: line.id, lang: 'zh' },
  ]);
  assert.deepEqual(E.pageQueue(page, LISTEN_MODES, DEFAULT_MODE, 'ja-zh'), pairs);
  assert.deepEqual(E.pageQueue(page, LISTEN_MODES, DEFAULT_MODE, 'zh-ja'), pairs.map((step, index) => ({ ...step, lang: index % 2 ? 'ja' : 'zh' })));
  assert.deepEqual(E.pageQueue(page, LISTEN_MODES, DEFAULT_MODE, 'ja'), page.lines.map(line => ({ lineId: line.id, lang: 'ja' })));
  assert.deepEqual(E.pageQueue(page, LISTEN_MODES, DEFAULT_MODE, 'zh'), page.lines.map(line => ({ lineId: line.id, lang: 'zh' })));
});

test('page navigation clamps safely and swipe gestures only turn on a horizontal drag', () => {
  const story = storyById('shooting-the-sun');
  const book = E.createBook(story, -10);
  assert.equal(book.index, 0);
  assert.equal(book.isFirst(), true);
  assert.equal(book.next(), true);
  assert.equal(book.index, 1);
  assert.equal(book.goTo(999), true);
  assert.equal(book.index, story.pages.length - 1);
  assert.equal(book.isLast(), true);
  assert.equal(book.next(), false);
  assert.equal(book.goTo(0), true);
  assert.equal(book.prev(), false);
  assert.equal(E.swipeDirection(-100, 10), 'next');
  assert.equal(E.swipeDirection(100, 10), 'prev');
  assert.equal(E.swipeDirection(20, 80), null);
});

test('pausing during language and sentence gaps suspends advancement until resume', async t => {
  const cases = [
    {
      name: 'language gap',
      steps: [{ lineId: 'line-1', lang: 'ja' }, { lineId: 'line-1', lang: 'zh' }],
      delay: E.PAUSE_BETWEEN_LANGUAGES,
      nextClip: './audio/story/zh/line-1.mp3',
    },
    {
      name: 'sentence gap',
      steps: [{ lineId: 'line-1', lang: 'ja' }, { lineId: 'line-2', lang: 'ja' }],
      delay: E.PAUSE_BETWEEN_SENTENCES,
      nextClip: './audio/story/ja/line-2.mp3',
    },
  ];

  for (const scenario of cases) {
    await t.test(scenario.name, () => {
      const played = [];
      const waits = [];
      const audio = {
        pause() {},
        play() { played.push(this.src); return Promise.resolve(); },
      };
      const narrator = E.createNarrator(audio, {}, (ms, fn) => waits.push({ ms, fn }));
      narrator.play('story', scenario.steps);
      audio.onended();
      assert.equal(waits[0].ms, scenario.delay);

      assert.equal(narrator.pause(), true);
      waits[0].fn();
      assert.equal(narrator.state, 'paused');
      assert.deepEqual(played, ['./audio/story/ja/line-1.mp3']);

      assert.equal(narrator.resume(), true);
      assert.equal(narrator.state, 'playing');
      assert.deepEqual(played, ['./audio/story/ja/line-1.mp3', scenario.nextClip]);
      waits[0].fn();
      assert.deepEqual(played, ['./audio/story/ja/line-1.mp3', scenario.nextClip]);
    });
  }
});

test('pause-aborted play promises preserve paused narration across initial and resumed playback', async () => {
  const rejectors = [];
  const unavailable = [];
  const audio = {
    pause() {},
    play() { return new Promise((_resolve, reject) => rejectors.push(reject)); },
  };
  const narrator = E.createNarrator(audio, { onUnavailable: () => unavailable.push(true) });
  const steps = [{ lineId: 'line-1', lang: 'ja' }];
  const abort = () => Object.assign(new Error('playback interrupted'), { name: 'AbortError' });

  narrator.play('story', steps);
  narrator.pause();
  rejectors[0](abort());
  await Promise.resolve();
  assert.equal(narrator.state, 'paused');
  assert.deepEqual(unavailable, []);

  narrator.resume();
  assert.equal(rejectors.length, 2);
  narrator.pause();
  rejectors[1](abort());
  await Promise.resolve();
  assert.equal(narrator.state, 'paused');
  assert.deepEqual(unavailable, []);
});

test('genuine playback failures remain unavailable after a pause', async () => {
  let rejectPlay;
  const unavailable = [];
  const audio = {
    pause() {},
    play() { return new Promise((_resolve, reject) => { rejectPlay = reject; }); },
  };
  const narrator = E.createNarrator(audio, { onUnavailable: () => unavailable.push(true) });
  narrator.play('story', [{ lineId: 'line-1', lang: 'ja' }]);
  narrator.pause();
  rejectPlay(Object.assign(new Error('decoder failed'), { name: 'NotSupportedError' }));
  await Promise.resolve();

  assert.equal(narrator.state, 'idle');
  assert.deepEqual(unavailable, [true]);
});

test('narration highlights each queued language clip and advances one sentence at a time', () => {
  const played = [];
  const highlighted = [];
  const waits = [];
  const audio = {
    pause() {},
    play() { played.push(this.src); return Promise.resolve(); },
  };
  const narrator = E.createNarrator(audio, { onStep: step => highlighted.push(step) }, (ms, fn) => waits.push({ ms, fn }));
  const page = storyById('bai-zei-qi').pages.find(item => item.id === 'p01');
  narrator.play('bai-zei-qi', E.pageQueue(page, LISTEN_MODES, DEFAULT_MODE, 'ja-zh'));

  assert.deepEqual(played, ['./audio/bai-zei-qi/ja/p01-1.mp3']);
  assert.deepEqual(highlighted[0], { lineId: 'p01-1', lang: 'ja' });
  audio.onended();
  assert.equal(waits[0].ms, E.PAUSE_BETWEEN_LANGUAGES);
  waits.shift().fn();
  assert.equal(played[1], './audio/bai-zei-qi/zh/p01-1.mp3');
  assert.deepEqual(highlighted[1], { lineId: 'p01-1', lang: 'zh' });
  audio.onended();
  assert.equal(waits[0].ms, E.PAUSE_BETWEEN_SENTENCES);
  waits.shift().fn();
  assert.equal(played[2], './audio/bai-zei-qi/ja/p01-2.mp3');
  assert.deepEqual(highlighted[2], { lineId: 'p01-2', lang: 'ja' });
});

test('buildListenModes generalizes to a three-language series while keeping display capped at two', () => {
  const languages = ['ja', 'zh', 'en'];
  const modes = E.buildListenModes(languages);
  assert.deepEqual(Object.keys(modes), ['ja-zh', 'ja-en', 'zh-ja', 'zh-en', 'en-ja', 'en-zh', 'ja', 'zh', 'en']);
  assert.deepEqual(modes['ja-en'], ['ja', 'en']);

  // A pair mode already shows exactly two languages, narratedOnly or not.
  assert.deepEqual(E.displayLanguagesFor(languages, ['ja', 'en'], false), ['ja', 'en']);
  assert.deepEqual(E.displayLanguagesFor(languages, ['ja', 'en'], true), ['ja', 'en']);

  // A single-language mode pairs the narrated language with a companion by default (still
  // capped at two), and collapses to just the narrated language once narratedOnly is on.
  assert.deepEqual(E.displayLanguagesFor(languages, ['en'], false), ['en', 'ja']);
  assert.deepEqual(E.displayLanguagesFor(languages, ['en'], true), ['en']);

  // A two-language series (taiwan-ehon's shape) always shows both, matching its original,
  // mode-independent display behavior exactly — this is what keeps Taiwan's reader unchanged.
  assert.deepEqual(E.displayLanguagesFor(['ja', 'zh'], ['zh'], false), ['zh', 'ja']);
  assert.deepEqual(E.displayLanguagesFor(['ja', 'zh'], ['ja', 'zh'], false), ['ja', 'zh']);
});
