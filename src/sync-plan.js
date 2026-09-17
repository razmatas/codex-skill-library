import { lstat, realpath } from 'node:fs/promises';
import path from 'node:path';
import { packageHash } from './scanner.js';

const hashPattern = /^[a-f0-9]{64}$/;
const segment = /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,99}$/;
// Fail closed: manifests are reviewed data, never executable shell instructions.
export function validateManagedEntries(manifest) {
  if (manifest.schemaVersion !== 1 || !Array.isArray(manifest.skills)) throw new Error('Invalid library schema');
  const targets = new Set();
  return manifest.skills.filter(entry => entry.managed === true).map(entry => {
    if (!segment.test(entry.folder || '') || !['agents', 'codex'].includes(entry.installRoot) || !hashPattern.test(entry.expectedHash || '')) throw new Error('Invalid managed target or fingerprint');
    if (!entry.name || typeof entry.name !== 'string') throw new Error('Managed skill needs a name');
    if (!entry.source || !['custom', 'github'].includes(entry.source.type)) throw new Error('Unsupported managed source');
    if (entry.source.type === 'custom' && entry.source.path !== `skills/${entry.folder}`) throw new Error('Custom package must be under skills/<folder>');
    if (entry.source.type === 'github' && (!/^[\w.-]+\/[\w.-]+$/.test(entry.source.repo || '') || !/^[a-f0-9]{40}$/.test(entry.source.revision || '') || !entry.source.path || entry.source.path.split('/').some(p => !segment.test(p)))) throw new Error('GitHub source needs a repository, full commit and safe package path');
    const target = `${entry.installRoot}/${entry.folder}`;
    if (targets.has(target)) throw new Error('Duplicate managed target');
    targets.add(target);
    return entry;
  });
}

async function exists(file) { try { return await lstat(file); } catch (e) { if (e.code === 'ENOENT') return null; throw e; } }
export async function safeAncestors(file) {
  for (let current = file; ; current = path.dirname(current)) {
    const info = await exists(current);
    if (info && (info.isSymbolicLink() || !info.isDirectory())) throw new Error('Install path contains a symlink or non-directory');
    if (path.dirname(current) === current) break;
  }
}

export async function planSync(manifest, { roots, projectRoot, receipts = {} }) {
  const entries = validateManagedEntries(manifest), plan = [];
  for (const entry of entries) {
    const row = { name: entry.name, folder: entry.folder, installRoot: entry.installRoot, expectedHash: entry.expectedHash };
    try {
      if (!path.isAbsolute(roots[entry.installRoot] || '')) throw new Error('Missing absolute install root');
      const target = path.join(roots[entry.installRoot], entry.folder);
      row.target = target;
      await safeAncestors(path.dirname(target));
      const info = await exists(target);
      if (info && (info.isSymbolicLink() || !info.isDirectory())) throw new Error('Target is a symlink or non-directory; manual review required');
      row.currentHash = info ? await packageHash(target) : null;
      if (row.currentHash === entry.expectedHash) { row.action = 'unchanged'; }
      else if (info && receipts[`${entry.installRoot}/${entry.folder}`]?.hash !== row.currentHash) {
        row.action = 'conflict'; row.reason = 'Unmanaged package or local edits; preserve existing contents';
      } else {
        row.action = info ? 'update-with-backup' : 'install';
        if (entry.source.type === 'github') {
          row.action = 'source-required'; row.reason = 'Pinned upstream package must be obtained and reviewed; planner never downloads or executes it';
        } else {
          const source = path.join(projectRoot, entry.source.path);
          row.source = source;
          await safeAncestors(source);
          const resolved = await realpath(source), base = await realpath(path.join(projectRoot, 'skills'));
          if (!resolved.startsWith(base + path.sep)) throw new Error('Source escapes reviewed package directory');
          if (await packageHash(source) !== entry.expectedHash) throw new Error('Source fingerprint differs from approved manifest');
        }
      }
    } catch (error) { row.action = 'conflict'; row.reason = error.message; }
    plan.push(row);
  }
  return plan;
}
