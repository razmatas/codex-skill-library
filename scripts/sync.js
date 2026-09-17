import path from 'node:path';
import os from 'node:os';
import { readJson, projectRoot, dataDir } from '../src/config.js';
import { planSync } from '../src/sync-plan.js';

// Deliberately read-only until the approved content and apply transaction are ready.
if (process.argv.slice(2).some(arg => arg !== '--dry-run')) throw new Error('Only --dry-run is supported; installed skills will not be changed');
const manifest = await readJson(path.join(projectRoot, 'library.json'), null);
const receipts = await readJson(path.join(dataDir, 'sync-receipts.json'), {});
const plan = await planSync(manifest, {
  roots: { agents: path.join(os.homedir(), '.agents/skills'), codex: path.join(process.env.CODEX_HOME || path.join(os.homedir(), '.codex'), 'skills') },
  projectRoot, receipts,
});
console.log(JSON.stringify({ mode: 'dry-run', managedSkills: plan.length, plan }, null, 2));
if (plan.some(row => ['conflict', 'source-required'].includes(row.action))) process.exitCode = 2;
