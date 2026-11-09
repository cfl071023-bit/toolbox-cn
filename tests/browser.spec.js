const origin=process.env.TOOLBOX_BASE_URL??'http://127.0.0.1:5178';
import {tools} from '../src/catalog';
import {test,expect} from '@playwright/test';
import jsQR from 'jsqr';
import {PNG} from 'pngjs';
test('Chinese home, synonyms, favorites, history, English and theme persistence',async({page})=>{
 await page.goto('/');await expect(page.locator('html')).toHaveAttribute('lang','zh-CN');await expect(page.locator('.tool-card')).toHaveCount(tools.length);
 await page.getByRole('textbox',{name:'搜索工具'}).fill('make my image smaller');await expect(page.locator('.tool-card')).toHaveCount(1);await expect(page.locator('.tool-card h3')).toHaveText('图片压缩');
 await page.getByRole('textbox',{name:'搜索工具'}).fill('图片变小');await expect(page.locator('.tool-card')).toHaveCount(1);
 await page.getByRole('button',{name:'收藏工具',exact:true}).click();await page.getByRole('button',{name:/我的收藏/}).click();await expect(page.locator('.tool-card')).toHaveCount(1);
 await page.locator('.card-link').click();await expect(page.locator('.workspace h1')).toHaveText('图片压缩');await page.getByRole('button',{name:'返回工具箱'}).click();await expect(page.locator('.recent-list')).toContainText('图片压缩');
 await page.getByRole('button',{name:'English',exact:true}).click();await expect(page.locator('html')).toHaveAttribute('lang','en');await page.getByRole('button',{name:'Toggle theme'}).click();await page.reload();await expect(page.locator('html')).toHaveAttribute('data-theme','dark');await expect(page.locator('html')).toHaveAttribute('lang','en');
});
test('JSON, Base64, timestamps, UUID, color, diff and QR results',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/#json');await page.getByRole('button',{name:'试用示例'}).click();await page.locator('.run-button').click();await expect(page.locator('.output textarea')).toHaveValue(/ToolBox CN/);
 await page.context().grantPermissions(['clipboard-read','clipboard-write']);await page.getByRole('button',{name:'复制结果'}).click();expect(await page.evaluate(()=>navigator.clipboard.readText())).toContain('ToolBox CN');
 await page.locator('.input-label textarea').first().fill('{broken}');await page.locator('.run-button').click();await expect(page.getByRole('alert')).toBeVisible();
 await page.goto('/#base64');await page.locator('.input-label textarea').first().fill('你好🌏');await page.locator('.run-button').click();const encoded=await page.locator('.output textarea').inputValue();await page.getByRole('button',{name:'Base64 → 文字'}).click();await page.locator('.input-label textarea').first().fill(encoded);await page.locator('.run-button').click();await expect(page.locator('.output textarea')).toHaveValue('你好🌏');
 await page.goto('/#time');await page.locator('.input-label textarea').first().fill('1704067200');await page.locator('.run-button').click();await expect(page.locator('.output textarea')).toHaveValue(/2024-01-01T00:00:00.000Z/);
 await page.goto('/#uuid');await page.getByRole('button',{name:'生成 UUID',exact:true}).click();expect(await page.locator('.output textarea').inputValue()).toMatch(/^[0-9a-f-]{36}$/);
 await page.goto('/#color');await page.locator('.input-label textarea').first().fill('#ff0000');await page.locator('.run-button').click();await expect(page.locator('.output textarea')).toHaveValue(/rgb\(255, 0, 0\)/);
 await page.goto('/#diff');await page.locator('textarea').nth(0).fill('hello <script>alert(1)</script>');await page.locator('textarea').nth(1).fill('hello world <script>alert(1)</script>');await expect(page.locator('.diff-output .added')).toContainText('world');
 await page.goto('/#qr');await page.locator('textarea').fill('https://example.com/你好');await page.getByRole('button',{name:'生成二维码',exact:true}).click();await expect(page.locator('.qr-preview')).toBeVisible();const src=await page.locator('.qr-preview').getAttribute('src');const png=PNG.sync.read(Buffer.from(src.split(',')[1],'base64'));const decoded=jsQR(new Uint8ClampedArray(png.data),png.width,png.height);expect(decoded.data).toBe('https://example.com/你好');
 const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'下载结果'}).click();expect((await downloadPromise).suggestedFilename()).toBe('toolbox-qr.png');expect(errors).toEqual([]);
});
test('image compression produces a valid smaller JPEG, reset and download work; no input uploads',async({page})=>{
 const requests=[];page.on('request',r=>{if(r.method()==='POST'||!r.url().startsWith(origin)&&!r.url().startsWith('data:'))requests.push(r.url())});
 await page.goto('/#image');const buffer=await page.evaluate(async()=>{const c=document.createElement('canvas');c.width=800;c.height=600;const x=c.getContext('2d');const image=x.createImageData(800,600);let seed=7;for(let i=0;i<image.data.length;i+=4){seed=(seed*1664525+1013904223)>>>0;image.data[i]=seed&255;image.data[i+1]=(seed>>>8)&255;image.data[i+2]=(seed>>>16)&255;image.data[i+3]=255;}x.putImageData(image,0,0);return [...new Uint8Array(await (await new Promise(r=>c.toBlob(r,'image/png'))).arrayBuffer())]});
 await page.locator('input[type=file]').setInputFiles({name:'test.png',mimeType:'image/png',buffer:Buffer.from(buffer)});await page.getByRole('button',{name:'压缩图片',exact:true}).click();await expect(page.locator('.image-previews figure')).toHaveCount(2);expect(await page.locator('.image-previews img').nth(1).getAttribute('src')).toMatch(/^data:image\/jpeg;base64,/);await expect(page.locator('.image-previews figcaption').nth(1)).toContainText('体积减少');
 const d=page.waitForEvent('download');await page.getByRole('button',{name:'下载结果'}).click();expect((await d).suggestedFilename()).toBe('toolbox-compressed.jpg');await page.getByRole('button',{name:'重置',exact:true}).click();await expect(page.locator('.image-previews')).toHaveCount(0);expect(requests).toEqual([]);
});
test('desktop and mobile layouts fit, categories and menu work',async({page})=>{
 await page.goto('/');await page.setViewportSize({width:1440,height:1050});await page.screenshot({path:'test-results/product-improvements-artifacts/screenshots/desktop-qa.png',fullPage:true});
 for(const width of [390,375,320]){await page.setViewportSize({width,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)}
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'test-results/product-improvements-artifacts/screenshots/mobile-qa.png',fullPage:true});await page.getByRole('button',{name:'打开菜单'}).click();await page.locator('aside nav').nth(1).getByRole('button',{name:'图片与设计',exact:true}).click();await expect(page.locator('.tool-card')).toHaveCount(6);await page.locator('.card-link').first().click();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

