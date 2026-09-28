'use strict';

// Minimal fake DOM shared by the reader's Node test harnesses (app.test.js, routing.test.js).
// Not itself a test file: it exists to run app.js's source in a vm sandbox without a browser.

class FakeElement {
  constructor(tagName = 'div') {
    this.tagName = tagName.toUpperCase();
    this.children = [];
    this.listeners = new Map();
    this.attributes = {};
    this.dataset = {};
    this.style = { setProperty() {} };
    this.className = '';
    this.hidden = false;
    this.checked = false;
    this.disabled = false;
    this.value = '';
    this.classList = {
      add: (...names) => this.setClasses(names, true),
      remove: (...names) => this.setClasses(names, false),
      contains: name => this.className.split(/\s+/).includes(name),
      toggle: (name, force = !this.classList.contains(name)) => {
        this.setClasses([name], force);
        return force;
      },
    };
  }

  setClasses(names, add) {
    const classes = new Set(this.className.split(/\s+/).filter(Boolean));
    for (const name of names) {
      if (add) classes.add(name);
      else classes.delete(name);
    }
    this.className = [...classes].join(' ');
  }

  append(...nodes) {
    for (const node of nodes) {
      if (node instanceof FakeElement && node.tagName === '#FRAGMENT') {
        this.append(...node.children);
      } else {
        if (node instanceof FakeElement) node.parentElement = this;
        this.children.push(node);
      }
    }
  }

  replaceChildren(...nodes) {
    this.children = [];
    this.append(...nodes);
  }

  addEventListener(type, listener) {
    const listeners = this.listeners.get(type) || [];
    listeners.push(listener);
    this.listeners.set(type, listeners);
  }

  dispatch(type, detail = {}) {
    for (const listener of this.listeners.get(type) || []) {
      listener({ target: this, ...detail });
    }
  }

  setAttribute(name, value) { this.attributes[name] = String(value); }
  getAttribute(name) { return this.attributes[name] ?? null; }
  focus() {}
  scrollIntoView() {}

  cloneNode(deep = false) {
    const clone = new FakeElement(this.tagName);
    clone.className = this.className;
    clone.dataset = { ...this.dataset };
    clone.attributes = { ...this.attributes };
    clone.scrollTop = this.scrollTop;
    if (deep) clone.append(...this.children.map(child => child instanceof FakeElement ? child.cloneNode(true) : child));
    return clone;
  }

  removeAttribute(name) { delete this.attributes[name]; }

  remove() {
    if (!this.parentElement) return;
    const index = this.parentElement.children.indexOf(this);
    if (index >= 0) this.parentElement.children.splice(index, 1);
    this.parentElement = null;
  }

  closest(selector) {
    for (let node = this; node; node = node.parentElement) {
      if (selector.startsWith('.') && selector.slice(1).split('.').every(name => node.classList.contains(name))) return node;
    }
    return null;
  }

  descendants() {
    return this.children.flatMap(child => child instanceof FakeElement ? [child, ...child.descendants()] : []);
  }

  querySelectorAll(selector) {
    const selectors = selector.split(',').map(item => item.trim());
    return this.descendants().filter(node => selectors.some(item =>
      item.startsWith('.') && item.slice(1).split('.').every(name => node.classList.contains(name))));
  }

  querySelector(selector) {
    if (selector === '.book-card') return this.querySelectorAll(selector)[0] || null;
    if (selector.startsWith('.')) return this.querySelectorAll(selector)[0] || null;
    return null;
  }

  contains(node) { return node === this || this.descendants().includes(node); }
}

// Every element id app.js queries at startup; both harnesses need the full set or app.js throws.
const READER_IDS = [
  'shelf', 'bookList', 'reader', 'readerTitle', 'closeBook', 'settingsButton', 'settingsPanel',
  'zhuyinToggle', 'autoTurnToggle', 'continuousToggle', 'stage', 'page', 'pageArt', 'pageImage', 'pageText', 'speechStatus',
  'prevButton', 'nextButton', 'playButton', 'playIcon', 'replayButton', 'muteButton', 'muteIcon', 'pageCounter',
];

// Fakes `location`/`history`/window-level `addEventListener('popstate', ...)` with a real
// back/forward stack, so app.js's routing can run and be driven the same way a browser would.
function createLocationHistory(initialPath, origin = 'https://yck2024.github.io') {
  const stack = [{ path: initialPath }];
  let cursor = 0;
  const popstateListeners = [];

  const location = {
    get pathname() { return stack[cursor].path; },
    get origin() { return origin; },
  };

  function resolve(url) {
    return new URL(url, origin + stack[cursor].path).pathname;
  }

  const history = {
    pushState(_state, _title, url) {
      const path = resolve(url);
      stack.length = cursor + 1;
      stack.push({ path });
      cursor = stack.length - 1;
    },
    replaceState(_state, _title, url) {
      stack[cursor] = { path: resolve(url) };
    },
  };

  function addEventListener(type, listener) {
    if (type === 'popstate') popstateListeners.push(listener);
  }

  function fire() {
    for (const listener of popstateListeners) listener({});
  }

  function back() {
    if (cursor === 0) return;
    cursor -= 1;
    fire();
  }

  function forward() {
    if (cursor === stack.length - 1) return;
    cursor += 1;
    fire();
  }

  // Lands on `path` via a popstate the way an entry the app never pushed itself would
  // (e.g. a stale bookmark for a book that no longer exists), without going through history.pushState.
  function jump(path) {
    stack.length = cursor + 1;
    stack.push({ path });
    cursor = stack.length - 1;
    fire();
  }

  return { location, history, addEventListener, back, forward, jump, currentPath: () => location.pathname };
}

module.exports = { FakeElement, READER_IDS, createLocationHistory };
