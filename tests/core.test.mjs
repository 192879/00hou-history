import test from 'node:test';
import assert from 'node:assert/strict';
import { addYears,displayYear } from '../src/core/calendar.js';
import { SeededRandom } from '../src/core/random.js';
import { createGameState } from '../src/core/state.js';
import { advanceYears } from '../src/core/game.js';

test('calendar skips nonexistent year zero',()=>{assert.equal(addYears(-1,1),1);assert.doesNotMatch(displayYear(0),/公元0年/)});
test('seeded random restores exactly',()=>{const a=new SeededRandom(42);a.next();const state=a.snapshot(),expected=a.next();const b=SeededRandom.restore(state);assert.equal(b.next(),expected)});
test('fast-forward settles every individual year',()=>{const start=createGameState({birthYear:-1,seed:42});start.economy.annualIncome=10;const {state,advanced}=advanceYears(start,5);assert.equal(advanced,5);assert.equal(state.age,5);assert.equal(state.currentYear,5);assert.equal(state.timeline.filter(x=>x.type==='year').length,5);assert.equal(state.economy.cash,30)});
test('same settled state is not mutated',()=>{const start=createGameState({seed:7});const one=advanceYears(start,1).state;const copy=structuredClone(one);assert.deepEqual(one,copy)});
