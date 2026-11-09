const origin=process.env.TOOLBOX_BASE_URL??'http://127.0.0.1:5178';
import {tools} from '../src/catalog';
import {test,expect} from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import jsQR from 'jsqr';
import {PNG} from 'pngjs';
const fixture=path.resolve('tests/fixtures/hopper.jpg');
const textInput=page=>page.locator('.input-label textarea').first();
async function run(page,value){if(value!==undefined)await textInput(page).fill(value);await page.locator('.run-button').click();}
async function decodedImage(page,src){return page.evaluate(async src=>{const img=new Image();img.src=src;await img.decode();const c=document.createElement('canvas');c.width=img.width;c.height=img.height;const x=c.getContext('2d');x.drawImage(img,0,0);return {width:img.width,height:img.height,pixel:[...x.getImageData(0,0,1,1).data]};},src);}

test('真实 JPEG 和上游 PNG 文件：压缩下载后仍可解码、尺寸正确',async({page},info)=>{
 await page.goto('/#image');
 for(const file of [fixture,path.resolve('upstream/public/banner.png')]){
  await page.locator('input[type=file]').setInputFiles(file);await expect(page.locator('.image-controls')).toBeVisible();
  const original=await decodedImage(page,await page.locator('.image-previews img').first().getAttribute('src'));
  await page.locator('input[type=range]').fill('65');await page.getByRole('button',{name:'压缩图片',exact:true}).click();await expect(page.locator('.image-previews img')).toHaveCount(2);
  const src=await page.locator('.image-previews img').nth(1).getAttribute('src');const result=await decodedImage(page,src);expect(result.width).toBe(original.width);expect(result.height).toBe(original.height);
  const pending=page.waitForEvent('download');await page.getByRole('button',{name:'下载结果'}).click();const d=await pending;const target=info.outputPath(path.basename(file)+'.compressed.jpg');await d.saveAs(target);const bytes=fs.readFileSync(target);expect(bytes[0]).toBe(255);expect(bytes[1]).toBe(216);expect(bytes.equals(Buffer.from(src.split(',')[1],'base64'))).toBe(true);
  if(file===fixture)expect(bytes.length).toBeLessThan(fs.statSync(file).size);
  await info.attach(path.basename(file)+'-sizes',{body:JSON.stringify({originalBytes:fs.statSync(file).size,resultBytes:bytes.length,width:result.width,height:result.height}),contentType:'application/json'});
 }
});

test('WebP、透明 PNG、损坏文件、超限文件和压缩结果变大提示',async({page})=>{
 await page.goto('/#image');
 const variants=await page.evaluate(async()=>{const c=document.createElement('canvas');c.width=32;c.height=24;return {png:c.toDataURL('image/png'),webp:c.toDataURL('image/webp')};});
 for(const [ext,src] of Object.entries(variants)){
  await page.locator('input[type=file]').setInputFiles({name:'transparent.'+ext,mimeType:'image/'+ext,buffer:Buffer.from(src.split(',')[1],'base64')});await page.getByRole('button',{name:'压缩图片',exact:true}).click();await expect(page.locator('.image-previews img')).toHaveCount(2);const data=await decodedImage(page,await page.locator('.image-previews img').nth(1).getAttribute('src'));expect(data.pixel).toEqual([255,255,255,255]);await expect(page.locator('.image-previews figcaption').nth(1)).toContainText('比原图更大');
 }
 await page.locator('input[type=file]').setInputFiles({name:'broken.jpg',mimeType:'image/jpeg',buffer:Buffer.from('not a jpeg')});await expect(page.getByRole('alert')).toContainText('无法读取');await expect(page.locator('.image-previews')).toHaveCount(0);
 await page.locator('input[type=file]').setInputFiles({name:'huge.jpg',mimeType:'image/jpeg',buffer:Buffer.alloc(25*1024*1024+1)});await expect(page.getByRole('alert')).toContainText('25 MB');
 await page.locator('input[type=file]').setInputFiles(fixture);await expect(page.locator('.image-controls')).toBeVisible();await expect(page.getByRole('alert')).toHaveCount(0);
});

