import test from 'node:test';
import assert from 'node:assert/strict';
import { createGameState,validateGameState } from '../src/core/state.js';
import { advance,prepareNewLife,resolveEvent,changeCareer,endingSummary } from '../src/core/engine.js';
import { SeededRandom } from '../src/core/random.js';
import { TALENTS,rollTalentCandidates,resolveTalentCombos } from '../src/data/talents.js';
import { CAREERS,availableCareers } from '../src/data/careers.js';
import { eventsForYear,REGIONS } from '../src/data/history.js';
import { ORIGINS,LIFE_GOALS } from '../src/data/origins.js';

test('V2 content minimums are real data',()=>{assert.equal(TALENTS.length,60);assert.equal(CAREERS.length,20);assert.equal(REGIONS.length,4)});
test('talent roll is unique and combos unlock centrally',()=>{const rolled=rollTalentCandidates(new SeededRandom(99),6);assert.equal(new Set(rolled.map(x=>x.id)).size,6);assert.deepEqual(resolveTalentCombos(['t01','t11']),['t57'])});
test('careers respect historical era',()=>{const ancient=createGameState({birthYear:700});ancient.age=20;ancient.currentYear=720;assert.equal(availableCareers(ancient).some(x=>x.id==='programmer'),false);const modern=createGameState({birthYear:2000});modern.age=25;modern.currentYear=2025;modern.skills.现代技术=20;assert.equal(availableCareers(modern).some(x=>x.id==='programmer'),true)});
test('history events are region scoped',()=>{assert.ok(eventsForYear(755,'china').some(x=>x.id==='anshi'));assert.equal(eventsForYear(755,'europe').some(x=>x.id==='anshi'),false)});
test('one seeded life can play from birth to ending without NaN',()=>{
 let s=prepareNewLife(createGameState({birthYear:1900,region:'china',seed:123,name:'测试者'}),['t01','t11','t04']);
 let guard=0;
 while(s.alive&&guard++<140){const out=advance(s,10);s=out.state;if(s.pendingEvent)s=resolveEvent(s,0);if(s.age===18&&!s.career){s.skills.学习=30;const teacher=availableCareers(s).find(x=>x.id==='teacher');if(teacher)s=changeCareer(s,teacher.id)}assert.ok(validateGameState(s));for(const group of [s.attributes,s.vitals,s.economy,s.skills])assert.ok(Object.values(group).every(Number.isFinite))}
 assert.equal(s.ended,true);assert.ok(s.timeline.length>=s.age);assert.ok(endingSummary(s).score>0);
});
test('restoring the same pending state cannot reroll an event',()=>{let s=prepareNewLife(createGameState({birthYear:2000,region:'china',seed:777}),['t02','t03']);while(!s.pendingEvent&&s.age<30)s=advance(s,1).state;const copy=structuredClone(s);assert.deepEqual(copy.pendingEvent,s.pendingEvent);const a=resolveEvent(s,0),b=resolveEvent(copy,0);assert.deepEqual(a,b)});
test('origin, identity and life goal are persisted into a prepared life',()=>{const s=prepareNewLife(createGameState({origin:'scholar',goal:'knowledge',gender:'女性',subregion:'江南',seed:9}),[]);assert.equal(ORIGINS.length,4);assert.equal(LIFE_GOALS.length,5);assert.equal(s.origin,'scholar');assert.equal(s.goal,'knowledge');assert.equal(s.gender,'女性');assert.equal(s.subregion,'江南');assert.equal(s.skills.学习,5);assert.ok(s.relationships[0].memory.includes('见证你出生'))});
test('education choice schedules and later resolves a deterministic consequence',()=>{let s=prepareNewLife(createGameState({birthYear:2000,region:'europe',seed:44}),[]);while(s.age<12){s=advance(s,1).state;if(s.pendingEvent)s=resolveEvent(s,0)}assert.equal(s.education,'基础教育');assert.ok(s.delayedEffects.some(x=>x.type==='education-return'&&x.dueAge===20));while(s.age<20){s=advance(s,1).state;if(s.pendingEvent&&s.age<20)s=resolveEvent(s,0)}assert.equal(s.pendingEvent?.id,'education-return-20');const before=s.reputation;s=resolveEvent(s,0);assert.ok(s.reputation>before)});
