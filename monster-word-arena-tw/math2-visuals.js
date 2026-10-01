(() => {
  'use strict';

  // The pictures of Math 2 questions. A question's `visual` is plain data ({ type, ...fields }, nothing but strings,
  // numbers, booleans, arrays and objects); app.js hands it to build(), which finds the builder registered for
  // `type` and returns the element to show above the answer buttons. A later card adds its picture by appending one
  // builder to BUILDERS and nothing else here changes. A builder is (visual, document) => Element.
  const SVG_NS = 'http://www.w3.org/2000/svg';
  // A ten-frame is two rows of five cells. Counters fill it a row at a time, left to right, so five is a full top row
  // and a child can see "five and some more" without counting. Sizes are in viewBox units; CSS sets the drawn size.
  const FRAME_COLUMNS = 5;
  const FRAME_ROWS = 2;
  const FRAME_CELLS = FRAME_COLUMNS * FRAME_ROWS;
  const CELL = 44;
  const FRAME_PAD = 5;

  function svgElement(document, tag, attributes) {
    const element = document.createElementNS(SVG_NS, tag);
    Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, String(value)));
    return element;
  }

  // One frame holding `count` counters (a whole number from 0 to 10; anything else is clamped into that range).
  function tenFrameSvg(count, document) {
    const filled = Math.min(FRAME_CELLS, Math.max(0, Math.floor(Number(count)) || 0));
    const width = FRAME_COLUMNS * CELL + FRAME_PAD * 2;
    const height = FRAME_ROWS * CELL + FRAME_PAD * 2;
    const svg = svgElement(document, 'svg', { viewBox: `0 0 ${width} ${height}`, class: 'ten-frame', focusable: 'false', 'aria-hidden': 'true' });
    svg.append(svgElement(document, 'rect', { class: 'ten-frame-board', x: 1, y: 1, width: width - 2, height: height - 2, rx: 12 }));
    for (let index = 0; index < FRAME_CELLS; index += 1) {
      const left = FRAME_PAD + (index % FRAME_COLUMNS) * CELL;
      const top = FRAME_PAD + Math.floor(index / FRAME_COLUMNS) * CELL;
      svg.append(svgElement(document, 'rect', { class: 'ten-frame-cell', x: left + 2, y: top + 2, width: CELL - 4, height: CELL - 4, rx: 8 }));
      if (index < filled) {
        svg.append(svgElement(document, 'circle', { class: 'ten-frame-counter', cx: left + CELL / 2, cy: top + CELL / 2, r: CELL / 2 - 7 }));
      }
    }
    return svg;
  }

  const BUILDERS = {
    // Ten-frames in a row, one per entry: visual = { type: 'ten-frame', counts: [3] } is one frame with three counters,
    // and a later card passes two counts for a sum within twenty.
    'ten-frame'(visual, document) {
      const row = document.createElement('div');
      row.className = 'ten-frames';
      (visual.counts || []).forEach(count => row.append(tenFrameSvg(count, document)));
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
