import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, realpath, mkdir, writeFile, readFile, symlink } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { packageHash } from '../src/scanner.js';
import { planSync } from '../src/sync-plan.js';
import { applySync, planDigest } from '../src/sync-apply.js';

async function fixture() {
  const projectRoot = await realpath(await mkdtemp(path.join(os.tmpdir(), 'skill-sync-apply-')));
  const source = path.join(projectRoot, 'skills/example');
  await mkdir(source, { recursive: true });
  await writeFile(path.join(source, 'SKILL.md'), '---\nname: example\ndescription: A test package\n---\nReviewed content');
  const entry = { managed: true, name: 'example', folder: 'example', installRoot: 'agents', expectedHash: await packageHash(source), source: { type: 'custom', path: 'skills/example' } };
  return { manifest: { schemaVersion: 1, skills: [entry] }, entry, source, options: { projectRoot, roots: { agents: path.join(projectRoot, 'home/.agents/skills') }, receiptFile: path.join(projectRoot, 'data/receipts.json'), receipts: {} } };
}
test('explicit plan approval installs, update preserves complete original package backup', async () => {
  const f = await fixture();
  let plan = await planSync(f.manifest, f.options);
  const installed = await applySync(f.manifest, f.options, planDigest(plan));
  const target = installed[0].target;
  assert.equal(await packageHash(target), f.entry.expectedHash);
  const original = await readFile(path.join(target, 'SKILL.md'), 'utf8');
  f.options.receipts = JSON.parse(await readFile(f.options.receiptFile, 'utf8'));
  await writeFile(path.join(f.source, 'SKILL.md'), original + '\nApproved update');
  f.entry.expectedHash = await packageHash(f.source);
  plan = await planSync(f.manifest, f.options);
  const updated = await applySync(f.manifest, f.options, planDigest(plan));
  assert.equal(await readFile(path.join(updated[0].backup, 'SKILL.md'), 'utf8'), original);
  assert.equal(await packageHash(target), f.entry.expectedHash);
});
test('changed approval, unmanaged edits and concurrent-run lock never overwrite target', async () => {
  const f = await fixture(), target = path.join(f.options.roots.agents, 'example');
  const approval = planDigest(await planSync(f.manifest, f.options));
  await mkdir(target, { recursive: true }); await writeFile(path.join(target, 'SKILL.md'), 'user work');
  await assert.rejects(applySync(f.manifest, f.options, approval), /Plan changed/);
  const plan = await planSync(f.manifest, f.options);
  await assert.rejects(applySync(f.manifest, f.options, planDigest(plan)), /unresolved conflicts/);
  await mkdir(path.join(path.dirname(f.options.receiptFile), '.sync-lock'));
  await assert.rejects(applySync(f.manifest, f.options, planDigest(plan)), /EEXIST/);
  assert.equal(await readFile(path.join(target, 'SKILL.md'), 'utf8'), 'user work');
});
test('plain-copy validation rejects package links without installing them', async () => {
  const f = await fixture();
  await writeFile(path.join(f.source, 'notes.md'), 'reference');
  await symlink('notes.md', path.join(f.source, 'link.md'));
  f.entry.expectedHash = await packageHash(f.source);
  const plan = await planSync(f.manifest, f.options);
  await assert.rejects(applySync(f.manifest, f.options, planDigest(plan)), /symlink/);
});
