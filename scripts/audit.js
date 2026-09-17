import os from 'node:os';
import path from 'node:path';
import { writeFile, readFile, readdir, stat } from 'node:fs/promises';
import { loadConfig, dataDir, atomicJson, readJson } from '../src/config.js';
import { scan, metadata, packageHash } from '../src/scanner.js';
import { auditPackage } from '../src/audit.js';

const config = await loadConfig(), inventory = await scan(config), home = os.homedir();
const packages = [];
const lock = await readJson(path.join(home,'.agents/.skill-lock.json'),{skills:{}});
function installEvidence(name) {
  const record = lock.skills?.[name];
  if (!record || !/^[\w.-]+\/[\w.-]+$/.test(record.source || '')) return null;
  return {source:record.source,skillPath:record.skillPath,folderHash:record.skillFolderHash,installedAt:record.installedAt,notes:'Local installer record; exact upstream revision and license still require verification'};
}
for (const skill of inventory.skills.filter(x=>x.kind==='personal' && x.origin.startsWith('user:'))) {
  const file = skill.path.startsWith('~/') ? path.join(home,skill.path.slice(2)) : skill.path;
  const audit = await auditPackage(path.dirname(file));
  packages.push({id:skill.id,name:skill.name,path:skill.path,hash:skill.hash,hashError:skill.hashError,...audit,discoverable:true,installEvidence:installEvidence(skill.name),provenance:'Unverified: repository references are clues, not authorship evidence'});
}
for (const [root,origin] of [[path.join(home,'.agents/skills'),'user:agents'],[path.join(process.env.CODEX_HOME || path.join(home,'.codex'),'skills'),'user:codex']]) {
  for (const entry of await readdir(root,{withFileTypes:true})) {
    if (!entry.isDirectory() || entry.name.startsWith('.')) continue;
    const dir=path.join(root,entry.name);
    try { await stat(path.join(dir,'SKILL.md')); continue; } catch(e) { if (e.code!=='ENOENT') throw e; }
    const renamed=(await readdir(dir)).filter(x=>/^SKILL[_-].*\.md$/i.test(x));
    for (const filename of renamed) {
      const meta=metadata(await readFile(path.join(dir,filename),'utf8')), audit=await auditPackage(dir);
      packages.push({id:`${origin}:${meta.name}`,name:meta.name,path:path.join(dir,filename).replace(home,'~'),hash:await packageHash(dir),...audit,discoverable:false,installEvidence:installEvidence(meta.name),provenance:'Unverified; nonstandard entry filename prevents normal Codex discovery'});
    }
  }
}
packages.sort((a,b)=>a.name.localeCompare(b.name));
const duplicates = [...new Set(packages.map(x=>x.name))].map(name=>({name,packages:packages.filter(x=>x.name===name).map(x=>({id:x.id,hash:x.hash}))})).filter(x=>x.packages.length>1).map(x=>({...x,identical:new Set(x.packages.map(p=>p.hash)).size===1 && x.packages.every(p=>p.hash)}));
const result = {generatedAt:new Date().toISOString(),machine:inventory.machine,packages,duplicates,inventoryWarnings:inventory.warnings,limitations:['Heuristic secret detection is not a guarantee.','No upstream provenance or license has been verified by this script.','Binary assets and symlinks require manual review.','No content uploaded, packages moved, or skill code executed.']};
await atomicJson(path.join(dataDir,'personal-skill-audit.json'),result);
const lines=['# Personal skill audit — '+inventory.machine.name,'','Generated '+result.generatedAt+'. Local review only; no skill content has been published.','','| Skill | Root | Files | Discoverable | Secret signals | Machine paths | License files | Review |','|---|---|---:|---|---:|---:|---:|---|',...packages.map(x=>`| ${x.name} | ${x.id.startsWith('user:agents:')?'.agents':'.codex'} | ${x.files} | ${x.discoverable?'Yes':'No: renamed entry file'} | ${x.secretSignals.length+x.credentialFiles.length} | ${x.machinePaths.length} | ${x.licenseFiles.length} | ${x.reviewRequired?'Manual content review':'Provenance / license review'} |`),'','## Duplicate names','',...duplicates.map(x=>`- ${x.name}: ${x.identical?'identical package fingerprints':'different package fingerprints; preserve both pending review'}`),'','## Limits','',...result.limitations.map(x=>'- '+x)];
await writeFile(path.join(dataDir,'personal-skill-audit.md'),lines.join('\n')+'\n',{mode:0o600});
console.log(JSON.stringify({packages:packages.length,duplicateNames:duplicates.length,withSecretSignals:packages.filter(x=>x.secretSignals.length||x.credentialFiles.length).map(x=>({name:x.name,id:x.id,signals:x.secretSignals,credentialFiles:x.credentialFiles})),withMachinePaths:packages.filter(x=>x.machinePaths.length).map(x=>({name:x.name,count:x.machinePaths.length})),withLicenses:packages.filter(x=>x.licenseFiles.length).map(x=>({name:x.name,files:x.licenseFiles,hints:x.licenseHints})),manualReview:packages.filter(x=>x.reviewRequired).map(x=>({name:x.name,errors:x.errors,binaries:x.binaries,symlinks:x.symlinks})),duplicates,report:path.join(dataDir,'personal-skill-audit.md')},null,2));