test('图片解码期间重置不会恢复旧图片',async({page})=>{
 await page.addInitScript(()=>{const original=Image.prototype.decode;Image.prototype.decode=async function(){window.__decoding=true;await new Promise(r=>setTimeout(r,400));return original.call(this)}});
 await page.goto('/#image');await page.locator('input[type=file]').setInputFiles(fixture);await page.waitForFunction(()=>window.__decoding);await page.getByRole('button',{name:'重置',exact:true}).click();await page.waitForTimeout(600);await expect(page.locator('.image-previews')).toHaveCount(0);await expect(page.getByRole('alert')).toHaveCount(0);
});

test('真实中文内容、网址和 Wi-Fi 文本的二维码可解码；空值与超长值报错',async({page})=>{
 await page.goto('/#qr');
 for(const value of ['欢迎来到 ToolBox CN！今天也要高效工作 😊','https://example.com/search?q=中文&from=ToolBoxCN','WIFI:T:WPA;S:ToolBox CN;P:test-123456;;']){
  await run(page,value);await expect(page.locator('.qr-preview')).toBeVisible();const src=await page.locator('.qr-preview').getAttribute('src');const png=PNG.sync.read(Buffer.from(src.split(',')[1],'base64'));expect(jsQR(new Uint8ClampedArray(png.data),png.width,png.height)?.data).toBe(value);
 }
 for(const invalid of ['', '中'.repeat(4000)]){await run(page,invalid);await expect(page.getByRole('alert')).toBeVisible();await expect(page.locator('.qr-preview')).toHaveCount(0)}
});

test('JSON 有效/无效输入、原文保留、下载与重置；Base64 无效输入',async({page})=>{
 await page.goto('/#json');
 for(const value of ['{"姓名":"张三","列表":[1,true,null,{"a":"😊"}]}','[]','null','0','"hello"']){await run(page,value);await expect(page.locator('.output textarea')).toHaveValue(JSON.stringify(JSON.parse(value),null,2));}
 for(const value of ['{"a":1,}', '{', '{"a":NaN}', '', '{"a":1} trailing']){await run(page,value);await expect(page.getByRole('alert')).toBeVisible();await expect(textInput(page)).toHaveValue(value);await expect(page.locator('.output')).toHaveCount(0)}
 await run(page,'{"hello":"世界"}');const pending=page.waitForEvent('download');await page.getByRole('button',{name:'下载结果'}).click();const d=await pending;expect(fs.readFileSync(await d.path(),'utf8')).toBe('{\n  "hello": "世界"\n}');await page.getByRole('button',{name:'重置',exact:true}).click();await expect(textInput(page)).toHaveValue('');await expect(page.locator('.output')).toHaveCount(0);
 await page.goto('/#base64');await page.getByRole('button',{name:'Base64 → 文字'}).click();await run(page,'%%%');await expect(page.getByRole('alert')).toBeVisible();
});

test('收藏与最近使用：刷新持久化、去重、时间顺序、取消收藏',async({page})=>{
 await page.goto('/');await page.locator('.tool-card').filter({has:page.getByRole('heading',{name:'JSON 格式化',exact:true})}).getByRole('button').click();
 for(const id of ['json','time','json','color']){await page.goto('/#'+id);await expect(page.locator('.workspace')).toBeVisible()}
 await page.reload();await page.getByRole('button',{name:'返回工具箱'}).click();await page.getByRole('button',{name:'最近使用',exact:true}).click();await expect(page.locator('.tool-card h3')).toHaveText(['颜色转换','JSON 格式化','时间戳转换']);
 await page.getByRole('button',{name:/我的收藏/}).click();await expect(page.locator('.tool-card h3')).toHaveText(['JSON 格式化']);await page.locator('.tool-card .favorite').click();await expect(page.locator('.tool-card')).toHaveCount(0);await page.reload();await page.getByRole('button',{name:/我的收藏/}).click();await expect(page.locator('.tool-card')).toHaveCount(0);
});

