'use strict';

const SAVE_KEY = '00hou-save-v1';
const APP_VERSION = 1;
const ATTRS = ['体魄','才智','人缘','韧性','家境'];
const STAGES = [
  {name:'童年',age:'0—15岁',icon:'🪁'},
  {name:'成年',age:'16—25岁',icon:'🌱'},
  {name:'事业',age:'26—40岁',icon:'⚙️'},
  {name:'家庭',age:'30—50岁',icon:'🏠'},
  {name:'中年',age:'41—60岁',icon:'🧭'},
  {name:'晚年',age:'61岁以后',icon:'🌌'}
];

const ARCHIVES = [
[-1000,'西周初期','周王朝分封体系逐步成形，青铜礼器与宗法礼制影响贵族和聚落生活。'],
[-900,'西周中期','农业与手工业延续发展，礼乐秩序之下，普通人的生活紧连土地与宗族。'],
[-800,'西周晚期','王室势力衰微，犬戎压力加剧；前771年西周覆亡，王室东迁。'],
[-700,'春秋争霸','诸侯竞争、会盟与战争频繁，铁器与牛耕逐渐改变生产方式。'],
[-600,'春秋变革','旧礼制持续松动，思想交流活跃，孔子生活于这一时代后期。'],
[-500,'战国序幕','诸侯兼并加速，各国变法图强，士阶层与私学兴起。'],
[-400,'战国变法','商鞅变法等制度改革推动中央集权，战争规模显著扩大。'],
[-300,'统一前夜','七雄争战趋于终局；前221年秦完成统一，推行郡县与书同文。'],
[-200,'汉初休养','秦亡汉兴，汉初推行休养生息；随后汉武帝时期国力扩张。'],
[-100,'西汉后期','丝绸之路沟通欧亚，外戚与政治矛盾也逐渐累积。'],
[0,'两汉更替','王莽建立新朝后社会动荡，刘秀于25年重建汉室。'],
[100,'东汉中期','造纸术改进，商旅与庄园经济发展；后期党争与边患渐重。'],
[200,'三国时代','黄巾起义后群雄割据，魏蜀吴鼎立，长期战争改变人口分布。'],
[300,'两晋动荡','西晋短暂统一后爆发内乱，北方人口大规模南迁。'],
[400,'南北朝并立','南北政权长期对峙，民族交融加深，佛教广泛传播。'],
[500,'南北朝后期','北魏改革与政权更迭交织，隋于589年结束长期分裂。'],
[600,'隋唐之际','大运河贯通南北；隋末动乱后唐朝建立并走向盛世。'],
[700,'盛唐气象','长安成为国际都会；755年安史之乱成为唐代由盛转衰的节点。'],
[800,'晚唐变局','藩镇割据、宦官专权与民变相继出现，唐朝于907年结束。'],
[900,'五代十国','政权频繁更替，南方经济持续发展；960年北宋建立。'],
[1000,'北宋繁华','城市商业、印刷与科技兴盛，科举扩大，但边疆压力长期存在。'],
[1100,'宋金对峙','靖康之变后南宋建立，经济重心南移，海上贸易繁荣。'],
[1200,'蒙古兴起','蒙古诸部统一并快速扩张；1279年元完成全国统一。'],
[1300,'元末明初','跨区域交流活跃，元末灾荒与起义并起，1368年明建立。'],
[1400,'明代前期','永乐迁都北京、郑和下西洋，中央集权与海陆交流并行。'],
[1500,'明代中后期','白银经济与海外贸易扩展，新作物传入，社会文化活跃。'],
[1600,'明清鼎革','气候、财政与战争危机叠加；1644年前后王朝更替。'],
[1700,'清代中期','人口增长、疆域巩固，传统农业社会达到高峰也面临资源压力。'],
[1800,'近代冲击','鸦片战争后条约体系形成，太平天国与洋务运动相继出现。'],
[1900,'现代中国','革命、战争、建设与改革接连发生，社会结构经历深刻转型。'],
[2000,'数字时代','互联网、移动设备与全球化塑造日常生活，新技术快速改变成长路径。']
].map(([year,title,text],index)=>({year,title,text,index}));

