import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, symlink, chmod } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { metadata, parseCodexConfig, scan, packageHash } from '../src/scanner.js';
import { buildCatalog } from '../src/catalog.js';
import { createApp, validateInventory } from '../src/server.js';

const config = { machineId:'raz-laptop', machineName:'Raz laptop', machines:[{id:'raz-laptop',name:'Raz laptop'},{id:'gabs-laptop',name:'Gabs laptop'}], scanIntervalMs:60000, scanTimeoutMs:120000, staleAfterMs:300000 };
const skill = { id:'user:agents:example', origin:'user:agents', name:'example', description:'Create something useful', kind:'personal', state:'installed', hash:'a'.repeat(64), sourceLabel:'User', path:'~/.agents/skills/example/SKILL.md' };
const snapshot = (id='raz-laptop', skills=[skill]) => ({schemaVersion:1,machine:{id,name:id},scannedAt:new Date().toISOString(),skills,roots:[{origin:'user:agents',path:'~/.agents/skills',state:'ok'}],warnings:[]});
async function temporary() { return mkdtemp(path.join(os.tmpdir(),'codex-skill-library-test-')); }
async function fixtureSkill(root, name='example') { const dir=path.join(root,name); await mkdir(dir,{recursive:true}); await writeFile(path.join(dir,'SKILL.md'),`---\nname: ${name}\ndescription: Use this to create an example.\n---\nInstructions\n`); return dir; }

