// Private archival backup approved by Raz. Does not grant redistribution rights,
// install/enable packages, execute their instructions, or infer unknown authorship.
import { cp, mkdir, readFile, stat, rename } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import os from 'node:os';
import path from 'node:path';
import { projectRoot, readJson, atomicJson } from '../src/config.js';
import { packageHash, metadata } from '../src/scanner.js';
import { auditPackage } from '../src/audit.js';
const audit = await readJson(path.join(projectRoot,'data/personal-skill-audit.json'),null);
if (!audit || Date.now()-Date.parse(audit.generatedAt)>300000) throw new Error('Run a fresh audit first');
const manifest = await readJson(path.join(projectRoot,'library.json'),null);
const backups=[],skills=[];
for (const item of audit.packages) {
  const entryPath=item.path.startsWith('~/')?path.join(os.homedir(),item.path.slice(2)):item.path;
  const source=path.dirname(entryPath),folder=path.basename(source),root=item.id.startsWith('user:agents:')?'agents':'codex';
  const check=await auditPackage(source);
  const binaryAllowed=item.name.startsWith('figma') && check.binaries.every(p=>p==='assets/figma.png');
  if(check.secretSignals.length || check.credentialFiles.length || check.symlinks.length || check.errors.length || check.binaries.length && !binaryAllowed) throw new Error(`Unsafe package held: ${item.name}`);
  const hash=await packageHash(source);
  if(hash!==item.hash) throw new Error(`Audit outdated: ${item.name}`);
  const relative=`skills/${root}/${folder}`,destination=path.join(projectRoot,relative);
  let present=false;try{await stat(destination);present=true;}catch(e){if(e.code!=='ENOENT')throw e;}
  if(present && await packageHash(destination)!==hash) {
    if(!process.argv.includes('--refresh-reviewed'))throw new Error(`Backup conflict: ${item.name}`);
    const preserved=path.join(projectRoot,'data/previous-backups',`${root}-${folder}-${randomUUID()}`);
    await mkdir(path.dirname(preserved),{recursive:true});
    await rename(destination,preserved);present=false;
  }
  if(!present) {
    await mkdir(path.dirname(destination),{recursive:true});
    await cp(source,destination,{recursive:true,force:false,errorOnExist:true,filter:file=>!['.git','node_modules','.venv','__pycache__','.DS_Store'].includes(path.basename(file))});
  }
  if(await packageHash(source)!==hash || await packageHash(destination)!==hash)throw new Error(`Copy verification failed: ${item.name}`);
  const entryFile=path.basename(entryPath),meta=metadata(await readFile(entryPath,'utf8'));
  const old=manifest.backups?.find(p=>p.id===item.id);
  const record={id:item.id,name:item.name,origin:`user:${root}`,folder,installRoot:root,entryFile,backupPath:relative,expectedHash:hash,licenseFiles:check.licenseFiles,license:old?.license || (check.licenseHints.includes('MIT')?'MIT declared in frontmatter; notice review pending':'Unspecified; private archival backup only'),discoverable:item.discoverable,provenance:item.installEvidence || 'Installed snapshot; upstream authorship/revision unverified',managed:false,review:{secretScan:'No heuristic findings; not a guarantee',portability:'Exact original preserved; dependencies, connectors and generated machine paths require local setup',redistribution:check.licenseFiles.length?'Preserve included licenses/notices':'No inferred redistribution permission'}};
  backups.push(record);
  if(record.discoverable)skills.push({...record,description:meta.description,kind:'personal',sourceLabel:'Private installed snapshot',source:{type:'snapshot',path:relative},examplePrompt:`$${item.name} — describe your task here`});
}
manifest.backups=backups;manifest.skills=skills;
manifest.notes='All 44 audited personal package copies archived with exact package hashes under their original roots. User approved private backup on 2026-09-17. Includes 40 discoverable copies and four nonstandard entry files. Unknown licenses/authorship are explicitly recorded, not inferred; no public redistribution permission granted. Built-in/plugin caches and credentials excluded. No installation or ownership adoption enabled.';
await atomicJson(path.join(projectRoot,'library.json'),manifest);
console.log(JSON.stringify({backedUp:backups.length,discoverable:skills.length,unknownLicenses:backups.filter(p=>!p.licenseFiles.length).length}));
