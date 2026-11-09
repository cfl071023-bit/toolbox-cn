// Based on sharevb/it-tools regex-tester.service.ts. GPL-3.0-only.
// Adds timeout isolation (parent), result limits, and empty-match handling.
self.onmessage=({data:{input,options}})=>{try{const flags=options.flags||'';if(!/^[dgimsuvy]*$/.test(flags)||new Set(flags).size!==flags.length)throw Error('flags');const re=new RegExp(options.pattern,flags.includes('d')?flags:flags+'d');if(!options.pattern)throw Error('pattern');const results=[];let match;while((match=re.exec(input))!==null){if(results.length>=1000)throw Error('match-limit');results.push({index:match.index,value:match[0],captures:match.slice(1).map((value,i)=>({value:value??null,range:match.indices[i+1]??null})),groups:match.groups??{}});if(!re.global&&!re.sticky)break;if(match[0]===''){const at=re.lastIndex;re.lastIndex+=(re.unicode||re.unicodeSets)&&input.codePointAt(at)>65535?2:1;}}self.postMessage({output:JSON.stringify(results,null,2)})}catch(e){self.postMessage({error:e.message})}};
self.postMessage({ready:true});

