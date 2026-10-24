export const CAREERS=[
 ['farmer','农民',-1000,2100,'农业',5,8,2],['merchant','商人',-1000,2100,'商业',8,11,5],['artisan','工匠',-1000,2100,'工艺',8,10,3],['doctor','医者',-1000,2100,'医疗',14,13,4],['scholar','书生',-1000,1900,'学习',12,9,2],
 ['official','官吏',-700,1911,'管理',22,18,5],['soldier','士兵',-1000,2100,'战斗',8,12,8],['trader','行商',-1000,1950,'商业',10,14,7],['boatman','船工',-1000,1950,'工艺',6,10,6],['worker','产业工人',1750,2100,'工艺',7,13,5],
 ['teacher','教师',1850,2100,'学习',16,15,3],['journalist','记者',1850,2100,'社交',14,16,6],['modern-doctor','现代医生',1850,2100,'医疗',24,24,5],['engineer','工程师',1800,2100,'现代技术',20,22,4],['researcher','科研人员',1850,2100,'学习',25,21,4],
 ['designer','设计师',1900,2100,'艺术',14,18,4],['office','企业职员',1900,2100,'管理',10,17,4],['programmer','程序员',1950,2100,'现代技术',18,24,6],['creator','内容创作者',1950,2100,'艺术',8,16,8],['entrepreneur','创业者',1800,2100,'商业',18,28,10]
].map(([id,name,minYear,maxYear,skill,minSkill,income,risk])=>({id,name,minYear,maxYear,skill,minSkill,income,risk,stress:Math.ceil(risk/2),promotionSkill:minSkill+18}));

export function availableCareers(state){return CAREERS.filter(c=>state.currentYear>=c.minYear&&state.currentYear<=c.maxYear&&state.skills[c.skill]>=Math.max(0,c.minSkill-12))}
