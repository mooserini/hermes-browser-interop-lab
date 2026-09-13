import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { access } from 'node:fs/promises';
import test from 'node:test';

const manifest = JSON.parse(await readFile(new URL('../manifest.json', import.meta.url), 'utf8'));

test('uses Manifest V3 and the minimum consent-gated permissions', () => {
  assert.equal(manifest.manifest_version, 3);
  assert.deepEqual(manifest.permissions, ['activeTab', 'scripting']);
  assert.equal('host_permissions' in manifest, false);
  assert.equal('content_scripts' in manifest, false);
  assert.deepEqual(manifest.action, {
    default_title: 'Toggle Hermes Browser Interop Lab on this page',
  });
});

test('references existing local scripts only', async () => {
  assert.equal(manifest.background.service_worker, 'src/service-worker.js');
  await access(new URL(`../${manifest.background.service_worker}`, import.meta.url));
  await access(new URL('../src/injected-tools.js', import.meta.url));
});

test('does not claim icons that are absent', () => {
  assert.equal('icons' in manifest, false);
  assert.equal('default_icon' in manifest.action, false);
});
