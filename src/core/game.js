import { addYears, displayYear } from './calendar.js';
import { SeededRandom } from './random.js';
import { validateGameState } from './state.js';

const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));

export function settleOneYear(input){
  if(!validateGameState(input))throw new TypeError('invalid game state');
  if(!input.alive||input.pendingEvent)return structuredClone(input);
  const s=structuredClone(input),rng=SeededRandom.restore(s.rngState);
  const nextYear=addYears(s.currentYear,1);
  if(s.lastSettlementYear===nextYear)return s;
  s.age+=1;s.currentYear=nextYear;
  const income=Number(s.economy.annualIncome)||0,expense=Number(s.economy.annualExpense)||0;
  s.economy.cash=round(s.economy.cash+income-expense);
  const ageLoss=s.age<40?0:s.age<60?.5:1.2;
  s.vitals.health=clamp(round(s.vitals.health-ageLoss+(rng.next()>.82?1:0)),0,100);
  s.vitals.stress=clamp(round(s.vitals.stress+(income<expense?2:-1)),0,100);
  s.rngState=rng.snapshot();s.lastSettlementYear=nextYear;s.revision+=1;s.updatedAt=new Date().toISOString();
  s.timeline.push({id:`year-${s.age}-${s.revision}`,age:s.age,year:nextYear,type:'year',text:`${displayYear(nextYear)}，你${s.age}岁。`,economyDelta:round(income-expense)});
  if(s.vitals.health<=0){s.alive=false;s.ended=true;s.timeline.push({id:`ending-${s.revision}`,age:s.age,year:nextYear,type:'ending',text:'你走完了这一生。'});}
  return s;
}
export function advanceYears(input,years,{stopOnEvent=true}={}){
  if(!Number.isInteger(years)||years<1)throw new RangeError('years must be positive');
  let s=structuredClone(input),advanced=0;
  while(advanced<years&&s.alive){s=settleOneYear(s);advanced++;if(stopOnEvent&&s.pendingEvent)break;}
  return {state:s,advanced,paused:Boolean(s.pendingEvent)};
}
const round=n=>Math.round(n*100)/100;
