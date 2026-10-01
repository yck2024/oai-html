(() => {
  'use strict';

  // Base-ten blocks: tens as rods (as tall as ten cubes, ruled into ten squares) on the left, ones as single cubes on the
  // right in rows of five, filled from the bottom. Counts are capped at 9 of each, so a picture never grows past 99 and
  // always fits the same area, which keeps every cube the same size on a phone. The sizes live in game.css.
  const BLOCK_MAX = 9;
  const blockCount = value => Math.min(BLOCK_MAX, Math.max(0, Math.floor(Number(value)) || 0));
  const SVG_NS = 'http://www.w3.org/2000/svg';

  function svgElement(document, tag, attributes) {
    const element = document.createElementNS(SVG_NS, tag);
    Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, String(value)));
    return element;
  }

  function tenFrameSvg(count, document) {
    const filled = Math.min(10, Math.max(0, Math.floor(Number(count)) || 0));
    const width = 5 * 44 + 10;
    const height = 2 * 44 + 10;
    const svg = svgElement(document, 'svg', { viewBox: `0 0 ${width} ${height}`, class: 'ten-frame', focusable: 'false', 'aria-hidden': 'true' });
    svg.append(svgElement(document, 'rect', { class: 'ten-frame-board', x: 1, y: 1, width: width - 2, height: height - 2, rx: 12 }));
    for (let index = 0; index < 10; index += 1) {
      const left = 5 + (index % 5) * 44;
      const top = 5 + Math.floor(index / 5) * 44;
      svg.append(svgElement(document, 'rect', { class: 'ten-frame-cell', x: left + 2, y: top + 2, width: 40, height: 40, rx: 8 }));
      if (index < filled) svg.append(svgElement(document, 'circle', { class: 'ten-frame-counter', cx: left + 22, cy: top + 22, r: 15 }));
    }
    return svg;
  }

  // The pictures of Math 2 questions. A question's `visual` is plain data ({ type, ...fields }, nothing but strings,
  // numbers, booleans, arrays and objects); app.js hands it to build(), which finds the builder registered for
  // `type` and returns the element to show above the answer buttons. A later card adds its picture by appending one
  // builder to BUILDERS and nothing else here changes. A builder is (visual, document) => Element.
  const BUILDERS = {
    'ten-frame'(visual, document) {
      const row = document.createElement('div');
      row.className = 'ten-frames';
      (visual.counts || []).forEach(count => row.append(tenFrameSvg(count, document)));
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
