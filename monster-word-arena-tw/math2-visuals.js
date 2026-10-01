(() => {
  'use strict';

  // The pictures of Math 2 questions. A question's `visual` is plain data ({ type, ...fields }, nothing but strings,
  // numbers, booleans, arrays and objects); app.js hands it to build(), which finds the builder registered for
  // `type` and returns the element to show above the answer buttons. A later card adds its picture by appending one
  // builder to BUILDERS and nothing else here changes. A builder is (visual, document) => Element.
  const BUILDERS = {
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
