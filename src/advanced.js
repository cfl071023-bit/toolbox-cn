// Adapted IT-Tools integrations. GPL-3.0-only. Provenance: REUSE.md.
import {camelCase,snakeCase,capitalCase} from 'change-case';
import {escape,unescape} from 'lodash-es';
import {parseDocument,stringify as yamlStringify} from 'yaml';
import Papa from 'papaparse';
import xmlFormat from 'xml-formatter';
import xmljs from 'xml-js';
import {format as sqlFormat} from 'sql-formatter';
import {marked} from 'marked';
import {Netmask} from 'netmask';
import {jwtDecode} from 'jwt-decode';
import {convertBase} from './vendor/integer-base';
import {arabicToRoman,romanToArabic} from './vendor/roman';
import * as temp from './vendor/temperature';
import {getStringSizeInBytes} from './vendor/text-statistics';
const pretty=v=>JSON.stringify(v,null,2);
function bounded(v,min,max){const n=Number(v);if(!Number.isInteger(n)||n<min||n>max)throw new Error('range');return n;}
export function wifiText(ssid,{password='',security='WPA'}={}){
 if(!ssid.trim()||!['WPA','WEP','nopass'].includes(security)||(security!=='nopass'&&!password))throw new Error('wifi');
 const esc=s=>s.replace(/([\\;,:" ])/g,m=>m===' '?m:'\\'+m);
 return security==='nopass'?`WIFI:S:${esc(ssid)};;`:`WIFI:S:${esc(ssid)};T:${security};P:${esc(password)};;`;
}
export function runAdvanced(id,input,o={},lang='zh'){
 const en=lang==='en',label=(a,b)=>en?b:a;
 if(!input.trim()&&!['stats','hash','token','svg'].includes(id))throw new Error('empty');
 if(id==='stats'){const chars=[...input],words=globalThis.Intl?.Segmenter?[...new Intl.Segmenter(lang,{granularity:'word'}).segment(input)].filter(x=>x.isWordLike).length:(input.trim()?input.trim().split(/\s+/u).length:0);return pretty({[label('字符数（含空格）','Characters (including spaces)')]:chars.length,[label('中文字符数','Han characters')]:chars.filter(c=>/\p{Script=Han}/u.test(c)).length,[label('分词数','Segmented words')]:words,[label('行数','Lines')]:input?input.split(/\r\n|\r|\n/).length:0,[label('UTF-8 字节数','UTF-8 bytes')]:getStringSizeInBytes(input)});}
 if(id==='case')return ({upper:s=>s.toUpperCase(),lower:s=>s.toLowerCase(),camel:camelCase,snake:snakeCase,title:capitalCase}[o.format??'upper'])(input);
 if(id==='dedupe'){let lines=[...new Set(input.split(/\r\n|\r|\n/).map(x=>x.trim()).filter(Boolean))];if(o.sort&&o.sort!=='keep')lines.sort((a,b)=>a.localeCompare(b,lang==='zh'?'zh-CN':'en')*(o.sort==='desc'?-1:1));return lines.join('\n');}
 if(id==='url-codec')return o.direction==='decode'?decodeURIComponent(input):encodeURIComponent(input);
 if(id==='url-parse'){const u=new URL(input.trim());return pretty({protocol:u.protocol,hostname:u.hostname,port:u.port,pathname:u.pathname,hash:u.hash,parameters:[...u.searchParams].map(([key,value])=>({key,value}))});}
 if(id==='json-yaml')return yamlStringify(JSON.parse(input));
 if(id==='yaml-json'){const doc=parseDocument(input);if(doc.errors.length||doc.contents===null)throw new Error('yaml');return pretty(doc.toJS({maxAliasCount:100}));}
 if(id==='json-csv'){const value=JSON.parse(input);if(!Array.isArray(value)||!value.length||value.some(x=>!x||Array.isArray(x)||typeof x!=='object'||Object.values(x).some(v=>v!==null&&typeof v==='object')))throw new Error('csv');const fields=[...new Set(value.flatMap(Object.keys))];if(!fields.length)throw new Error('csv');return Papa.unparse({fields,data:value.map(row=>fields.map(key=>row[key]??''))},{newline:'\n',escapeFormulae:true});}
 if(id==='csv-json'){const p=Papa.parse(input,{header:true,skipEmptyLines:'greedy',delimiter:','});if(!p.meta.fields?.length||new Set(p.meta.fields).size!==p.meta.fields.length||p.meta.renamedHeaders&&Object.keys(p.meta.renamedHeaders).length||p.errors.length||p.meta.fields.some(x=>!x.trim()))throw new Error('csv');return pretty(p.data);}
 if(id==='xml'){xmljs.xml2js(input,{compact:true});return xmlFormat(input,{indentation:'  ',lineSeparator:'\n',collapseContent:true,throwOnFailure:true});}
 if(id==='sql')return sqlFormat(input,{language:o.dialect??'sql',tabWidth:2,keywordCase:'upper'});
 if(id==='markdown')return marked.parse(input,{async:false});
 if(id==='html')return o.direction==='decode'?unescape(input):escape(input);
 if(id==='hash')return crypto.subtle.digest('SHA-256',new TextEncoder().encode(input)).then(data=>[...new Uint8Array(data)].map(x=>x.toString(16).padStart(2,'0')).join(''));
 if(id==='token'){const length=bounded(o.length??24,8,128);const alphabet=({mixed:'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',hex:'0123456789abcdef',symbols:'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*_-+='})[o.alphabet??'mixed'];if(!alphabet)throw new Error('alphabet');let result='';const limit=256-256%alphabet.length;while(result.length<length){for(const n of crypto.getRandomValues(new Uint8Array(length*2))){if(n<limit)result+=alphabet[n%alphabet.length];if(result.length===length)break;}}return result;}
 if(id==='base'){const from=Number(o.from??10),to=Number(o.to??16);if(![2,8,10,16].includes(from)||![2,8,10,16].includes(to)||!input.trim())throw new Error('base');let s=input.trim().toLowerCase(),sign='';if(s[0]==='-'){sign='-';s=s.slice(1)}if(!s)throw new Error('base');const value=convertBase({value:s,fromBase:from,toBase:to});return value==='0'?'0':sign+value;}
 if(id==='temperature'){if(!input.trim())throw new Error('temperature');const n=Number(input);if(!Number.isFinite(n))throw new Error('temperature');const k=({C:temp.convertCelsiusToKelvin,F:temp.convertFahrenheitToKelvin,K:v=>v}[o.unit??'C'])(n);if(k<0)throw new Error('temperature');return `${Number(temp.convertKelvinToCelsius(k).toFixed(6))} °C\n${Number(temp.convertKelvinToFahrenheit(k).toFixed(6))} °F\n${Number(k.toFixed(6))} K`;}
 if(id==='roman'){const s=input.trim().toUpperCase();if(!s)throw new Error('roman');if(/^\d+$/.test(s))return arabicToRoman(bounded(s,1,3999));const n=romanToArabic(s);if(n===null||!n)throw new Error('roman');return String(n);}
 if(id==='subnet'){const s=input.trim();if(!/^\d{1,3}(\.\d{1,3}){3}\/\d{1,2}$/.test(s)||s.split('/')[0].split('.').some(x=>Number(x)>255)||Number(s.split('/')[1])>32)throw new Error('subnet');const b=new Netmask(s);return pretty({network:b.base,mask:b.mask,prefix:b.bitmask,broadcast:b.broadcast??null,first:b.first,last:b.last,totalAddresses:b.size});}
 if(id==='jwt'){const s=input.trim();if(s.split('.').length!==3)throw new Error('jwt');return pretty({[label('注意','Warning')]:label('仅解码，未验证签名','Decoded only. Signature NOT verified.'),header:jwtDecode(s,{header:true}),payload:jwtDecode(s)});}
 if(id==='svg'){const w=bounded(o.width??800,1,4096),h=bounded(o.height??400,1,4096);const bg=o.background??'#6366f1';if(!/^#[\da-f]{6}$/i.test(bg))throw new Error('color');return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="${bg}"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="${Math.max(1,Math.min(32,h/4,w/8))}" fill="#ffffff">${escape(input||`${w} × ${h}`)}</text></svg>`;}
 throw new Error('unknown');
}
