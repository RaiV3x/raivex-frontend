import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

const pages = ['dist/upload-data/index.html', 'dist/upload-data/ios-module/index.html'];
for (const entry of pages) {
  const html = readFileSync(entry, 'utf8');
  assert.match(html, /name="viewport" content="width=device-width, initial-scale=1/);
  assert.match(html, /<link rel="canonical" href="https:\/\/dave\.raivex\.xyz\/upload-data\/"\s*>/);
  assert.match(html, /<script type="module" crossorigin src="\/assets\//);
  assert.doesNotMatch(html, /admin\.|110\.42\.44\.176|http-equiv="refresh"/);
}
const css = readdirSync('dist/assets').filter(name => name.endsWith('.css'))
  .map(name => readFileSync(`dist/assets/${name}`, 'utf8')).join('\n');
assert.doesNotMatch(css, /@media\s*\([^)]*[<>]=/, 'Media query ranges break older Safari mobile layout');
assert.match(css, /@media\s*\(max-width:\s*560px\)/);
assert.match(css, /@media\s*\(min-width:\s*900px\)/);
const scripts = readdirSync('dist/assets').filter(name => name.endsWith('.js'))
  .map(name => readFileSync(`dist/assets/${name}`, 'utf8')).join('\n');
assert.ok(scripts.includes('https://api.raivex.xyz:8443'), 'Production subscriptions must use the direct API port');
assert.ok(!scripts.includes('upload.raivex.xyz'), 'Abandoned upload hostname must not be shipped');
const root = readFileSync('dist/index.html', 'utf8');
assert.match(root, /url=https:\/\/dave\.raivex\.xyz\/upload-data\//);
assert.match(root, /rel="canonical" href="https:\/\/dave\.raivex\.xyz\/upload-data\/"/);
assert.doesNotMatch(root, /https:\/\/raivex\.xyz\//);
console.log('Production compatibility: upload hub, module link, Safari media queries and canonical domain OK');