test('frontmatter accepts quoted and folded descriptions, rejects invalid files', () => {
  assert.deepEqual(metadata('---\nname: example\ndescription: >-\n  A folded\n  description\n---\nbody'),{name:'example',description:'A folded description'});
  assert.equal(metadata('---\nname: "example"\ndescription: "Use: safely"\n---\n').description,'Use: safely');
  assert.throws(()=>metadata('# No metadata'));
});
test('enabled plugins and disabled paths are parsed without exposing other config', () => {
  const parsed=parseCodexConfig('[plugins."figma@market"]\nenabled = true\n[plugins."other@market"]\nenabled = false\n[[skills.config]]\npath = "/tmp/example/SKILL.md"\nenabled = false\n');
  assert.equal(parsed.plugins.get('figma@market'),true); assert.equal(parsed.plugins.get('other@market'),false); assert.ok(parsed.disabledPaths.has('/tmp/example/SKILL.md'));
});
test('package fingerprint detects script and executable-mode changes', async () => {
  const dir=await fixtureSkill(await temporary()); const script=path.join(dir,'helper.js'); await writeFile(script,'first'); const first=await packageHash(dir);
  await writeFile(script,'second'); const second=await packageHash(dir); assert.notEqual(first,second);
  await chmod(script,0o755); assert.notEqual(second,await packageHash(dir));
});
test('scanner discovers new installs, follows skill links, ignores external package links', async () => {
  const home=await temporary(), agents=path.join(home,'.agents/skills'), codex=path.join(home,'.codex');
  const firstDir=await fixtureSkill(agents); await mkdir(codex,{recursive:true});
  let result=await scan(config,{home}); assert.ok(result.skills.some(x=>x.name==='example'));
  const outside=await fixtureSkill(path.join(home,'approved'),'linked'); await symlink(outside,path.join(agents,'linked'));
  await fixtureSkill(agents,'new-skill'); result=await scan(config,{home}); assert.ok(result.skills.some(x=>x.name==='new-skill')); assert.ok(result.skills.some(x=>x.name==='linked'));
  await symlink(path.join(outside,'SKILL.md'),path.join(firstDir,'outside-link')); result=await scan(config,{home}); assert.equal(result.skills.find(x=>x.name==='example').hash,null);
});
test('plugin cache is not enabled by its mere presence; nested same-name entries have distinct IDs', async () => {
  const home=await temporary(), codex=path.join(home,'.codex'), root=path.join(codex,'plugins/cache/test-market/test-plugin/1.0.0');
  await fixtureSkill(path.join(root,'skills')); await fixtureSkill(path.join(root,'skills/nested'));
  let result=await scan(config,{home}); const pluginSkills=result.skills.filter(x=>x.kind==='plugin'); assert.equal(pluginSkills.length,2); assert.equal(new Set(pluginSkills.map(x=>x.id)).size,2); assert.ok(pluginSkills.every(x=>x.state==='cached'));
  await writeFile(path.join(codex,'config.toml'),'[plugins."test-plugin@test-market"]\nenabled = true\n'); result=await scan(config,{home}); assert.ok(result.skills.filter(x=>x.kind==='plugin').every(x=>x.state==='installed'));
});
test('unknown laptop does not show missing skills', () => {
  const result=buildCatalog(config,[snapshot()]); assert.equal(result.skills[0].statuses[1].state,'unknown'); assert.equal(result.machines[1].state,'unconnected');
});
test('fresh empty laptop shows missing; content drift and stale inventories are distinct', () => {
  assert.equal(buildCatalog(config,[snapshot(),snapshot('gabs-laptop',[])]).skills[0].statuses[1].state,'missing');
  const second=snapshot('gabs-laptop',[{...skill,hash:'b'.repeat(64)}]); assert.ok(buildCatalog(config,[snapshot(),second]).skills[0].statuses.every(x=>x.state==='attention'));
  second.receivedAt=new Date(Date.now()-600000).toISOString(); assert.equal(buildCatalog(config,[snapshot(),second]).skills[0].statuses[1].state,'unknown');
});
test('incomplete scope cannot prove a skill is missing; desired hash reports drift', () => {
  const second=snapshot('gabs-laptop',[]); second.warnings=['Read failed']; assert.equal(buildCatalog(config,[snapshot(),second]).skills[0].statuses[1].state,'unknown');
  const result=buildCatalog(config,[snapshot()],{skills:[{...skill,expectedHash:'b'.repeat(64)}]}); assert.equal(result.skills[0].statuses[0].state,'attention');
});
test('uploaded inventory rejects local overwrite, duplicate IDs and invalid hashes', () => {
  assert.throws(()=>validateInventory(snapshot(),config));
  assert.throws(()=>validateInventory(snapshot('gabs-laptop',[skill,skill]),config));
  assert.throws(()=>validateInventory(snapshot('gabs-laptop',[{...skill,hash:'bad'}]),config));
  assert.ok(validateInventory(snapshot('gabs-laptop'),config).receivedAt);
});
test('shared favourites persist across restarts, survive missing skills and reject cross-site writes', async () => {
  const directory=await temporary();
  async function start(skills) {
    const app=await createApp(config,{directory,scanner:async()=>snapshot('raz-laptop',skills)});
    const server=http.createServer(app.handler);await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
    const base=`http://127.0.0.1:${server.address().port}`;
    return {base,close:async()=>{app.close();await new Promise(resolve=>server.close(resolve));}};
  }
  let running=await start([skill,{...skill,id:'user:agents:second',name:'second'}]);
  try {
    const write=(id,favourite,origin=running.base)=>fetch(running.base+'/api/favourites',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json','X-Skill-Library-Request':'favourites'},body:JSON.stringify({id,favourite})});
    assert.equal((await write(skill.id,true,'https://evil.example')).status,403);
    assert.equal((await fetch(running.base+'/api/favourites',{method:'POST',body:'{}'})).status,403);
    assert.equal((await write('unknown',true)).status,400);
    assert.equal((await write(skill.id,'true')).status,400);
    const updates=await Promise.all([write(skill.id,true),write('user:agents:second',true)]);
    assert.ok(updates.every(r=>r.status===200));
    assert.deepEqual(new Set(JSON.parse(await readFile(path.join(directory,'favourites.json'),'utf8'))),new Set([skill.id,'user:agents:second']));
    await running.close();running=await start([]);
    const catalog=await (await fetch(running.base+'/api/catalog')).json();
    assert.equal(catalog.favourites.length,2);
    assert.equal((await write(skill.id,false)).status,200);
    assert.deepEqual((await (await fetch(running.base+'/api/catalog')).json()).favourites,['user:agents:second']);
    assert.equal((await fetch(running.base+'/data/favourites.json')).status,404);
  } finally {await running.close();}
});
test('server restricts host, protects upload, accepts valid reporter, persists snapshots', async () => {
  const directory=await temporary(); const app=await createApp(config,{directory,scanner:async()=>snapshot()});
  const server=http.createServer(app.handler); await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  try {
    const base=`http://127.0.0.1:${server.address().port}`, token=(await readFile(app.tokenFile,'utf8')).trim();
    assert.equal((await fetch(base+'/api/catalog')).status,200);
    const forbiddenStatus = await new Promise((resolve,reject) => { const request=http.get(base+'/api/catalog',{headers:{Host:'evil.test'}},response=>{response.resume();resolve(response.statusCode);});request.on('error',reject); });
    assert.equal(forbiddenStatus,403);
    assert.equal((await fetch(base+'/api/inventory',{method:'POST',body:'{}'})).status,401);
    const response=await fetch(base+'/api/inventory',{method:'POST',headers:{Authorization:`Bearer ${token}`},body:JSON.stringify(snapshot('gabs-laptop'))}); assert.equal(response.status,200);
    assert.equal((await (await fetch(base+'/api/catalog')).json()).machines[1].state,'live');
    assert.equal(JSON.parse(await readFile(path.join(directory,'gabs-laptop.json'),'utf8')).machine.id,'gabs-laptop');
    assert.equal((await fetch(base+'/data/report-token')).status,404);
    assert.equal((await fetch(base+'/api/inventory',{method:'POST',headers:{Authorization:`Bearer ${token}`,Origin:'http://localhost'},body:'{}'})).status,403);
  } finally { app.close(); await new Promise(resolve=>server.close(resolve)); }
});
test('server remains responsive while a production-style scan is still running', async () => {
  const directory=await temporary();
  await writeFile(path.join(directory,'raz-laptop.json'),JSON.stringify(snapshot()));
  let finishScan;
  const app=await createApp(config,{directory,scanRunner:()=>new Promise(resolve=>{finishScan=resolve;})});
  const server=http.createServer(app.handler); await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  try {
    const base=`http://127.0.0.1:${server.address().port}`;
    const health=await (await fetch(base+'/api/health')).json();
    assert.equal(health.ok,true); assert.equal(health.scanning,true);
    assert.ok((await (await fetch(base+'/api/catalog')).json()).skills.some(item=>item.id===skill.id));
    finishScan(snapshot()); await app.refresh();
    assert.equal((await (await fetch(base+'/api/health')).json()).scanning,false);
  } finally { app.close(); await new Promise(resolve=>server.close(resolve)); }
});