const ORIGINS = [
 {name:'耕读之家',desc:'重视积累与学习，日子不富裕但根基稳。',bonus:{体魄:1,才智:2,人缘:0,韧性:1,家境:0}},
 {name:'行旅商户',desc:'随人潮与商路迁徙，很早学会察言观色。',bonus:{体魄:0,才智:1,人缘:2,韧性:0,家境:1}},
 {name:'军户匠门',desc:'纪律与手艺是家族赖以生存的资本。',bonus:{体魄:2,才智:0,人缘:0,韧性:2,家境:0}},
 {name:'寒门孤苗',desc:'资源稀少，却拥有超乎常人的求生意志。',bonus:{体魄:0,才智:0,人缘:1,韧性:3,家境:0}}
];

const TALENTS = [
 ['过目不忘','才智',2],['天生牛马','体魄',2],['社交悍匪','人缘',2],['打不倒我','韧性',2],['含着钥匙','家境',2],
 ['危机嗅觉','韧性',1],['巧手天成','才智',1],['人见人爱','人缘',1],['耐力惊人','体魄',1],['精打细算','家境',1],
 ['乱世游侠','体魄',1],['纸上乾坤','才智',1],['左右逢源','人缘',1],['绝处逢生','韧性',1],['家业有方','家境',1],
 ['好奇宝宝','才智',1],['邻里之星','人缘',1],['早睡早起','体魄',1],['情绪稳定','韧性',1],['祖传秘方','家境',1],
 ['时代弄潮儿','才智',1],['贵人雷达','人缘',1],['钢铁胃','体魄',1],['存档体质','韧性',2]
].map((t,id)=>({id,name:t[0],attr:t[1],value:t[2],rare:t[2]>1}));

const DIFFICULTIES = {
 easy:{name:'轻松渡劫',points:12,risk:-.09,score:.85,desc:'资源更多，坏事概率较低'},
 normal:{name:'凡人修行',points:9,risk:0,score:1,desc:'标准难度，命运有起有落'},
 hard:{name:'逆天改命',points:6,risk:.1,score:1.25,desc:'资源紧缺，高风险高评分'}
};

