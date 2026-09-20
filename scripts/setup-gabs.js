import { readFile, stat } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { projectRoot, dataDir, loadConfig } from '../src/config.js';

const config = await loadConfig();
if (config.machineId !== 'gabs-laptop' || config.machineName !== 'Gabs laptop') throw new Error('This command only runs with the reviewed Gabs laptop config');
if (!/^http:\/\/100\.108\.148\.72:4317\/api\/inventory$/.test(config.reportUrl || '')) throw new Error('Unexpected reporter URL; review config.local.json');
const tokenFile = path.join(dataDir, 'report-token');
const token = (await readFile(tokenFile, 'utf8')).trim();
const mode = (await stat(tokenFile)).mode & 0o777;
if (!/^[a-f0-9]{64}$/.test(token) || mode !== 0o600) throw new Error('Reporter token is missing, invalid, or not mode 0600');
const run = (args) => execFileSync(process.execPath, args, { cwd: projectRoot, stdio: 'inherit' });
run(['scripts/restore.js', '--install-missing']);
run(['scripts/report.js']);
run(['scripts/service.js', 'install', '--reporter']);
console.log('Gabs setup complete: missing skills installed, conflicts preserved, report accepted, background reporter installed.');
