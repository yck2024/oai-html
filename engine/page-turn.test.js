'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const css = fs.readFileSync(path.join(__dirname, 'ehon.css'), 'utf8');

function keyframeEndAngle(name) {
  const keyframes = css.match(new RegExp(`@keyframes ${name}\\s*\\{([\\s\\S]*?)\\n\\}`));
  assert.ok(keyframes, `missing @keyframes ${name}`);
  const endpoint = keyframes[1].match(/to\s*\{[^}]*transform:\s*rotateY\(([-\d.]+)deg\)/);
  assert.ok(endpoint, `missing rotateY endpoint in @keyframes ${name}`);
  return Number(endpoint[1]);
}

test('page-turn keyframes lift the free edge toward the reader', () => {
  assert.ok(keyframeEndAngle('page-next') < 0, 'next page must rotate outward from its left spine');
  assert.ok(keyframeEndAngle('page-prev') > 0, 'previous page must rotate outward from its right spine');
});
