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
    setAttribute(name,value) { this[name]=value; },
  };
}

test('generated token is embedded in a pullable Shadowrocket module URL', async () => {
  const ids = ['server', 'token', 'generate-token', 'preview-status', 'subscription-url', 'error',
    'download', 'copy-link','toggle-token'];
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
      createElement() { return { click() { downloads.push(this.href); } }; },
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
  const expected = `https://api.raivex.xyz:8443/mysekaibot_cn.sgmodule?token=${token}`;
  assert.equal(copied[0], expected);
  assert.equal(elements['#subscription-url'].textContent, expected);
  elements['#download'].listeners.click();
  assert.equal(downloads.length, 1);
  assert.equal(downloads[0],expected);
});

test('upload-data is the canonical page and the module deep link still loads', () => {
  const page = readFileSync(path.join(__dirname, '..', 'upload-data', 'ios-module', 'index.html'), 'utf8');
  const hub = readFileSync(path.join(__dirname, '..', 'upload-data', 'index.html'), 'utf8');
  const root = readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  for (const entry of [page, hub]) {
    assert.match(entry, /<div id="root"><\/div>/);
    assert.match(entry, /\/src\/main.tsx/);
    assert.match(entry, /connect-src 'none'/);
    assert.match(entry, /https:\/\/dave\.raivex\.xyz\/upload-data\//);
    assert.doesNotMatch(entry, /http-equiv="refresh"/);
  }
  assert.equal(readFileSync(path.join(__dirname, '..', 'public', 'CNAME'), 'utf8').trim(), 'dave.raivex.xyz');
  const component = readFileSync(path.join(__dirname, '..', 'src', 'modules', 'ios-module', 'Page.tsx'), 'utf8');
  assert.match(component, /<h1 id="page-title">上传数据<\/h1>/);
  assert.doesNotMatch(component, /白名单|admin\./);
  const publishedRoot = readFileSync(path.join(__dirname, '..', 'public', 'index.html'), 'utf8');
  for (const redirect of [root, publishedRoot]) {
    assert.match(redirect, /url=https:\/\/dave\.raivex\.xyz\/upload-data\//);
    assert.match(redirect, /rel="canonical" href="https:\/\/dave\.raivex\.xyz\/upload-data\/"/);
    assert.doesNotMatch(redirect, /https:\/\/raivex\.xyz\//);
  }
});
