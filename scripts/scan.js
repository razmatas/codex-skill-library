import { loadConfig, atomicJson, dataDir } from '../src/config.js';
import { scan } from '../src/scanner.js';
import path from 'node:path';
const config = await loadConfig();
const result = await scan(config);
await atomicJson(path.join(dataDir, `${config.machineId}.json`), result);
console.log(JSON.stringify({ machine: result.machine, skills: result.skills.length, warnings: result.warnings, snapshot: path.join(dataDir, `${config.machineId}.json`) }, null, 2));
