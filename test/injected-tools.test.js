import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const source = await readFile(new URL('../src/injected-tools.js', import.meta.url), 'utf8');

class FakeElement {
  constructor(tagName) {
    this.tagName = tagName;
    this.attributes = new Map();
    this.style = {};
    this.textContent = '';
    this.removed = false;
  }

  setAttribute(name, value) {
    this.attributes.set(name, value);
  }

  getAttribute(name) {
    return this.attributes.get(name) ?? null;
  }

  remove() {
    this.removed = true;
  }
}

function createHarness() {
  const listeners = new Map();
  const selectorCalls = new Map();
  const selectorCounts = new Map([
    ['h1, h2, h3, h4, h5, h6', 3],
    ['header, nav, main, aside, footer, [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"]', 4],
    ['button, [role="button"]', 2],
    ['a[href]', 1],
    ['form', 1],
    ['img:not([alt])', 0],
  ]);

  const buttons = [
    Object.assign(new FakeElement('button'), { textContent: 'Save' }),
    new FakeElement('button'),
  ];

  const documentElement = new FakeElement('html');
  documentElement.lang = 'en';
  documentElement.append = (element) => {
    documentElement.lastChild = element;
  };

  const document = {
    documentElement,
    createElement: (tagName) => new FakeElement(tagName),
    querySelectorAll: (selector) => {
      selectorCalls.set(selector, (selectorCalls.get(selector) ?? 0) + 1);
      if (selector === 'button, [role="button"]') {
        return buttons;
      }
      return Array.from({ length: selectorCounts.get(selector) ?? 0 }, () => new FakeElement('x'));
    },
  };

  const window = {
    addEventListener(type, listener) {
      listeners.set(type, listener);
    },
    removeEventListener(type, listener) {
      if (listeners.get(type) === listener) {
        listeners.delete(type);
      }
    },
    dispatch(type, event) {
      listeners.get(type)?.(event);
    },
  };

  return { document, listeners, selectorCalls, window };
}

test('registers two narrow tools and toggles cleanly', async () => {
  const harness = createHarness();
  const context = vm.createContext({
    document: harness.document,
    window: harness.window,
  });

  const enabled = vm.runInContext(source, context);
  assert.deepEqual({ ...enabled }, { enabled: true, toolCount: 2 });
  assert.equal(harness.listeners.has('devtoolstooldiscovery'), true);
  assert.match(harness.document.documentElement.lastChild.textContent, /read-only tools/);

  let group;
  harness.window.dispatch('devtoolstooldiscovery', {
    respondWith(value) {
      group = value;
    },
  });

  assert.equal(group.name, 'Hermes Browser Interop Lab');
  assert.deepEqual(
    Array.from(group.tools, (tool) => tool.name),
    ['describeHermesInteropHarness', 'auditPageSemantics'],
  );

  const description = await group.tools[0].execute({});
  assert.equal(description.dataCollection, false);
  assert.equal(description.networkAccess, false);
  assert.equal(description.mutationTools, false);

  const audit = await group.tools[1].execute({});
  assert.deepEqual(
    {
      documentLanguage: audit.documentLanguage,
      headings: audit.headings,
      landmarks: audit.landmarks,
      buttons: audit.buttons,
      links: audit.links,
      forms: audit.forms,
      imagesMissingAlt: audit.imagesMissingAlt,
      unnamedButtons: audit.unnamedButtons,
    },
    {
      documentLanguage: 'en',
      headings: 3,
      landmarks: 4,
      buttons: 2,
      links: 1,
      forms: 1,
      imagesMissingAlt: 0,
      unnamedButtons: 1,
    },
  );

  const notice = harness.document.documentElement.lastChild;
  const disabled = vm.runInContext(source, context);
  assert.deepEqual({ ...disabled }, { enabled: false, toolCount: 0 });
  assert.equal(harness.listeners.has('devtoolstooldiscovery'), false);
  assert.equal(notice.removed, true);
});

test('queries button elements once per semantics audit', async () => {
  const harness = createHarness();
  const context = vm.createContext({
    document: harness.document,
    window: harness.window,
  });

  vm.runInContext(source, context);

  let group;
  harness.window.dispatch('devtoolstooldiscovery', {
    respondWith(value) {
      group = value;
    },
  });

  await group.tools[1].execute({});

  assert.equal(harness.selectorCalls.get('button, [role="button"]'), 1);
});

test('contains no network, storage, cookie, or dynamic-code primitives', () => {
  const forbidden = [
    /\bfetch\s*\(/,
    /XMLHttpRequest/,
    /WebSocket/,
    /document\.cookie/,
    /localStorage/,
    /sessionStorage/,
    /\beval\s*\(/,
    /new\s+Function\b/,
  ];

  for (const pattern of forbidden) {
    assert.doesNotMatch(source, pattern);
  }
});
