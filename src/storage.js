import {tools} from './catalog';
// Validate persisted preferences before using them; old or edited storage must not break the app.
export function readPreference(key,fallback){
 try{
  const value=JSON.parse(localStorage.getItem(key));
  if(key==='tb-lang')return ['zh','en'].includes(value)?value:fallback;
  if(key==='tb-dark')return typeof value==='boolean'?value:fallback;
  if(key==='tb-favorites'||key==='tb-recent')return Array.isArray(value)?[...new Set(value.filter(x=>tools.some(t=>t.id===x)))].slice(0,key==='tb-recent'?12:tools.length):fallback;
 }catch{}
 return fallback;
}
