export const ACHIEVEMENTS=[
 ['first-year','岁月启程','年龄达到1岁',s=>s.age>=1],['adult','成人礼','活到18岁',s=>s.age>=18],['middle','人到中年','活到45岁',s=>s.age>=45],['elder','古稀之年','活到70岁',s=>s.age>=70],['century','百岁人瑞','活到100岁',s=>s.age>=100],
 ['wealthy','白手起家','净资产达到100',s=>net(s)>=100],['tycoon','家业长青','净资产达到500',s=>net(s)>=500],['scholar','终身学习','学习技能达到60',s=>s.skills.学习>=60],['master','一代宗师','任一技能达到90',s=>Object.values(s.skills).some(v=>v>=90)],['poly','博学多才','五项技能达到30',s=>Object.values(s.skills).filter(v=>v>=30).length>=5],
 ['career','安身立命','拥有一份职业',s=>Boolean(s.career)],['promotion','事业有成','职业等级达到3',s=>(s.career?.level||0)>=3],['friends','高朋满座','拥有5位重要关系',s=>s.relationships.length>=5],['family','家族守护者','拥有伴侣或子女且亲密度高',s=>s.relationships.some(r=>['伴侣','子女'].includes(r.type)&&r.closeness>=70)],['single','独行亦从容','单身生活到60岁',s=>s.age>=60&&s.flags.includes('single-choice')],
 ['witness','历史见证者','经历3个重大历史事件',s=>s.timeline.filter(x=>x.type==='history').length>=3],['survivor','乱世求生者','经历危机历史事件并活到60岁',s=>s.age>=60&&s.flags.includes('history-crisis')],['healthy','身心康健','60岁时健康不低于75',s=>s.age>=60&&s.vitals.health>=75],['calm','从容一生','压力低于20并活到50岁',s=>s.age>=50&&s.vitals.stress<20],['reincarnate','再世为人','完成一次人生',s=>s.ended]
].map(([id,name,desc,test])=>({id,name,desc,test}));
const net=s=>s.economy.cash+s.economy.savings+s.economy.assets-s.economy.debt;
export function unlockAchievements(state){const unlocked=[];for(const a of ACHIEVEMENTS){if(!state.achievements.includes(a.id)&&a.test(state)){state.achievements.push(a.id);unlocked.push(a)}}return unlocked}
