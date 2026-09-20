import path from 'node:path';
import { readJson, projectRoot } from '../src/config.js';
import { packageHash } from '../src/scanner.js';
const root=process.argv[2]?path.resolve(process.argv[2]):projectRoot;
const manifest=await readJson(path.join(root,'library.json'),null);
let verified=0;
const backupsById=new Map((manifest.backups || []).map(item=>[item.id,item]));
for(const item of manifest.backups || []) {
  if(item.backupPath!==`skills/${item.installRoot}/${item.folder}` || !/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(item.folder) || !['agents','codex'].includes(item.installRoot))throw new Error('Invalid archive path');
  if(await packageHash(path.join(root,item.backupPath))!==item.expectedHash)throw new Error(`Fingerprint mismatch: ${item.id}`);
  verified++;
}
if(!verified)throw new Error('No backups to verify');
let pinnedIdentities=0;
const seenPinned=new Set();
for(const upstream of manifest.verifiedUpstreams || []) {
  if(!/^[\w.-]+\/[\w.-]+$/.test(upstream.repo) || !/^[0-9a-f]{40}$/.test(upstream.revision))throw new Error('Invalid verified upstream pin');
  if(upstream.license!=='MIT' || !upstream.notice || !upstream.packages?.length)throw new Error(`Incomplete verified upstream metadata: ${upstream.repo}`);
  for(const pkg of upstream.packages) {
    if(!/^skills\/[a-zA-Z0-9][a-zA-Z0-9._/-]*$/.test(pkg.path) || !/^[0-9a-f]{64}$/.test(pkg.expectedHash) || !pkg.identities?.length)throw new Error(`Invalid verified package pin: ${upstream.repo}`);
    for(const identity of pkg.identities) {
      if(seenPinned.has(identity))throw new Error(`Duplicate verified identity: ${identity}`);
      const backup=backupsById.get(identity);
      if(!backup || backup.expectedHash!==pkg.expectedHash)throw new Error(`Verified pin does not match archived package: ${identity}`);
      seenPinned.add(identity);
      pinnedIdentities++;
    }
  }
}
console.log(JSON.stringify({verified,discoverable:manifest.backups.filter(b=>b.discoverable).length,backupOnly:manifest.backups.filter(b=>!b.discoverable).length,pinnedIdentities}));
