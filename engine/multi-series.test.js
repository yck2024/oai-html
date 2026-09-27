'use strict';

// Generic checks that run against every series registered in engine/registry.js, including one
// (japan-ehon) with no stories yet. Series-specific behavioral detail (real narration, real
// routing, real analytics payloads) stays in ehon/app/sw/pwa/routing/book-pages.test.js, which
// exercise the fully-populated taiwan-ehon dataset; this file instead guards the two things
// every series must get right regardless of content: it must not have drifted from the shared
// engine source, and its own config must be internally consistent.

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const ROOT = path.join(__dirname, '..');
const SERIES_FOLDERS = require('./registry.js');
const { sync } = require('./build.js');

test('every registered series folder is in sync with engine/ (no hand-edited copy has drifted)', () => {
  const drifted = sync({ write: false });
  assert.deepEqual(drifted, [], `out of sync with engine/ — run \`node engine/build.js\`:\n${drifted.join('\n')}`);
});

test('every registered series has a stories.js that matches its stories/*.js source, if it has one', () => {
  const { build } = require('./build-stories.js');
  const changed = build({ write: false });
  assert.deepEqual(changed, [], `stories.js out of sync with stories/*.js — run \`node engine/build-stories.js\`:\n${changed.join(', ')}`);
});

for (const folder of SERIES_FOLDERS) {
  test(`${folder}: series.config.js is complete and its own folder/basePath agree with its path on disk`, () => {
    const seriesDir = path.join(ROOT, folder);
    const config = require(path.join(seriesDir, 'series.config.js'));
    assert.equal(config.folder, folder, 'config.folder must match the folder it lives in');
    assert.equal(config.shelfMarker, `/${folder}/`);
    assert.equal(config.basePath, `/oai-html/${folder}/`);
    assert.ok(config.id, 'config.id (the GA series_id value) must be set');
    assert.ok(Array.isArray(config.languages) && config.languages.length >= 1, 'config.languages must be a non-empty array');
    assert.ok(config.languages.every(lang => ['ja', 'zh', 'en'].includes(lang)), 'config.languages may only contain ja/zh/en');
    assert.ok(config.defaultMode, 'config.defaultMode must be set');
    assert.equal(typeof config.narratedOnlyToggle, 'boolean');
  });

  test(`${folder}: stories.js loads as an array with unique, non-empty story ids`, () => {
    const stories = require(path.join(ROOT, folder, 'stories.js'));
    assert.ok(Array.isArray(stories), 'stories.js must export an array');
    const ids = stories.map(story => story.id);
    assert.equal(new Set(ids).size, ids.length, 'every story id must be unique');
    for (const id of ids) assert.ok(id && typeof id === 'string', 'every story id must be a non-empty string');
  });

  test(`${folder}: manifest.webmanifest id/start_url/scope match series.config.js's basePath`, () => {
    const seriesDir = path.join(ROOT, folder);
    const config = require(path.join(seriesDir, 'series.config.js'));
    const manifest = JSON.parse(fs.readFileSync(path.join(seriesDir, 'manifest.webmanifest'), 'utf8'));
    assert.equal(manifest.id, config.basePath);
    assert.equal(manifest.start_url, config.basePath);
    assert.equal(manifest.scope, config.basePath);
  });

  test(`${folder}: generated book pages are up to date with its own stories.js and index.html`, () => {
    const seriesDir = path.join(ROOT, folder);
    const { generate } = require(path.join(seriesDir, 'generate-book-pages.js'));
    const rendered = generate({ write: false });
    for (const [id, html] of rendered) {
      const onDisk = fs.readFileSync(path.join(seriesDir, id, 'index.html'), 'utf8');
      assert.equal(onDisk, html, `${folder}/${id}/index.html is stale — run: node ${folder}/generate-book-pages.js`);
    }
  });
}

test('taiwan-ehon keeps every new language/toggle feature off, matching its original two-language behavior exactly', () => {
  const config = require(path.join(ROOT, 'taiwan-ehon', 'series.config.js'));
  assert.deepEqual(config.languages, ['ja', 'zh']);
  assert.equal(config.narratedOnlyToggle, false);
});

test('japan-ehon opts into the third language and the narrated-only toggle', () => {
  const config = require(path.join(ROOT, 'japan-ehon', 'series.config.js'));
  assert.ok(config.languages.includes('en'));
  assert.equal(config.narratedOnlyToggle, true);
});
