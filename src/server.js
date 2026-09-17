import http from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { projectRoot, dataDir, loadConfig, readJson, atomicJson } from './config.js';
import { scan } from './scanner.js';
import { buildCatalog } from './catalog.js';

export function validateInventory(input, config) {
  const short = (x, max = 1000) => typeof x === 'string' && x.length <= max;
  if (input?.schemaVersion !== 1 || !config.machines.some(x => x.id === input.machine?.id) || input.machine.id === config.machineId) throw new Error('Unknown or local machine ID');
  if (!Array.isArray(input.skills) || input.skills.length > 2000 || !Array.isArray(input.roots) || input.roots.length > 1000 || !Array.isArray(input.warnings) || input.warnings.length > 2000) throw new Error('Invalid inventory');
  const ids = new Set();
  const skills = input.skills.map(skill => {
    if (!short(skill.id, 600) || ids.has(skill.id) || !short(skill.name, 160) || !short(skill.description, 20000) || !short(skill.origin, 240) || !skill.id.startsWith(skill.origin + ':') || !['personal','builtin','plugin','project'].includes(skill.kind) || !['installed','disabled','cached'].includes(skill.state)) throw new Error('Invalid skill');
    if (skill.hash !== null && !/^[a-f0-9]{64}$/.test(skill.hash)) throw new Error('Invalid hash');
    ids.add(skill.id);
    const result = {};
    for (const key of ['id','name','description','origin','kind','state','hash']) result[key] = skill[key];
    for (const key of ['sourceLabel','version','path','hashError','setup','examplePrompt']) if (skill[key] === null || short(skill[key], 20000)) result[key] = skill[key];
    result.duplicate = skill.duplicate === true;
    return result;
  });
  const roots = input.roots.map(root => {
    if (!short(root.origin, 240) || !short(root.path, 2000) || !['ok','absent','error'].includes(root.state)) throw new Error('Invalid root');
    return { origin: root.origin, path: root.path, state: root.state };
  });
  if (!input.warnings.every(x => short(x, 4000)) || !Number.isFinite(Date.parse(input.scannedAt))) throw new Error('Invalid scan metadata');
  return { schemaVersion: 1, machine: config.machines.find(x => x.id === input.machine.id), scannedAt: input.scannedAt, receivedAt: new Date().toISOString(), skills, roots, warnings: input.warnings };
}
export async function createApp(config, { directory = dataDir, scanner = scan } = {}) {
  await mkdir(directory, { recursive: true });
  const tokenFile = path.join(directory, 'report-token');
  let token;
  try { token = (await readFile(tokenFile, 'utf8')).trim(); }
  catch (e) { if (e.code !== 'ENOENT') throw e; token = randomBytes(32).toString('hex'); await writeFile(tokenFile, token + '\n', { mode: 0o600, flag: 'wx' }); }
  const snapshots = new Map();
  const favouriteFile = path.join(directory, 'favourites.json');
  const savedFavourites = await readJson(favouriteFile, []);
  if (!Array.isArray(savedFavourites) || savedFavourites.length > 4000 || !savedFavourites.every(id => typeof id === 'string' && id.length <= 600)) throw new Error('Invalid saved favourites');
  let favourites = new Set(savedFavourites), favouriteWrite = Promise.resolve();
  for (const machine of config.machines) {
    const saved = await readJson(path.join(directory, `${machine.id}.json`), null);
    if (saved) snapshots.set(machine.id, saved);
  }
  let scanning = null, lastScanError = null;
  async function refresh() {
    if (scanning) return scanning;
    scanning = (async () => {
      const inventory = await scanner(config);
      inventory.receivedAt = new Date().toISOString();
      await atomicJson(path.join(directory, `${config.machineId}.json`), inventory);
      snapshots.set(config.machineId, inventory);
      lastScanError = null;
    })().catch(e => { lastScanError = e.message; console.error('Scan failed:', e.message); }).finally(() => { scanning = null; });
    return scanning;
  }
  await refresh();
  const interval = setInterval(refresh, config.scanIntervalMs);
  interval.unref();
  const assets = new Map([['/', ['index.html','text/html']], ['/app.js', ['app.js','text/javascript']], ['/style.css', ['style.css','text/css']]]);
  async function handler(req, res) {
    const headers = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer', 'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'" };
    const send = (status, value) => { res.writeHead(status, { ...headers, 'Content-Type': 'application/json' }); res.end(JSON.stringify(value)); };
    try {
      const host = new URL(`http://${req.headers.host || 'invalid'}`).hostname;
      const hosts = new Set(['127.0.0.1','localhost',config.tailscaleHost,config.tailscaleDns].filter(Boolean));
      if (!hosts.has(host)) return send(403, { error: 'Host not allowed' });
      const url = new URL(req.url, `http://${req.headers.host}`);
      if (req.method === 'GET' && url.pathname === '/api/catalog') {
        const library = await readJson(path.join(projectRoot, 'library.json'), { skills: [] });
        return send(200, { ...buildCatalog(config, [...snapshots.values()], library), favourites: [...favourites], lastScanError });
      }
      if (req.method === 'POST' && url.pathname === '/api/favourites') {
        // Shared tailnet preference, not a skill mutation. Reject cross-site writes.
        let origin;
        try { origin = new URL(req.headers.origin); } catch { return send(403, { error: 'Same-origin request required' }); }
        if (origin.host !== req.headers.host || !['http:', 'https:'].includes(origin.protocol) || req.headers['x-skill-library-request'] !== 'favourites') return send(403, { error: 'Same-origin request required' });
        if (req.headers['content-type'] !== 'application/json') return send(415, { error: 'JSON required' });
        let body = '', size = 0;
        for await (const chunk of req) {
          size += chunk.length;
          if (size > 4096) return send(413, { error: 'Preference request too large' });
          body += chunk.toString();
        }
        let value;
        try { value = JSON.parse(body); } catch { return send(400, { error: 'Invalid JSON' }); }
        if (typeof value?.id !== 'string' || value.id.length > 600 || typeof value.favourite !== 'boolean') return send(400, { error: 'Invalid favourite' });
        const library = await readJson(path.join(projectRoot, 'library.json'), { skills: [] });
        if (!favourites.has(value.id) && ![...snapshots.values()].some(s => s.skills.some(skill => skill.id === value.id)) && !library.skills.some(skill => skill.id === value.id)) return send(400, { error: 'Unknown skill' });
        const update = favouriteWrite.then(async () => {
          const next = new Set(favourites);
          if (value.favourite) next.add(value.id); else next.delete(value.id);
          if (next.size > 4000) throw new Error('Too many favourites');
          await atomicJson(favouriteFile, [...next]);
          favourites = next;
          return [...next];
        });
        favouriteWrite = update.catch(() => {});
        return send(200, { favourites: await update });
      }
      if (req.method === 'GET' && url.pathname === '/api/health') return send(200, { ok: !lastScanError, machineId: config.machineId, scanIntervalMs: config.scanIntervalMs });
      if (req.method === 'POST' && url.pathname === '/api/inventory') {
        const supplied = Buffer.from((req.headers.authorization || '').replace(/^Bearer /, ''));
        const expected = Buffer.from(token);
        if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return send(401, { error: 'Invalid reporter token' });
        if (req.headers.origin) return send(403, { error: 'Browser uploads are not permitted' });
        let body = '', length = 0;
        for await (const chunk of req) {
          length += chunk.length;
          if (length > 4 * 1024 * 1024) { send(413, { error: 'Inventory exceeds 4 MB' }); req.destroy(); return; }
          body += chunk.toString();
        }
        let inventory;
        try { inventory = validateInventory(JSON.parse(body), config); }
        catch (e) { return send(400, { error: e.message }); }
        await atomicJson(path.join(directory, `${inventory.machine.id}.json`), inventory);
        snapshots.set(inventory.machine.id, inventory);
        return send(200, { ok: true, receivedAt: inventory.receivedAt });
      }
      if (req.method === 'GET' && assets.has(url.pathname)) {
        const [file, type] = assets.get(url.pathname);
        res.writeHead(200, { ...headers, 'Content-Type': `${type}; charset=utf-8` });
        res.end(await readFile(path.join(projectRoot, 'public', file)));
        return;
      }
      return send(404, { error: 'Not found' });
    } catch (e) { console.error('Request failed:', e.message); if (!res.headersSent) send(500, { error: 'Request failed; check service logs' }); else res.end(); }
  }
  return { handler, refresh, close: () => clearInterval(interval), tokenFile };
}
async function main() {
  const config = await loadConfig();
  const app = await createApp(config);
  const servers = [];
  const retryTimers = new Set();
  let stopping = false;
  for (const host of ['127.0.0.1', config.tailscaleHost].filter(Boolean)) {
    const server = http.createServer(app.handler);
    server.requestTimeout = 15000;
    server.on('error', e => {
      console.error(`Listener ${host}: ${e.message}`);
      if (host === '127.0.0.1') process.exit(1);
      if (!stopping) {
        const timer = setTimeout(() => { retryTimers.delete(timer); if (!stopping) server.listen(config.port, host); }, 30000);
        retryTimers.add(timer); timer.unref();
      }
    });
    server.listen(config.port, host, () => console.log(`Skill Library: http://${host}:${config.port}`));
    servers.push(server);
  }
  console.log(`Scans every ${config.scanIntervalMs / 1000}s. Reporter credential stored locally, never served to browsers.`);
  const shutdown = () => { stopping = true; app.close(); for (const timer of retryTimers) clearTimeout(timer); for (const server of servers) server.close(); };
  process.on('SIGTERM', shutdown); process.on('SIGINT', shutdown);
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main().catch(e => { console.error(e.message); process.exit(1); });
