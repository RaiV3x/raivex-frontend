import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

const destination = 'https://dave.raivex.xyz/upload-data/ios-module/';
const canonical = `rel="canonical" href="${destination}"`;
const html = readFileSync('dist/upload-data/ios-module/index.html', 'utf8');
assert.match(html, /name="viewport" content="width=device-width, initial-scale=1/);
assert.ok(html.includes(canonical));
assert.match(html, /<script type="module" crossorigin src="\/assets\//);
assert.doesNotMatch(html, /admin\.|110\.42\.44\.176|http-equiv="refresh"/);

for (const file of ['dist/index.html', 'dist/upload-data/index.html']) {
  const redirect = readFileSync(file, 'utf8');
  assert.ok(redirect.includes(`http-equiv="refresh" content="0;url=${destination}"`), file);
  assert.ok(redirect.includes(canonical), file);
  assert.doesNotMatch(redirect, /<script\b|id="root"|https:\/\/raivex\.xyz\//, file);
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
console.log('Production compatibility: direct module redirects, Safari media queries and canonical domain OK');
