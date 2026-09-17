import { mkdir, writeFile, readFile, realpath, unlink, cp } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import os from 'node:os';
import { projectRoot, dataDir } from '../src/config.js';
if (process.platform !== 'darwin') throw new Error('This helper supports macOS launchd only');
const mode = process.argv.includes('--reporter') ? 'reporter' : 'dashboard';
const label = `local.codex-skill-library.${mode}`;
const plist = path.join(os.homedir(), 'Library/LaunchAgents', `${label}.plist`);
const target = `gui/${process.getuid()}`;
const runtime = path.join(os.homedir(), 'Library/Application Support/Codex Skill Library', mode);
const runtimeData = path.join(runtime, 'data');
const xml = value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
if (process.argv[2] === 'install') {
  try { await readFile(plist); throw new Error(`Service already exists: ${plist}. Inspect it before replacing.`); } catch (e) { if (e.code !== 'ENOENT') throw e; }
  await mkdir(path.dirname(plist), { recursive: true });
  let existingDeployment = null;
  try { existingDeployment = JSON.parse(await readFile(path.join(runtime, 'deployment.json'), 'utf8')); } catch (e) { if (e.code !== 'ENOENT') throw e; }
  if (existingDeployment && existingDeployment.source !== projectRoot) throw new Error('Runtime belongs to another checkout; refusing to overwrite');
  if (!existingDeployment) {
    try { await mkdir(runtime, { recursive: false }); } catch (e) {
      if (e.code === 'ENOENT') { await mkdir(path.dirname(runtime), { recursive: true }); await mkdir(runtime); }
      else throw e;
    }
  }
  for (const item of ['src','scripts','public','package.json','config.example.json','library.json']) await cp(path.join(projectRoot,item),path.join(runtime,item),{recursive:true});
  await cp(path.join(projectRoot,'config.local.json'),path.join(runtime,'config.local.json'));
  await mkdir(runtimeData,{recursive:true});
  // Preserve installed runtime credentials/snapshots on redeploy; initialize only once.
  if (!existingDeployment) {
    try { await cp(dataDir,runtimeData,{recursive:true,errorOnExist:false}); } catch (e) { if (e.code !== 'ENOENT') throw e; }
  }
  await writeFile(path.join(runtime,'deployment.json'),JSON.stringify({source:projectRoot,installedAt:new Date().toISOString()},null,2)+'\n',{mode:0o600});
  const arguments_ = [await realpath(process.execPath), path.join(runtime, mode === 'reporter' ? 'scripts/report.js' : 'src/server.js'), ...(mode === 'reporter' ? ['--watch'] : [])];
  const document = `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<plist version="1.0"><dict>\n<key>Label</key><string>${label}</string>\n<key>ProgramArguments</key><array>${arguments_.map(x => `<string>${xml(x)}</string>`).join('')}</array>\n<key>WorkingDirectory</key><string>${xml(runtime)}</string>\n<key>RunAtLoad</key><true/><key>KeepAlive</key><true/><key>ThrottleInterval</key><integer>30</integer>\n<key>StandardOutPath</key><string>${xml(path.join(runtimeData, `${mode}.log`))}</string>\n<key>StandardErrorPath</key><string>${xml(path.join(runtimeData, `${mode}.error.log`))}</string>\n</dict></plist>\n`;
  await writeFile(plist, document, { mode: 0o600, flag: 'wx' });
  execFileSync('/bin/launchctl', ['bootstrap', target, plist], { stdio: 'inherit' });
  console.log(`Installed ${label}. Starts at login; restarts on exit. Internal runtime: ${runtime}`);
} else if (process.argv[2] === 'remove') {
  const existing = await readFile(plist, 'utf8');
  if (!existing.includes(`<string>${label}</string>`) || !(existing.includes(xml(projectRoot)) || existing.includes(xml(runtime)))) throw new Error('Refusing to remove an unrelated service');
  execFileSync('/bin/launchctl', ['bootout', `${target}/${label}`], { stdio: 'inherit' });
  await unlink(plist);
  console.log(`Removed only ${plist}. Project data and skills are preserved.`);
} else throw new Error('Usage: node scripts/service.js install|remove [--reporter]');
