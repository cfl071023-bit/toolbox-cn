// Validate JSON syntax, then format its tokens without changing number precision,
// duplicate keys, escape sequences, or property order through a parse/stringify round trip.
export function formatJson(source){
 JSON.parse(source);
 const tokens=source.match(/"(?:\\.|[^"\\])*"|[{}\[\],:]|[^\s{}\[\],:]+/g);
 let result='',depth=0;
 const newline=()=>{result+='\n'+'  '.repeat(depth)};
 for(let i=0;i<tokens.length;i++){
  const token=tokens[i];
  if(token==='{'||token==='['){
   result+=token;const close=token==='{'?'}':']';
   if(tokens[i+1]===close){result+=close;i++;}else{depth++;newline();}
  }else if(token==='}'||token===']'){depth--;newline();result+=token;}
  else if(token===','){result+=',';newline();}
  else if(token===':')result+=': ';
  else result+=token;
 }
 return result;
}
