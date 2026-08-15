const store = require('../../utils/store.js');
const rec = require('../../utils/recommend.js');
const { RECIPE_MAP, CATEGORIES } = require('../../data/recipes.js');
const { REGION_MAP } = require('../../data/regions.js');
const { CONDITION_MAP } = require('../../data/conditions.js');

Page({
  data: {
    recipe: null,
    region: null,
    catName: '',
    people: 4,
    ingList: [],
    analysis: [],
    goodNames: [],
    badNames: [],
    isFav: false,
    familyScore: null,
    familySuit: ''
  },

  onLoad(query) {
    const r = RECIPE_MAP[query.id];
    if (!r) {
      wx.showToast({ title: '菜谱不存在', icon: 'none' });
      return;
    }
    const members = store.getMembers();
    const settings = store.getSettings();
    const people = Math.max(1, members.length + (settings.guestCount || 0));

    wx.setNavigationBarTitle({ title: r.name });

    this.members = members;
    this.setData({
      recipe: r,
      region: REGION_MAP[r.region] || { name: '家常', healthNote: '' },
      catName: (CATEGORIES.find(c => c.key === r.cat) || {}).name || '',
      people,
      isFav: store.getFavs().indexOf(r.id) !== -1,
      goodNames: (r.good || []).map(id => CONDITION_MAP[id]).filter(Boolean),
      badNames: (r.bad || []).map(id => CONDITION_MAP[id]).filter(Boolean)
    });
    this.calcIng(people);
    this.calcAnalysis();
  },

  calcIng(people) {
    const r = this.data.recipe;
    if (!r) return;
    this.setData({
      ingList: r.ing.map(i => ({
        n: i.n,
        q: Math.round(i.q * people * 10) / 10,
        u: i.u
      }))
    });
  },

  calcAnalysis() {
    const r = this.data.recipe;
    const members = this.members || [];
    if (!r || !members.length) {
      this.setData({ analysis: [], familyScore: null });
      return;
    }
    const analysis = members.map(m => {
      const s = rec.scoreForMember(r, m);
      let level = 'normal', text = '一般';
      if (s.blocked) { level = 'block'; text = '禁忌，不要吃'; }
      else if (s.score >= 85) { level = 'best'; text = '很适合'; }
      else if (s.score >= 68) { level = 'good'; text = '适合'; }
      else if (s.score < 50) { level = 'avoid'; text = '建议少吃'; }
      return {
        name: m.name,
        gender: m.gender,
        initial: m.name.slice(0, 1),
        score: Math.max(0, Math.min(100, Math.round(s.score))),
        level, text,
        plus: s.plus.slice(0, 3),
        minus: s.minus.slice(0, 3)
      };
    });

    const fam = rec.scoreForFamily(r, members, {});
    let familySuit = '基本合适';
    if (fam.blocked) familySuit = '家中有人禁忌';
    else if (fam.total >= 82) familySuit = '全家都很合适';
    else if (fam.total >= 68) familySuit = '整体合适';
    else if (fam.total < 52) familySuit = '不太推荐同桌';

    this.setData({
      analysis,
      familyScore: Math.max(0, Math.min(100, Math.round(fam.total))),
      familySuit
    });
  },

  changePeople(e) {
    const d = Number(e.currentTarget.dataset.d);
    const people = Math.max(1, Math.min(20, this.data.people + d));
    this.setData({ people });
    this.calcIng(people);
  },

  toggleFav() {
    const on = store.toggleFav(this.data.recipe.id);
    this.setData({ isFav: on });
    wx.showToast({ title: on ? '已收藏' : '已取消收藏', icon: 'none' });
  },

  copyIng() {
    const txt = this.data.recipe.name + '（' + this.data.people + '人份）\n'
      + this.data.ingList.map(i => `${i.n} ${i.q}${i.u}`).join('\n')
      + '\n调味：' + (this.data.recipe.season || []).join('、');
    wx.setClipboardData({ data: txt, success: () => wx.showToast({ title: '已复制食材', icon: 'success' }) });
  }
});
