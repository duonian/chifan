/**
 * 地区菜系库
 * flavorTags 用于口味匹配，healthNote 提示该菜系在健康饮食上的注意点
 */
var REGIONS = [
  {
    id: 'chaoshan',
    name: '潮汕',
    short: '潮',
    desc: '清、鲜、淡，重原味，善用砂锅粥、卤味、鱼饭、菜脯',
    flavorTags: ['清淡', '鲜甜', '原味'],
    signature: ['砂锅粥', '白灼', '生炒', '鱼饭', '卤味', '打冷'],
    healthNote: '本味清淡对三高友好；但卤水、鱼露、菜脯、咸杂含盐高，高血压者需减量；生腌类孕妇与脾胃虚者禁食。',
    color: '#3E7C6B'
  },
  {
    id: 'canton',
    name: '广府',
    short: '粤',
    desc: '清蒸白灼、老火靓汤、讲究时令与"清热祛湿"',
    flavorTags: ['清淡', '鲜', '甘润'],
    signature: ['清蒸', '白灼', '老火汤', '煲仔', '蒸饭'],
    healthNote: '清蒸白灼最健康；老火汤嘌呤高，痛风者只吃料不喝汤；烧腊类高脂高盐需限制。',
    color: '#4A8C7A'
  },
  {
    id: 'hakka',
    name: '客家',
    short: '客',
    desc: '咸、香、肥，重酿菜与药膳炖品',
    flavorTags: ['咸香', '浓郁', '醇厚'],
    signature: ['酿豆腐', '盐焗', '梅菜扣肉', '药膳鸡汤'],
    healthNote: '盐焗与梅菜类盐分极高，高血压者要改良做法；药膳炖品适合气血虚者。',
    color: '#8A6A3E'
  },
  {
    id: 'minnan',
    name: '闽南',
    short: '闽',
    desc: '汤鲜味清，善用海产、姜、米酒',
    flavorTags: ['鲜', '清甜', '微酸'],
    signature: ['海鲜汤', '姜母鸭', '沙茶', '面线糊'],
    healthNote: '海鲜嘌呤偏高，痛风者慎；沙茶酱含盐与油较高。',
    color: '#4A7C9C'
  },
  {
    id: 'jiangzhe',
    name: '江浙',
    short: '浙',
    desc: '清鲜微甜，讲究时令河鲜与炖煨',
    flavorTags: ['清鲜', '微甜', '软糯'],
    signature: ['清蒸', '红烧', '腌笃鲜', '醉'],
    healthNote: '菜偏甜，糖尿病者要求"免糖"；红烧类酱油多，注意钠摄入。',
    color: '#6A8AAE'
  },
  {
    id: 'chuanyu',
    name: '川渝',
    short: '川',
    desc: '麻辣鲜香，一菜一格',
    flavorTags: ['麻辣', '香辣', '浓味'],
    signature: ['小炒', '水煮', '干煸', '泡菜'],
    healthNote: '本库已收录"微辣改良版"；阴虚火旺、肝火旺、胃病、痔疮、孕妇需避开重辣。',
    color: '#B5533E'
  },
  {
    id: 'hunan',
    name: '湘菜',
    short: '湘',
    desc: '香辣酸辣，重油重色',
    flavorTags: ['香辣', '酸辣', '咸鲜'],
    signature: ['小炒肉', '剁椒蒸', '腊味'],
    healthNote: '腊味与剁椒盐分极高；建议清蒸系为主并减盐。',
    color: '#A8543E'
  },
  {
    id: 'north',
    name: '北方家常',
    short: '北',
    desc: '鲁菜与京津冀家常，面食为主，咸鲜适口',
    flavorTags: ['咸鲜', '醇厚', '扎实'],
    signature: ['炖菜', '面食', '包子', '汆'],
    healthNote: '面食为主易升糖，糖尿病者用杂粮面；炖菜可少盐多醋。',
    color: '#8A7A4A'
  },
  {
    id: 'jiangnan_su',
    name: '淮扬',
    short: '淮',
    desc: '刀工精细、清淡平和、汤羹见长',
    flavorTags: ['清淡', '鲜和', '细腻'],
    signature: ['文思豆腐', '清炖', '狮子头', '烫干丝'],
    healthNote: '整体清淡适合老人与三高；狮子头可用鸡胸肉替代减脂。',
    color: '#7A9C8A'
  },
  {
    id: 'yungui',
    name: '云贵',
    short: '滇',
    desc: '酸辣鲜香，菌菇与野菜丰富',
    flavorTags: ['酸辣', '鲜香', '清爽'],
    signature: ['汽锅鸡', '酸汤', '野生菌', '凉拌'],
    healthNote: '酸汤开胃适合食欲差者；菌类嘌呤中等，痛风急性期慎食。',
    color: '#6A8A5A'
  },
  {
    id: 'northeast',
    name: '东北',
    short: '东',
    desc: '量大味厚，炖菜与酸菜见长',
    flavorTags: ['咸香', '浓郁', '酸爽'],
    signature: ['乱炖', '酸菜', '锅包肉', '拌菜'],
    healthNote: '酸菜亚硝酸盐与钠高，需限量；炖菜宜少油少盐。',
    color: '#7A6A8A'
  },
  {
    id: 'common',
    name: '通用家常',
    short: '常',
    desc: '不分地域的基础家常菜与药膳粥汤',
    flavorTags: ['清淡', '家常'],
    signature: ['清炒', '蒸蛋', '杂粮粥', '炖汤'],
    healthNote: '基础款，可按各人体质灵活调整。',
    color: '#8A8A8A'
  }
];

var REGION_MAP = {};
for (var ri = 0; ri < REGIONS.length; ri++) {
  REGION_MAP[REGIONS[ri].id] = REGIONS[ri];
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { REGIONS: REGIONS, REGION_MAP: REGION_MAP };
}
if (typeof window !== 'undefined') {
  window.REGIONS = REGIONS;
  window.REGION_MAP = REGION_MAP;
}
