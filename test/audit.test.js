import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, symlink } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { inspectText, auditPackage } from '../src/audit.js';

test('secret signals redact matched values and include only rule and line',()=>{
  const secret='ghp_'+'A'.repeat(30), inspected=inspectText(`Intro\n${secret}\npassword = "SyntheticValueForTest9876"`);
  assert.deepEqual(inspected.findings,[{rule:'github-token',line:2},{rule:'credential-assignment',line:3}]);
  assert.ok(!JSON.stringify(inspected).includes(secret));
});
test('placeholder assignments are not reported as likely secrets',()=>{
  assert.deepEqual(inspectText('api_key = "YOUR_API_KEY_PLACEHOLDER"').findings,[]);
});
test('machine paths are reported without full values and GitHub sources are clues',()=>{
  const result=inspectText('/Users/private-name/specific-folder\nhttps://github.com/openai/skills/tree/main\nMIT License');
  assert.deepEqual(result.machinePaths,[{line:1}]); assert.deepEqual(result.sourceReferences,['https://github.com/openai/skills']); assert.deepEqual(result.licenseHints,['MIT License']);
});
test('audit flags credential files, binary assets and links without following them',async()=>{
  const dir=await mkdtemp(path.join(os.tmpdir(),'codex-skill-audit-')); await writeFile(path.join(dir,'.env'),'PLACEHOLDER=1'); await writeFile(path.join(dir,'asset.bin'),Buffer.from([0,1,2])); await symlink('/not/a/real/secret',path.join(dir,'external-link'));
  const result=await auditPackage(dir); assert.equal(result.reviewRequired,true); assert.deepEqual(result.credentialFiles,['.env']); assert.deepEqual(result.binaries,['asset.bin']); assert.deepEqual(result.symlinks,['external-link']); assert.equal(result.errors.length,0);
});
