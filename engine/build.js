#!/usr/bin/env node
'use strict';

// Syncs the shared engine into every registered series folder. GitHub Pages serves plain
// static files with no build/include step, and a service worker only ever intercepts requests
// its own page makes (see the taiwan-ehon README's "why series folders hold real copies" note),
// so each series folder keeps a real, unmodified copy of the runtime engine files next to its
// own series.config.js/stories.js/images/audio. `engine/` is the single source of truth for
// those copies; run this after editing anything under `engine/` (CI's drift check — `--check`
// — fails if a series folder's copy has drifted from engine/ without a re-sync).
//
// ehon.css is different: each series keeps its own *combined* stylesheet (engine/ehon.css's
// shared layout rules plus that series' own theme.css color tokens/pattern), still served as
// one file at <series>/ehon.css so no series' index.html needs a second <link> tag.

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const ENGINE_DIR = __dirname;
const SERIES = require('./registry.js');

// Copied verbatim into every series folder. Each reads that folder's own series.config.js and
// stories.js via __dirname/require, so the file itself never needs to differ between series.
const RUNTIME_FILES = ['ehon.js', 'app.js', 'offline.js', 'sw.js', 'generate-book-pages.js', 'test-dom.js'];

function combinedCss(seriesDir) {
  const base = fs.readFileSync(path.join(ENGINE_DIR, 'ehon.css'), 'utf8');
  const theme = fs.readFileSync(path.join(seriesDir, 'theme.css'), 'utf8');
  return `${theme}\n${base}`;
}

function targetsFor(seriesFolder) {
  const seriesDir = path.join(ROOT, seriesFolder);
  const targets = new Map();
  for (const file of RUNTIME_FILES) {
    targets.set(path.join(seriesDir, file), fs.readFileSync(path.join(ENGINE_DIR, file), 'utf8'));
  }
  targets.set(path.join(seriesDir, 'ehon.css'), combinedCss(seriesDir));
  return targets;
}

function sync({ write = true } = {}) {
  const drifted = [];
  for (const seriesFolder of SERIES) {
    for (const [targetPath, content] of targetsFor(seriesFolder)) {
      const current = fs.existsSync(targetPath) ? fs.readFileSync(targetPath, 'utf8') : null;
      if (current === content) continue;
      drifted.push(path.relative(ROOT, targetPath));
      if (write) fs.writeFileSync(targetPath, content);
    }
  }
  return drifted;
}

if (require.main === module) {
  const check = process.argv.includes('--check');
  const drifted = sync({ write: !check });
  if (check) {
    if (drifted.length) {
      console.error('Out of sync with engine/ (run `node engine/build.js` to fix):');
      for (const file of drifted) console.error(`  ${file}`);
      process.exit(1);
    }
    console.log('Every series folder matches engine/.');
  } else {
    console.log(drifted.length ? `Synced ${drifted.length} file(s):\n${drifted.map(f => `  ${f}`).join('\n')}` : 'Already in sync.');
  }
}

module.exports = { sync, targetsFor, RUNTIME_FILES };
