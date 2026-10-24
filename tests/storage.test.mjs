import test from 'node:test';
import assert from 'node:assert/strict';
import { createGameState } from '../src/core/state.js';
import { createMemoryAdapter,createSaveRepository,SLOT_IDS } from '../src/storage/saves.js';
import { inspectLegacySave,migrateLegacyToArchive } from '../src/storage/migrations.js';

test('auto and three manual slots round trip',async()=>{const repo=createSaveRepository(createMemoryAdapter()),s=createGameState({seed:1});await repo.writeAuto(s);for(let i=1;i<=3;i++)await repo.writeManual(i,s);const slots=await repo.list();assert.equal(slots.length,SLOT_IDS.length);assert.ok(slots.every(x=>x&&!x.corrupt));assert.deepEqual(slots[0].payload,s)});
test('full backup round trip',async()=>{const a=createSaveRepository(createMemoryAdapter()),s=createGameState({seed:2});await a.writeAuto(s);const backup=await a.exportAll(),b=createSaveRepository(createMemoryAdapter());assert.equal(await b.importAll(backup),1);assert.deepEqual((await b.read('auto')).payload,s)});
test('V1 save remains a read-only archive',()=>{const old={version:1,archiveIndex:3,screen:'result',difficulty:'normal',attrs:{体魄:5},records:[{event:'测试'}]};assert.ok(inspectLegacySave(old));const archive=migrateLegacyToArchive(old);assert.equal(archive.readOnly,true);assert.deepEqual(archive.original,old);assert.equal(inspectLegacySave({bad:true}),null)});
