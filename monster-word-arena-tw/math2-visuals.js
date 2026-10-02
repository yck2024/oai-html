(() => {
  'use strict';

  // Base-ten blocks: tens as rods (as tall as ten cubes, ruled into ten squares) on the left, ones as single cubes on the
  // right in rows of five, filled from the bottom. Counts are capped at 9 of each, so a picture never grows past 99 and
  // always fits the same area, which keeps every cube the same size on a phone. The sizes live in game.css.
  const BLOCK_MAX = 9;
  const blockCount = value => Math.min(BLOCK_MAX, Math.max(0, Math.floor(Number(value)) || 0));
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const FRAME_CELLS = 10;
  const round = value => Math.round(value * 100) / 100;
  // A ten-frame is two rows of five cells. Counters fill it a row at a time, left to right, so five is a full top row
  // and a child can see "five and some more" without counting. Sizes are in viewBox units; CSS sets the drawn size.
  const FRAME_COLUMNS = 5;
  const FRAME_ROWS = 2;
  const CELL = 44;
  const FRAME_PAD = 5;

  function svgElement(document, tag, attributes = {}) {
    const element = document.createElementNS(SVG_NS, tag);
    Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, String(value)));
    return element;
  }

  const wholeNumber = (value, most) => Math.min(most, Math.max(0, Math.floor(Number(value)) || 0));

  // One frame holding `count` counters (a whole number from 0 to 10; anything else is clamped into that range).
  // `marks` dresses the frame for a sum or a take-away within twenty, and each mark is a count of cells:
  //   moving: the last counters, drawn in a second colour, to be moved into the other frame's empty cells
  //   gap:    the empty cells just after the counters, outlined as the places those counters will fill
  //   taken:  the last counters, faded and crossed out, as the ones being taken away
  function tenFrameSvg(count, document, marks = {}) {
    const filled = wholeNumber(count, FRAME_CELLS);
    const moving = Math.min(filled, wholeNumber(marks.moving, FRAME_CELLS));
    const gap = Math.min(FRAME_CELLS - filled, wholeNumber(marks.gap, FRAME_CELLS));
    const taken = Math.min(filled, wholeNumber(marks.taken, FRAME_CELLS));
    const width = FRAME_COLUMNS * CELL + FRAME_PAD * 2;
    const height = FRAME_ROWS * CELL + FRAME_PAD * 2;
    const svg = svgElement(document, 'svg', { viewBox: `0 0 ${width} ${height}`, class: 'ten-frame', focusable: 'false', 'aria-hidden': 'true' });
    svg.append(svgElement(document, 'rect', { class: 'ten-frame-board', x: 1, y: 1, width: width - 2, height: height - 2, rx: 12 }));
    for (let index = 0; index < FRAME_CELLS; index += 1) {
      const left = FRAME_PAD + (index % FRAME_COLUMNS) * CELL;
      const top = FRAME_PAD + Math.floor(index / FRAME_COLUMNS) * CELL;
      const isGap = index >= filled && index < filled + gap;
      svg.append(svgElement(document, 'rect', { class: isGap ? 'ten-frame-cell ten-frame-gap' : 'ten-frame-cell', x: left + 2, y: top + 2, width: CELL - 4, height: CELL - 4, rx: 8 }));
      if (index < filled) {
        const extra = index >= filled - taken ? ' ten-frame-taken' : index >= filled - moving ? ' ten-frame-moving' : '';
        svg.append(svgElement(document, 'circle', { class: `ten-frame-counter${extra}`, cx: left + CELL / 2, cy: top + CELL / 2, r: CELL / 2 - 7 }));
        if (extra === ' ten-frame-taken') {
          const reach = CELL / 2 - 12;
          const [cx, cy] = [left + CELL / 2, top + CELL / 2];
          svg.append(
            svgElement(document, 'line', { class: 'ten-frame-cross', x1: cx - reach, y1: cy - reach, x2: cx + reach, y2: cy + reach }),
            svgElement(document, 'line', { class: 'ten-frame-cross', x1: cx - reach, y1: cy + reach, x2: cx + reach, y2: cy - reach }),
          );
        }
      }
    }
    return svg;
  }

  // The pictures of Math 2 questions. A question's `visual` is plain data ({ type, ...fields }, nothing but strings,
  // numbers, booleans, arrays and objects); app.js hands it to build(), which finds the builder registered for
  // `type` and returns the element to show above the answer buttons. A later card adds its picture by appending one
  // builder to BUILDERS and nothing else here changes. A builder is (visual, document) => Element.
  // The marks each frame of a ten-frame visual carries. `taken` is one count per frame. `move` is
  // { from, to, count } with frame indexes: the last `count` counters of frame `from` are marked to move into the
  // `count` empty cells that follow the counters of frame `to`. A move that does not fit both frames is ignored.
  function frameMarks(visual, counts) {
    const marks = counts.map((_, index) => ({ taken: Array.isArray(visual.taken) ? visual.taken[index] : 0 }));
    const { from, to, count } = visual.move || {};
    const fits = Number.isInteger(from) && Number.isInteger(to) && from !== to && counts[from] !== undefined && counts[to] !== undefined;
    if (fits) {
      const size = Math.min(wholeNumber(count, FRAME_CELLS), wholeNumber(counts[from], FRAME_CELLS), FRAME_CELLS - wholeNumber(counts[to], FRAME_CELLS));
      marks[from].moving = size;
      marks[to].gap = size;
    }
    return marks;
  }

  // Where the two hands point, in degrees clockwise from twelve. The hour hand moves with the minutes, so at half past
  // it sits halfway between two numbers (3:30 is 105 degrees, between the 3 at 90 and the 4 at 120).
  function clockAngles(hour, minute) {
    return { hour: ((hour % 12) + minute / 60) * 30, minute: minute * 6 };
  }

  const pointOnClock = (angle, length) => ({
    x: round(100 + length * Math.sin((angle * Math.PI) / 180)),
    y: round(100 - length * Math.cos((angle * Math.PI) / 180)),
  });

  const BUILDERS = {
    // Ten-frames in a row, one per entry: visual = { type: 'ten-frame', counts: [3] } is one frame with three counters,
    // and a sum within twenty passes two counts. Optional extras for two frames, all plain data:
    //   sign:  '+' written between the frames
    //   move:  { from, to, count }, the counters that fill the other frame to ten
    //   taken: one count per frame, the counters faded out as taken away
    'ten-frame'(visual, document) {
      const row = document.createElement('div');
      const counts = visual.counts || [];
      row.className = counts.length === 2 ? 'ten-frames ten-frames-pair' : 'ten-frames';
      const marks = frameMarks(visual, counts);
      counts.forEach((count, index) => {
        if (index > 0 && visual.sign === '+') {
          const sign = document.createElement('span');
          sign.className = 'ten-frame-sign';
          sign.textContent = '+';
          row.append(sign);
        }
        row.append(tenFrameSvg(count, document, marks[index]));
      });
      return row;
    },

    // Rods and cubes: visual = { type: 'blocks', tens: 3, ones: 4 } draws 34.
    blocks(visual, document) {
      const part = (className, count, tag) => {
        const group = document.createElement('div');
        group.className = className;
        for (let index = 0; index < count; index += 1) {
          const block = document.createElement(tag);
          block.className = tag === 'span' ? 'block-cube' : 'block-rod';
          group.append(block);
        }
        return group;
      };
      const blocks = document.createElement('div');
      blocks.className = 'blocks';
      blocks.append(part('block-tens', blockCount(visual.tens), 'div'), part('block-ones', blockCount(visual.ones), 'span'));
      return blocks;
    },

    // null marks the missing number, never the answer. Keep the four tiles on one row, in counting order.
    sequence(visual, document) {
      const row = document.createElement('div');
      row.className = 'numeral-row sequence-row';
      (visual.values || []).forEach(value => {
        const tile = document.createElement('span');
        tile.className = `numeral-tile${value === null ? ' sequence-gap' : ''}`;
        tile.textContent = value === null ? '?' : String(value);
        row.append(tile);
      });
      return row;
    },
    // Plain numerals in a row, one tile each: visual = { type: 'numerals', values: [3, 12, 40] }.
    numerals(visual, document) {
      const row = document.createElement('div');
      row.className = 'numeral-row';
      (visual.values || []).forEach(value => {
        const tile = document.createElement('span');
        tile.className = 'numeral-tile';
        tile.textContent = String(value);
        row.append(tile);
      });
      return row;
    },

    // A round clock with the numbers 1-12 and two hands: visual = { type: 'clock', hour: 3, minute: 30 }. The short, thick
    // hour hand and the long, thin minute hand differ in colour as well as length. Only :00 and :30 are asked today,
    // but the minute hand follows any minute.
    clock(visual, document) {
      const angles = clockAngles(visual.hour, visual.minute);
      const svg = svgElement(document, 'svg', { viewBox: '0 0 200 200', class: 'clock-face', 'aria-hidden': 'true', focusable: 'false' });
      svg.append(svgElement(document, 'circle', { class: 'clock-rim', cx: 100, cy: 100, r: 94 }));
      for (let mark = 1; mark <= 12; mark += 1) {
        const outer = pointOnClock(mark * 30, 90);
        const inner = pointOnClock(mark * 30, 84);
        svg.append(svgElement(document, 'line', { class: 'clock-tick', x1: inner.x, y1: inner.y, x2: outer.x, y2: outer.y }));
        const place = pointOnClock(mark * 30, 69);
        const number = svgElement(document, 'text', { class: 'clock-number', x: place.x, y: place.y, 'text-anchor': 'middle', 'dominant-baseline': 'central' });
        number.textContent = String(mark);
        svg.append(number);
      }
      const hourEnd = pointOnClock(angles.hour, 38);
      const minuteEnd = pointOnClock(angles.minute, 55);
      svg.append(
        svgElement(document, 'line', { class: 'clock-hand clock-hour-hand', x1: 100, y1: 100, x2: hourEnd.x, y2: hourEnd.y }),
        svgElement(document, 'line', { class: 'clock-hand clock-minute-hand', x1: 100, y1: 100, x2: minuteEnd.x, y2: minuteEnd.y }),
        svgElement(document, 'circle', { class: 'clock-centre', cx: 100, cy: 100, r: 7 }),
      );
      return svg;
    },
  };

  // The element for a visual, or null when there is none or no builder is registered for its type.
  function build(visual, document = globalThis.document) {
    const builder = visual && BUILDERS[visual.type];
    return builder ? builder(visual, document) : null;
  }

  const api = { BUILDERS, build };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') window.FriendlyArenaMath2Visuals = api;
})();
