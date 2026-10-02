'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { LEVELS, MATH2_KINDS, DIAGRAMS, diagramPartAt, createGame } = require('./game.js');
const visuals = require('./math2-visuals.js');
const prompts = require('./audio/prompts.json');

function seededRandom(seed) {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

function drawQuestions(level, count, random = seededRandom(11)) {
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

const lineQuestions = (level, count = 1500) => drawQuestions(level, count).filter(question => question.diagram);
const kindsOf = questions => [...new Set(questions.map(question => question.kind))].sort();
const answerOf = question => Number(question.answerId);
const tickValues = question => question.diagram.visual.ticks.map(tick => tick.value);

// A minimal stand-in for the DOM, enough for the visual builder (it only creates elements and sets attributes).
function fakeDocument() {
  const make = tag => ({
    tag, className: '', dataset: {}, attributes: {}, children: [], textContent: '',
    setAttribute(name, value) { this.attributes[name] = String(value); },
    append(...nodes) { this.children.push(...nodes); },
  });
  return { createElement: make, createElementNS: (_namespace, tag) => make(tag) };
}
const descendants = node => node.children.flatMap(child => [child, ...descendants(child)]);

test('the number line has no place on Easy; Harder uses a 0-10 line; Super uses 0-20, then tens to 100', () => {
  assert.deepEqual(lineQuestions('easy', 600), [], 'Easy holds only Step 1 content');
  const harder = lineQuestions('harder');
  assert.deepEqual(kindsOf(harder), ['number-line']);
  assert.ok(harder.every(question => JSON.stringify(tickValues(question)) === JSON.stringify([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])));
  const superQuestions = lineQuestions('super');
  assert.deepEqual(kindsOf(superQuestions), ['number-line', 'number-line-tens']);
  for (const question of superQuestions) {
    if (question.kind === 'number-line') assert.deepEqual(tickValues(question), Array.from({ length: 21 }, (_item, value) => value));
    else assert.deepEqual(tickValues(question), Array.from({ length: 11 }, (_item, index) => index * 10));
  }
  const byKind = Object.fromEntries(MATH2_KINDS.map(entry => [entry.kind, Object.keys(entry.generators).sort()]));
  assert.deepEqual(byKind['number-line'], ['harder', 'super']);
  assert.deepEqual(byKind['number-line-tens'], ['super']);
});

test('tens are asked only on the 0-100 line, and the other lines ask single numbers inside them', () => {
  for (const question of lineQuestions('super')) {
    const tens = question.kind === 'number-line-tens';
    if (tens) {
      assert.equal(answerOf(question) % 10, 0);
      assert.ok(answerOf(question) > 0 && answerOf(question) < 100);
    } else assert.ok(answerOf(question) >= 1 && answerOf(question) <= 19);
  }
  for (const question of lineQuestions('harder')) assert.ok(answerOf(question) >= 1 && answerOf(question) <= 9);
});

test('the anchors written under the line are never the answer, so the child has to count along the ticks', () => {
  for (const level of ['harder', 'super']) {
    for (const question of lineQuestions(level)) {
      const { ticks } = question.diagram.visual;
      const labelled = ticks.filter(tick => tick.labelled).map(tick => tick.value);
      assert.ok(labelled.length >= 3, `${question.key}: the ends and the middle are labelled`);
      assert.equal(labelled[0], 0);
      assert.equal(labelled[labelled.length - 1], ticks[ticks.length - 1].value);
      assert.ok(!labelled.includes(answerOf(question)), `${question.key}: the answer is not an anchor`);
      assert.ok(ticks.some(tick => tick.value === answerOf(question) && !tick.labelled));
    }
  }
});

test('the same number is never asked twice in a row, and every ask is a different question key per line', () => {
  for (const level of ['harder', 'super']) {
    const questions = drawQuestions(level, 800);
    questions.slice(1).forEach((question, index) => assert.notEqual(question.key, questions[index].key));
  }
  const keys = new Set(lineQuestions('super').map(question => question.key));
  assert.ok([...keys].every(key => /^math2-line-(20|100)-\d+$/.test(key)));
  assert.ok([...keys].some(key => key.startsWith('math2-line-20-')) && [...keys].some(key => key.startsWith('math2-line-100-')));
});

test('a number line question is a picture question: every tick is an option, and the right tick is the answer', () => {
  for (const level of ['harder', 'super']) {
    for (const question of lineQuestions(level, 600)) {
      assert.equal(question.format, 'diagram');
      assert.equal(question.topic, 'math2');
      assert.equal(question.answerStyle, 'line');
      assert.equal(question.range, undefined);
      assert.equal(question.visual, null, 'the line is drawn on the stage, not above the choices');
      assert.deepEqual(question.options.map(option => option.id), Object.keys(question.diagram.parts));
      assert.deepEqual(question.options.map(option => option.id), tickValues(question).map(String));
      assert.ok(question.options.some(option => option.id === question.answerId));
      for (const option of question.options) assert.deepEqual([option.zh, option.en, option.ja], [option.id, option.id, option.id]);
      assert.equal(question.acceptedIds, undefined, 'only the one tick is right');
      assert.deepEqual(JSON.parse(JSON.stringify(question.diagram)), question.diagram, 'the picture is plain data');
    }
  }
});

test('the question is spoken as the number clip and then the shared "Where does this number go?" clip, in every language', () => {
  const sequences = new Set();
  for (const level of ['harder', 'super']) {
    for (const question of lineQuestions(level, 600)) {
      assert.deepEqual(question.audioSequence, [`word-number-${question.answerId}`, 'math2-line-where']);
      assert.equal(question.audioId, 'math2-line-where', 'audioId is the shared clip');
      sequences.add(question.audioSequence[0]);
    }
  }
  assert.ok(sequences.size > 20, `${sequences.size} different number clips are asked for`);
  for (const language of ['en', 'zh', 'ja']) {
    assert.ok(prompts['math2-line-where'][language], `${language} has the shared clip text`);
    const file = path.join(__dirname, 'audio', language, 'math2-line-where.mp3');
    assert.ok(fs.statSync(file).size > 1024, `${language} clip is bundled`);
  }
  assert.equal(prompts['math2-line-where'].en, 'Where does this number go?');
  assert.equal(prompts['math2-line-where'].zh, '這個數字要放在哪裡？');
  assert.equal(prompts['math2-line-where'].ja, 'このかずは、どこにあるかな？');
  assert.deepEqual(MATH2_KINDS.find(entry => entry.kind === 'number-line').audioIds, ['math2-line-where']);
  assert.deepEqual(MATH2_KINDS.find(entry => entry.kind === 'number-line-tens').audioIds, ['math2-line-where']);
});

test('the written prompt names the number, and the spoken clip never gives it away in the shared sentence', () => {
  const question = lineQuestions('harder', 200)[0];
  const value = answerOf(question);
  assert.equal(question.promptEn, `Where does ${value} go?`);
  assert.equal(question.promptZh, `${value} 要放在哪裡？`);
  assert.equal(question.promptJa, `${value}は、どこかな？`);
  assert.doesNotMatch(prompts['math2-line-where'].en + prompts['math2-line-where'].zh + prompts['math2-line-where'].ja, /\d/);
});

test('the clip for every number a line can ask about is a number word from audio/words.json', () => {
  const words = require('./audio/words.json');
  const asked = new Set(['harder', 'super'].flatMap(level => lineQuestions(level)).map(question => question.audioSequence[0]));
  for (const id of asked) {
    assert.match(id, /^word-number-(\d|[1-9]\d|100)$/);
    assert.ok(words[id], `${id} is a bundled number word`);
    for (const language of ['en', 'zh', 'ja']) assert.ok(fs.existsSync(path.join(__dirname, 'audio', language, `${id}.mp3`)), `${language}/${id}.mp3 is bundled`);
  }
});

test('every tick has a tap region inside the picture, a small ring and a keyboard spot on the tick', () => {
  for (const question of lineQuestions('super', 600)) {
    const { width, height, minRadiusPx, parts, visual } = question.diagram;
    assert.ok(minRadiusPx >= 20, 'a finger can hit a tick');
    visual.ticks.forEach(tick => {
      const part = parts[String(tick.value)];
      const [cx, cy, rx, ry] = part.regions[0];
      assert.equal(cx, tick.x, `${tick.value}: the region is centred on its tick`);
      assert.ok(cx - rx >= -0.01 && cx + rx <= 1.01 && cy - ry >= 0 && cy + ry <= 1.02, `${tick.value}: the region fits in the picture`);
      const [ringX, ringY, ringRx, ringRy] = part.rings[0];
      assert.deepEqual([ringX, ringY], [tick.x, visual.y], 'the ring is on the tick');
      assert.ok(Math.abs((ringRx * width) / (ringRy * height) - 1) < 0.02, 'the ring is a circle, not an oval');
      assert.deepEqual(part.spot, part.rings[0], 'the keyboard button sits on the tick');
    });
    assert.ok(width / height > 2, 'the line is wide');
  }
});

test('a tap picks the nearest tick, even on a phone where the 0-20 ticks are only 16 pixels apart', () => {
  const question = lineQuestions('super').find(candidate => candidate.kind === 'number-line');
  const { ticks } = question.diagram.visual;
  const size = { width: 340, height: 340 * (question.diagram.height / question.diagram.width) };
  const ids = question.options.map(option => option.id);
  ticks.forEach((tick, index) => {
    const y = question.diagram.visual.y + 0.06;
    assert.equal(diagramPartAt(tick.x, y, size, question.diagram, ids), String(tick.value), `a tap on ${tick.value}`);
    if (index < ticks.length - 1) {
      const next = ticks[index + 1];
      const nearThis = tick.x + (next.x - tick.x) * 0.35;
      const nearNext = tick.x + (next.x - tick.x) * 0.65;
      assert.equal(diagramPartAt(nearThis, y, size, question.diagram, ids), String(tick.value), `a tap just right of ${tick.value}`);
      assert.equal(diagramPartAt(nearNext, y, size, question.diagram, ids), String(next.value), `a tap just left of ${next.value}`);
    }
  });
  // The ends of the line catch a finger a little beyond the first and last tick, and the empty sky above the line is no answer.
  assert.equal(diagramPartAt(ticks[0].x - 0.02, question.diagram.visual.y, size, question.diagram, ids), '0');
  assert.equal(diagramPartAt(ticks[10].x, 0.05, size, question.diagram, ids), null);
  assert.equal(diagramPartAt(0.5, 0.0, size, question.diagram, ids), null);
});

test('the minimum radius widens a region that is narrower than a finger, and a wider region is left as it is', () => {
  const diagram = {
    minRadiusPx: 24,
    parts: { a: { regions: [[0.5, 0.5, 0.005, 0.01]] }, b: { regions: [[0.9, 0.5, 0.2, 0.2]] } },
  };
  const size = { width: 300, height: 100 };
  assert.equal(diagramPartAt(0.5 + 20 / 300, 0.5, size, diagram), 'a', 'within 24px of the thin region');
  assert.equal(diagramPartAt(0.5 + 20 / 300, 0.5, null, diagram), null, 'no size, no widening');
  assert.equal(diagramPartAt(0.9, 0.5 + 0.15, size, diagram), 'b');
  assert.equal(diagramPartAt(0.5, 0.5, size, diagram, ['b']), null, 'a part the question does not ask about is not tapped');
});

test('a topic name still picks a bundled picture: the character and the farm work as before', () => {
  assert.equal(diagramPartAt(0.5, 0.1, { width: 400, height: 550 }, 'face'), diagramPartAt(0.5, 0.1, { width: 400, height: 550 }, DIAGRAMS.face));
  assert.equal(diagramPartAt(0.5, 0.5, null, 'no-such-picture'), null);
});

test('the number line builder draws the axis, a tick for every value and labels only on the anchors, with a dino at the start', () => {
  for (const question of lineQuestions('harder', 200).slice(0, 1).concat(lineQuestions('super').filter(candidate => candidate.kind === 'number-line-tens').slice(0, 1))) {
    const { visual } = question.diagram;
    const line = visuals.build(visual, fakeDocument());
    const nodes = descendants(line);
    assert.equal(line.className, 'number-line');
    assert.equal(nodes.filter(node => node.attributes.class === 'number-line-axis').length, 1);
    const ticks = nodes.filter(node => /number-line-tick/.test(node.attributes.class || ''));
    assert.equal(ticks.length, visual.ticks.length);
    ticks.forEach((tick, index) => assert.equal(Number(tick.attributes.x1), Math.round(visual.ticks[index].x * visual.width * 100) / 100, 'drawn where the region is'));
    const labels = nodes.filter(node => node.attributes.class === 'number-line-label');
    assert.deepEqual(labels.map(label => label.textContent), visual.ticks.filter(tick => tick.labelled).map(tick => String(tick.value)));
    const dino = nodes.find(node => /number-line-dino/.test(node.className));
    assert.ok(dino, 'a dino stands on the line');
    assert.equal(dino.dataset.character, 'dino');
    assert.equal(dino.attributes['aria-hidden'], 'true');
  }
  assert.equal(visuals.build({ type: 'number-line' }, fakeDocument()).className, 'number-line', 'an empty line still draws');
});

test('the number line is registered in the visual builders next to the others', () => {
  assert.equal(typeof visuals.BUILDERS['number-line'], 'function');
  for (const type of ['numerals', 'ten-frame', 'blocks', 'sequence', 'clock']) assert.equal(typeof visuals.BUILDERS[type], 'function');
});

test("today's Math and the other Math 2 kinds carry no picture of their own and no clip sequence", () => {
  const game = createGame(seededRandom(5));
  for (const level of LEVELS) {
    game.chooseTopic('math');
    game.chooseLevel(level);
    const question = game.getState().question;
    assert.equal(question.diagram, undefined);
    assert.equal(question.audioSequence, undefined);
    assert.equal(question.format, undefined);
  }
  for (const level of LEVELS) {
    for (const question of drawQuestions(level, 300).filter(candidate => !candidate.kind.startsWith('number-line'))) {
      assert.equal(question.diagram, undefined, question.kind);
      assert.equal(question.audioSequence, undefined, question.kind);
      assert.equal(question.format, undefined, question.kind);
    }
  }
});
