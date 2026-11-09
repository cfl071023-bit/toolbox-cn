import {chromium} from '@playwright/test';
import fs from 'node:fs';
const origin=process.env.TOOLBOX_SCREENSHOT_URL??'http://127.0.0.1:5178';
fs.mkdirSync('docs/screenshots',{recursive:true});const browser=await chromium.launch();
async function shot(name,{lang='zh',dark=false,width=1600,height=1000,tool='',act}={}){if(process.argv[2]&&process.argv[2]!==name)return;const context=await browser.newContext({viewport:{width,height}});await context.addInitScript(({lang,dark})=>{localStorage.setItem('tb-lang',JSON.stringify(lang));localStorage.setItem('tb-dark',JSON.stringify(dark));},{lang,dark});const page=await context.newPage();await page.goto(origin+'/#'+tool);await page.waitForLoadState('networkidle');if(act)await act(page);await page.screenshot({path:'docs/screenshots/'+name+'.png',fullPage:false});await context.close();console.log('Captured',name);}
try{
 await shot('homepage-zh-light-desktop');await shot('homepage-zh-dark-desktop',{dark:true});await shot('homepage-en-light-desktop',{lang:'en'});await shot('homepage-zh-mobile',{width:390,height:844});
 await shot('json-working',{tool:'json',width:1440,act:async p=>{await p.getByRole('button',{name:'试用示例'}).click();await p.locator('.run-button').click();await p.locator('.output textarea').waitFor()}});
 await shot('image-compression',{tool:'image',width:1440,height:1200,act:async p=>{await p.locator('input[type=file]').setInputFiles('tests/fixtures/hopper.jpg');await p.locator('input[type=range]').fill('65');await p.getByRole('button',{name:'压缩图片',exact:true}).click();await p.locator('.image-previews img').nth(1).waitFor()}});
 await shot('qr-working',{tool:'qr',width:1440,height:1100,act:async p=>{await p.locator('.input-label textarea').first().fill('https://example.com/?q=工具箱');await p.locator('.run-button').click();await p.locator('.qr-preview').waitFor()}});
 await shot('chinese-search',{act:async p=>{await p.getByRole('textbox',{name:'搜索工具'}).fill('帮我把照片压缩小一点');await p.locator('.tool-card').first().waitFor()}});
}finally{await browser.close()}
