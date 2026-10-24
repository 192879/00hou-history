export const REGIONS=[
 {id:'china',name:'中国',desc:'王朝更替、农业文明、城市与现代化交织的漫长历史。',subregions:['华北','江南','西南','岭南','西北']},
 {id:'europe',name:'欧洲',desc:'城邦、帝国、工业革命与现代国家体系塑造的区域。',subregions:['西欧','南欧','中欧','北欧','东欧']},
 {id:'west-asia',name:'西亚',desc:'古代文明、跨洲贸易与多重帝国交会之地。',subregions:['两河流域','安纳托利亚','波斯地区','黎凡特','阿拉伯地区']},
 {id:'other',name:'其他地区',desc:'以概括性世界史背景呈现，避免套用单一区域经历。',subregions:['东亚其他地区','南亚','非洲','美洲','大洋洲']}
];
export const HISTORY_EVENTS=[
 ['changping','长平之战',-260,-260,'china','大规模战争改变了战国后期的力量格局。','crisis'],
 ['qin-unify','秦统一六国',-221,-221,'china','秦完成统一并推行郡县、度量衡与文字制度。','change'],
 ['yongjia','永嘉之乱',311,316,'china','西晋末年战乱引发人口迁徙与社会剧变。','crisis'],
 ['anshi','安史之乱',755,763,'china','唐代由盛转衰的重要节点，许多地区遭受长期动荡。','crisis'],
 ['jingkang','靖康之变',1127,1127,'china','北宋覆亡，政治中心与大量人口南移。','crisis'],
 ['mingqing','明清鼎革',1644,1644,'china','明清政权更替，战争与秩序重建并存。','crisis'],
 ['opium','鸦片战争',1840,1842,'china','近代条约体系开始形成，社会与经济受到深远影响。','change'],
 ['xinhai','辛亥革命',1911,1912,'china','帝制结束，共和制度开始艰难探索。','change'],
 ['war1937','全面抗战',1937,1945,'china','战争给普通人造成深重苦难，也带来广泛社会动员。','crisis'],
 ['prc','中华人民共和国成立',1949,1949,'china','国家政权和社会制度进入新的历史阶段。','change'],
 ['reform','改革开放',1978,1992,'china','市场化改革和对外开放改变工作与生活机会。','opportunity'],
 ['sars','非典',2003,2003,'china','公共卫生事件影响城市生活与医疗体系。','crisis'],
 ['covid','新冠疫情',2020,2022,'other','全球公共卫生事件深刻影响出行、工作和家庭生活。','crisis'],
 ['ai-wave','人工智能浪潮',2022,2100,'other','生成式人工智能推动学习、创作与劳动方式变化。','opportunity'],
 ['rome-fall','西罗马帝国衰亡',476,476,'europe','西罗马政治结构瓦解，欧洲进入新的权力格局。','change'],
 ['black-death','黑死病',1347,1353,'europe','大规模疫病改变人口、劳动与社会结构。','crisis'],
 ['industrial','工业革命',1760,1840,'europe','机械化生产与城市化重塑经济和劳动。','opportunity'],
 ['ww1','第一次世界大战',1914,1918,'europe','总体战给欧洲与世界带来巨大人员和社会损失。','crisis'],
 ['ww2','第二次世界大战',1939,1945,'europe','全球战争造成空前破坏并重塑国际秩序。','crisis'],
 ['silk-road','丝绸之路繁荣',-130,700,'west-asia','跨洲商路促进商品、技术与文化交流。','opportunity'],
 ['abbasid','阿拔斯时代',750,900,'west-asia','城市、学术与跨区域贸易在许多地区繁荣。','opportunity'],
 ['mongol-west','蒙古西征',1219,1260,'west-asia','战争冲击既有城市与政权，也重组欧亚交通网络。','crisis'],
 ['oil-era','石油时代',1908,2000,'west-asia','能源产业深刻改变区域经济与国际关系。','opportunity']
].map(([id,name,start,end,region,background,type])=>({id,name,start,end,region,background,type}));

export function eventsForYear(year,region){return HISTORY_EVENTS.filter(e=>year>=e.start&&year<=e.end&&(e.region===region||e.region==='other'))}
