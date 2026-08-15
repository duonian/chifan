const store = require('../../utils/store.js');
const util = require('../../utils/util.js');
const { RECIPE_MAP } = require('../../data/recipes.js');

const MEAL_KEYS = ['breakfast', 'lunch', 'dinner', 'snack'];
const MEAL_NAMES = { breakfast: '早餐', lunch: '午餐', dinner: '晚餐', snack: '加餐' };

function mealNutrition(ids) {
  let kcal = 0, protein = 0, na = 0;
  (ids || []).forEach(function (d) {
    const r = RECIPE_MAP[d.id];
    if (r) { kcal += r.kcal || 0; protein += r.protein || 0; na += r.na || 0; }
  });
  return {
    kcal: Math.round(kcal),
    protein: Math.round(protein),
    na: Math.round(na),
    salt: Math.round(na * 2.54 / 1000 * 10) / 10
  };
}

function nutritionTargets(members) {
  const set = {};
  (members || []).forEach(function (m) { (m.conditions || []).forEach(function (c) { set[c] = 1; }); });
  const out = [];
  if (set.hypertension || set.gout) out.push({ title: '限盐 · 限嘌呤', text: '今日盐尽量 ≤5g/人；浓汤、腌制品、海鲜内脏限量。痛风者不喝酒、不喝老火汤。' });
  if (set.diabetes || set.pre_diabetes) out.push({ title: '控糖 · 低 GI', text: '主食以杂粮饭/薯类为主，避免白粥与精白米面；进餐顺序：汤→菜→蛋白→主食。' });
  if (set.hyperlipidemia || set.fatty_liver) out.push({ title: '控油 · 降脂', text: '烹调油 ≤25g/人，多选蒸煮拌；肉类去皮去肥膘先焯水。' });
  if (set.anemia || set.menstrual || set.palace_cold || set.pregnancy || set.breastfeeding) out.push({ title: '补铁补蛋白', text: '搭配肝脏/红肉/鸭血与维C 蔬菜；餐后 1 小时不喝浓茶。' });
  if (set.osteoporosis || set.child_growth || set.teen || set.elderly || set.pregnancy || set.breastfeeding) out.push({ title: '补钙', text: '每天奶类/豆制品/小鱼小虾，多晒太阳助钙吸收。' });
  if (set.spleen_weak || set.stomach_cold || set.yang_deficiency) out.push({ title: '温软好消化', text: '食物温热入口，少生冷油腻，细嚼慢咽七分饱。' });
  if (set.constipation) out.push({ title: '高纤多饮水', text: '多吃蔬果粗粮，晨起一杯温水，每日饮水 1500ml 以上。' });
  if (!out.length) out.push({ title: '均衡即可', text: '当前无特殊忌口，保持多样化、少油少盐、三餐规律即可。' });
  return out;
}

Page({
  data: {
    dateOffset: 0,
    dateLabel: '',
    dateKey: '',
    hasMembers: false,
    hasPlan: false,
    peopleCount: 0,
    overall: null,
    meals: [],
    targets: []
  },

  onShow() { this.refresh(); },

  refresh() {
    const members = store.getMembers();
    const d = util.addDays(new Date(), this.data.dateOffset);
    const dk = util.dateKey(d);
    const saved = store.getPlan(dk);

    let overall = null;
    let meals = [];
    if (saved) {
      let tot = { kcal: 0, protein: 0, na: 0 };
      MEAL_KEYS.forEach(function (k) {
        const ids = (saved.meals && saved.meals[k]) || [];
        const n = mealNutrition(ids);
        tot.kcal += n.kcal; tot.protein += n.protein; tot.na += n.na;
        if (ids.length) {
          meals.push({ key: k, name: MEAL_NAMES[k], kcal: n.kcal, protein: n.protein, salt: n.salt });
        }
      });
      const people = saved.peopleCount || members.length;
      overall = {
        kcalPerPerson: Math.round(tot.kcal),
        proteinPerPerson: Math.round(tot.protein),
        saltGram: Math.round(tot.na * 2.54 / 1000 * 10) / 10,
        kcalTotal: Math.round(tot.kcal * people),
        naLevel: tot.na > 2000 ? 'high' : (tot.na > 1500 ? 'mid' : 'ok')
      };
    }

    this.setData({
      hasMembers: members.length > 0,
      dateLabel: util.dateLabel(d),
      dateKey: dk,
      hasPlan: !!saved,
      peopleCount: saved ? saved.peopleCount : members.length,
      overall: overall,
      meals: meals,
      targets: nutritionTargets(members)
    });
  },

  changeDate(e) {
    const delta = Number(e.currentTarget.dataset.d);
    this.setData({ dateOffset: this.data.dateOffset + delta }, () => this.refresh());
  },

  goPlan() { wx.switchTab({ url: '/pages/plan/plan' }); }
});
