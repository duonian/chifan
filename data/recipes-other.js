/**
 * 菜谱库 · 其他地区（川渝 / 湘 / 江浙 / 淮扬 / 北方 / 云贵 / 东北）
 */
var RECIPES_OTHER = [
  /* ---------------- 川渝 ---------------- */
  {
    id: 'cy01', name: '开水白菜（清汤版）', region: 'chuanyu', cat: 'soup',
    meals: ['lunch', 'dinner'], nature: '平', time: 70, kcal: 60, protein: 6, na: 240,
    tags: ['清淡', '低脂', '易消化', '软烂', '低盐'],
    ing: [{ n: '娃娃菜', q: 120, u: 'g' }, { n: '鸡胸肉', q: 40, u: 'g' }, { n: '瘦肉', q: 30, u: 'g' }],
    season: ['盐 0.8g', '姜片'],
    steps: [
      '鸡胸与瘦肉剁茸备用，另用鸡架熬清汤 1 小时。',
      '肉茸分两次投入微沸汤中吸附杂质，捞出杂质使汤清澈。',
      '娃娃菜心焯水后浸入清汤。',
      '上桌前再冲入滚烫清汤。'
    ],
    good: ['elderly', 'spleen_weak', 'hypertension', 'overweight', 'diabetes'],
    bad: ['gout'],
    tips: '川菜里最清淡的一道，证明"川菜≠只有辣"；痛风者不宜喝肉汤。'
  },
  {
    id: 'cy02', name: '蒜泥白肉（瘦肉改良）', region: 'chuanyu', cat: 'meat',
    meals: ['lunch'], nature: '平', time: 40, kcal: 185, protein: 17, na: 420,
    tags: ['高蛋白'],
    ing: [{ n: '猪后腿瘦肉', q: 100, u: 'g' }, { n: '黄瓜', q: 60, u: 'g' }, { n: '蒜', q: 8, u: 'g' }],
    season: ['生抽 5ml', '香醋 5ml', '辣椒油 3g（可免）', '糖 0'],
    steps: [
      '整块瘦肉冷水下锅，加姜葱料酒煮 25 分钟至筷子能扎透。',
      '关火在原汤中泡 15 分钟，取出晾凉切薄片。',
      '黄瓜切片垫底。',
      '蒜泥、生抽、醋调汁淋上，怕辣可完全不放辣油。'
    ],
    good: ['anemia', 'child_growth'],
    bad: ['spleen_weak', 'stomach_cold', 'hyperlipidemia'],
    tips: '用后腿瘦肉替代传统五花肉，脂肪减少约一半；脾胃虚者需回温食用。'
  },
  {
    id: 'cy03', name: '番茄土豆牛腩（微辣家常）', region: 'chuanyu', cat: 'meat',
    meals: ['lunch', 'dinner'], nature: '平', time: 80, kcal: 210, protein: 18, na: 400,
    tags: ['补血', '高蛋白', '益气', '软烂'],
    ing: [{ n: '牛腩', q: 90, u: 'g' }, { n: '番茄', q: 100, u: 'g' }, { n: '土豆', q: 80, u: 'g' }, { n: '洋葱', q: 30, u: 'g' }],
    season: ['油 5g', '生抽 5ml', '八角 1 颗', '盐 0.8g'],
    steps: [
      '牛腩冷水焯去血沫，切块。',
      '少油炒香洋葱与番茄至出沙，加牛腩翻炒。',
      '加开水没过，八角、生抽，小火炖 60 分钟。',
      '下土豆再炖 20 分钟至软糯，收汁调味。'
    ],
    good: ['anemia', 'menstrual', 'qi_deficiency', 'child_growth', 'kidney_weak', 'elderly'],
    bad: ['gout'],
    tips: '番茄的酸能软化牛肉纤维，天然减少用盐；不放辣椒即为老少皆宜版。'
  },
  {
    id: 'cy04', name: '麻婆豆腐（少油少盐版）', region: 'chuanyu', cat: 'veg',
    meals: ['lunch', 'dinner'], nature: '温', time: 20, kcal: 155, protein: 12, na: 480,
    tags: ['高蛋白', '补钙', '重口'],
    ing: [{ n: '嫩豆腐', q: 150, u: 'g' }, { n: '牛肉末', q: 35, u: 'g' }, { n: '蒜苗', q: 15, u: 'g' }],
    season: ['豆瓣酱 6g', '油 6g', '花椒粉 1g', '生粉水'],
    steps: [
      '豆腐切块用淡盐水泡 5 分钟去豆腥，捞出沥干。',
      '少油炒散牛肉末，下豆瓣酱炒出红油。',
      '加水烧开，轻推入豆腐，小火煨 5 分钟。',
      '勾薄芡，撒花椒粉与蒜苗。全程不再加盐。'
    ],
    good: ['menopause', 'yang_deficiency'],
    bad: ['hypertension', 'stomach_cold', 'yin_deficiency', 'liver_yang', 'pregnancy', 'child_growth'],
    tips: '豆瓣酱本身含盐极高，务必不再额外加盐；高血压家庭建议改做「虾仁豆腐羹」。'
  },
  {
    id: 'cy05', name: '干煸四季豆（水焯版）', region: 'chuanyu', cat: 'veg',
    meals: ['lunch', 'dinner'], nature: '平', time: 18, kcal: 95, protein: 4, na: 300,
    tags: ['高纤', '健脾', '祛湿'],
    ing: [{ n: '四季豆', q: 150, u: 'g' }, { n: '猪肉末', q: 25, u: 'g' }, { n: '蒜', q: 6, u: 'g' }],
    season: ['油 6g', '生抽 4ml', '干辣椒 1 个（可免）'],
    steps: [
      '四季豆掐去两头，沸水焯 3 分钟（必须彻底熟透防中毒）。',
      '少油小火煸炒至表皮起皱。',
      '下肉末与蒜末炒香。',
      '生抽调味，起锅。'
    ],
    good: ['spleen_weak', 'damp_heavy', 'constipation'],
    bad: [],
    tips: '四季豆必须完全熟透，否则皂苷会致呕吐腹泻；焯水法比传统油炸省油 80%。'
  },

  /* ---------------- 湘菜 ---------------- */
  {
    id: 'hn01', name: '剁椒蒸鱼头（减盐版）', region: 'hunan', cat: 'meat',
    meals: ['lunch', 'dinner'], nature: '温', time: 25, kcal: 150, protein: 20, na: 520,
    tags: ['高蛋白', '重口', '低脂'],
    ing: [{ n: '胖头鱼头', q: 160, u: 'g' }, { n: '剁椒', q: 12, u: 'g' }, { n: '姜', q: 6, u: 'g' }],
    season: ['蒸鱼豉油 3ml', '油 5g', '蒜末'],
    steps: [
      '剁椒先用清水漂洗一次去掉部分盐分（关键改良）。',
      '鱼头对半劈开洗净，铺姜丝去腥。',
      '均匀铺上剁椒与蒜末，大火蒸 10 分钟。',
      '撒葱花淋热油，不再另加盐。'
    ],
    good: ['yang_deficiency', 'damp_heavy'],
    bad: ['hypertension', 'yin_deficiency', 'liver_yang', 'stomach_cold', 'pregnancy'],
    tips: '鱼头本身营养好，但剁椒钠含量惊人；高血压成员在场请改「清蒸鱼头豆腐汤」。'
  },
  {
    id: 'hn02', name: '农家小炒肉（减油版）', region: 'hunan', cat: 'meat',
    meals: ['lunch'], nature: '温', time: 15, kcal: 220, protein: 15, na: 450,
    tags: ['高蛋白', '重口'],
    ing: [{ n: '猪前腿肉', q: 90, u: 'g' }, { n: '青椒', q: 80, u: 'g' }, { n: '蒜', q: 6, u: 'g' }],
    season: ['油 5g', '生抽 5ml', '豆豉 3g'],
    steps: [
      '肉切薄片，肥瘦分开；青椒切滚刀块。',
      '不放油先下肥肉片煸出油，弃掉多余油脂。',
      '下瘦肉炒变色，加豆豉蒜末。',
      '青椒下锅大火翻炒 1 分钟，生抽调味。'
    ],
    good: ['damp_heavy', 'yang_deficiency'],
    bad: ['hypertension', 'yin_deficiency', 'liver_yang', 'stomach_cold', 'hyperlipidemia'],
    tips: '用煸出的猪油炒菜可不额外放油；辣椒去籽能减轻辛辣刺激。'
  },
  {
    id: 'hn03', name: '湘式蒸南瓜', region: 'hunan', cat: 'staple',
    meals: ['breakfast', 'lunch', 'dinner'], nature: '温', time: 20, kcal: 85, protein: 2, na: 5,
    tags: ['健脾', '养胃', '软烂', '易消化', '低脂', '低盐'],
    ing: [{ n: '老南瓜', q: 200, u: 'g' }],
    season: ['无（原味）'],
    steps: [
      '南瓜洗净去瓤，带皮切厚片。',
      '摆盘水开后大火蒸 15 分钟。',
      '筷子能轻松插入即可。',
      '什么调料都不放，吃原本的甜。'
    ],
    good: ['spleen_weak', 'stomach_cold', 'elderly', 'hypertension', 'constipation'],
    bad: ['diabetes'],
    tips: '养胃佳品，可代替部分主食；但南瓜升糖较快，糖尿病者需计入主食量且不超过 100g。'
  },

  /* ---------------- 江浙 / 淮扬 ---------------- */
  {
    id: 'jz01', name: '腌笃鲜（减盐版）', region: 'jiangzhe', cat: 'soup',
    meals: ['lunch', 'dinner'], nature: '平', time: 90, kcal: 175, protein: 16, na: 460,
    tags: ['高蛋白', '鲜', '高纤'],
    ing: [{ n: '鲜猪肉', q: 70, u: 'g' }, { n: '咸肉', q: 15, u: 'g' }, { n: '春笋', q: 90, u: 'g' }, { n: '百叶结', q: 30, u: 'g' }],
    season: ['姜片', '不加盐'],
    steps: [
      '咸肉先用清水浸泡 2 小时换水两次（减盐关键）。',
      '鲜肉焯水，与咸肉、姜片同炖 50 分钟。',
      '春笋焯水去草酸后下锅炖 25 分钟。',
      '最后放百叶结煮 10 分钟，全程不放盐。'
    ],
    good: ['constipation', 'overweight', 'anemia'],
    bad: ['hypertension', 'gout', 'spleen_weak'],
    tips: '咸肉是钠的主要来源，浸泡去盐后风味仍在；痛风者笋与浓汤都要控制。'
  },
  {
    id: 'jz02', name: '清炒虾仁（西湖风味）', region: 'jiangzhe', cat: 'meat',
    meals: ['lunch', 'dinner'], nature: '平', time: 12, kcal: 120, protein: 19, na: 260,
    tags: ['高蛋白', '低脂', '清淡', '易消化', '少油'],
    ing: [{ n: '河虾仁', q: 100, u: 'g' }, { n: '蛋清', q: 10, u: 'g' }],
    season: ['油 5g', '盐 0.8g', '料酒 3ml', '生粉 3g'],
    steps: [
      '虾仁挑去虾线，用厨房纸吸干水分。',
      '加蛋清、生粉、少许盐上浆冷藏 20 分钟。',
      '温油下锅快速滑散至变色即捞。',
      '锅中留底油，回虾仁淋料酒翻两下出锅。'
    ],
    good: ['elderly', 'child_growth', 'overweight', 'hyperlipidemia', 'anemia', 'kidney_weak'],
    bad: ['gout'],
    tips: '低脂高蛋白，减脂期与老人都合适；关键是虾仁一定要吸干水分才滑嫩。'
  },
  {
    id: 'jz03', name: '荠菜豆腐羹', region: 'jiangzhe', cat: 'soup',
    meals: ['lunch', 'dinner'], nature: '凉', time: 15, kcal: 85, protein: 8, na: 250,
    tags: ['清淡', '软烂', '补钙', '平肝', '易消化', '低脂'],
    ing: [{ n: '荠菜', q: 60, u: 'g' }, { n: '嫩豆腐', q: 100, u: 'g' }, { n: '香菇', q: 15, u: 'g' }],
    season: ['盐 0.8g', '生粉水', '香油 2 滴'],
    steps: [
      '荠菜焯水后切碎；豆腐切小丁。',
      '清水或素高汤煮开，下香菇丁与豆腐。',
      '滚 3 分钟后下荠菜。',
      '勾薄芡，滴香油。'
    ],
    good: ['hypertension', 'liver_yang', 'elderly', 'menopause', 'overweight'],
    bad: ['stomach_cold', 'palace_cold'],
    tips: '荠菜含钾丰富有助降压，是春季平肝的时令菜。'
  },
  {
    id: 'ha01', name: '淮扬狮子头（鸡胸低脂版）', region: 'jiangnan_su', cat: 'meat',
    meals: ['lunch', 'dinner'], nature: '平', time: 70, kcal: 155, protein: 20, na: 320,
    tags: ['高蛋白', '低脂', '软烂', '易消化', '清淡'],
    ing: [{ n: '鸡胸肉', q: 90, u: 'g' }, { n: '马蹄', q: 25, u: 'g' }, { n: '鸡蛋清', q: 15, u: 'g' }, { n: '小青菜', q: 60, u: 'g' }],
    season: ['盐 0.8g', '生粉 5g', '姜末', '白胡椒'],
    steps: [
      '鸡胸剁成粗粒（不要用绞肉机打成泥，口感更好）。',
      '加马蹄碎、蛋清、生粉、姜末，同向搅打上劲。',
      '团成球放入微沸清汤中，小火慢炖 50 分钟，全程不可大滚。',
      '最后铺青菜煮 3 分钟。'
    ],
    good: ['elderly', 'spleen_weak', 'hyperlipidemia', 'overweight', 'child_growth', 'hypertension', 'diabetes'],
    bad: [],
    tips: '用鸡胸替代传统五花肉，脂肪从 30g 降到 5g 左右，老人小孩三高全家都能吃。'
  },
  {
    id: 'ha02', name: '文思豆腐羹', region: 'jiangnan_su', cat: 'soup',
    meals: ['lunch', 'dinner'], nature: '平', time: 25, kcal: 80, protein: 8, na: 230,
    tags: ['软烂', '易消化', '清淡', '低脂', '补钙', '高蛋白'],
    ing: [{ n: '内酯豆腐', q: 120, u: 'g' }, { n: '香菇', q: 15, u: 'g' }, { n: '火腿(少量)', q: 5, u: 'g' }, { n: '青菜叶', q: 20, u: 'g' }],
    season: ['盐 0.7g', '生粉水', '姜汁'],
    steps: [
      '豆腐切极细丝（家庭做法切薄片即可），泡在清水中防断。',
      '清汤烧开，下香菇丝与火腿丝。',
      '轻推入豆腐丝，小火煮 3 分钟。',
      '勾极薄的芡，撒青菜末。'
    ],
    good: ['elderly', 'spleen_weak', 'menopause', 'hypertension', 'overweight', 'child_growth'],
    bad: ['gout'],
    tips: '牙口不好的老人最友好的一道菜；火腿是咸味来源，高血压者可省去改用干贝。'
  },

  /* ---------------- 北方 ---------------- */
  {
    id: 'bf01', name: '西红柿炒鸡蛋（免糖版）', region: 'north', cat: 'veg',
    meals: ['breakfast', 'lunch', 'dinner'], nature: '平', time: 12, kcal: 135, protein: 9, na: 280,
    tags: ['高蛋白', '易消化', '清淡', '低糖', '软烂'],
    ing: [{ n: '西红柿', q: 150, u: 'g' }, { n: '鸡蛋', q: 55, u: 'g' }],
    season: ['油 6g', '盐 0.8g', '不放糖'],
    steps: [
      '西红柿顶部划十字，开水烫 10 秒去皮，切块。',
      '蛋液加几滴水打散，热锅温油炒至半凝固盛出。',
      '下西红柿中火炒出浓汁（这一步决定味道）。',
      '回鸡蛋翻匀，只放盐不放糖。'
    ],
    good: ['hypertension', 'diabetes', 'spleen_weak', 'child_growth', 'elderly', 'anemia'],
    bad: [],
    tips: '国民家常菜；番茄红素需油脂才好吸收，所以适量油是必要的；糖友务必免糖。'
  },
  {
    id: 'bf02', name: '小米南瓜粥', region: 'north', cat: 'porridge',
    meals: ['breakfast', 'dinner'], nature: '温', time: 35, kcal: 175, protein: 5, na: 5,
    tags: ['健脾', '养胃', '软烂', '易消化', '安神', '低盐', '温中'],
    ing: [{ n: '小米', q: 45, u: 'g' }, { n: '南瓜', q: 100, u: 'g' }, { n: '枸杞', q: 2, u: 'g' }],
    season: ['无'],
    steps: [
      '小米淘洗后浸泡 20 分钟。',
      '南瓜去皮切小块，与小米同煮。',
      '大火煮开转小火 25 分钟，不时搅拌。',
      '出锅前撒枸杞，静置 5 分钟出米油。'
    ],
    good: ['spleen_weak', 'stomach_cold', 'elderly', 'insomnia', 'qi_deficiency', 'pregnancy', 'child_growth'],
    bad: ['diabetes'],
    tips: '"代参汤"，最养胃的早餐；表面那层米油营养最好，别撇掉。'
  },
  {
    id: 'bf03', name: '醋溜白菜木耳', region: 'north', cat: 'veg',
    meals: ['lunch', 'dinner'], nature: '平', time: 12, kcal: 70, protein: 3, na: 260,
    tags: ['降脂', '高纤', '润肠', '低脂', '清淡'],
    ing: [{ n: '白菜', q: 160, u: 'g' }, { n: '黑木耳(泡发)', q: 40, u: 'g' }],
    season: ['油 5g', '香醋 6ml', '生抽 4ml', '干辣椒 1 个(可免)'],
    steps: [
      '白菜帮斜刀片薄，叶子撕块，梗叶分开。',
      '木耳泡发焯水 1 分钟。',
      '热锅少油先炒菜帮 1 分钟，加木耳。',
      '沿锅边烹醋，下叶子快炒，生抽调味。'
    ],
    good: ['hyperlipidemia', 'hypertension', 'constipation', 'overweight', 'fatty_liver', 'diabetes'],
    bad: [],
    tips: '醋能提鲜从而减少用盐，木耳有助降低血液黏稠度，三高家庭常备。'
  },
  {
    id: 'bf04', name: '杂粮米饭', region: 'north', cat: 'staple',
    meals: ['lunch', 'dinner'], nature: '平', time: 45, kcal: 235, protein: 6, na: 2,
    tags: ['粗粮', '低GI', '高纤', '低糖', '低盐', '润肠'],
    ing: [{ n: '大米', q: 40, u: 'g' }, { n: '糙米', q: 15, u: 'g' }, { n: '燕麦米', q: 10, u: 'g' }, { n: '红豆', q: 8, u: 'g' }],
    season: ['无'],
    steps: [
      '糙米、燕麦米、红豆提前浸泡 2 小时以上（关键）。',
      '与大米混合，水量比纯白米多 15%。',
      '电饭煲杂粮饭模式。',
      '煮好后焖 10 分钟再开盖。'
    ],
    good: ['diabetes', 'hyperlipidemia', 'constipation', 'overweight', 'fatty_liver', 'hypertension'],
    bad: ['spleen_weak', 'elderly'],
    tips: '控糖家庭的主食基石；但粗粮不易消化，脾胃虚与老人请把粗粮比例降到 1/4 并煮更软。'
  },
  {
    id: 'bf05', name: '山药排骨汤', region: 'north', cat: 'soup',
    meals: ['lunch', 'dinner'], nature: '平', time: 75, kcal: 165, protein: 14, na: 280,
    tags: ['健脾', '益气', '软烂', '补钙', '养胃'],
    ing: [{ n: '排骨', q: 80, u: 'g' }, { n: '铁棍山药', q: 100, u: 'g' }, { n: '玉米', q: 60, u: 'g' }, { n: '枸杞', q: 2, u: 'g' }],
    season: ['盐 1g', '姜 3 片', '几滴醋'],
    steps: [
      '排骨冷水下锅焯水，撇净浮沫。',
      '加姜片与几滴醋（帮助钙溶出），大火滚 10 分钟。',
      '转小火炖 40 分钟，下玉米与山药再炖 20 分钟。',
      '撇油，调盐，撒枸杞。'
    ],
    good: ['spleen_weak', 'qi_deficiency', 'elderly', 'child_growth', 'kidney_weak', 'anemia'],
    bad: ['gout'],
    tips: '最百搭的家庭汤；痛风者只吃山药玉米不喝汤。'
  },
  {
    id: 'bf06', name: '荞麦面条配西红柿卤', region: 'north', cat: 'staple',
    meals: ['lunch', 'dinner'], nature: '平', time: 25, kcal: 285, protein: 12, na: 380,
    tags: ['低GI', '粗粮', '高纤', '低糖'],
    ing: [{ n: '荞麦面(干)', q: 75, u: 'g' }, { n: '西红柿', q: 120, u: 'g' }, { n: '鸡蛋', q: 55, u: 'g' }, { n: '青菜', q: 60, u: 'g' }],
    season: ['油 5g', '盐 0.8g', '生抽 4ml'],
    steps: [
      '西红柿去皮切丁炒出浓汁做卤。',
      '打入蛋液炒散，加少许水煮成浓稠卤汁。',
      '荞麦面煮 4 分钟，最后 1 分钟下青菜。',
      '面捞出过一遍温水（脾胃虚者不过水），浇卤。'
    ],
    good: ['diabetes', 'hyperlipidemia', 'overweight', 'hypertension', 'fatty_liver'],
    bad: ['spleen_weak', 'stomach_cold'],
    tips: '荞麦 GI 值约 54，远低于白面条的 80+，是糖友的优选主食。'
  },

  /* ---------------- 云贵 ---------------- */
  {
    id: 'yg01', name: '汽锅鸡', region: 'yungui', cat: 'soup',
    meals: ['lunch', 'dinner'], nature: '平', time: 120, kcal: 165, protein: 20, na: 260,
    tags: ['益气', '高蛋白', '清淡', '低脂', '软烂'],
    ing: [{ n: '土鸡', q: 110, u: 'g' }, { n: '三七花或党参', q: 4, u: 'g' }, { n: '姜', q: 5, u: 'g' }],
    season: ['盐 1g', '不加一滴水'],
    steps: [
      '鸡块焯水后铺入汽锅，加姜片与药材。',
      '汽锅置于装水的汤锅上，用湿毛巾密封接缝。',
      '中火蒸 2 小时，蒸汽凝结自成一锅原汁。',
      '开盖调盐即可，汤色清亮。'
    ],
    good: ['qi_deficiency', 'anemia', 'elderly', 'spleen_weak', 'menstrual', 'hypertension'],
    bad: ['gout'],
    tips: '完全不加水，靠蒸汽凝成汤，是最能保留原味的做法，含盐极低适合高血压。'
  },
  {
    id: 'yg02', name: '酸汤鱼（番茄木姜子版）', region: 'yungui', cat: 'meat',
    meals: ['lunch', 'dinner'], nature: '平', time: 30, kcal: 145, protein: 21, na: 420,
    tags: ['高蛋白', '低脂', '开胃'],
    ing: [{ n: '黑鱼片', q: 130, u: 'g' }, { n: '番茄', q: 100, u: 'g' }, { n: '白酸汤', q: 40, u: 'ml' }, { n: '豆芽', q: 50, u: 'g' }],
    season: ['油 5g', '盐 0.8g', '木姜子油 2 滴'],
    steps: [
      '番茄炒出沙，加酸汤与清水烧开。',
      '下豆芽垫底煮 2 分钟捞入碗中。',
      '鱼片逐片下锅，中火 2 分钟至变白。',
      '滴木姜子油提香，不用放辣。'
    ],
    good: ['spleen_weak', 'overweight', 'hyperlipidemia', 'damp_heavy'],
    bad: ['stomach_cold', 'gout'],
    tips: '酸味开胃，适合夏天食欲差；胃酸过多与胃溃疡者少吃。'
  },
  {
    id: 'yg03', name: '菌菇炒时蔬', region: 'yungui', cat: 'veg',
    meals: ['lunch', 'dinner'], nature: '平', time: 15, kcal: 85, protein: 5, na: 270,
    tags: ['低脂', '高纤', '降脂', '清淡', '增鲜'],
    ing: [{ n: '杏鲍菇', q: 70, u: 'g' }, { n: '口蘑', q: 50, u: 'g' }, { n: '西兰花', q: 80, u: 'g' }, { n: '胡萝卜', q: 30, u: 'g' }],
    season: ['油 5g', '盐 0.8g', '蒜片'],
    steps: [
      '西兰花掰小朵盐水泡 10 分钟后焯水 1 分钟。',
      '菌菇撕条，干锅先煸出水分（提鲜关键）。',
      '少油爆香蒜片，下菌菇与胡萝卜炒 2 分钟。',
      '加西兰花翻匀，调盐出锅。'
    ],
    good: ['hyperlipidemia', 'overweight', 'diabetes', 'hypertension', 'fatty_liver', 'constipation'],
    bad: ['gout'],
    tips: '菌菇的天然鲜味物质可减少用盐；痛风急性发作期避免菌类。'
  },

  /* ---------------- 东北 ---------------- */
  {
    id: 'db01', name: '东北乱炖（少油版）', region: 'northeast', cat: 'veg',
    meals: ['lunch', 'dinner'], nature: '平', time: 40, kcal: 145, protein: 8, na: 350,
    tags: ['软烂', '高纤', '易消化', '健脾'],
    ing: [{ n: '土豆', q: 80, u: 'g' }, { n: '豆角', q: 60, u: 'g' }, { n: '茄子', q: 70, u: 'g' }, { n: '五花肉', q: 30, u: 'g' }, { n: '玉米', q: 50, u: 'g' }],
    season: ['生抽 5ml', '盐 0.8g', '八角'],
    steps: [
      '五花肉切片先煸出油，倒掉多余油脂。',
      '下土豆、豆角翻炒，加生抽上色。',
      '加水没过食材，放八角，中火炖 20 分钟。',
      '下茄子与玉米再炖 12 分钟至软烂收汁。'
    ],
    good: ['elderly', 'spleen_weak', 'constipation', 'child_growth'],
    bad: ['diabetes'],
    tips: '一锅菜搞定多种蔬菜，适合人多的家庭；土豆玉米算主食，吃了要减饭。'
  },
  {
    id: 'db02', name: '拌三丝（凉菜）', region: 'northeast', cat: 'veg',
    meals: ['lunch', 'dinner'], nature: '凉', time: 15, kcal: 75, protein: 4, na: 300,
    tags: ['低脂', '高纤', '清淡', '润肠', '生冷'],
    ing: [{ n: '黄瓜', q: 70, u: 'g' }, { n: '胡萝卜', q: 40, u: 'g' }, { n: '粉丝(干)', q: 15, u: 'g' }, { n: '木耳', q: 20, u: 'g' }],
    season: ['香醋 6ml', '生抽 4ml', '香油 3g', '蒜末'],
    steps: [
      '粉丝温水泡软后煮 2 分钟过凉。',
      '木耳泡发焯水，胡萝卜焯 30 秒。',
      '黄瓜切丝。',
      '所有材料加调料拌匀，冷藏 10 分钟更爽口。'
    ],
    good: ['overweight', 'hypertension', 'constipation', 'liver_yang'],
    bad: ['spleen_weak', 'stomach_cold', 'palace_cold', 'menstrual', 'yang_deficiency', 'elderly'],
    tips: '夏日开胃菜；但脾胃虚寒、经期女性与老人应避免凉拌，可改为温拌（材料趁热拌）。'
  },
  {
    id: 'db03', name: '酸菜白肉汆锅（限盐）', region: 'northeast', cat: 'soup',
    meals: ['dinner'], nature: '平', time: 50, kcal: 195, protein: 14, na: 560,
    tags: ['开胃', '软烂', '高盐'],
    ing: [{ n: '酸菜', q: 90, u: 'g' }, { n: '五花肉', q: 70, u: 'g' }, { n: '粉条(干)', q: 15, u: 'g' }, { n: '冻豆腐', q: 40, u: 'g' }],
    season: ['姜片', '不额外加盐'],
    steps: [
      '酸菜清水浸泡 30 分钟并挤洗两遍（重要减盐步骤）。',
      '五花肉整块煮 25 分钟后切薄片。',
      '酸菜丝与肉汤同炖 20 分钟。',
      '下冻豆腐与粉条煮软，摆上白肉。'
    ],
    good: ['damp_heavy'],
    bad: ['hypertension', 'hyperlipidemia', 'diabetes', 'gout', 'pregnancy', 'fatty_liver'],
    tips: '腌菜含亚硝酸盐与大量钠，建议一月不超过 1-2 次；高血压高血脂家庭不推荐。'
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { RECIPES_OTHER: RECIPES_OTHER };
}
if (typeof window !== 'undefined') {
  window.RECIPES_OTHER = RECIPES_OTHER;
}
