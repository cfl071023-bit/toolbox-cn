// Maintainer check: requires the two audited Git checkouts. Not required to build an extracted source ZIP.
import fs from 'node:fs';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
import {readZip} from './archive.mjs';
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const archive=new Map(readZip('dist/source.zip').map(e=>[e.name,e.data]));
const upstreams=[];
for(const [root,commit] of [['upstream','d505845f918e946ec300af7b36efc107e2f66e9e'],['upstream-sharevb','b5eace85dbdb247f832b2aa9967b9d570a84d1ce']]){
 assert.equal(execFileSync('git',['-C',root,'rev-parse','HEAD'],{encoding:'utf8'}).trim(),commit);
 assert.equal(execFileSync('git',['-C',root,'status','--porcelain'],{encoding:'utf8'}).trim(),'');
 const tracked=execFileSync('git',['-C',root,'ls-files','-z'],{encoding:'utf8'}).split('\0').filter(Boolean);
 for(const file of tracked)assert.ok(archive.get(root+'/'+file)?.equals(fs.readFileSync(root+'/'+file)),'Original upstream bytes preserved: '+root+'/'+file);
 upstreams.push({root,commit,trackedFiles:tracked.length,status:'PASS'});
}
const frozen=[['toolbox-cn-0.1.0-source.zip','bf187433520a1cd2b6c12e745bb5fd151fc21328ce30b6bb562f571e2a2463b7'],['toolbox-cn-0.1.0-static.zip','ec28eab258b096e7bdcd9bc6318ffa1f2770a0277835f27063fd72a4b95b8e2c']].map(([file,expected])=>{const hash=sha(fs.readFileSync('release/'+file));assert.equal(hash,expected);return {file,sha256:hash,status:'PASS'}});
const runtimeFiles=['index.html',...fs.readdirSync('dist/assets').map(f=>'assets/'+f)].sort();
const runtimeAssets=Object.fromEntries(runtimeFiles.map(file=>[file,sha(fs.readFileSync('dist/'+file))]));
const target='qa-evidence/platform-expansion-artifacts.json';
if(fs.existsSync(target)&&!process.argv.includes('--record'))assert.deepEqual(runtimeAssets,JSON.parse(fs.readFileSync(target,'utf8')).runtimeAssets,'Documentation packaging must preserve the tested runtime assets');
fs.writeFileSync(target,JSON.stringify({status:'PASS',upstreams,frozenReleaseArchives:frozen,sourceZIPCRC:'PASS',runtimeAssets,privacy:'No publication, upload or deployment performed'},null,2)+'\n');
console.log('PASS: 2624 original upstream files, frozen release SHA-256, source ZIP CRC and tested runtime asset fingerprints.');

