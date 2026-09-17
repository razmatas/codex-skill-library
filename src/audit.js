import { readdir, readFile, lstat, realpath } from 'node:fs/promises';
import path from 'node:path';

const excluded = new Set(['.git', 'node_modules', '.venv', '__pycache__', '.DS_Store']);
const credentialFilename = /^(?:\.env(?:\..*)?|id_(?:rsa|ed25519)(?:\.pub)?|credentials(?:\..*)?|.*\.(?:p12|pfx|key|pem))$/i;
const rules = [
  ['private-key', /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/g],
  ['github-token', /\bgh[pousr]_[A-Za-z0-9]{20,}\b/g],
  ['github-fine-grained-token', /\bgithub_pat_[A-Za-z0-9_]{30,}\b/g],
  ['openai-token', /\bsk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{24,}\b/g],
  ['aws-access-key', /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/g],
  ['slack-token', /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/g],
  ['credential-in-url', /https?:\/\/[^\s/:@]+:[^\s/@]{8,}@/g],
  ['credential-assignment', /\b(?:api[_-]?key|access[_-]?token|auth[_-]?token|password|secret)\s*[:=]\s*["']([^"'\r\n]{16,})["']/gi],
];
const example = /(?:example|placeholder|your[_ -]|replace[_ -]|dummy|process\.env|os\.environ|\$\{|<|\{\{|xxx)/i;
// Heuristics are review signals, not proof that a package is secret-free.
export function inspectText(text) {
  const findings = [];
  for (const [rule, pattern] of rules) {
    for (const match of text.matchAll(new RegExp(pattern))) {
      if (rule === 'credential-assignment' && example.test(match[1])) continue;
      findings.push({ rule, line: text.slice(0,match.index).split('\n').length });
    }
  }
  const machinePaths = [...text.matchAll(/(?:\/Users\/[^\s"'`<>\n)\]}]+|\/Volumes\/[^\n"'`<>]+)/g)].map(match => ({ line: text.slice(0,match.index).split('\n').length }));
  const sourceReferences = new Set();
  for (const match of text.matchAll(/https:\/\/github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)/g)) {
    sourceReferences.add(`https://github.com/${match[1]}/${match[2].replace(/\.git$/, '').replace(/[.,]+$/, '')}`);
  }
  const licenseHints = [...text.matchAll(/\b(?:MIT License|Apache License|BSD [23]-Clause|GNU (?:GENERAL PUBLIC LICENSE|General Public License)|CC-BY(?:-SA)?(?:-\d\.\d)?|SPDX-License-Identifier:\s*[\w.-]+)/g)].map(match => match[0]);
  for (const match of text.matchAll(/^license:\s*(MIT|Apache-2\.0|BSD-2-Clause|BSD-3-Clause)\s*$/gm)) licenseHints.push(match[1]);
  return { findings, machinePaths, sourceReferences:[...sourceReferences], licenseHints:[...new Set(licenseHints)] };
}
export async function auditPackage(directory) {
  const base = await realpath(directory), visited = new Set();
  const result = { files:0, bytes:0, licenseFiles:[], licenseHints:[], sourceReferences:[], secretSignals:[], machinePaths:[], credentialFiles:[], binaries:[], symlinks:[], excluded:[], errors:[] };
  const references = new Set(), licenses = new Set();
  async function walk(dir) {
    const actual = await realpath(dir);
    if (!actual.startsWith(base + path.sep) && actual !== base || visited.has(actual)) throw new Error('Unsafe directory symlink or cycle');
    visited.add(actual);
    for (const entry of await readdir(dir,{withFileTypes:true})) {
      const file = path.join(dir,entry.name), relative = path.relative(directory,file).split(path.sep).join('/');
      if (excluded.has(entry.name)) { result.excluded.push(relative); continue; }
      try {
        const info = await lstat(file);
        if (info.isSymbolicLink()) { result.symlinks.push(relative); continue; }
        if (info.isDirectory()) { await walk(file); continue; }
        if (!info.isFile()) { result.errors.push({file:relative,reason:'Special file requires manual review'}); continue; }
        result.files++; result.bytes += info.size;
        if (/^(?:LICENSE|COPYING|NOTICE)(?:[._-].*)?$/i.test(entry.name)) result.licenseFiles.push(relative);
        if (credentialFilename.test(entry.name)) result.credentialFiles.push(relative);
        if (info.size > 20 * 1024 * 1024) { result.errors.push({file:relative,reason:'File exceeds audit size limit'}); continue; }
        const content = await readFile(file);
        if (content.includes(0)) { result.binaries.push(relative); continue; }
        const inspected = inspectText(content.toString('utf8'));
        result.secretSignals.push(...inspected.findings.map(hit=>({file:relative,...hit})));
        result.machinePaths.push(...inspected.machinePaths.map(hit=>({file:relative,...hit})));
        inspected.sourceReferences.forEach(x=>references.add(x));
        inspected.licenseHints.forEach(x=>licenses.add(x));
      } catch (e) { result.errors.push({file:relative,reason:e.code || 'Read failed'}); }
    }
    visited.delete(actual);
  }
  await walk(directory);
  result.sourceReferences = [...references].sort(); result.licenseHints = [...licenses].sort();
  result.reviewRequired = result.secretSignals.length > 0 || result.credentialFiles.length > 0 || result.symlinks.length > 0 || result.errors.length > 0 || result.binaries.length > 0;
  return result;
}