const EVENTS = [
 [
  {title:'启蒙之门',text:'家中只能支持一种启蒙方式，你的选择会塑造最初的眼界。',choices:[['跟随长辈劳作',{体魄:2,韧性:1},'你从汗水里学会了生存。'],['争取读书识字',{才智:3,家境:-1},'知识打开了一扇窄小却明亮的窗。'],['在邻里间跑腿',{人缘:2,家境:1},'你很快记住了每张面孔。']]},
  {title:'灾年余波',text:'收成或供应出了问题，家里的储备越来越薄。',choices:[['主动节衣缩食',{韧性:2,体魄:-1},'你学会把有限的东西留给更需要的人。'],['寻找额外食物',{体魄:1,才智:1},'一次大胆尝试缓解了燃眉之急。'],['向邻里互助',{人缘:2,家境:1},'人情成为比钱更可靠的储备。']]},
  {title:'陌生世界',text:'一次迁徙或环境变化，把你推入完全陌生的人群。',choices:[['先观察再融入',{才智:1,韧性:2},'你读懂了新环境的规则。'],['主动结交伙伴',{人缘:3},'笑容帮你跨过了隔阂。'],['埋头练本事',{体魄:1,才智:2},'本领让你拥有立足之地。']]}
 ],
 [
  {title:'成人岔路',text:'成年礼之后，你必须决定先把力气投向哪里。',choices:[['拜师学艺',{才智:2,家境:1},'漫长训练换来了安身之技。'],['远行见世面',{人缘:2,韧性:1},'地图之外，是复杂而鲜活的人。'],['留守照顾家人',{人缘:1,家境:2},'你守住了最重要的关系。']]},
  {title:'风口之上',text:'新制度、新市场或新技术出现，一切尚无定论。',choices:[['大胆投身其中',{才智:2,家境:2,韧性:-1},'你踩中了浪头，也付出了代价。'],['稳妥积累',{韧性:2,家境:1},'慢一步让根基更加牢固。'],['组织同伴尝试',{人缘:2,才智:1},'众人的判断弥补了个人盲点。']]},
  {title:'情义考验',text:'朋友卷入麻烦，希望你站在身边。',choices:[['不问代价相助',{人缘:3,家境:-1},'这份情义被牢牢记住。'],['先查明真相',{才智:2,人缘:1},'冷静让事情没有继续恶化。'],['劝其及时止损',{韧性:2},'有时拒绝也是一种保护。']]}
 ],
 [
  {title:'立业抉择',text:'几条道路同时出现：稳定、冒险，或创造自己的道路。',choices:[['进入稳定行当',{家境:2,韧性:1},'规律的日子让积累开始发生。'],['投身时代新业',{才智:2,家境:2},'变化让你疲惫，也给你机会。'],['联合伙伴创业',{人缘:2,家境:2,韧性:-1},'你们在争执中把想法做成了现实。']]},
  {title:'权力与原则',text:'只要稍微违背原则，你就能换来一次重要机会。',choices:[['守住底线',{韧性:3,家境:-1},'失去的机会换来了心安。'],['顺势而为',{家境:3,人缘:-1},'捷径很快，但留下了阴影。'],['寻找第三条路',{才智:2,人缘:1},'你用耐心拆开了两难。']]},
  {title:'事业低谷',text:'外部环境骤变，多年的投入可能付诸东流。',choices:[['及时转向',{才智:2,韧性:1},'承认变化不是认输。'],['坚持到底',{韧性:3,体魄:-1},'你把最后的筹码押给了信念。'],['求助旧识',{人缘:2,家境:1},'曾经种下的人情结出了果。']]}
 ],
 [
  {title:'屋檐之下',text:'事业与亲密关系同时需要你，时间却只够顾全一边。',choices:[['把时间留给家人',{人缘:3,家境:-1},'缺席的收益，换成了在场的记忆。'],['冲刺事业',{家境:3,人缘:-1},'物质更宽裕，关系却需要修补。'],['坦诚协商分工',{才智:1,人缘:2},'说开以后，你们成为真正的队友。']]},
  {title:'代际分歧',text:'你和长辈或晚辈对未来有截然不同的想法。',choices:[['坚持自己的判断',{韧性:2,人缘:-1},'边界更清晰，空气也一度凝固。'],['认真听完再决定',{人缘:2,才智:1},'理解并不等于全盘接受。'],['用结果证明',{家境:2,韧性:1},'行动替你说了最有力的话。']]},
  {title:'共同难关',text:'家里遭遇突发困境，所有人都在等一个决定。',choices:[['独自扛下',{韧性:2,体魄:-2},'你保护了家人，也消耗了自己。'],['全家共同面对',{人缘:3,韧性:1},'坦诚让压力被许多人分担。'],['动用积蓄解决',{家境:-2,人缘:2},'钱少了，家还稳稳地在。']]}
 ],
 [
  {title:'中途盘点',text:'你忽然发现，过去追求的未必还是今天想要的。',choices:[['重新学习',{才智:3,家境:-1},'迟来的学生时代同样滚烫。'],['守住已有成果',{家境:2,韧性:1},'稳定本身就是一种成就。'],['投身公共事务',{人缘:3},'个人的经验开始照亮更多人。']]},
  {title:'健康警报',text:'身体发出警报，你必须改变生活方式。',choices:[['彻底调整作息',{体魄:3,家境:-1},'规律让你重新掌握身体。'],['暂时硬撑',{家境:2,体魄:-2},'你完成了任务，账单却记在身体上。'],['与亲友结伴改善',{体魄:2,人缘:2},'有人同行，改变不再痛苦。']]},
  {title:'时代换挡',text:'熟悉的技能正在被新工具取代。',choices:[['从头学习新工具',{才智:3,韧性:1},'好奇心让年龄失去边界。'],['发挥经验优势',{人缘:1,家境:2},'经验在变化中找到了新位置。'],['让位并帮助新人',{人缘:3,韧性:1},'你不再站在中央，却成为可靠的支点。']]}
 ],
 [
  {title:'岁月回望',text:'晚年的时间变慢了，你可以决定如何安放余下的日子。',choices:[['整理一生经验',{才智:2,人缘:1},'你的故事成为后来者的地图。'],['游历未见之地',{体魄:1,韧性:2},'世界依然不断给你惊喜。'],['陪伴亲友邻里',{人缘:3},'你被许多温柔的瞬间包围。']]},
  {title:'最后的礼物',text:'你想为后来的人留下些什么。',choices:[['留下知识与作品',{才智:3},'思想越过了个人生命的边界。'],['留下可用的家业',{家境:3},'积累成为下一程的起点。'],['留下共同记忆',{人缘:3},'人们谈起你时总会微笑。']]},
  {title:'与自己和解',text:'旧日遗憾再次浮现，你终于有时间面对它。',choices:[['写信表达歉意',{人缘:2,韧性:1},'答案未必完美，但沉默结束了。'],['接受无法改变',{韧性:3},'放下不是遗忘，而是不再惩罚自己。'],['完成未竟心愿',{体魄:1,才智:1,家境:-1},'迟到的句号依然完整。']]}
 ]
];

