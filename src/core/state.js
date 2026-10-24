import { SeededRandom } from './random.js';

export const V2_SCHEMA_VERSION=2;
export const ATTR_NAMES=['体魄','才智','人缘','韧性','家境'];

export function createGameState({birthYear=2000,region='china',seed=Date.now(),name='无名旅人'}={}){
  const rng=new SeededRandom(seed);
  return {
    schemaVersion:V2_SCHEMA_VERSION,gameVersion:'2.0.0-alpha.2',id:cryptoId(rng),name,
    birthYear,currentYear:birthYear,age:0,region,alive:true,ended:false,
    rngState:rng.snapshot(),revision:0,lastSettlementYear:null,pendingEvent:null,
    attributes:{体魄:5,才智:5,人缘:5,韧性:5,家境:5},
    vitals:{health:100,energy:100,stress:5},
    economy:{cash:10,savings:0,assets:0,debt:0,annualIncome:0,annualExpense:6},
    career:null,skills:{学习:0,农业:0,商业:0,工艺:0,社交:0,管理:0,战斗:0,医疗:0,艺术:0,现代技术:0},
    talents:[],relationships:[],flags:[],timeline:[],achievements:[],createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()
  };
}
function cryptoId(rng){return `life-${Date.now().toString(36)}-${Math.floor(rng.next()*1e9).toString(36)}`}
export function validateGameState(s){
  if(!s||s.schemaVersion!==V2_SCHEMA_VERSION||!Number.isInteger(s.age)||s.age<0||!Number.isInteger(s.currentYear))return false;
  if(!Number.isInteger(s.rngState)||!s.attributes||!s.vitals||!s.economy||!Array.isArray(s.timeline))return false;
  return Object.values(s.attributes).every(Number.isFinite)&&Object.values(s.vitals).every(Number.isFinite)&&Object.values(s.economy).every(Number.isFinite);
}
