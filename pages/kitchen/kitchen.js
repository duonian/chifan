const store = require('../../utils/store.js');
const rec = require('../../utils/recommend.js');
const { RECIPES, RECIPE_MAP, CATEGORIES } = require('../../data/recipes.js');
const { REGION_MAP } = require('../../data/regions.js');

const CAT_NAME = {};
CATEGORIES.forEach(function (c) { CAT_NAME[c.key] = c.name; });

function regionName(id) { return (REGION_MAP[id] || { name: '家常' }).name; }

function suitOf(total) {
  if (total >= 82) return { text: '非常适合', cls: 'suit-best' };
  if (total >= 68) return { text: '适合', cls: 'suit-good' };
  if (total >= 52) return { text: '基本可以', cls: 'suit-normal' };
  return { text: '需注意', cls: 'suit-avoid' };
}

// 装饰一条菜：补上适配文字、地区名、分类名
function decorate(it) {
  const suit = suitOf(it.total);
  return {
    id: it.id,
    name: it.name,
    region: it.region,
    cat: it.cat,
    total: it.total,
    used: it.used || [],
    suitText: suit.text,
    suitCls: suit.cls,
    regionName: regionName(it.region),
    catName: CAT_NAME[it.cat] || ''
  };
}

// 把常吃菜 id 列表转成带适配度的展示数组（排除已被全家忌口淘汰的）
function buildRegular(ids, members, opts) {
  return (ids || []).map(function (id) { return RECIPE_MAP[id]; }).filter(Boolean)
    .map(function (r) {
      const s = rec.scoreForFamily(r, members, opts);
      return decorate({ id: r.id, name: r.name, region: r.region, cat: r.cat, total: Math.round(s.total) });
    })
    .filter(function (x) { return x.suitCls !== 'suit-avoid'; })
    .sort(function (a, b) { return b.total - a.total; });
}

Page({
  data: {
    hasMembers: false,
    regularDishes: [],
    inventory: [],
    invInput: '',
    invSuggestions: ['鸡蛋', '番茄', '豆腐', '青菜', '土豆', '葱', '姜', '瘦肉', '米饭', '胡萝卜', '木耳', '虾仁'],
    // 添加菜品弹层
    pickerVisible: false,
    pickerQuery: '',
    pickerResults: [],
    // 智能搭配结果
    result: null
  },

  onShow() { this.load(); },

  load() {
    const members = store.getMembers();
    const settings = store.getSettings();
    const opts = { regions: settings.regions || [], exclude: settings.exclude || [] };
    this.setData({
      hasMembers: members.length > 0,
      inventory: settings.inventory || [],
      regularDishes: buildRegular(settings.regularDishes || [], members, opts)
    });
  },

  /* ---------------- 常吃菜 ---------------- */
  addClick() {
    this.setData({ pickerVisible: true, pickerQuery: '', pickerResults: [] });
  },
  closePicker() {
    this.setData({ pickerVisible: false });
  },
  noop() {},
  pickerInput(e) {
    const q = (e.detail.value || '').trim().toLowerCase();
    let results = [];
    if (q) {
      results = RECIPES.filter(function (r) {
        if (r.name && r.name.toLowerCase().indexOf(q) !== -1) return true;
        if (r.ing && r.ing.some(function (i) { return i.n && i.n.toLowerCase().indexOf(q) !== -1; })) return true;
        return false;
      }).slice(0, 12).map(function (r) {
        return { id: r.id, name: r.name, regionName: regionName(r.region), catName: CAT_NAME[r.cat] || '' };
      });
    }
    this.setData({ pickerQuery: q, pickerResults: results });
  },
  pickRecipe(e) {
    const id = e.currentTarget.dataset.id;
    const settings = store.getSettings();
    const list = settings.regularDishes || [];
    if (list.indexOf(id) !== -1) {
      wx.showToast({ title: '已在列表中', icon: 'none' });
      return;
    }
    list.push(id);
    store.saveRegularDishes(list);
    this.setData({ pickerVisible: false, pickerQuery: '', pickerResults: [] });
    this.load();
    wx.showToast({ title: '已添加', icon: 'success' });
  },
  removeRegular(e) {
    const id = e.currentTarget.dataset.id;
    const settings = store.getSettings();
    settings.regularDishes = (settings.regularDishes || []).filter(function (x) { return x !== id; });
    store.saveRegularDishes(settings.regularDishes);
    this.load();
  },

  /* ---------------- 现有食材 / 剩菜 ---------------- */
  invInput(e) { this.setData({ invInput: e.detail.value }); },
  addInv() {
    const v = (this.data.invInput || '').trim();
    if (!v) return;
    const settings = store.getSettings();
    const list = settings.inventory || [];
    if (list.indexOf(v) === -1) list.push(v);
    store.saveInventory(list);
    this.setData({ inventory: list, invInput: '' });
  },
  quickInv(e) {
    const name = e.currentTarget.dataset.name;
    const settings = store.getSettings();
    const list = settings.inventory || [];
    if (list.indexOf(name) === -1) list.push(name);
    store.saveInventory(list);
    this.setData({ inventory: list });
  },
  removeInv(e) {
    const name = e.currentTarget.dataset.name;
    const settings = store.getSettings();
    settings.inventory = (settings.inventory || []).filter(function (x) { return x !== name; });
    store.saveInventory(settings.inventory);
    this.setData({ inventory: settings.inventory });
  },

  /* ---------------- 智能搭配 ---------------- */
  onSmart() {
    const members = store.getMembers();
    if (!members.length) {
      wx.showToast({ title: '请先添加家庭成员', icon: 'none' });
      return;
    }
    const settings = store.getSettings();
    const opts = { regions: settings.regions || [], exclude: settings.exclude || [] };
    const res = rec.kitchenSuggestion(members, opts, settings.inventory || [], settings.regularDishes || []);
    const result = {
      regular: (res.regular || []).map(decorate),
      useUp: (res.useUp || []).map(decorate),
      complement: (res.complement || []).map(decorate),
      needBuy: res.needBuy || []
    };
    this.setData({ result: result });
    wx.pageScrollTo({ scrollTop: 99999, duration: 300 });
  },

  /* ---------------- 跳转 ---------------- */
  goMembers() { wx.navigateTo({ url: '/pages/members/members' }); },
  goPlan() { wx.switchTab({ url: '/pages/plan/plan' }); },
  openDetail(e) {
    const id = e.currentTarget.dataset.id;
    if (id) wx.navigateTo({ url: '/pages/detail/detail?id=' + id });
  }
});
