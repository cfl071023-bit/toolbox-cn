// GPL-3.0-only. Adapted from sharevb/it-tools; see docs/UPSTREAM-EXPANSION.md.
import Papa from 'papaparse';
import {diffJson} from 'diff';
import {generateMarkdownTable} from './vendor/markdown-table';
const groups={prettier:['css-code','js-code'],toml:['json-toml','toml-json'],xml:['json-xml','xml-json'],flat:['json-flat'],units:['units']};
const imports={prettier:()=>import('./format-code'),toml:()=>import('smol-toml'),xml:()=>import('xml-js'),flat:()=>Promise.all([import('flatten-anything'),import('nestify-anything')]),units:()=>import('convert'),markdown:()=>import('marked')};
const loaded={};
export async function prepareExpansion(id){const key=Object.keys(groups).find(k=>groups[k].includes(id))||(id==='md-preview'?'markdown':null);if(key)await(loaded[key]??=imports[key]());if(key==='prettier')await(await loaded[key]).prepareCode(id);if(id==='regex')await prepareRegex();}
const json=value=>JSON.parse(value);
const stringify=value=>JSON.stringify(value,null,2);
const finite=value=>{if(String(value).trim()===''||!Number.isFinite(Number(value)))throw Error('number');return Number(value)};
export function inspectTree(value){let count=0;function visit(v,depth){if(++count>5000||depth>40)throw Error('tree-limit');if(v&&typeof v==='object')Object.values(v).forEach(x=>visit(x,depth+1));}visit(value,0);return value;}
function date(value){if(!/^\d{4}-\d{2}-\d{2}$/.test(value))throw Error('date');const d=new Date(value+'T00:00:00Z');if(!Number.isFinite(+d)||d.toISOString().slice(0,10)!==value)throw Error('date');return d;}
export function table(input){const parsed=Papa.parse(input.trim(),{skipEmptyLines:true});if(parsed.errors.length||!parsed.data[0]?.length||parsed.data.some(row=>row.length!==parsed.data[0].length))throw Error('csv');return generateMarkdownTable({headers:parsed.data[0],alignments:[],rows:parsed.data.slice(1)});}
function checkKeys(obj,nesting=false){if(!obj||Array.isArray(obj)||typeof obj!=='object')throw Error('object');for(const [k,v] of Object.entries(obj)){const parts=nesting?k.split('.'):[k];if(parts.some(p=>!p||['__proto__','prototype','constructor'].includes(p))||!nesting&&k.includes('.'))throw Error('unsafe-key');if(!nesting&&v&&typeof v==='object'&&!Array.isArray(v))checkKeys(v);if(nesting&&Object.keys(obj).some(other=>other!==k&&other.startsWith(k+'.')))throw Error('conflicting-key');}}
export async function runExpansion(id,input,options={},lang='zh'){
 if(input.length>100000||String(options.second??'').length>100000)throw Error('input-limit');await prepareExpansion(id);
 if(!input.trim())throw Error('empty');
 if(id==='md-table')return table(input);
 if(id==='md-preview')return (await loaded.markdown).marked.parse(input,{async:false});
 if(id==='json-view')return stringify(inspectTree(json(input)));
 if(id==='json-diff'){const changes=diffJson(inspectTree(json(input)),inspectTree(json(options.second||'')));return changes.every(p=>!p.added&&!p.removed)?(lang==='en'?'Identical JSON':'两份 JSON 相同'):changes.map(p=>(p.added?'+ ':p.removed?'- ':'  ')+p.value.split('\n').join('\n'+(p.added?'+ ':p.removed?'- ':'  '))).join('');}
 if(id==='list-compare'){const list=s=>[...new Set(s.split(/\r?\n/).map(x=>x.trim()).filter(Boolean))];const a=list(input),b=list(options.second||'');if(!b.length)throw Error('second');return stringify({[lang==='en'?'Shared':'共同项']:a.filter(x=>b.includes(x)),[lang==='en'?'Only in first':'仅第一份']:a.filter(x=>!b.includes(x)),[lang==='en'?'Only in second':'仅第二份']:b.filter(x=>!a.includes(x))});}
 if(id==='percentage'){const base=finite(input),n=finite(options.value);if(options.operation!=='percent'&&base===0)throw Error('zero');const result=options.operation==='percent'?base*n/100:options.operation==='share'?n/base*100:options.operation==='change'?(n-base)/base*100:NaN;if(!Number.isFinite(result))throw Error('number');return Number(result.toPrecision(14))+ (options.operation==='percent'?'':'%');}
 if(id==='date-calc')return String((date(options.end)-date(input.trim()))/86400000)+(lang==='en'?' days':' 天');
 if(id==='units'){const value=finite(input),from=options.from,to=options.to;const speed=['m/s','km/h'];let result;if(speed.includes(from)||speed.includes(to)){if(!speed.includes(from)||!speed.includes(to))throw Error('dimension');result=value*(from===to?1:from==='m/s'?3.6:1/3.6);}else result=(await loaded.units).default(value,from).to(to);if(!Number.isFinite(result))throw Error('overflow');return String(Number(result.toPrecision(14)))+' '+to;}
 if(id==='regex')return runRegex(input,options);
 if(id==='css-code'||id==='js-code')return (await loaded.prettier).formatCode(id,input,options.operation);
 if(id==='json-toml'){const value=inspectTree(json(input));function rejectNull(v){if(v===null)throw Error('null');if(typeof v==='object')Object.values(v).forEach(rejectNull);}rejectNull(value);if(!value||Array.isArray(value)||typeof value!=='object')throw Error('object');return (await loaded.toml).stringify(value);}
 if(id==='toml-json')return stringify((await loaded.toml).parse(input));
 if(id==='xml-json'||id==='json-xml'){const lib=(await loaded.xml).default;const xml=id==='xml-json'?input:lib.js2xml(inspectTree(json(input)),{compact:true,spaces:2});if(/<!DOCTYPE|<!ENTITY/i.test(xml))throw Error('xml');const doc=new DOMParser().parseFromString(xml,'application/xml');if(doc.querySelector('parsererror')||!doc.documentElement)throw Error('xml');return id==='json-xml'?xml:stringify(lib.xml2js(xml,{compact:true}));}
 if(id==='html-text'){// Parse inside a template: remote resources and scripts stay inert.
 const template=document.createElement('template');template.innerHTML=input;template.content.querySelectorAll('script,style,template,noscript').forEach(e=>e.remove());template.content.querySelectorAll('p,div,h1,h2,h3,h4,h5,h6,li,br,tr,section,article').forEach(e=>e.append('\n'));return template.content.textContent.replace(/[\t ]+\n/g,'\n').replace(/\n{3,}/g,'\n\n').trim();}
 if(id==='json-flat'){const value=inspectTree(json(input));checkKeys(value,options.operation==='nest');const [a,b]=await loaded.flat;return stringify(options.operation==='nest'?b.nestifyObject(value):a.flatten(value));}
 throw Error('unknown-tool');
}
let regexWorker,ready,pending;
function prepareRegex(){if(ready)return ready;ready=new Promise((resolve,reject)=>{regexWorker=new Worker(new URL('./regex-worker.js',import.meta.url),{type:'module'});regexWorker.onmessage=e=>{if(e.data.ready)resolve();else if(pending){const p=pending;pending=null;clearTimeout(p.timer);e.data.error?p.reject(Error(e.data.error)):p.resolve(e.data.output)}};regexWorker.onerror=()=>{reject(Error('worker'));pending?.reject(Error('worker'));regexWorker?.terminate();regexWorker=null;ready=null;};});return ready;}
async function runRegex(input,options){await prepareRegex();if(pending)throw Error('busy');return new Promise((resolve,reject)=>{const timer=setTimeout(()=>{regexWorker.terminate();regexWorker=null;ready=null;pending=null;reject(Error('regex-timeout'));},1000);pending={resolve,reject,timer};regexWorker.postMessage({input,options});});}
