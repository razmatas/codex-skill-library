import path from 'node:path';
import os from 'node:os';
import { readJson, projectRoot, dataDir } from '../src/config.js';
import { planSync } from '../src/sync-plan.js';
import { applySync, planDigest } from '../src/sync-apply.js';
const args=process.argv.slice(2);
if(args.length>1 || args.some(a=>!['--dry-run','--install-missing'].includes(a) && !/^--apply=[a-f0-9]{64}$/.test(a)))throw new Error('Use --dry-run, --install-missing, or --apply=<reviewed-plan-digest>');
const library=await readJson(path.join(projectRoot,'library.json'),null);
const manifest={schemaVersion:1,skills:library.backups.filter(b=>b.discoverable).map(b=>({...b,managed:true,source:{type:'custom',path:b.backupPath}}))};
const receiptFile=path.join(dataDir,'sync-receipts.json');
const options={projectRoot,receiptFile,receipts:await readJson(receiptFile,{}),roots:{agents:path.join(os.homedir(),'.agents/skills'),codex:path.join(process.env.CODEX_HOME || path.join(os.homedir(),'.codex'),'skills')}};
const plan=await planSync(manifest,options),digest=planDigest(plan);
if(args[0] === '--install-missing') {
  const results=await applySync(manifest,options,digest,{applyActions:['install'],skipOtherActions:true});
  console.log(JSON.stringify({mode:'install-missing',installed:results.filter(x=>x.applied).length,installedNames:results.filter(x=>x.applied).map(x=>x.name),matching:results.filter(x=>x.action==='unchanged').length,skipped:results.filter(x=>x.skipped).map(x=>({name:x.name,action:x.action,reason:x.reason}))},null,2));
} else if(args[0]?.startsWith('--apply=')) {
  const results=await applySync(manifest,options,args[0].slice(8));
  console.log(JSON.stringify({mode:'apply',results},null,2));
} else {
  console.log(JSON.stringify({mode:'dry-run',digest,plan,backupOnly:library.backups.filter(b=>!b.discoverable).map(b=>({name:b.name,entryFile:b.entryFile,reason:'Nonstandard entry filename preserved; not enabled'}))},null,2));
  if(plan.some(p=>!['unchanged','install','update-with-backup'].includes(p.action)))process.exitCode=2;
}
