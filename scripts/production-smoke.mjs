import {chromium} from '@playwright/test';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
import {cases} from '../tests/advanced-cases.js';
import {platformCases} from '../tests/platform-cases.js';
import {expandedTools} from '../src/expanded-catalog.js';
import {PDFDocument} from 'pdf-lib';
import QRCode from 'qrcode';
import {readZip} from './archive.mjs';
let proc;
try{const response=await fetch('http://127.0.0.1:5179');if(!response.ok)throw Error('unavailable');console.log('Using existing local production preview on 5179.');}catch{proc=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','5179','--strictPort'],{stdio:'ignore',windowsHide:true});}
let browser;
try{
 for(let i=0;i<50;i++){try{const r=await fetch('http://127.0.0.1:5179');if(r.ok)break;}catch{}await new Promise(r=>setTimeout(r,200));}
 browser=await chromium.launch();const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5179/#json');await page.getByRole('button',{name:'试用示例'}).click();await page.locator('.run-button').click();assert.match(await page.locator('.output textarea').inputValue(),/ToolBox CN/);
 for(const [id,input,options,expected] of cases){await page.goto('http://127.0.0.1:5179/#'+id);await page.waitForLoadState('networkidle');for(const [key,value] of Object.entries(options)){const field=page.locator(`[data-option="${key}"]`);if(await field.evaluate(e=>e.tagName==='SELECT'))await field.selectOption(String(value));else await field.fill(String(value));}if(id!=='token')await page.locator('.input-label textarea').first().fill(input);await page.locator('.run-button').click();await page.locator('.output textarea').waitFor();const result=await page.locator('.output textarea').inputValue();if(expected instanceof RegExp)assert.match(result,expected);else assert.ok(result.includes(expected),id+' production result');}
 await page.goto('http://127.0.0.1:5179/#wifi');await page.getByRole('button',{name:'试用示例'}).click();await page.locator('.run-button').click();await page.locator('.qr-preview').waitFor();
 for(const [id,input,options,expected] of platformCases){console.log('Smoke expansion: '+id);await page.goto('http://127.0.0.1:5179/#'+id);await page.getByRole('heading',{level:1,name:expandedTools.find(t=>t.id===id).name[0],exact:true}).waitFor();for(const [key,value] of Object.entries(options)){if(key==='second'){await page.locator('.dual-editor textarea').nth(1).fill(value);continue;}const field=page.locator(`[data-option="${key}"]`);if(await field.evaluate(e=>e.tagName==='SELECT'))await field.selectOption(String(value));else await field.fill(String(value));}await page.locator('.input-label textarea').first().fill(input);await page.locator('.run-button').click();await page.locator('.output textarea').waitFor();assert.ok((await page.locator('.output textarea').inputValue()).includes(expected),id+' production output');}
 const pdf=await PDFDocument.create();pdf.addPage([240,400]);const buffer=Buffer.from(await pdf.save());await page.goto('http://127.0.0.1:5179/#pdf-merge');await page.locator('input[type=file]').setInputFiles([{name:'first.pdf',mimeType:'application/pdf',buffer},{name:'second.pdf',mimeType:'application/pdf',buffer}]);await page.locator('.run-button').click();await page.locator('.output').waitFor();const pendingDownload=page.waitForEvent('download');await page.getByRole('button',{name:'下载结果',exact:true}).click();const downloaded=await pendingDownload;const chunks=[];for await(const chunk of await downloaded.createReadStream())chunks.push(chunk);assert.equal((await PDFDocument.load(Buffer.concat(chunks))).getPageCount(),2);
 await page.goto('http://127.0.0.1:5179/#image-resize');await page.locator('input[type=file]').setInputFiles('tests/fixtures/hopper.jpg');await page.locator('[data-option=width]').fill('64');await page.locator('.run-button').click();await page.locator('.output img').waitFor();assert.deepEqual(await page.locator('.output img').evaluate(async img=>{await img.decode();return [img.naturalWidth,img.naturalHeight]}),[64,64]);
 await page.goto('http://127.0.0.1:5179/#qr-read');await page.locator('input[type=file]').setInputFiles({name:'qr.png',mimeType:'image/png',buffer:await QRCode.toBuffer('ToolBox CN smoke 中文')});await page.locator('.run-button').click();await page.locator('.output textarea').waitFor();assert.equal(await page.locator('.output textarea').inputValue(),'ToolBox CN smoke 中文');
 const sourceEntries=readZip('dist/source.zip');for(const name of ['upstream/LICENSE','upstream-sharevb/LICENSE','src/pdf-worker.js','src/vendor/markdown-table.ts','package-lock.json'])assert.ok(sourceEntries.some(e=>e.name===name),'source includes '+name);
 const license=await fetch('http://127.0.0.1:5179/LICENSE');assert.match(await license.text(),/GNU GENERAL PUBLIC LICENSE/);
 const source=await fetch('http://127.0.0.1:5179/source.zip');const data=new Uint8Array(await source.arrayBuffer());assert.equal(data[0],80);assert.equal(data[1],75);assert.equal(errors.length,0);console.log('PASS production smoke: original JSON, 22 earlier additions, 17 expansion text tools, PDF download/page count, real JPEG resize, Chinese QR decoding, lazy assets, GPL and both upstream source trees.');
}finally{await browser?.close();proc?.kill();}


