import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { loadConfig, dataDir, atomicJson } from '../src/config.js';
import { scan } from '../src/scanner.js';
const config = await loadConfig();
const url = new URL(config.reportUrl);
if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new Error('Invalid reportUrl');
if (url.protocol === 'http:' && !/^100\.(?:6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(url.hostname) && !['127.0.0.1','localhost'].includes(url.hostname)) throw new Error('HTTP reporting is limited to loopback or Tailscale IPs; use HTTPS elsewhere');
const token = (await readFile(path.join(dataDir, 'report-token'), 'utf8')).trim();
async function report() {
  const snapshot = await scan(config);
  await atomicJson(path.join(dataDir, `${config.machineId}.json`), snapshot);
  const response = await fetch(url, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(snapshot), signal: AbortSignal.timeout(15000), redirect: 'error' });
  if (!response.ok) throw new Error(`Report failed (${response.status}): ${await response.text()}`);
  console.log(`${new Date().toISOString()} Published ${snapshot.skills.length} skills as ${config.machineId}`);
}
async function attempt() { try { await report(); } catch (e) { console.error(e.message); if (!process.argv.includes('--watch')) process.exitCode = 1; } }
await attempt();
if (process.argv.includes('--watch')) {
  let busy = false;
  setInterval(async () => { if (busy) return; busy = true; try { await attempt(); } finally { busy = false; } }, config.scanIntervalMs);
}
