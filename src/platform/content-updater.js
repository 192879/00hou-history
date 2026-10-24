const VERSION_URL='https://192879.github.io/00hou-history/game-data/version.json';
const CACHE_KEY='00hou-content-version';

export async function checkContentUpdates({timeout=5000}={}){
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeout);
  try{
    const url=location.protocol==='file:'||globalThis.Capacitor?.isNativePlatform?.()?VERSION_URL:'./game-data/version.json';
    const response=await fetch(url,{cache:'no-store',signal:controller.signal});if(!response.ok)throw new Error(`HTTP ${response.status}`);
    const manifest=await response.json();validateManifest(manifest);localStorage.setItem(CACHE_KEY,JSON.stringify(manifest));return{ok:true,manifest};
  }catch(error){
    const cached=readCached();return{ok:false,offline:true,manifest:cached,error:String(error?.message||error)};
  }finally{clearTimeout(timer)}
}
export function readCached(){try{const value=JSON.parse(localStorage.getItem(CACHE_KEY));validateManifest(value);return value}catch{return null}}
function validateManifest(m){if(!m||m.schemaVersion!==1||typeof m.contentVersion!=='string'||typeof m.minimumEngineVersion!=='string'||!Array.isArray(m.packs))throw new TypeError('invalid content manifest');for(const p of m.packs){if(!p||typeof p.id!=='string'||typeof p.url!=='string'||!p.url.endsWith('.json')||typeof p.sha256!=='string')throw new TypeError('invalid content pack')}return true}
