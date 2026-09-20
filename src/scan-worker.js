import { parentPort, workerData } from 'node:worker_threads';
import { scan } from './scanner.js';

try {
  const inventory = await scan(workerData);
  parentPort.postMessage({ ok: true, inventory });
} catch (error) {
  parentPort.postMessage({ ok: false, error: error instanceof Error ? error.message : String(error) });
}
