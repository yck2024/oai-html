'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { LEVELS, CHOICE_COUNT, MATH2_KINDS, createGame } = require('./game.js');
const visuals = require('./math2-visuals.js');
const prompts = require('./audio/prompts.json');

function seededRandom(seed) {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

function drawQuestions(level, count, random = seededRandom(21)) {
  const game = createGame(random);
  game.chooseTopic('math2');
  game.chooseLevel(level);
  const questions = [];
  for (let draw = 0; draw < count; draw += 1) {
    questions.push(game.getState().question);
    game.chooseTopic('math2');
  }
  return questions;
}

const clockKinds = level => [...new Set(drawQuestions(level, 600).map(question => question.kind).filter(kind => kind.startsWith('clock')))].sort();
const timeOf = id => {
  const [hour, minute] = id.split(':').map(Number);
  return { hour, minute };
};
const answerOf = question => question.options.find(option => option.id === question.answerId);

// The wording each language says and writes, spelled out here independently of game.js.
const ENGLISH = (hour, minute) => (minute === 0 ? `${hour} o'clock` : `half past ${hour}`);
const MANDARIN_HOURS = ['一', '兩', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
const JAPANESE_HOURS = ['いち', 'に', 'さん', 'よ', 'ご', 'ろく', 'しち', 'はち', 'く', 'じゅう', 'じゅういち', 'じゅうに'];
const MANDARIN = (hour, minute) => `${MANDARIN_HOURS[hour - 1]}點${minute === 0 ? '' : '半'}`;
const JAPANESE = (hour, minute) => `${JAPANESE_HOURS[hour - 1]}じ${minute === 0 ? '' : 'はん'}`;
const NUMBER_WORDS = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];

test('the clock has no place on Easy; Harder reads o\'clock and half past; Super reads half past and finds clocks', () => {
  assert.deepEqual(clockKinds('easy'), []);
  assert.deepEqual(clockKinds('harder'), ['clock-half', 'clock-oclock']);
  assert.deepEqual(clockKinds('super'), ['clock-find', 'clock-half']);
  const byKind = Object.fromEntries(MATH2_KINDS.map(entry => [entry.kind, Object.keys(entry.generators).sort()]));
  assert.deepEqual(byKind['clock-oclock'], ['harder']);
  assert.deepEqual(byKind['clock-half'], ['harder', 'super']);
  assert.deepEqual(byKind['clock-find'], ['super']);
});

test('every clock time is worded the way each language says it, and Japanese stays in hiragana', () => {
  const seen = new Set();
  for (const level of ['harder', 'super']) {
    for (const question of drawQuestions(level, 1200).filter(candidate => ['time', 'clock'].includes(candidate.answerStyle))) {
      for (const option of question.options) {
        const { hour, minute } = timeOf(option.id);
        assert.ok(hour >= 1 && hour <= 12 && (minute === 0 || minute === 30), `${option.id} is an hour with :00 or :30`);
        assert.deepEqual([option.en, option.zh, option.ja], [ENGLISH(hour, minute), MANDARIN(hour, minute), JAPANESE(hour, minute)]);
        assert.deepEqual(option.time, { hour, minute });
        assert.doesNotMatch(option.ja, /[ァ-ヿ㐀-鿿]/, 'on-screen Japanese stays hiragana');
        seen.add(option.id);
      }
    }
  }
  assert.equal(seen.size, 24, 'all twelve hours are offered at :00 and :30');
  assert.equal(MANDARIN(2, 0), '兩點', '2 o\'clock is 兩點, not 二點');
  assert.ok([...seen].includes('2:00') && [...seen].includes('2:30'));
  assert.equal(MANDARIN(12, 30), '十二點半');
  assert.equal(JAPANESE(3, 0), 'さんじ');
  assert.equal(JAPANESE(3, 30), 'さんじはん');
  assert.equal(ENGLISH(3, 0), "3 o'clock");
  assert.equal(ENGLISH(3, 30), 'half past 3');
});

test('reading a clock: the picture shows the time, and the answer is that time in words among four choices', () => {
  for (const [kind, level, minutes] of [['clock-oclock', 'harder', [0]], ['clock-half', 'harder', [30]], ['clock-half', 'super', [30]]]) {
    const questions = drawQuestions(level, 1600).filter(question => question.kind === kind);
    assert.ok(questions.length > 100, `${kind} on ${level} is asked`);
    const hours = new Set();
    for (const question of questions) {
      assert.equal(question.answerStyle, 'time');
      assert.equal(question.audioId, 'math2-clock-what', 'one shared prompt, which never says the time');
      assert.equal(question.options.length, CHOICE_COUNT[level]);
      assert.equal(question.visual.type, 'clock');
      assert.deepEqual(minutes, [question.visual.minute]);
      assert.deepEqual(timeOf(question.answerId), { hour: question.visual.hour, minute: question.visual.minute }, 'the right button is the time on the clock');
      hours.add(question.visual.hour);
      assert.equal(question.picture, '');
      assert.equal(question.display, '');
    }
    assert.equal(hours.size, 12, `${kind} on ${level} uses every hour`);
  }
});

test("o'clock choices are all o'clock; half past choices include both neighbouring hours and sometimes the same hour at :00", () => {
  for (const question of drawQuestions('harder', 1200).filter(candidate => candidate.kind === 'clock-oclock')) {
    assert.ok(question.options.every(option => option.time.minute === 0));
  }
  let withOclock = 0;
  const halfQuestions = drawQuestions('super', 1200).filter(candidate => candidate.kind === 'clock-half');
  for (const question of halfQuestions) {
    const { hour } = question.visual;
    const wrap = value => ((value - 1 + 12) % 12) + 1;
    const ids = question.options.map(option => option.id);
    assert.ok(ids.includes(`${wrap(hour - 1)}:30`) && ids.includes(`${wrap(hour + 1)}:30`), 'the hour hand sits between two numbers, so both are offered');
    if (ids.includes(`${hour}:00`)) withOclock += 1;
  }
  assert.ok(withOclock > halfQuestions.length * 0.15 && withOclock < halfQuestions.length * 0.6, `the same hour at :00 shows up some of the time (${withOclock}/${halfQuestions.length})`);
});

test('find the clock: Super asks for a time at :00 or :30 and the choices are four different clock faces', () => {
  const questions = drawQuestions('super', 1200).filter(question => question.kind === 'clock-find');
  assert.ok(questions.length > 100, 'find-clock questions are regularly offered alongside the other Super kinds');
  const asked = new Set();
  for (const question of questions) {
    assert.equal(question.answerStyle, 'clock');
    assert.equal(question.visual, null, 'the picture is on the buttons');
    assert.equal(question.options.length, CHOICE_COUNT.super);
    const target = timeOf(question.answerId);
    assert.equal(question.audioId, `math2-clock-find-${target.hour}-${target.minute === 0 ? '00' : '30'}`);
    assert.deepEqual(answerOf(question).time, target);
    const faces = question.options.map(option => `${option.time.hour}:${option.time.minute}`);
    assert.equal(new Set(faces).size, faces.length, 'no two faces show the same time');
    asked.add(question.audioId);
  }
  assert.equal(asked.size, 24, 'every time is asked');
});

test('the find prompts say the same thing on screen and aloud, and name the time in each language', () => {
  for (const question of drawQuestions('super', 400).filter(candidate => candidate.kind === 'clock-find')) {
    const { hour, minute } = timeOf(question.answerId);
    const spoken = prompts[question.audioId];
    assert.equal(question.promptEn, `Find the clock that says ${ENGLISH(hour, minute)}.`);
    assert.equal(question.promptZh, `哪一個鐘是${MANDARIN(hour, minute)}？`);
    assert.equal(question.promptJa, `${JAPANESE(hour, minute)}のとけいは、どれかな？`);
    assert.equal(question.promptZh, spoken.zh);
    assert.equal(question.promptJa, spoken.ja);
    // The manifest spells the numbers out for the voice; the screen uses digits.
    assert.equal(spoken.en, question.promptEn.replace(/\d+/, digits => NUMBER_WORDS[Number(digits) - 1]));
    assert.doesNotMatch(question.promptJa, /[ァ-ヿ㐀-鿿]/);
  }
});

test('the shared "What time is it?" prompt is the same on screen and aloud and does not say the time', () => {
  const question = drawQuestions('harder', 100).find(candidate => candidate.kind === 'clock-oclock');
  assert.deepEqual([question.promptEn, question.promptZh, question.promptJa], ['What time is it?', '現在幾點了？', 'いま、なんじかな？']);
  assert.deepEqual(prompts['math2-clock-what'], { en: question.promptEn, zh: question.promptZh, ja: question.promptJa });
  assert.doesNotMatch(prompts['math2-clock-what'].en, /\d|o'clock|half/);
});

test('the clock prompts are exactly one shared clip and 24 find clips, 75 with the three languages', () => {
  const clockIds = Object.keys(prompts).filter(id => id.startsWith('math2-clock'));
  assert.equal(clockIds.length, 25);
  assert.equal(clockIds.filter(id => id.startsWith('math2-clock-find-')).length, 24);
  assert.equal(clockIds.length * 3, 75);
});

test('the same clock question is never asked twice in a row', () => {
  for (const random of [() => 0, () => 0.5, () => 0.99, seededRandom(4)]) {
    for (const level of ['harder', 'super']) {
      const questions = drawQuestions(level, 80, random);
      questions.slice(1).forEach((question, index) => assert.notEqual(question.key, questions[index].key));
    }
  }
});

// A just-enough SVG document: elements remember their tag, attributes and children.
function fakeSvgDocument() {
  const make = (namespace, tag) => ({
    namespace,
    tag,
    attributes: {},
    children: [],
    textContent: '',
    setAttribute(name, value) { this.attributes[name] = value; },
    append(...nodes) { this.children.push(...nodes); },
  });
  return { createElementNS: make, createElement: tag => make(null, tag) };
}

test('the rendered clock hands point to the hour and minute for every o\'clock and half past time', () => {
  const angleOf = hand => {
    const dx = Number(hand.attributes.x2) - 100;
    const dy = 100 - Number(hand.attributes.y2);
    return (Math.atan2(dx, dy) * 180 / Math.PI + 360) % 360;
  };
  for (let hour = 1; hour <= 12; hour += 1) {
    for (const minute of [0, 30]) {
      const clock = visuals.build({ type: 'clock', hour, minute }, fakeSvgDocument());
      const hourHand = clock.children.find(child => child.attributes.class.includes('clock-hour-hand'));
      const minuteHand = clock.children.find(child => child.attributes.class.includes('clock-minute-hand'));
      const expectedHour = ((hour % 12) + minute / 60) * 30;
      const expectedMinute = minute * 6;
      assert.ok(Math.abs(angleOf(hourHand) - expectedHour) < 0.5, `${hour}:${minute} hour hand at ${angleOf(hourHand)}`);
      assert.ok(Math.abs(angleOf(minuteHand) - expectedMinute) < 0.5, `${hour}:${minute} minute hand at ${angleOf(minuteHand)}`);
    }
  }
});

test('the clock builder draws a round face with the numbers 1-12, an hour hand, a minute hand and a centre', () => {
  const clock = visuals.build({ type: 'clock', hour: 3, minute: 30 }, fakeSvgDocument());
  assert.equal(clock.tag, 'svg');
  assert.equal(clock.namespace, 'http://www.w3.org/2000/svg');
  assert.equal(clock.attributes.class, 'clock-face');
  assert.equal(clock.attributes['aria-hidden'], 'true');
  const named = className => clock.children.filter(child => child.attributes.class && child.attributes.class.split(' ').includes(className));
  assert.deepEqual(named('clock-number').map(child => child.textContent), ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']);
  assert.equal(named('clock-tick').length, 12);
  assert.equal(named('clock-centre').length, 1);
  const [hourHand] = named('clock-hour-hand');
  const [minuteHand] = named('clock-minute-hand');
  const angleOf = hand => {
    const dx = Number(hand.attributes.x2) - 100;
    const dy = 100 - Number(hand.attributes.y2);
    return (Math.atan2(dx, dy) * 180 / Math.PI + 360) % 360;
  };
  const lengthOf = hand => Math.hypot(Number(hand.attributes.x2) - 100, Number(hand.attributes.y2) - 100);
  assert.ok(Math.abs(angleOf(hourHand) - 105) < 0.5, `hour hand at ${angleOf(hourHand)}`);
  assert.ok(Math.abs(angleOf(minuteHand) - 180) < 0.5, `minute hand at ${angleOf(minuteHand)}`);
  assert.ok(lengthOf(hourHand) < lengthOf(minuteHand), 'the hour hand is the short one');
  // The numbers sit where the hands point: the 3 is straight to the right of the centre.
  const three = named('clock-number').find(child => child.textContent === '3');
  assert.ok(Math.abs(Number(three.attributes.y) - 100) < 0.5 && Number(three.attributes.x) > 100);
  const twelve = named('clock-number').find(child => child.textContent === '12');
  assert.ok(Math.abs(Number(twelve.attributes.x) - 100) < 0.5 && Number(twelve.attributes.y) < 100);
});
