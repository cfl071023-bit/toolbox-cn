// Regenerates static source inventory. Inventory does not certify upstream tools as tested.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const upstream='upstream-sharevb',root=path.join(upstream,'src/tools');
const mappings={
 'pdf-concat':['pdf-merge'],'pdf-extract':['pdf-split'],'crop-image':['image-crop'],'image-resizer':['image-resize'],'image-converter':['image-convert'],'file-hasher':['file-hash'],'base64-file-converter':['file-base64'],'qr-code-decoder':['qr-read'],'markdown-preview':['md-preview'],'markdown-table-generator':['md-table'],'percentage-calculator':['percentage'],'many-units-converter':['units'],'days-calculator':['date-calc'],'regex-tester':['regex'],'css-js-prettify-minify':['css-code','js-code'],'json-viewer':['json-view'],'json-diff':['json-diff'],'json-to-xml':['json-xml'],'xml-to-json':['xml-json'],'json-to-toml':['json-toml'],'toml-to-json':['toml-json'],'list-comparer':['list-compare'],'extract-text-from-html':['html-text'],'json-flatten-nestify':['json-flat']
};
const existing={
 'text-diff':['diff'],'base64-string-converter':['base64'],'date-time-converter':['time'],'uuid-generator':['uuid'],'color-converter':['color'],'text-statistics':['stats'],'case-converter':['case'],'list-converter':['dedupe'],'url-encoder':['url-codec'],'url-parser':['url-parse'],'json-to-yaml-converter':['json-yaml'],'yaml-to-json-converter':['yaml-json'],'json-to-csv':['json-csv'],'csv-to-json':['csv-json'],'xml-formatter':['xml'],'sql-prettify':['sql'],'markdown-to-html':['markdown'],'html-entities':['html'],'hash-text':['hash'],'token-generator':['token'],'integer-base-converter':['base'],'temperature-converter':['temperature'],'roman-numeral-converter':['roman'],'ipv4-subnet-calculator':['subnet'],'jwt-parser':['jwt'],'wifi-qr-code-generator':['wifi'],'svg-placeholder-generator':['svg'],'qr-code-generator':['qr']
};
const deferred={
 'pdf-compressor':'Ghostscript WASM package ~16.3 MB; AGPL-3.0 and large mobile-memory workload. Not integrated/tested.',
 'ocr-image':'Tesseract Chinese model package ~21.9 MB, plus workers/core/English data. Requires dedicated accuracy and offline asset testing.',
 'potrace':'Upstream uses Node Buffer and multiple tracing backends. esm-potrace-wasm package declares GPL-2.0; redistribution compatibility not established. No fake embedded-image SVG.',
 'html-to-pdf':'Print/browser differences and document pagination require dedicated QA.',
 'pdf-text-extractor':'PDF.js worker and CJK text extraction require dedicated file fixtures.',
 'html-to-markdown':'Useful next candidate; not selected for this bounded batch.',
 'markdown-toc-generator':'Useful next candidate; not selected for this bounded batch.',
 'remove-exif':'Useful next candidate; metadata privacy needs explicit output verification.',
 'image-exif-reader':'Useful next candidate; broad image/camera fixture coverage required.',
 'watermarker':'Useful next candidate; export and mobile controls require dedicated QA.'
};
const dirs=fs.readdirSync(root,{withFileTypes:true}).filter(d=>d.isDirectory()).map(d=>d.name).sort();
const inventory=dirs.map(id=>{const files=fs.readdirSync(path.join(root,id));return {id,sourceDirectory:`${upstream}/src/tools/${id}`,status:mappings[id]?'INTEGRATED_ADAPTED':existing[id]?'EXISTING_EQUIVALENT':deferred[id]?'DEFERRED_REVIEWED':'NOT_SELECTED_NOT_TESTED',toolboxIds:mappings[id]||existing[id]||[],reason:deferred[id]||null,hasEntry:files.includes('index.ts')};});
const revision={repository:'https://github.com/sharevb/it-tools',branch:'chore/all-my-stuffs',commit:'b5eace85dbdb247f832b2aa9967b9d570a84d1ce',commitDate:'2026-11-08T18:45:54+01:00',packageVersion:JSON.parse(fs.readFileSync(path.join(upstream,'package.json'),'utf8')).version,licenseDeclared:'GNU GPLv3',licenseSHA256:crypto.createHash('sha256').update(fs.readFileSync(path.join(upstream,'LICENSE'))).digest('hex'),sourceDirectories:dirs.length,scope:'Static source inventory only. Unselected upstream directories have not been functionally tested.'};
fs.writeFileSync('docs/UPSTREAM-SHAREVB.json',JSON.stringify(revision,null,2)+'\n');
fs.writeFileSync('docs/UPSTREAM-TOOL-INVENTORY.json',JSON.stringify({revision,tools:inventory},null,2)+'\n');
for(const id of [...Object.keys(mappings),...Object.keys(existing)])if(!dirs.includes(id))console.warn('Mapping does not exist:',id);
console.log(JSON.stringify({directories:dirs.length,integratedSourceDirectories:inventory.filter(t=>t.status==='INTEGRATED_ADAPTED').length,existingEquivalents:inventory.filter(t=>t.status==='EXISTING_EQUIVALENT').length,deferredReviewed:inventory.filter(t=>t.status==='DEFERRED_REVIEWED').length}));

