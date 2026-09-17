import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, symlink, readFile, realpath } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { packageHash } from '../src/scanner.js';
import { planSync, validateManagedEntries } from '../src/sync-plan.js';

async function fixture() {
  const projectRoot = await realpath(await mkdtemp(path.join(os.tmpdir(), 'skill-sync-plan-')));
  const source = path.join(projectRoot, 'skills/example');
  const roots = { agents: path.join(projectRoot, 'home/.agents/skills'), codex: path.join(projectRoot, 'home/.codex/skills') };
  await mkdir(source, { recursive: true });
  await mkdir(roots.agents, { recursive: true });
  await writeFile(path.join(source, 'SKILL.md'), 'reviewed content');
  const entry = { managed: true, name: 'example', folder: 'example', installRoot: 'agents', expectedHash: await packageHash(source), source: { type: 'custom', path: 'skills/example' } };
  return { projectRoot, roots, entry, manifest: { schemaVersion: 1, skills: [entry] } };
}
test('manifest rejects traversal, mutable upstream refs and duplicate targets', async () => {
  const f = await fixture();
  for (const change of [{ folder: '../bad' }, { installRoot: 'system' }, { source: { type: 'github', repo: 'owner/repo', revision: 'main', path: 'skills/example' } }]) {
    assert.throws(() => validateManagedEntries({ ...f.manifest, skills: [{ ...f.entry, ...change }] }));
  }
  assert.throws(() => validateManagedEntries({ ...f.manifest, skills: [f.entry, f.entry] }));
});
test('planner refuses unowned edits and only proposes backup update with matching receipt', async () => {
  const f = await fixture(), target = path.join(f.roots.agents, 'example');
  assert.equal((await planSync(f.manifest, f))[0].action, 'install');
  await mkdir(target); await writeFile(path.join(target, 'SKILL.md'), 'local edits');
  assert.equal((await planSync(f.manifest, f))[0].action, 'conflict');
  const receipts = { 'agents/example': { hash: await packageHash(target) } };
  assert.equal((await planSync(f.manifest, { ...f, receipts }))[0].action, 'update-with-backup');
  assert.equal(await readFile(path.join(target, 'SKILL.md'), 'utf8'), 'local edits');
  await writeFile(path.join(target, 'SKILL.md'), 'new local edits');
  assert.equal((await planSync(f.manifest, { ...f, receipts }))[0].action, 'conflict');
});
test('source mismatch and target symlink are conflicts, identical unmanaged target is unchanged', async () => {
  const f = await fixture(), target = path.join(f.roots.agents, 'example');
  await writeFile(path.join(f.projectRoot, 'skills/example/SKILL.md'), 'modified after approval');
  assert.equal((await planSync(f.manifest, f))[0].action, 'conflict');
  await symlink(path.join(f.projectRoot, 'skills/example'), target);
  assert.equal((await planSync(f.manifest, f))[0].action, 'conflict');
  const g = await fixture(); await mkdir(path.join(g.roots.agents, 'example'));
  await writeFile(path.join(g.roots.agents, 'example/SKILL.md'), 'reviewed content');
  assert.equal((await planSync(g.manifest, g))[0].action, 'unchanged');
});
