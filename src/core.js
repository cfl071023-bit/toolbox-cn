// ToolBox CN modifications, 2026-11-08. GPL-3.0-only.
// Base64 implementation is reused directly from CorentinTh/it-tools.
import {textToBase64,base64ToText} from './vendor/base64.ts';
import {v4} from 'uuid';
import {colord} from 'colord';
import {diffChars} from 'diff';
import {formatJson} from './json';
export const compareText=(a,b)=>diffChars(a,b);
export const prepareAdvanced=()=>import('./advanced');
export function runTool(id,input,mode='encode',options={},lang='zh'){
 if(['pdf-merge','pdf-split','image-crop','image-resize','image-convert','file-hash','file-base64','qr-read','md-preview','md-table','percentage','units','date-calc','regex','css-code','js-code','json-view','json-diff','json-xml','xml-json','json-toml','toml-json','list-compare','html-text','json-flat'].includes(id))return import('./expansion').then(m=>m.runExpansion(id,input,options,lang));
 if(id==='json')return formatJson(input);
 if(id==='base64')return mode==='decode'?base64ToText(input.trim()):textToBase64(input);
 if(id==='uuid')return v4();
 if(id==='color'){const c=colord(input);if(!c.isValid())throw new Error('color');return `${c.toHex()}\n${c.toRgbString()}\n${c.toHslString()}`;}
 if(id==='time'){
 const s=input.trim();if(!s)throw new Error('time');
 if(!/^-?\d+$/.test(s)&&!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/.test(s))throw new Error('time');
 if(s.includes('T')){
  const [y,m,day]=s.slice(0,10).split('-').map(Number);const leap=y%4===0&&(y%100!==0||y%400===0);const days=[31,leap?29:28,31,30,31,30,31,31,30,31,30,31];
  if(m<1||m>12||day<1||day>days[m-1])throw new Error('time');
 }
 const d=new Date(/^-?\d+$/.test(s)?Number(s)*(s.replace('-','').length<=10?1000:1):s);
 if(!Number.isFinite(d.getTime()))throw new Error('time');
 return `UTC: ${d.toISOString()}\nLocal: ${d.toLocaleString()}\nUnix (s): ${Math.floor(d.getTime()/1000)}\nUnix (ms): ${d.getTime()}`;}
 return prepareAdvanced().then(({runAdvanced})=>runAdvanced(id,input,options,lang));
}
