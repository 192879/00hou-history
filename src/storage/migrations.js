import { createGameState } from '../core/state.js';

export const LEGACY_KEY='00hou-save-v1';
export function inspectLegacySave(raw){
  try{const v=typeof raw==='string'?JSON.parse(raw):raw;if(!v||v.version!==1||!Array.isArray(v.records))return null;return v}catch{return null}
}
export function migrateLegacyToArchive(raw){
  const old=inspectLegacySave(raw);if(!old)return null;
  return {kind:'v1-archive',schemaVersion:1,readOnly:true,importedAt:new Date().toISOString(),summary:{archiveIndex:old.archiveIndex,screen:old.screen,difficulty:old.difficulty,attributes:old.attrs,records:old.records},original:old};
}
export function startV2FromLegacy(raw){
  const old=inspectLegacySave(raw);if(!old)return null;
  const years=Array.from({length:31},(_,i)=>i===10?1:-1000+i*100);
  const birthYear=years[old.archiveIndex]??2000;
  const state=createGameState({birthYear});
  state.legacyArchive=migrateLegacyToArchive(old);
  return state;
}
