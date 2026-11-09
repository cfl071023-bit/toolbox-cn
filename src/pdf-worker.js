// Adapted from sharevb/it-tools pdf-concat/pdf-extract.vue (GPL-3.0-only).
// QPDF itself is Apache-2.0. Embedded WASM; no external server or CDN.
import createQPDFModule from 'qpdf-wasm-esm-embedded';
self.onmessage=async({data:{files,pages,id}})=>{let mod;try{mod=await createQPDFModule({print:()=>{},printErr:()=>{}});files.forEach((buffer,i)=>mod.FS.writeFile(`in${i}.pdf`,new Uint8Array(buffer)));const args=['--empty','--pages'];if(id==='pdf-merge')files.forEach((_,i)=>args.push(`in${i}.pdf`,'1-z'));else{if(!/^\d+(?:-\d+)?(?:,\d+(?:-\d+)?)*$/.test(pages)||pages.length>1000)throw Error('pages');args.push('in0.pdf',pages);}args.push('--','out.pdf');const code=mod.callMain(args);if(code!==0)throw Error('pdf');const bytes=mod.FS.readFile('out.pdf');self.postMessage({bytes});}catch(e){self.postMessage({error:e.message})}finally{if(mod)for(const name of [...files.map((_,i)=>`in${i}.pdf`),'out.pdf'])try{mod.FS.unlink(name)}catch{}}};
self.postMessage({ready:true});
