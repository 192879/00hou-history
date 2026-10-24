import { addYears,displayYear } from './calendar.js';
import { SeededRandom } from './random.js';
import { availableCareers,CAREERS } from '../data/careers.js';
import { eventsForYear } from '../data/history.js';
import { eligibleLifeEvents } from '../data/life-events.js';
import { TALENTS,resolveTalentCombos } from '../data/talents.js';
import { unlockAchievements } from '../data/achievements.js';
import { ORIGINS } from '../data/origins.js';

const clamp=(v,min=0,max=100)=>Math.max(min,Math.min(max,v));
const round=v=>Math.round(v*100)/100;

export function prepareNewLife(state,talentIds=[]){
 const s=structuredClone(state);s.talents=[...talentIds,...resolveTalentCombos(talentIds)];
 s.delayedEffects??=[];s.personality??={勇气:50,谨慎:50,同理心:50};s.reputation??=0;s.education??='未启蒙';
 const origin=ORIGINS.find(x=>x.id===s.origin)||ORIGINS[0];s.origin=origin.id;s.economy.cash=Math.max(0,s.economy.cash+origin.cash);
 for(const [a,v] of Object.entries(origin.attrs))s.attributes[a]=clamp(s.attributes[a]+v,0,20);for(const [k,v] of Object.entries(origin.skills))s.skills[k]=clamp(s.skills[k]+v);
 s.relationships.push({id:'parent-1',name:'家中长辈',type:'父母',age:25,closeness:60,health:100,active:true,memory:['见证你出生']});
 for(const id of s.talents){const t=TALENTS.find(x=>x.id===id);if(t)s.attributes[t.attr]=clamp(s.attributes[t.attr]+t.value,0,20)}
 if(s.talents.includes('t05'))s.economy.cash+=20;if(s.talents.includes('t30'))s.skills.学习+=8;
 s.timeline.push({id:'birth',age:0,year:s.birthYear,type:'birth',text:`${displayYear(s.birthYear)}，你出生了。`});return s;
}
export function advance(state,years=1){
 let s=structuredClone(state),advanced=0;
 while(advanced<years&&s.alive&&!s.pendingEvent){s=settle(s);advanced++;}
 return{state:s,advanced,paused:Boolean(s.pendingEvent)};
}
function settle(state){
 const s=structuredClone(state),rng=SeededRandom.restore(s.rngState),year=addYears(s.currentYear,1);
 if(s.lastSettlementYear===year)return s;
 s.age++;s.currentYear=year;s.revision++;s.lastSettlementYear=year;
  settleCareer(s,rng);settleEconomy(s);settleHealth(s,rng);settleRelationships(s,rng);applyDelayedEffects(s);
 s.timeline.push({id:`year-${s.age}-${s.revision}`,age:s.age,year,type:'year',text:`${displayYear(year)}，${s.age}岁。`,cash:s.economy.cash,health:s.vitals.health});
 const historical=eventsForYear(year,s.region).find(e=>!s.flags.includes(`history:${e.id}`)),milestone=educationMilestone(s);
 if(!s.pendingEvent&&historical){s.pendingEvent=historyToEvent(historical);s.flags.push(`history:${historical.id}`);if(historical.type==='crisis')s.flags.push('history-crisis')}
 else if(!s.pendingEvent&&milestone){s.pendingEvent=milestone;s.flags.push(`education:${s.age}`)}
 else if(!s.pendingEvent&&s.age>=7&&rng.next()<eventChance(s)){const pool=eligibleLifeEvents(s).filter(e=>!s.flags.includes(`event:${e.id}:${Math.floor(s.age/10)}`));if(pool.length){const e=rng.pick(pool);s.pendingEvent=structuredClone(e);s.flags.push(`event:${e.id}:${Math.floor(s.age/10)}`)}}
 if(!s.pendingEvent&&!s.career&&s.age>=16&&s.age<=60&&rng.next()<.34)s.pendingEvent=careerEvent(s);
 if(s.vitals.health<=0||mortality(s,rng)){s.alive=false;s.ended=true;s.pendingEvent=null;s.endReason=s.vitals.health<=0?'健康耗尽':'寿终';s.timeline.push({id:`ending-${s.revision}`,age:s.age,year,type:'ending',text:`${displayYear(year)}，你走完了${s.age}年的人生。`})}
 s.rngState=rng.snapshot();s.updatedAt=new Date().toISOString();unlockAchievements(s);return s;
}
function settleCareer(s,rng){
 if(!s.career)return;
 const c=CAREERS.find(x=>x.id===s.career.id);if(!c){s.career=null;return}
 s.economy.annualIncome=round(c.income*(1+(s.career.level-1)*.28));s.vitals.stress=clamp(s.vitals.stress+c.stress*.35);
 s.skills[c.skill]=clamp(s.skills[c.skill]+1+(s.talents.includes('t38')?1:0));s.career.experience++;
 if(s.skills[c.skill]>=c.promotionSkill+(s.career.level-1)*12&&s.career.level<5){s.career.level++;s.timeline.push({id:`promotion-${s.revision}`,age:s.age,year:s.currentYear,type:'career',text:`你在${c.name}职业中晋升到${s.career.level}级。`})}
 if(rng.next()<c.risk/450){s.timeline.push({id:`career-risk-${s.revision}`,age:s.age,year:s.currentYear,type:'career',text:`${c.name}工作出现波折，你承受了一段压力。`});s.vitals.stress=clamp(s.vitals.stress+8)}
}
function settleEconomy(s){
 const ageCost=s.age<16?4:s.age<60?8:6,discount=s.talents.includes('t16')?.85:1;
 s.economy.annualExpense=round(ageCost*discount+(s.relationships.filter(r=>r.type==='子女'&&r.active).length*2));
 s.economy.cash=round(s.economy.cash+s.economy.annualIncome-s.economy.annualExpense);
 if(s.economy.cash<0){s.economy.debt=round(s.economy.debt+Math.abs(s.economy.cash));s.economy.cash=0;s.vitals.stress=clamp(s.vitals.stress+4)}
 if(s.economy.cash>30){const save=round((s.economy.cash-30)*.25);s.economy.cash-=save;s.economy.savings=round(s.economy.savings+save)}
 s.economy.savings=round(s.economy.savings*(s.talents.includes('t52')?1.04:1.015));
}
function settleHealth(s,rng){
 const ageLoss=s.age<35?0:s.age<55?.45:s.age<75?1:1.8,stressLoss=Math.max(0,s.vitals.stress-55)/45;
 s.vitals.health=clamp(round(s.vitals.health-ageLoss-stressLoss+(s.talents.includes('t25')?.5:0)+(rng.next()>.92?1:0)));
 s.vitals.energy=clamp(round(100-s.age*.35-s.vitals.stress*.15));
 s.vitals.stress=clamp(round(s.vitals.stress+(s.economy.debt>0?2:-1)-(s.talents.includes('t15')?1:0)));
 if(s.talents.includes('t04')&&s.vitals.health<25)s.vitals.health=clamp(s.vitals.health+3);
}
function settleRelationships(s,rng){for(const r of s.relationships){if(!r.active)continue;r.age++;r.closeness=clamp(r.closeness+(rng.next()>.55?1:-1));if(r.age>90&&rng.next()<.08){r.active=false;s.timeline.push({id:`farewell-${r.id}-${s.revision}`,age:s.age,year:s.currentYear,type:'family',text:`你送别了${r.name}。`})}}}
function applyDelayedEffects(s){
 const due=(s.delayedEffects||[]).filter(x=>x.dueAge<=s.age&&!x.resolved);for(const d of due){
  if(s.pendingEvent)break;d.resolved=true;
  if(d.type==='friend-return')s.pendingEvent={id:`friend-return-${d.dueAge}`,title:'旧友重逢',text:'多年前受到你帮助的朋友再次出现，并记得当时的善意。',choices:[{label:'共同面对新的机会',effects:{cash:8,relation:8,reputation:4}},{label:'只叙旧，不谈利益',effects:{relation:12,stress:-4,personality:{同理心:4}}}]};
  if(d.type==='education-return')s.pendingEvent={id:`education-return-${d.dueAge}`,title:'学习开始回报你',text:'多年积累的学习能力，让你在成年后遇到了新的入口。',choices:[{label:'抓住进阶机会',effects:{skill:'学习',skillDelta:8,reputation:5,stress:4}},{label:'将知识用于现实生计',effects:{cash:10,skill:'管理',skillDelta:4}}]};
 }
}
function educationMilestone(s){
 if(s.flags.includes(`education:${s.age}`))return null;
 if(s.age===7)return{id:'education-7',title:'第一次启蒙',text:'家庭必须决定如何分配有限的教育资源。',choices:[{label:'学习识字与基础知识',effects:{skill:'学习',skillDelta:6,education:'启蒙',cash:-2}},{label:'跟随家人学习生活技能',effects:{skill:'农业',skillDelta:5,education:'生活教育',relation:3}}]};
 if(s.age===12)return{id:'education-12',title:'少年道路',text:'早年的积累开始分出方向，这次选择会影响成年职业。',choices:[{label:'继续系统求学',effects:{skill:'学习',skillDelta:9,education:'基础教育',cash:-4,delayed:{after:8,type:'education-return'}}},{label:'拜师学习手艺',effects:{skill:'工艺',skillDelta:8,education:'学徒经历'}},{label:'帮助家庭劳作',effects:{skill:'农业',skillDelta:7,cash:4,relation:4}}]};
 if(s.age===16)return{id:'education-16',title:'走向成年',text:'你需要在深造、谋生和探索之间选择。过去的教育会改变成功机会。',choices:[{label:'继续深造',effects:{skill:'学习',skillDelta:10,education:'进阶教育',cash:-7}},{label:'准备就业',effects:{skill:'管理',skillDelta:4,cash:3}},{label:'外出见世面',effects:{skill:'社交',skillDelta:6,stress:2,personality:{勇气:4}}}]};return null;
}
function mortality(s,rng){if(s.age<62)return false;const base=(s.age-58)/850+(100-s.vitals.health)/1400;return rng.next()<base*(s.talents.includes('t56')?.55:1)}
function eventChance(s){return .18+(s.vitals.stress>65?.08:0)+(s.talents.includes('t45')?.03:0)}
function historyToEvent(e){return{id:`history-${e.id}`,title:e.name,text:e.background,history:true,historyType:e.type,choices:e.type==='crisis'?[{label:'优先保护家人与健康',effects:{cash:-5,health:3,relation:5}},{label:'寻找新的生计',effects:{cash:4,stress:5,skill:'商业',skillDelta:2}},{label:'迁往相对安全之地',effects:{cash:-8,stress:2,attribute:'韧性',attrDelta:1}}]:[{label:'学习并适应变化',effects:{skill:'学习',skillDelta:4,stress:2}},{label:'抓住新机会',effects:{cash:7,stress:4,skill:'商业',skillDelta:2}},{label:'守住现有生活',effects:{stress:-2,relation:3}}]}}
function careerEvent(s){const careers=availableCareers(s).slice(0,6);return{id:'career-choice',title:'职业道路',text:'你可以选择一份符合时代与能力的职业，或继续积累。',careerChoices:careers,choices:careers.map(c=>({label:`成为${c.name}`,careerId:c.id,effects:{stress:2}})).concat([{label:'暂不入职',effects:{skill:'学习',skillDelta:2}}])}}
export function resolveEvent(state,index){
 const s=structuredClone(state),event=s.pendingEvent,choice=event?.choices?.[index];if(!event||!choice)throw new RangeError('invalid event choice');
 if(choice.careerId){const c=CAREERS.find(x=>x.id===choice.careerId);s.career={id:c.id,name:c.name,level:1,experience:0};s.economy.annualIncome=c.income}
 applyEffects(s,choice.effects||{});s.timeline.push({id:`decision-${s.revision}-${event.id}`,age:s.age,year:s.currentYear,type:event.history?'history':'decision',title:event.title,text:choice.label});
 s.pendingEvent=null;s.revision++;s.updatedAt=new Date().toISOString();unlockAchievements(s);return s;
}
function applyEffects(s,e){
 if(e.cash)s.economy.cash=round(Math.max(0,s.economy.cash+e.cash));if(e.assets)s.economy.assets=round(Math.max(0,s.economy.assets+e.assets));
 if(e.health)s.vitals.health=clamp(s.vitals.health+e.health);if(e.stress)s.vitals.stress=clamp(s.vitals.stress+e.stress);
 if(e.skill)s.skills[e.skill]=clamp(s.skills[e.skill]+(e.skillDelta||1));if(e.attribute)s.attributes[e.attribute]=clamp(s.attributes[e.attribute]+(e.attrDelta||1),0,20);
 if(e.education)s.education=e.education;if(e.reputation)s.reputation=clamp(s.reputation+e.reputation);if(e.personality)for(const [k,v] of Object.entries(e.personality))s.personality[k]=clamp((s.personality[k]||50)+v);
 if(e.flag&&!s.flags.includes(e.flag))s.flags.push(e.flag);if(e.relation)for(const r of s.relationships)r.closeness=clamp(r.closeness+e.relation);
 if(e.addPartner&&!s.relationships.some(r=>r.type==='伴侣'&&r.active))s.relationships.push(makeNpc(s,'伴侣',s.age));
 if(e.addChild)s.relationships.push(makeNpc(s,'子女',0));
 if(e.addFriend&&!s.relationships.some(r=>r.type==='朋友'&&r.active))s.relationships.push({...makeNpc(s,'朋友',s.age),name:'旧友',memory:['你曾在少年时伸出援手']});
 if(e.delayed)s.delayedEffects.push({id:`delayed-${s.revision}-${s.delayedEffects.length}`,dueAge:s.age+e.delayed.after,type:e.delayed.type,resolved:false});
}
function makeNpc(s,type,age){return{id:`npc-${s.revision}-${s.relationships.length}`,name:type==='伴侣'?'伴侣':'孩子',type,age,closeness:60,health:100,active:true,memory:[]}}
export function changeCareer(state,careerId){const s=structuredClone(state),c=availableCareers(s).find(x=>x.id===careerId);if(!c)throw new Error('career unavailable');s.career={id:c.id,name:c.name,level:1,experience:0};s.economy.annualIncome=c.income;s.timeline.push({id:`career-${s.revision}`,age:s.age,year:s.currentYear,type:'career',text:`你开始从事${c.name}。`});s.revision++;return s}
export function endingSummary(s){
 const net=round(s.economy.cash+s.economy.savings+s.economy.assets-s.economy.debt),relations=s.relationships.filter(r=>r.closeness>=60).length,skills=Math.max(...Object.values(s.skills));
 let title='平凡而幸福';if(s.age>=100)title='百岁人瑞';else if(s.flags.includes('history-crisis')&&s.age>=60)title='乱世求生者';else if(skills>=90)title='一代宗师';else if(net>=300)title='白手起家';else if(s.career?.id==='programmer'||s.career?.id==='researcher')title='科技先行者';else if(relations>=3)title='家族守护者';
 const goalBonus=s.goal==='wealth'?net*2:s.goal==='knowledge'?skills*4:s.goal==='family'?relations*100:s.goal==='longevity'?s.age*10:Math.max(0,100-s.vitals.stress)*2;
 const score=Math.round(s.age*20+net*3+skills*5+relations*120+s.achievements.length*100+goalBonus);return{title,score,net,relations,skills,goal:s.goal};
}
