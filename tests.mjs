import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const store=new Map();
const element=()=>({innerHTML:'',textContent:'',value:'',files:[],dataset:{},classList:{add(){},remove(){}},addEventListener(){},querySelectorAll(){return[]},click(){}});
const elements=new Map([['app',element()],['toast',element()],['importInput',element()],['installBtn',element()]]);
const document={getElementById:id=>elements.get(id)||element(),createElement:()=>element(),addEventListener(){}};
const window={scrollY:0,scrollTo(){},addEventListener(){},setTimeout,clearTimeout};
const context={console,Math,Date,JSON,Blob,URL:{createObjectURL:()=>'',revokeObjectURL(){}},navigator:{},document,window,localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)},confirm:()=>true,setTimeout,clearTimeout};
vm.createContext(context);
vm.runInContext(fs.readFileSync('app.js','utf8'),context,{filename:'app.js'});
const api=context.window.__GAME_TEST__;

assert.equal(api.ARCHIVES.length,31,'应包含31届档案');
assert.deepEqual([api.ARCHIVES[0].year,api.ARCHIVES.at(-1).year],[-1000,2000]);
assert.equal(api.TALENTS.length,24,'应包含24种天赋');
assert.equal(api.ORIGINS.length,4,'应包含4种出身');
assert.equal(api.STAGES.length,6,'应包含6个人生阶段');

api.reset();
let s=api.allocateAll();
assert.equal(s.screen,'life');
assert.equal(s.points,0);
for(let i=0;i<6;i++) s=api.choose(i%3);
assert.equal(s.screen,'result','完整流程应抵达结局');
assert.equal(s.records.length,6,'每阶段应记录一次选择');
assert.ok(api.resultData().score>0,'结局应生成有效评分');
assert.ok(store.get('00hou-save-v1'),'每步应写入本地存档');
assert.equal(api.validSave(JSON.parse(store.get('00hou-save-v1'))),true);
assert.equal(api.validSave({}),false,'损坏存档应被拒绝');

console.log('✓ 31届历史档案与24种天赋');
console.log('✓ 六阶段流程可从开局抵达结局');
console.log('✓ 属性、评分、人生记录与自动存档有效');
console.log('全部测试通过');
