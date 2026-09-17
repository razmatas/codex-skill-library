import path from 'node:path';
import { readJson, projectRoot } from '../src/config.js';
import { packageHash } from '../src/scanner.js';
const root=process.argv[2]?path.resolve(process.argv[2]):projectRoot;
const manifest=await readJson(path.join(root,'library.json'),null);
let verified=0;
for(const item of manifest.backups || []) {
  if(item.backupPath!==`skills/${item.installRoot}/${item.folder}` || !/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(item.folder) || !['agents','codex'].includes(item.installRoot))throw new Error('Invalid archive path');
  if(await packageHash(path.join(root,item.backupPath))!==item.expectedHash)throw new Error(`Fingerprint mismatch: ${item.id}`);
  verified++;
}
if(!verified)throw new Error('No backups to verify');
console.log(JSON.stringify({verified,discoverable:manifest.backups.filter(b=>b.discoverable).length,backupOnly:manifest.backups.filter(b=>!b.discoverable).length}));
