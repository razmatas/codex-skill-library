import { mkdir, lstat, readdir, cp, rename, rmdir } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID, createHash } from 'node:crypto';
import { planSync, validateManagedEntries, safeAncestors } from './sync-plan.js';
import { packageHash, metadata } from './scanner.js';
import { readFile } from 'node:fs/promises';
import { atomicJson } from './config.js';

export function planDigest(plan) { return createHash('sha256').update(JSON.stringify(plan)).digest('hex'); }
async function exists(file) { try { return await lstat(file); } catch (e) { if (e.code === 'ENOENT') return null; throw e; } }
// Reject links/special files even if a read-only fingerprint could follow them.
async function plainTree(directory) {
  const info = await lstat(directory);
  if (!info.isDirectory() || info.isSymbolicLink()) throw new Error('Source is not a plain directory');
  for (const entry of await readdir(directory)) {
    const file = path.join(directory, entry), item = await lstat(file);
    if (item.isSymbolicLink() || (!item.isDirectory() && !item.isFile())) throw new Error('Source contains a symlink or special file');
    if (item.isDirectory()) await plainTree(file);
  }
}

// Explicit caller approval is tied to the exact current plan. Never call from scans/reports.
// Advisory locks coordinate this tool only; stop other installers while applying.
export async function applySync(manifest, options, approvedDigest) {
  const { roots, projectRoot, receiptFile } = options;
  if (!receiptFile || !path.isAbsolute(receiptFile)) throw new Error('Absolute receipt file required');
  await safeAncestors(path.dirname(receiptFile));
  await mkdir(path.dirname(receiptFile), { recursive: true });
  const lock = path.join(path.dirname(receiptFile), '.sync-lock');
  await mkdir(lock); // Existing lock means another run or recovery is needed; never steal it.
  const results = [];
  try {
    const receipts = options.receipts || {};
    const plan = await planSync(manifest, options);
    if (planDigest(plan) !== approvedDigest) throw new Error('Plan changed; review a new dry-run');
    if (plan.some(row => !['unchanged', 'install', 'update-with-backup'].includes(row.action))) throw new Error('Plan contains unresolved conflicts or unprepared sources');
    const entries = validateManagedEntries(manifest);
    for (let i = 0; i < plan.length; i++) {
      const row = plan[i], entry = entries[i];
      if (row.action === 'unchanged') { results.push({ ...row, applied: false }); continue; }
      const root = roots[entry.installRoot], target = path.join(root, entry.folder);
      await safeAncestors(root); await mkdir(root, { recursive: true });
      const source = path.join(projectRoot, entry.source.path);
      await plainTree(source);
      const name = metadata(await readFile(path.join(source, 'SKILL.md'), 'utf8')).name;
      if (name !== entry.name) throw new Error('Source name differs from manifest');
      const stage = path.join(root, `.skill-library-stage-${randomUUID()}`);
      await cp(source, stage, { recursive: true, errorOnExist: true, force: false, preserveTimestamps: true });
      await plainTree(stage);
      if (await packageHash(stage) !== entry.expectedHash) throw new Error(`Staged fingerprint differs; preserved staging at ${stage}`);
      // Revalidate directly before moving any installed package.
      await safeAncestors(root);
      const current = await exists(target);
      if (current && (!current.isDirectory() || current.isSymbolicLink())) throw new Error('Target changed into a link or non-directory');
      const currentHash = current ? await packageHash(target) : null;
      if (currentHash !== row.currentHash) throw new Error('Local contents changed since approval; preserved target and staging');
      let backup = null;
      if (current) {
        const backups = path.join(root, '.skill-library-backups');
        await safeAncestors(backups); await mkdir(backups, { recursive: true });
        backup = path.join(backups, `${entry.folder}-${randomUUID()}`);
        await rename(target, backup);
        if (await packageHash(backup) !== currentHash) {
          if (!await exists(target)) await rename(backup, target);
          throw new Error('Contents changed during move; backup preserved or restored');
        }
      }
      try {
        if (await exists(target)) throw new Error('Another installer created target; original backup preserved');
        await rename(stage, target);
      } catch (error) {
        if (backup && !await exists(target)) await rename(backup, target);
        throw error;
      }
      receipts[`${entry.installRoot}/${entry.folder}`] = { hash: entry.expectedHash, installedAt: new Date().toISOString(), backup };
      await atomicJson(receiptFile, receipts);
      results.push({ ...row, applied: true, backup });
    }
    return results;
  } finally { await rmdir(lock); }
}
