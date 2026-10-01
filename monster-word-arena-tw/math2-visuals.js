(() => {
  'use strict';

  // Base-ten blocks: tens as rods (as tall as ten cubes, ruled into ten squares) on the left, ones as single cubes on the
  // right in rows of five, filled from the bottom. Counts are capped at 9 of each, so a picture never grows past 99 and
  // always fits the same area, which keeps every cube the same size on a phone. The sizes live in game.css.
  const BLOCK_MAX = 9;
  const blockCount = value => Math.min(BLOCK_MAX, Math.max(0, Math.floor(Number(value)) || 0));

  // The pictures of Math 2 questions. A question's `visual` is plain data ({ type, ...fields }, nothing but strings,
  // numbers, booleans, arrays and objects); app.js hands it to build(), which finds the builder registered for
  // `type` and returns the element to show above the answer buttons. A later card adds its picture by appending one
  // builder to BUILDERS and nothing else here changes. A builder is (visual, document) => Element.
  const BUILDERS = {
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