test('JSON 保留数字原文；时间戳校验无效日期；颜色多格式与 UUID 更新',async({page})=>{
 await page.goto('/#json');await run(page,'{"n":9007199254740993,"decimal":0.12345678901234567890}');await expect(page.locator('.output textarea')).toHaveValue(/9007199254740993/);await expect(page.locator('.output textarea')).toHaveValue(/0\.12345678901234567890/);
 await page.goto('/#time');for(const value of ['1704067200','1704067200000','2024-01-01T08:00:00+08:00']){await run(page,value);await expect(page.locator('.output textarea')).toHaveValue(/2024-01-01T00:00:00.000Z/)}for(const value of ['2024-02-30T00:00:00Z','2023-02-29T00:00:00Z','garbage']){await run(page,value);await expect(page.getByRole('alert')).toBeVisible()}
 await page.goto('/#color');for(const value of ['#ff0000','rgb(255, 0, 0)','hsl(0, 100%, 50%)']){await run(page,value);await expect(page.locator('.output textarea')).toHaveValue(/#ff0000/)}await run(page,'invalid');await expect(page.getByRole('alert')).toBeVisible();
 await page.goto('/#uuid');const ids=new Set();for(let i=0;i<10;i++){await run(page);const value=await page.locator('.output textarea').inputValue();expect(value).toMatch(/^[0-9a-f-]{14}4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);ids.add(value)}expect(ids.size).toBe(10);
});

test('中文自然语言、中英混合与英文搜索，覆盖八个工具',async({page})=>{
 await page.goto('/');
 const queries=[['帮我把照片压缩小一点','图片压缩'],['我想生成一个二维码','二维码生成'],['比较两段文字有什么不同','文字对比'],['帮我整理JSON数据','JSON 格式化'],['将文字转成Base64','Base64 编解码'],['把时间戳转成日期','时间戳转换'],['帮我生成一个唯一编号','UUID 生成'],['把颜色转成RGB','颜色转换'],['make my image smaller','图片压缩'],['generate a qr code','二维码生成'],['compare two texts','文字对比'],['format json','JSON 格式化'],['decode base64','Base64 编解码'],['timestamp','时间戳转换'],['generate uuid','UUID 生成'],['convert color','颜色转换']];
 for(const [q,name] of queries){await page.getByRole('textbox',{name:'搜索工具'}).fill(q);await expect(page.locator('.tool-card h3').first()).toHaveText(name)}
 await page.getByRole('textbox',{name:'搜索工具'}).fill('不存在的xyz工具');await expect(page.locator('.tool-card')).toHaveCount(0);
});

test('全部工具中英文切换保留输入；主题往返与刷新；损坏偏好可恢复',async({page})=>{
 await page.goto('/');
 for(const [id,enName] of [['image','Image compressor'],['qr','QR code generator'],['diff','Text comparison'],['json','JSON formatter'],['base64','Base64 encoder / decoder'],['time','Timestamp converter'],['uuid','UUID generator'],['color','Color converter']]){
  await page.goto('/#'+id);if(!['image','uuid'].includes(id))await textInput(page).fill('临时输入');await page.getByRole('button',{name:'English',exact:true}).click();await expect(page.locator('.workspace h1')).toHaveText(enName);if(!['image','uuid'].includes(id))await expect(textInput(page)).toHaveValue('临时输入');await page.getByRole('button',{name:'简体中文',exact:true}).click();await expect(page.locator('html')).toHaveAttribute('lang','zh-CN');
 }
 for(const expected of ['dark','light']){await page.getByRole('button',{name:'切换主题'}).click();await expect(page.locator('html')).toHaveAttribute('data-theme',expected);await page.reload();await expect(page.locator('html')).toHaveAttribute('data-theme',expected)}
 await page.evaluate(()=>{localStorage.setItem('tb-favorites','{}');localStorage.setItem('tb-recent','"oops"');localStorage.setItem('tb-lang','[]');localStorage.setItem('tb-dark','"false"')});await page.goto('/');await expect(page.locator('.tool-card')).toHaveCount(tools.length);await expect(page.locator('html')).toHaveAttribute('lang','zh-CN');await expect(page.locator('html')).toHaveAttribute('data-theme','light');
});

for(const id of ['image','qr','diff','json','base64','time','uuid','color'])test(`隐私核验 ${id}：断网可处理、无上传请求、输入不写入持久存储`,async({page,context})=>{
 const external=[],writes=[],sockets=[];page.on('request',r=>{if(!r.url().startsWith(origin)&&!r.url().startsWith('data:'))external.push(r.url());if(!['GET','HEAD'].includes(r.method()))writes.push(r.url())});page.on('websocket',s=>{if(!s.url().startsWith(origin.replace('http','ws')))sockets.push(s.url())});
 await page.goto('/#'+id);await page.waitForLoadState('networkidle');await context.setOffline(true);const marker='QA_PRIVATE_隐私_93854';
 if(id==='image'){await page.locator('input[type=file]').setInputFiles(fixture);await page.getByRole('button',{name:'压缩图片',exact:true}).click();await expect(page.locator('.image-previews img')).toHaveCount(2)}
 else if(id==='diff'){await textInput(page).fill(marker);await page.locator('textarea').nth(1).fill(marker+'新增');await expect(page.locator('.diff-output .added')).toHaveText('新增')}
 else{const values={qr:marker,json:JSON.stringify({secret:marker}),base64:marker,time:'1704067200',color:'#123456'};await run(page,values[id]);await expect(page.locator(id==='qr'?'.qr-preview':'.output textarea')).toBeVisible();if(id==='json')await expect(page.locator('.output textarea')).toHaveValue(new RegExp(marker));if(id==='time')await expect(page.locator('.output textarea')).toHaveValue(/2024-01-01/);if(id==='color')await expect(page.locator('.output textarea')).toHaveValue(/rgb\(18, 52, 86\)/);if(id==='uuid')await expect(page.locator('.output textarea')).toHaveValue(/^[0-9a-f-]{14}4/)}
 expect(external).toEqual([]);expect(writes).toEqual([]);expect(sockets).toEqual([]);const stored=await page.evaluate(()=>JSON.stringify({local:{...localStorage},session:{...sessionStorage}}));expect(stored).not.toContain(marker);expect(Object.keys(JSON.parse(stored).local).sort()).toEqual(['tb-dark','tb-favorites','tb-lang','tb-recent']);expect(Object.keys(JSON.parse(stored).session)).toEqual([]);
 await context.setOffline(false);await page.reload();if(!['image','uuid'].includes(id))await expect(textInput(page)).toHaveValue('');if(id==='image')await expect(page.locator('.image-previews')).toHaveCount(0);
});

test('桌面与移动端：所有工具、双主题、双语言均无横向溢出',async({page})=>{
 for(const width of [1440,768,390,320]){
  await page.setViewportSize({width,height:900});await page.goto('/');for(const id of ['', 'image','qr','diff','json','base64','time','uuid','color']){await page.goto('/#'+id);await expect(page.locator(id?'.workspace':'.hero')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${width}px ${id}`).toBe(true)}
 }
 await page.getByRole('button',{name:'English',exact:true}).click();await page.getByRole('button',{name:'Toggle theme'}).click();for(const width of [1440,390,320]){await page.setViewportSize({width,height:900});for(const id of ['', 'image','json','diff','base64']){await page.goto('/#'+id);await expect(page.locator(id?'.workspace':'.hero')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`English dark ${width}px ${id}`).toBe(true)}}
});
