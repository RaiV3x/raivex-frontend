const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

function field(value = '') {
  return {
    value,
    textContent: '',
    disabled: false,
    listeners: {},
    addEventListener(type, handler) { this.listeners[type] = handler; },
  };
}

test('generated token is embedded in a pullable Shadowrocket module URL', async () => {
  const ids = ['server', 'token', 'generate-token', 'preview-status', 'subscription-url', 'error',
    'download', 'copy-link'];
  const elements = Object.fromEntries(ids.map(id => [`#${id}`, field()]));
  const copied = [];
  const downloads = [];
  class TestURL extends URL {
    static createObjectURL() { return 'blob:test'; }
    static revokeObjectURL() {}
  }
  class TestBlob {
    constructor(parts) { downloads.push(parts.join('')); }
  }
  const context = vm.createContext({
    document: {
      querySelector(selector) { return elements[selector]; },
      createElement() { return { click() {} }; },
    },
    crypto: {
      getRandomValues(bytes) { bytes.forEach((_, index) => { bytes[index] = index; }); return bytes; },
    },
    navigator: { clipboard: { writeText: async text => { copied.push(text); } } },
    URL: TestURL,
    Blob: TestBlob,
    setTimeout() {},
  });
  vm.runInContext(
    readFileSync(path.join(__dirname, '..', 'static', 'generator.js'), 'utf8'),
    context,
  );

  elements['#generate-token'].listeners.click();
  const token = elements['#token'].value;
  assert.match(token, /^[0-9a-f]{64}$/);
  assert.equal(elements['#copy-link'].disabled, false);

  await elements['#copy-link'].listeners.click();
  const expected = `https://api.raivex.xyz/mysekaibot_cn.sgmodule?token=${token}`;
  assert.equal(copied[0], expected);
  assert.equal(elements['#subscription-url'].textContent, expected);
  elements['#download'].listeners.click();
  assert.equal(downloads.length, 1);
  assert.ok(downloads[0].startsWith(`#!url=${expected}\n`));
  assert.ok(downloads[0].includes(`&token=${token}&debug=0`));
  assert.ok(!downloads[0].includes('&uid='));
  assert.ok(downloads[0].includes('endpoint=https%3A%2F%2Fapi.raivex.xyz%2Fcapture'));
  assert.ok(!downloads[0].includes('CHANGE_ME'));
  assert.ok(!downloads[0].includes('110.42.44.176:8787'));
});
