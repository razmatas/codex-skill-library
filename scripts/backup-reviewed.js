// Explicit approved first batch. Not an automatic publisher or installer.
import { cp, mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { projectRoot, readJson, atomicJson } from '../src/config.js';
import { auditPackage } from '../src/audit.js';
import { packageHash, metadata } from '../src/scanner.js';
const selected = [
  ['codex','figma','SKILL.md'], ['codex','figma-implement-design','SKILL.md'],
  ['codex','frontend-slides','SKILL.md'], ['codex','hatch-pet','SKILL.md'],
  ['agents','brand-guidelines','SKILL_BrandGuidelines.md'],
  ['agents','frontend-design','SKILL_FrontendDesign.md'],
  ['agents','skill-creator','SKILL_SkillCreator.md'],
];
const manifest = await readJson(path.join(projectRoot,'library.json'),null);
manifest.backups ||= [];
for (const [root,folder,entryFile] of selected) {
  const source = path.join(os.homedir(),`.${root}/skills`,folder);
  const audit = await auditPackage(source);
  const binaryAllowed = folder.startsWith('figma') && audit.binaries.every(file=>file==='assets/figma.png');
  if (!audit.licenseFiles.length || audit.secretSignals.length || audit.credentialFiles.length || audit.symlinks.length || audit.errors.length || audit.binaries.length && !binaryAllowed) throw new Error(`Review failed: ${folder}`);
  const before = await packageHash(source), relative = `skills/${root}/${folder}`, destination = path.join(projectRoot,relative);
  await mkdir(path.dirname(destination),{recursive:true});
  await cp(source,destination,{recursive:true,force:false,errorOnExist:true,filter:file=>!['.git','node_modules','.venv','__pycache__','.DS_Store'].includes(path.basename(file))});
  if (await packageHash(source)!==before || await packageHash(destination)!==before) throw new Error(`Package changed while backing up: ${folder}`);
  const meta = metadata(await readFile(path.join(destination,entryFile),'utf8'));
  const id = `user:${root}:${meta.name}`;
  const record = {id,name:meta.name,origin:`user:${root}`,folder,installRoot:root,entryFile,backupPath:relative,expectedHash:before,licenseFiles:audit.licenseFiles,license:folder==='frontend-slides'?'MIT':'Apache-2.0',discoverable:entryFile==='SKILL.md',provenance:'Exact installed snapshot; upstream commit not yet established',managed:false};
  manifest.backups.push(record);
  if (record.discoverable) manifest.skills.push({...record,description:meta.description,kind:'personal',sourceLabel:'Reviewed installed snapshot',source:{type:'snapshot',path:relative},examplePrompt:`$${meta.name} — describe your task here`});
}
manifest.notes='User approved review/backup of all personal packages on 2026-09-17. First batch contains seven licensed installed snapshots, not an automated install plan. Remaining packages need provenance/license review. Backups preserve renamed entry files without enabling them. Credentials and built-in/plugin caches excluded.';
await atomicJson(path.join(projectRoot,'library.json'),manifest);
console.log(JSON.stringify({backups:manifest.backups.length,discoverable:manifest.skills.length}));
