const store = require('../../utils/store.js');
const util = require('../../utils/util.js');
const rec = require('../../utils/recommend.js');
const { REGION_MAP } = require('../../data/regions.js');
const { CATEGORIES, MEAL_NAMES, RECIPE_MAP } = require('../../data/recipes.js');

const CAT_NAME = {};
CATEGORIES.forEach(c => { CAT_NAME[c.key] = c.name; });

const MEAL_ORDER = [
  { key: 'breakfast', name: '早餐', icon: '🌅', time: '07:00 - 08:30' },
  { key: 'lunch', name: '午餐', icon: '🍚', time: '11:30 - 13:00' },
  { key: 'dinner', name: '晚餐', icon: '🌙', time: '18:00 - 19:30' },
  { key: 'snack', name: '加餐 / 茶饮', icon: '🍵', time: '15:00 或睡前' }
];

function suitOf(total) {
  if (total >= 82) return { text: '非常适合', cls: 'suit-best' };
  if (total >= 68) return { text: '适合', cls: 'suit-good' };
  if (total >= 52) return { text: '基本可以', cls: 'suit-normal' };
  return { text: '需注意', cls: 'suit-avoid' };
}

function dishView(item, peopleCount) {
  const r = item.recipe;
  const region = REGION_MAP[r.region] || { name: '家常' };
  const suit = suitOf(item.total);
  const ingText = r.ing
    .map(i => `${i.n} ${Math.round(i.q * peopleCount)}${i.u}`)
    .join('、');
  const cautions = (item.detail || [])
    .filter(d => d.score < 52 && d.minus.length)
    .map(d => ({ name: d.name, reason: d.minus[0] }));
  const highlights = (item.detail || [])
    .filter(d => d.score >= 80 && d.plus.length)
    .map(d => d.name);

  return {
    id: r.id,
    name: r.name,
    cat: r.cat,
    catName: CAT_NAME[r.cat] || '',
    regionName: region.name,
    regionColor: region.color,
    tags: (r.tags || []).slice(0, 4),
    time: r.time,
    kcal: r.kcal,
    protein: r.protein,
    na: r.na,
    total: item.total,
    suitText: suit.text,
    suitCls: suit.cls,
    ingText,
    tips: r.tips,
    cautions,
    highlights: highlights.join('、')
  };
}

