import { validateGameState } from '../core/state.js';
import { LEGACY_KEY, migrateLegacyToArchive } from './migrations.js';

export const SLOT_IDS=['auto','manual-1','manual-2','manual-3'];
const DB='00hou-v2-saves',STORE='slots',BACKUP_KEY='00hou-save-v1-backup';

export function createSaveRepository(adapter=createBrowserAdapter()){
  async function write(slot,state,meta={}){
    if(!SLOT_IDS.includes(slot))throw new RangeError('unknown slot');
    const payload=structuredClone(state),checksum=await digest(payload);
    const envelope={format:'00hou-save',schemaVersion:2,slot,checksum,savedAt:new Date().toISOString(),meta,payload};
    await adapter.set(slot,envelope);return envelope;
  }
  async function read(slot){
    const envelope=await adapter.get(slot);if(!envelope)return null;
    if(!isEnvelope(envelope)||await digest(envelope.payload)!==envelope.checksum)return {corrupt:true,slot,savedAt:envelope.savedAt??null};
    return envelope;
  }
  return {
    writeAuto:(state,meta)=>write('auto',state,meta),writeManual:(index,state,meta)=>write(`manual-${index}`,state,meta),read,
    list:async()=>Promise.all(SLOT_IDS.map(read)),remove:slot=>adapter.remove(slot),
    exportAll:async()=>({format:'00hou-backup',schemaVersion:2,exportedAt:new Date().toISOString(),slots:(await Promise.all(SLOT_IDS.map(read))).filter(Boolean)}),
    importAll:async backup=>{if(!backup||backup.format!=='00hou-backup'||!Array.isArray(backup.slots))throw new TypeError('invalid backup');let count=0;for(const e of backup.slots){if(isEnvelope(e)&&await digest(e.payload)===e.checksum){await adapter.set(e.slot,e);count++}}return count;},
    preserveLegacy:async()=>{const raw=localStorage.getItem(LEGACY_KEY);if(!raw)return null;if(!localStorage.getItem(BACKUP_KEY))localStorage.setItem(BACKUP_KEY,raw);const archive=migrateLegacyToArchive(raw);if(archive)await adapter.set('legacy-v1',archive);return archive;}
  };
}
function isEnvelope(e){return e&&e.format==='00hou-save'&&SLOT_IDS.includes(e.slot)&&validateGameState(e.payload)&&typeof e.checksum==='string'}
async function digest(value){
  const bytes=new TextEncoder().encode(stable(value));
  if(globalThis.crypto?.subtle){const hash=await crypto.subtle.digest('SHA-256',bytes);return [...new Uint8Array(hash)].map(x=>x.toString(16).padStart(2,'0')).join('')}
  let h=2166136261;for(const b of bytes){h^=b;h=Math.imul(h,16777619)}return `fnv1a-${(h>>>0).toString(16)}`;
}
function stable(v){if(v===null||typeof v!=='object')return JSON.stringify(v);if(Array.isArray(v))return `[${v.map(stable).join(',')}]`;return `{${Object.keys(v).sort().map(k=>`${JSON.stringify(k)}:${stable(v[k])}`).join(',')}}`}
export function createMemoryAdapter(){const map=new Map();return{get:async k=>structuredClone(map.get(k)??null),set:async(k,v)=>map.set(k,structuredClone(v)),remove:async k=>map.delete(k)}}
function createBrowserAdapter(){
  if(typeof indexedDB==='undefined')return{get:async k=>JSON.parse(localStorage.getItem(`${DB}:${k}`)||'null'),set:async(k,v)=>localStorage.setItem(`${DB}:${k}`,JSON.stringify(v)),remove:async k=>localStorage.removeItem(`${DB}:${k}`)};
  const open=()=>new Promise((resolve,reject)=>{const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>r.result.createObjectStore(STORE);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});
  const tx=async(mode,fn)=>{const db=await open();return new Promise((resolve,reject)=>{const t=db.transaction(STORE,mode),req=fn(t.objectStore(STORE));req.onsuccess=()=>resolve(req.result??null);req.onerror=()=>reject(req.error);t.oncomplete=()=>db.close()})};
  return{get:k=>tx('readonly',s=>s.get(k)),set:(k,v)=>tx('readwrite',s=>s.put(v,k)),remove:k=>tx('readwrite',s=>s.delete(k))};
}
