import { readdir, readFile, stat, realpath } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { createHash } from 'node:crypto';
import { readJson } from './config.js';

const ignored = new Set(['node_modules', '.git', '.DS_Store', '__pycache__', '.venv']);
async function exists(file) { try { await stat(file); return true; } catch (e) { if (e.code === 'ENOENT') return false; throw e; } }
function scalar(value) {
  value = value.trim();
  if (value.startsWith('"')) { try { return JSON.parse(value); } catch {} }
  if (value.startsWith("'") && value.endsWith("'")) return value.slice(1, -1).replace(/''/g, "'");
  return value.replace(/\s+#.*$/, '').trim();
}
// Only top-level strings needed for an inventory, not a general YAML parser.
export function metadata(text) {
  const front = text.replace(/^\uFEFF/, '').match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!front) throw new Error('Missing YAML frontmatter');
  const lines = front[1].split(/\r?\n/), result = {};
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/^(name|description):\s*(.*)$/);
    if (!match) continue;
    let value = match[2];
    if (/^[>|][+-]?$/.test(value)) {
      const parts = [];
      while (i + 1 < lines.length && /^(\s+|$)/.test(lines[i + 1])) parts.push(lines[++i].trim());
      value = parts.join(' ');
    }
    result[match[1]] = scalar(value);
  }
  if (!result.name || !result.description) throw new Error('Missing name or description');
  return result;
}
export function parseCodexConfig(text) {
  const plugins = new Map(), disabledPaths = new Set();
  const sections = text.split(/(?=^\[)/m);
  for (const section of sections) {
    const plugin = section.match(/^\[plugins\."([^"]+)"\]/);
    const enabled = section.match(/^enabled\s*=\s*(true|false)\s*(?:#.*)?$/m);
    if (plugin) plugins.set(plugin[1], enabled ? enabled[1] === 'true' : null);
    if (section.startsWith('[[skills.config]]') && enabled?.[1] === 'false') {
      const file = section.match(/^path\s*=\s*("(?:[^"\\]|\\.)*"|'[^']*')/m);
      if (file) disabledPaths.add(path.resolve(scalar(file[1])));
    }
  }
  return { plugins, disabledPaths };
}
export async function packageHash(directory) {
  const hash = createHash('sha256'), visited = new Set();
  const base = await realpath(directory);
  async function walk(dir) {
    const actual = await realpath(dir);
    if (actual !== base && !actual.startsWith(base + path.sep)) throw new Error('Package symlink points outside skill');
    if (visited.has(actual)) throw new Error('Package contains a symlink cycle');
    visited.add(actual);
    const entries = (await readdir(dir, { withFileTypes: true })).sort((a,b) => a.name.localeCompare(b.name, 'en'));
    for (const entry of entries) {
      if (ignored.has(entry.name)) continue;
      const file = path.join(dir, entry.name), info = await stat(file);
      if (info.isDirectory()) await walk(file);
      else if (info.isFile()) {
        const resolved = await realpath(file);
        if (!resolved.startsWith(base + path.sep)) throw new Error('Package symlink points outside skill');
        if (info.size > 20 * 1024 * 1024) throw new Error('Package file exceeds 20 MB fingerprint limit');
        const content = await readFile(file);
        hash.update(JSON.stringify([path.relative(directory, file).split(path.sep).join('/'), content.length, info.mode & 0o111]));
        hash.update(content);
      }
    }
    visited.delete(actual);
  }
  await walk(directory);
  return hash.digest('hex');
}
export async function scan(config, { home = os.homedir() } = {}) {
  const codex = process.env.CODEX_HOME || path.join(home, '.codex');
  const warnings = [], skills = [], roots = [];
  let text = '';
  try { text = await readFile(path.join(codex, 'config.toml'), 'utf8'); }
  catch (e) { if (e.code !== 'ENOENT') warnings.push('Codex configuration could not be read; enabled states need verification.'); }
  const registry = parseCodexConfig(text);
  const disabledReal = new Set();
  for (const file of registry.disabledPaths) { try { disabledReal.add(await realpath(file)); } catch {} }
  async function readSkill(file, context) {
    try {
      const meta = metadata(await readFile(file, 'utf8'));
      let hash = null, hashError = null;
      try { hash = await packageHash(path.dirname(file)); } catch (e) { hashError = e.message; }
      const resolved = await realpath(file);
      const disabled = registry.disabledPaths.has(path.resolve(file)) || disabledReal.has(resolved);
      skills.push({
        id: `${context.origin}:${context.packageKey ? context.packageKey + ':' : ''}${meta.name}`, name: meta.name, description: meta.description,
        kind: context.kind, origin: context.origin, sourceLabel: context.label,
        version: context.version || null, path: file.replace(home, '~'), hash, hashError,
        state: disabled ? 'disabled' : context.state, setup: 'Dependencies and connector authentication not checked',
        examplePrompt: `$${meta.name} — describe your task here`,
      });
    } catch (e) { warnings.push(`${file.replace(home, '~')}: ${e.message}`); }
  }
  async function skillRoot(directory, context, recursive = false) {
    const root = { origin: context.origin, path: directory.replace(home, '~'), state: 'ok' };
    roots.push(root);
    const visited = new Set();
    async function walk(dir, depth) {
      if (depth > 12) { root.state = 'error'; warnings.push(`Scan depth exceeded: ${dir}`); return; }
      const actual = await realpath(dir);
      if (visited.has(actual)) return;
      visited.add(actual);
      if (await exists(path.join(dir, 'SKILL.md'))) await readSkill(path.join(dir, 'SKILL.md'), { ...context, packageKey: context.kind === 'plugin' || context.origin.startsWith('plugin:') ? path.relative(directory, dir).split(path.sep).join('/') : '' });
      if (!recursive && depth > 0) return;
      for (const entry of await readdir(dir, { withFileTypes: true })) {
        if (ignored.has(entry.name) || entry.name.startsWith('.')) continue;
        const next = path.join(dir, entry.name);
        try { if ((await stat(next)).isDirectory()) await walk(next, depth + 1); }
        catch (e) { root.state = 'error'; warnings.push(`${next.replace(home, '~')}: ${e.message}`); }
      }
    }
    try { await walk(directory, 0); }
    catch (e) { root.state = e.code === 'ENOENT' ? 'absent' : 'error'; if (root.state === 'error') warnings.push(`${root.path}: ${e.message}`); }
  }
  await skillRoot(path.join(home, '.agents/skills'), { kind: 'personal', origin: 'user:agents', label: 'User · .agents', state: 'installed' });
  await skillRoot(path.join(codex, 'skills'), { kind: 'personal', origin: 'user:codex', label: 'User · .codex', state: 'installed' });
  await skillRoot(path.join(codex, 'skills/.system'), { kind: 'builtin', origin: 'system', label: 'Codex built-in', state: 'installed' });
  await skillRoot('/etc/codex/skills', { kind: 'personal', origin: 'admin', label: 'Administrator', state: 'installed' });
  for (const extra of config.extraRoots || []) {
    if (!extra.id || !path.isAbsolute(extra.path)) throw new Error('extraRoots require a stable id and absolute path');
    await skillRoot(extra.path, { kind: 'project', origin: `project:${extra.id}`, label: extra.label || extra.id, state: 'installed' });
  }
  const cache = path.join(codex, 'plugins/cache');
  const plugins = [];
  try {
    for (const market of await readdir(cache, { withFileTypes: true })) {
      if (!market.isDirectory() || market.name.startsWith('.')) continue;
      for (const plugin of await readdir(path.join(cache, market.name), { withFileTypes: true })) {
        if (!plugin.isDirectory() || plugin.name.startsWith('.')) continue;
        const dir = path.join(cache, market.name, plugin.name);
        const versions = (await readdir(dir, { withFileTypes: true })).filter(x => x.isDirectory() && !x.name.startsWith('.')).map(x => x.name).sort((a,b) => b.localeCompare(a, 'en', { numeric: true }));
        const id = `${plugin.name}@${market.name}`;
        const state = registry.plugins.has(id) ? (registry.plugins.get(id) === true ? 'installed' : registry.plugins.get(id) === false ? 'disabled' : 'cached') : 'cached';
        // Cache version is an observation, not an authoritative selected-version lock.
        let found = false;
        for (const version of versions) {
          const base = path.join(dir, version);
          const manifest = await readJson(path.join(base, '.codex-plugin/plugin.json'), null) || await readJson(path.join(base, '.claude-plugin/plugin.json'), null);
          const locations = manifest?.skills ? (Array.isArray(manifest.skills) ? manifest.skills : [manifest.skills]) : ['./skills'];
          const validLocations = locations.filter(x => typeof x === 'string').map(x => path.resolve(base, x)).filter(x => x.startsWith(base + path.sep));
          if (!validLocations.length || !(await Promise.all(validLocations.map(exists))).some(Boolean)) continue;
          plugins.push({ id, version, state });
          for (const location of validLocations) if (await exists(location)) await skillRoot(location, { kind: market.name === 'openai-primary-runtime' ? 'builtin' : 'plugin', origin: `plugin:${id}`, label: `${plugin.name} · ${market.name}`, version, state }, true);
          found = true;
          break;
        }
        if (!found) plugins.push({ id, version: versions[0] || null, state });
      }
    }
  } catch (e) { if (e.code !== 'ENOENT') warnings.push(`Plugin cache scan incomplete: ${e.message}`); }
  const names = new Map();
  for (const skill of skills) names.set(skill.name, (names.get(skill.name) || 0) + 1);
  for (const skill of skills) skill.duplicate = names.get(skill.name) > 1;
  return { schemaVersion: 1, machine: { id: config.machineId, name: config.machineName }, scannedAt: new Date().toISOString(), skills: skills.sort((a,b) => a.name.localeCompare(b.name)), plugins, roots, warnings };
}
