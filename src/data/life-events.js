export const LIFE_EVENTS=[
 {id:'school',minAge:7,maxAge:18,title:'求学机会',text:'一位师长愿意给你更系统的学习机会。',choices:[{label:'投入时间学习',effects:{skill:'学习',skillDelta:4,cash:-2,stress:2}},{label:'先帮助家庭',effects:{cash:3,relation:2,skill:'农业',skillDelta:1}}]},
 {id:'friend',minAge:8,maxAge:40,title:'新朋友',text:'你遇见了一个与你很投缘的人。多年以后，这段关系也许仍会回响。',choices:[{label:'主动结交并伸出援手',effects:{addFriend:true,relation:6,stress:-2,delayed:{after:20,type:'friend-return'}}},{label:'礼貌相处',effects:{stress:-1,attribute:'韧性',attrDelta:1,personality:{谨慎:3}}}]},
 {id:'mentor',minAge:14,maxAge:35,title:'师徒之缘',text:'一位经验丰富的人愿意指导你。',choices:[{label:'认真拜师',effects:{skill:'学习',skillDelta:5,cash:-2,relation:4}},{label:'自己摸索',effects:{attribute:'韧性',attrDelta:1,skill:'工艺',skillDelta:2}}]},
 {id:'partner',minAge:20,maxAge:48,title:'亲密关系',text:'一段关系正走到可以认真选择的路口。',choices:[{label:'尝试共同生活',effects:{addPartner:true,relation:8,cash:-3}},{label:'保持单身',effects:{flag:'single-choice',stress:-2,attribute:'韧性',attrDelta:1}}]},
 {id:'child',minAge:24,maxAge:45,title:'家庭计划',text:'你需要决定是否承担养育下一代的责任。',requires:'partner',choices:[{label:'选择养育孩子',effects:{addChild:true,cash:-8,relation:6,stress:4}},{label:'选择不生育',effects:{flag:'childfree',stress:-2,relation:2}}]},
 {id:'illness',minAge:35,maxAge:100,title:'健康警报',text:'身体出现持续不适，需要决定如何应对。',choices:[{label:'及时治疗',effects:{cash:-6,health:12,stress:-3}},{label:'暂时硬撑',effects:{cash:3,health:-10,stress:5}}]},
 {id:'investment',minAge:25,maxAge:65,title:'投资机会',text:'有人提出一项收益与风险并存的计划。',choices:[{label:'谨慎投入',effects:{cash:-5,assets:8,stress:2}},{label:'保留现金',effects:{attribute:'韧性',attrDelta:1}}]},
 {id:'community',minAge:18,maxAge:90,title:'社区事务',text:'邻里需要有人组织一项公共事务。',choices:[{label:'承担责任',effects:{relation:6,skill:'管理',skillDelta:3,stress:2}},{label:'提供物资',effects:{cash:-4,relation:3}}]},
 {id:'travel',minAge:18,maxAge:75,title:'远行机会',text:'一次远行可能拓宽眼界，也会消耗积蓄。',choices:[{label:'踏上旅途',effects:{cash:-5,skill:'社交',skillDelta:3,stress:-3}},{label:'留在熟悉之地',effects:{assets:2,stress:-1}}]}
];
export function eligibleLifeEvents(state){return LIFE_EVENTS.filter(e=>state.age>=e.minAge&&state.age<=e.maxAge&&(!e.requires||(e.requires==='partner'&&state.relationships.some(r=>r.type==='伴侣'&&r.active))))}
