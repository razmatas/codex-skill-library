import { readFile, mkdir, writeFile, rename } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import os from 'node:os';

export const projectRoot = fileURLToPath(new URL('../', import.meta.url));
export const dataDir = path.join(projectRoot, 'data');
export async function readJson(file, fallback) {
  try { return JSON.parse(await readFile(file, 'utf8')); }
  catch (error) { if (error.code === 'ENOENT') return fallback; throw error; }
}
export async function loadConfig() {
  const defaults = await readJson(path.join(projectRoot, 'config.example.json'), {});
  const local = await readJson(path.join(projectRoot, 'config.local.json'), {});
  const config = { ...defaults, machineId: os.hostname().toLowerCase().replace(/[^a-z0-9-]/g, '-'), machineName: os.hostname(), ...local };
  if (!/^[a-z0-9-]{1,80}$/.test(config.machineId)) throw new Error('Invalid machineId');
  if (!Number.isInteger(config.port) || config.port < 1024 || config.port > 65535) throw new Error('Invalid port');
  if (config.scanIntervalMs < 10000 || config.staleAfterMs < config.scanIntervalMs * 2) throw new Error('Invalid scan/stale intervals');
  if (!Number.isInteger(config.scanTimeoutMs) || config.scanTimeoutMs < 10000 || config.scanTimeoutMs > 600000) throw new Error('Invalid scan timeout');
  return config;
}
export async function atomicJson(file, value) {
  await mkdir(path.dirname(file), { recursive: true });
  const temporary = `${file}.${process.pid}.tmp`;
  await writeFile(temporary, JSON.stringify(value, null, 2) + '\n', { mode: 0o600 });
  await rename(temporary, file);
}
