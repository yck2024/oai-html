'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

function analyticsHarness() {
  const events = [];
  const listeners = {};
  const window = { gtag: (...args) => events.push(args) };
  const document = {
    visibilityState: 'hidden',
    documentElement: { scrollHeight: 1 },
    addEventListener: (name, handler) => { listeners[name] = handler; },
  };
  const context = {
    window,
    document,
    addEventListener() {},
    setTimeout() {},
    innerHeight: 1,
    scrollY: 0,
  };
  const script = fs.readFileSync(path.join(__dirname, 'analytics.js'), 'utf8');
  vm.runInNewContext(script, context);

  return {
    events,
    click(ignored, id, label) {
      const button = {
        tagName: 'BUTTON',
        id,
        dataset: {},
        getAttribute: name => name === 'aria-label' ? label : null,
      };
      const ignoredRoot = {};
      const target = {
        closest(selector) {
          if (selector === '[data-analytics-ignore]') return ignored ? ignoredRoot : null;
          if (selector === "[data-analytics-event], a[href^='#'], button") return button;
          return null;
        },
      };
      listeners.click({ target });
    },
  };
}

test('automatic click analytics skip ignored story content without changing accessible names', () => {
  const analytics = analyticsHarness();
  analytics.click(true, '', '長い日本語の物語の一文');
  assert.equal(analytics.events.length, 0);

  analytics.click(false, 'playButton', 'Read aloud');
  assert.equal(analytics.events.length, 1);
  assert.equal(analytics.events[0][1], 'button_click');
  assert.equal(analytics.events[0][2].element_label, 'Read aloud');
});