let state = null;
let deferredInstall = null;
const $ = id => document.getElementById(id);
const app = $('app');

function rand(max){ return Math.floor(Math.random()*max); }
function clamp(n,min=0,max=20){ return Math.max(min,Math.min(max,n)); }
function pickTalents(){ const pool=[...TALENTS]; const out=[]; while(out.length<3) out.push(pool.splice(rand(pool.length),1)[0].id); return out; }
function freshState(){
 const archive=ARCHIVES[rand(ARCHIVES.length)], origin=ORIGINS[rand(ORIGINS.length)];
 const attrs=Object.fromEntries(ATTRS.map(a=>[a,3+(origin.bonus[a]||0)]));
 const talents=pickTalents(); talents.forEach(id=>{const t=TALENTS[id];attrs[t.attr]+=t.value});
 return {version:APP_VERSION,screen:'setup',archiveIndex:archive.index,originIndex:ORIGINS.indexOf(origin),talents,difficulty:'normal',attrs,baseAttrs:{...attrs},points:DIFFICULTIES.normal.points,stage:0,records:[],seed:rand(999999),createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};
}
function save(){ if(!state)return;state.updatedAt=new Date().toISOString();localStorage.setItem(SAVE_KEY,JSON.stringify(state)); }
function load(){ try{const raw=localStorage.getItem(SAVE_KEY);if(!raw)return null;const s=JSON.parse(raw);return validSave(s)?s:null}catch{return null} }
function validSave(s){return !!(s&&s.version===APP_VERSION&&['setup','life','result'].includes(s.screen)&&Number.isInteger(s.archiveIndex)&&ARCHIVES[s.archiveIndex]&&s.attrs&&ATTRS.every(a=>Number.isFinite(s.attrs[a]))&&Array.isArray(s.records));}
function archive(){return ARCHIVES[state.archiveIndex]}
function toast(msg){const el=$('toast');if(!el)return;el.textContent=msg;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),1700)}
function attrHud(){return `<div class="hud">${ATTRS.map(a=>`<div class="stat"><small>${a}</small><b>${state.attrs[a]}</b></div>`).join('')}</div>`}
function render(){save();if(state.screen==='setup')renderSetup();else if(state.screen==='life')renderLife();else renderResult();window.scrollTo?.({top:0,behavior:'smooth'});}

