import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

const html = readFileSync('dist/upload-data/ios-module/index.html', 'utf8');
assert.match(html, /name="viewport" content="width=device-width, initial-scale=1/);
assert.match(html, /https:\/\/dave\.raivex\.xyz\//);
const css = readdirSync('dist/assets').filter(name => name.endsWith('.css'))
  .map(name => readFileSync(`dist/assets/${name}`, 'utf8')).join('\n');
assert.doesNotMatch(css, /@media\s*\([^)]*[<>]=/, 'Media query ranges break older Safari mobile layout');
assert.match(css, /@media\s*\(max-width:\s*560px\)/);
assert.match(css, /@media\s*\(min-width:\s*900px\)/);
assert.doesNotMatch(html, /admin\.|110\.42\.44\.176/);
const scripts = readdirSync('dist/assets').filter(name => name.endsWith('.js'))
  .map(name => readFileSync(`dist/assets/${name}`, 'utf8')).join('\n');
assert.ok(scripts.includes('https://api.raivex.xyz:8443'), 'Production subscriptions must use the direct API port');
assert.ok(!scripts.includes('upload.raivex.xyz'), 'Abandoned upload hostname must not be shipped');
for (const entry of ['dist/index.html', 'dist/upload-data/index.html']) {
  const redirect = readFileSync(entry, 'utf8');
  assert.match(redirect, /url=https:\/\/dave\.raivex\.xyz\/upload-data\/ios-module\//);
  assert.match(redirect, /rel="canonical" href="https:\/\/dave\.raivex\.xyz\/upload-data\/ios-module\/"/);
  assert.doesNotMatch(redirect, /https:\/\/raivex\.xyz\//);
}
console.log('Production compatibility: viewport, Safari media queries, canonical domain OK');