Page({
  data: {
    dateOffset: 0,
    dateLabel: '',
    dateKey: '',
    peopleCount: 0,
    members: [],
    hasMembers: false,
    generated: false,
    mealOrder: MEAL_ORDER,
    viewMeals: [],
    notes: [],
    conflicts: [],
    nutrition: null,
    regionNames: '',
    loading: false
  },

  onShow() {
    this.refreshBase();
  },

  refreshBase() {
    const members = store.getMembers();
    const settings = store.getSettings();
    const peopleCount = members.length + (settings.guestCount || 0);
    const d = util.addDays(new Date(), this.data.dateOffset);
    const dk = util.dateKey(d);
    const regionNames = (settings.regions || [])
      .map(id => (REGION_MAP[id] ? REGION_MAP[id].name : ''))
      .filter(Boolean).join('、') || '全部菜系';

    this.setData({
      members,
      hasMembers: members.length > 0,
      peopleCount,
      dateKey: dk,
      dateLabel: util.dateLabel(d),
      regionNames
    }, () => {
      const saved = store.getPlan(dk);
      if (saved) this.renderSaved(saved);
      else this.setData({ generated: false, viewMeals: [], notes: [], nutrition: null });
    });
  },

  renderSaved(saved) {
    this.setData({
      generated: true,
      viewMeals: saved.viewMeals,
      notes: saved.notes,
      conflicts: saved.conflicts,
      nutrition: saved.nutrition,
      peopleCount: saved.peopleCount
    });
  },

  changeDate(e) {
    const delta = Number(e.currentTarget.dataset.d);
    this.setData({ dateOffset: this.data.dateOffset + delta }, () => this.refreshBase());
  },

  generate(seedOffset) {
    const members = this.data.members;
    if (!members.length) {
      wx.showToast({ title: '请先添加家庭成员', icon: 'none' });
      return;
    }
    this.setData({ loading: true });
    const settings = store.getSettings();
    const peopleCount = members.length + (settings.guestCount || 0);

    const plan = rec.generateDayPlan(members, {
      regions: settings.regions || [],
      dateKey: this.data.dateKey,
      peopleCount,
      recentIds: store.getRecentIds(),
      maxTime: settings.maxTime || 0,
      exclude: settings.exclude || [],
      seedOffset: typeof seedOffset === 'number' ? seedOffset : 0
    });

    const viewMeals = MEAL_ORDER.map(m => ({
      key: m.key,
      name: m.name,
      icon: m.icon,
      time: m.time,
      dishes: (plan.meals[m.key] || []).map(d => dishView(d, peopleCount))
    })).filter(m => m.dishes.length);

    const snapshot = {
      dateKey: plan.dateKey,
      peopleCount,
      viewMeals,
      notes: plan.notes,
      conflicts: plan.conflicts,
      nutrition: plan.nutrition,
      shopping: plan.shopping,
      allIds: plan.allIds,
      meals: {
        breakfast: (plan.meals.breakfast || []).map(d => ({ id: d.recipe.id, name: d.recipe.name })),
        lunch: (plan.meals.lunch || []).map(d => ({ id: d.recipe.id, name: d.recipe.name })),
        dinner: (plan.meals.dinner || []).map(d => ({ id: d.recipe.id, name: d.recipe.name })),
        snack: (plan.meals.snack || []).map(d => ({ id: d.recipe.id, name: d.recipe.name }))
      }
    };
    store.savePlan(this.data.dateKey, snapshot);

    this.setData({
      loading: false,
      generated: true,
      peopleCount,
      viewMeals,
      notes: plan.notes,
      conflicts: plan.conflicts,
      nutrition: plan.nutrition
    });
  },

  onGenerate() { this.generate(0); },

  onRegenerate() {
    this.generate(Math.floor(Math.random() * 100000) + 1);
    wx.showToast({ title: '换了一批', icon: 'none' });
  },

  // 单菜替换
  replaceDish(e) {
    const { meal, cat, id } = e.currentTarget.dataset;
    const settings = store.getSettings();
    const saved = store.getPlan(this.data.dateKey);
    if (!saved) return;

    const exclude = [];
    saved.viewMeals.forEach(m => m.dishes.forEach(d => exclude.push(d.id)));

    const next = rec.replaceDish(this.data.members, {
      regions: settings.regions || [],
      maxTime: settings.maxTime || 0,
      exclude: settings.exclude || []
    }, meal, cat, exclude);

    if (!next) {
      wx.showToast({ title: '暂无更多合适的选择', icon: 'none' });
      return;
    }

    const viewMeals = saved.viewMeals.map(m => {
      if (m.key !== meal) return m;
      return {
        ...m,
        dishes: m.dishes.map(d => (d.id === id ? dishView(next, saved.peopleCount) : d))
      };
    });

    // 重新汇总营养与采购
    const allRecipes = [];
    viewMeals.forEach(m => m.dishes.forEach(d => {
      if (RECIPE_MAP[d.id]) allRecipes.push({ recipe: RECIPE_MAP[d.id] });
    }));
    const fakeMeals = { breakfast: [], lunch: [], dinner: [], snack: [] };
    viewMeals.forEach(m => {
      fakeMeals[m.key] = m.dishes.map(d => ({ recipe: RECIPE_MAP[d.id] })).filter(x => x.recipe);
    });

    let kcal = 0, protein = 0, na = 0;
    allRecipes.forEach(x => { kcal += x.recipe.kcal; protein += x.recipe.protein; na += x.recipe.na; });
    const nutrition = {
      kcalPerPerson: Math.round(kcal),
      proteinPerPerson: Math.round(protein),
      naPerPerson: Math.round(na),
      kcalTotal: Math.round(kcal * saved.peopleCount),
      saltGram: Math.round(na * 2.54 / 1000 * 10) / 10,
      naLevel: na > 2000 ? 'high' : (na > 1500 ? 'mid' : 'ok')
    };

    saved.viewMeals = viewMeals;
    saved.nutrition = nutrition;
    saved.shopping = rec.shoppingList(fakeMeals, saved.peopleCount);
    saved.meals[meal] = viewMeals.find(m => m.key === meal).dishes.map(d => ({ id: d.id, name: d.name }));
    store.savePlan(this.data.dateKey, saved);

    this.setData({ viewMeals, nutrition });
    wx.showToast({ title: '已替换为「' + next.recipe.name + '」', icon: 'none' });
  },

  openDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/detail/detail?id=' + id });
  },

  goShopping() {
    wx.navigateTo({ url: '/pages/shopping/shopping?date=' + this.data.dateKey });
  },

  goMembers() { wx.navigateTo({ url: '/pages/members/members' }); },

  copyPlan() {
    const lines = [];
    lines.push(`【${this.data.dateLabel}｜${this.data.peopleCount}人份家庭食谱】`);
    this.data.viewMeals.forEach(m => {
      lines.push(`\n${m.name}：`);
      m.dishes.forEach(d => lines.push(`  · ${d.name}（${d.regionName}·${d.catName}）`));
    });
    if (this.data.nutrition) {
      lines.push(`\n每人约 ${this.data.nutrition.kcalPerPerson} 千卡 / 蛋白质 ${this.data.nutrition.proteinPerPerson}g / 食盐约 ${this.data.nutrition.saltGram}g`);
    }
    wx.setClipboardData({
      data: lines.join('\n'),
      success: () => wx.showToast({ title: '食谱已复制', icon: 'success' })
    });
  }
});