function renderSetup(){
 const a=archive(),o=ORIGINS[state.originIndex],ts=state.talents.map(i=>TALENTS[i]);
 app.innerHTML=`<section class="hero"><div class="eyebrow">LIFE ARCHIVE / ${a.index+1} OF 31</div><h1>你的这一世，<br>从${a.year<0?'公元前'+Math.abs(a.year):'公元'+a.year}年开始。</h1><p>命运已随机分配年代、出身和三项天赋。调整属性，选择难度，然后进入这条只属于你的时间线。</p></section>
 <section class="panel archive" data-year="${a.year}"><div class="panel-title"><h2>${a.title}</h2><span class="tag">真实背景</span></div><p>${a.text}</p><div class="disclaimer">历史环境依据通行史实概括；你的角色、家庭与人生经历均属虚构。</div></section>
 <div class="grid two"><section class="panel"><div class="panel-title"><h2>随机出身</h2><span class="tag">${o.name}</span></div><p class="story">${o.desc}</p><div class="talents">${ts.map(t=>`<span class="talent ${t.rare?'rare':''}">${t.name} · ${t.attr}+${t.value}</span>`).join('')}</div></section>
 <section class="panel"><h2>渡劫难度</h2><div class="grid three" style="margin-top:14px">${Object.entries(DIFFICULTIES).map(([k,d])=>`<button class="difficulty ${state.difficulty===k?'selected':''}" data-diff="${k}"><strong>${d.name}</strong><small>${d.desc}</small></button>`).join('')}</div></section></div>
 <section class="panel"><div class="panel-title"><h2>五维命盘</h2><span class="tag">可自由分配</span></div><div class="points">剩余命运点：${state.points}</div>${ATTRS.map(a=>`<div class="attr-row"><span>${a}</span><div class="meter"><i style="width:${state.attrs[a]*5}%"></i></div><b>${state.attrs[a]}</b><button class="mini" data-add="${a}" ${state.points<=0?'disabled':''}>＋</button></div>`).join('')}<div class="actions"><button id="reroll" class="ghost">重掷这一世</button><button id="start" class="btn" ${state.points?'disabled':''}>进入人生</button></div></section>
 <section class="panel save-tools"><button id="import" class="ghost">导入存档</button><button id="export" class="ghost">导出当前存档</button></section>`;
 bindCommon();
 app.querySelectorAll('[data-diff]').forEach(b=>b.addEventListener('click',()=>changeDifficulty(b.dataset.diff)));
 app.querySelectorAll('[data-add]').forEach(b=>b.addEventListener('click',()=>{if(state.points>0){state.attrs[b.dataset.add]++;state.points--;render()}}));
 $('reroll').addEventListener('click',()=>{state=freshState();render();toast('命运已重新洗牌')});
 $('start').addEventListener('click',()=>{state.screen='life';state.stage=0;render()});
}
function changeDifficulty(key){
 const used=ATTRS.reduce((sum,a)=>sum+(state.attrs[a]-state.baseAttrs[a]),0);
 state.difficulty=key;const total=DIFFICULTIES[key].points;
 if(used>total){state.attrs={...state.baseAttrs};state.points=total;toast('点数已按新难度重置')}else state.points=total-used;
 render();
}
function currentEvent(){const pool=EVENTS[state.stage];return pool[(state.seed+state.archiveIndex*3+state.stage)%pool.length]}
function renderLife(){
 const st=STAGES[state.stage], ev=currentEvent(),a=archive();
 app.innerHTML=`<div class="progress">${STAGES.map((_,i)=>`<i class="${i<=state.stage?'done':''}"></i>`).join('')}</div>${attrHud()}
 <section class="panel"><span class="history-chip">${a.year<0?'前'+Math.abs(a.year):a.year}年生 · ${a.title}</span><div class="event-icon">${st.icon}</div><div class="eyebrow">${st.name} / ${st.age}</div><h1 class="event-title">${ev.title}</h1><p class="story">${ev.text}</p><div class="disclaimer">时代背景：${a.text}</div></section>
 <section class="panel"><div class="panel-title"><h2>你会怎么选？</h2><span class="tag">选择后立即存档</span></div><div class="grid three">${ev.choices.map((c,i)=>`<button class="choice" data-choice="${i}"><strong>${c[0]}</strong><small>${effectText(c[1])}</small></button>`).join('')}</div></section>
 <section class="panel save-tools"><button id="export" class="ghost">导出存档</button><button id="import" class="ghost">导入存档</button><button id="restart" class="ghost danger">放弃此生</button></section>`;
 bindCommon();app.querySelectorAll('[data-choice]').forEach(b=>b.addEventListener('click',()=>choose(+b.dataset.choice)));
 $('restart').addEventListener('click',()=>{if(confirm('确定放弃当前人生并重新投胎吗？')){state=freshState();render()}});
}
function effectText(e){return Object.entries(e).map(([k,v])=>`${k}${v>0?'+':''}${v}`).join(' · ')}
function choose(index){
 const ev=currentEvent(), c=ev.choices[index];if(!c)return;
 const key=Object.keys(c[1]).sort((x,y)=>c[1][y]-c[1][x])[0];
 const base=.72+state.attrs[key]*.012-DIFFICULTIES[state.difficulty].risk;
 const success=Math.random()<Math.max(.35,Math.min(.95,base));
 Object.entries(c[1]).forEach(([a,v])=>state.attrs[a]=clamp(state.attrs[a]+(success?v:Math.min(0,v)-1)));
 const note=success?c[2]:`事情没有完全按计划发展，但你从挫折中记住了这一课。`;
 state.records.push({stage:state.stage,stageName:STAGES[state.stage].name,event:ev.title,choice:c[0],success,note,year:archive().year});
 if(state.stage>=STAGES.length-1){state.screen='result'}else state.stage++;
 render();toast(success?'抉择已记录 · 命运向前':'遭遇波折 · 但人生继续');
}
function resultData(){
 const total=ATTRS.reduce((s,a)=>s+state.attrs[a],0), successes=state.records.filter(r=>r.success).length;
 const score=Math.round((total*92+successes*120+state.records.length*60)*DIFFICULTIES[state.difficulty].score);
 const top=[...ATTRS].sort((a,b)=>state.attrs[b]-state.attrs[a])[0];
 const endings={体魄:['行遍山河','你以强健与行动力穿过时代，晚年仍对世界充满热望。'],才智:['时代译者','你理解变化，也把复杂世界讲给后来的人听。'],人缘:['万家灯火','你最珍贵的遗产，是许多人生命里关于你的温暖记忆。'],韧性:['不灭微光','时代多次把你推倒，你却总能重新站起，活成坚韧本身。'],家境:['百年基业','你把有限资源经营成可以传递的安全感，让后来者站得更稳。']};
 let [title,desc]=endings[top];if(score>6500){title='渡劫飞升 · 千古回响';desc='你不仅活过了时代，还在时代里留下了清晰而长久的回声。'}
 const rank=score>6500?'S':score>5400?'A':score>4400?'B':score>3500?'C':'D';return{score,rank,title,desc,total};
}
function renderResult(){
 const r=resultData(),a=archive();
 app.innerHTML=`<section class="hero"><div class="eyebrow">LIFE COMPLETE / ${DIFFICULTIES[state.difficulty].name}</div><div class="score">${r.score}</div><div class="rank">命格评级 ${r.rank}</div><h1 class="ending">${r.title}</h1><p>${r.desc}</p></section>${attrHud()}
 <section class="panel archive" data-year="${a.year}"><div class="panel-title"><h2>人生档案 · ${a.title}</h2><span class="tag">${a.year<0?'公元前'+Math.abs(a.year):'公元'+a.year}</span></div>${state.records.map(x=>`<div class="record"><small>${x.stageName} · ${x.event} · ${x.success?'顺遂':'波折'}</small><p><b>${x.choice}</b><br>${x.note}</p></div>`).join('')}</section>
 <section class="panel"><div class="actions"><button id="reborn" class="btn">重新投胎</button><button id="export" class="ghost">导出人生档案</button><button id="import" class="ghost">导入存档</button></div></section>`;
 bindCommon();$('reborn').addEventListener('click',()=>{state=freshState();render()});
}
function bindCommon(){
 $('export')?.addEventListener('click',exportSave);$('import')?.addEventListener('click',()=>$('importInput').click());
}
function exportSave(){
 save();const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download=`00后渡劫存档-${Date.now()}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),500);toast('存档已导出');
}
async function importSave(file){
 try{const next=JSON.parse(await file.text());if(!validSave(next))throw new Error();state=next;save();render();toast('存档导入成功')}catch{toast('无法识别此存档')}
}

$('importInput')?.addEventListener('change',e=>{const f=e.target.files?.[0];if(f)importSave(f);e.target.value=''});
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstall=e;$('installBtn')?.classList.remove('hidden')});
$('installBtn')?.addEventListener('click',async()=>{if(!deferredInstall)return;deferredInstall.prompt();await deferredInstall.userChoice;deferredInstall=null;$('installBtn').classList.add('hidden')});
document.addEventListener('touchmove',e=>{if(window.scrollY===0&&e.touches?.[0]?.clientY>80)e.stopPropagation()},{passive:true});
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));

state=load()||freshState();
render();

window.__GAME_TEST__={
 getState:()=>JSON.parse(JSON.stringify(state)),
 reset:()=>{state=freshState();save();return state},
 allocateAll:()=>{while(state.points>0){state.attrs[ATTRS[state.points%ATTRS.length]]++;state.points--}state.screen='life';save();return state},
 choose:(i=0)=>{choose(i);return state},
 validSave,resultData,ARCHIVES,TALENTS,ORIGINS,STAGES
};
