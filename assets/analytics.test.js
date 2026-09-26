'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

function storybookPageviewHarness(href, referrer) {
  const dataLayer = [];
  const replacements = [];
  const location = new URL(href);
  const document = { referrer };
  const history = {
    replaceState(_state, _title, url) {
      replacements.push(url);
      location.href = new URL(url, location.href).href;
    },
  };
  const context = { dataLayer, document, history, location, URL };
  context.window = context;
  const html = fs.readFileSync(path.join(__dirname, '../taiwan-ehon/index.html'), 'utf8');
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  for (const [, script] of scripts) vm.runInNewContext(script, context);
  const config = dataLayer.map(args => Array.from(args)).find(args => args[0] === 'config');
  return { config: config && config[2], initialHash: context.taiwanEhonInitialHash, location, replacements };
}

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

test('storybook direct-link fragments are scrubbed before page-view configuration', () => {
  const page = storybookPageviewHarness(
    'https://gallery.example/taiwan-ehon/?lang=ja#bai-zei-qi/7',
    'https://gallery.example/#taiwan-ehon/shooting-the-sun/12',
  );

  assert.equal(page.initialHash, '#bai-zei-qi/7');
  assert.equal(page.location.hash, '');
  assert.deepEqual(page.replacements, ['/taiwan-ehon/?lang=ja']);
  assert.equal(page.config.page_location, 'https://gallery.example/taiwan-ehon/?lang=ja');
  assert.equal(page.config.page_referrer, 'https://gallery.example/');
  assert.equal(page.config.page_title, 'Taiwan story picture books');
});

test('automatic click analytics skip ignored story content without changing accessible names', () => {
  const analytics = analyticsHarness();
  analytics.click(true, '', '長い日本語の物語の一文');
  assert.equal(analytics.events.length, 0);

  analytics.click(false, 'playButton', 'Read aloud');
  assert.equal(analytics.events.length, 1);
  assert.equal(analytics.events[0][1], 'button_click');
  assert.equal(analytics.events[0][2].element_label, 'Read aloud');
});
