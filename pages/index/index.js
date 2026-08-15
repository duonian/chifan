const store = require('../../utils/store.js');
const util = require('../../utils/util.js');
const rec = require('../../utils/recommend.js');
const { CONDITION_MAP } = require('../../data/conditions.js');
const { REGIONS } = require('../../data/regions.js');
const { RECIPES } = require('../../data/recipes.js');

Page({
  data: {
    dateLabel: '',
    greeting: '',
    members: [],
    memberViews: [],
    settings: {},
    regions: REGIONS,
    peopleCount: 0,
    conflicts: [],
    todayPlan: null,
    summary: [],
    recipeTotal: RECIPES.length,
    regionTotal: REGIONS.length
  },

  onShow() {
    this.load();
  },

  load() {
    const members = store.getMembers();
    const settings = store.getSettings();
    const now = new Date();
    const h = now.getHours();
    let greeting = '早上好';
    if (h >= 11 && h < 14) greeting = '中午好';
    else if (h >= 14 && h < 18) greeting = '下午好';
    else if (h >= 18) greeting = '晚上好';

    const memberViews = members.map(m => ({
      ...m,
      initial: m.name ? m.name.slice(0, 1) : '?',
      stage: util.ageStage(m.age),
      genderName: util.genderName(m.gender),
      condNames: (m.conditions || []).map(id => (CONDITION_MAP[id] ? CONDITION_MAP[id].name : id))
    }));

    const peopleCount = members.length + (settings.guestCount || 0);
    const conflicts = members.length > 1 ? rec.detectConflicts(members) : [];

    const dk = util.dateKey(now);
    const saved = store.getPlan(dk);
    let summary = [];
    if (saved) {
      summary = [
        { label: '早餐', dishes: (saved.meals.breakfast || []).map(d => d.name).join(' · ') },
        { label: '午餐', dishes: (saved.meals.lunch || []).map(d => d.name).join(' · ') },
        { label: '晚餐', dishes: (saved.meals.dinner || []).map(d => d.name).join(' · ') }
      ];
    }

    this.setData({
      dateLabel: util.dateLabel(now),
      greeting,
      members,
      memberViews,
      settings,
      peopleCount,
      conflicts,
      todayPlan: saved,
      summary
    });
  },

  toggleRegion(e) {
    const id = e.currentTarget.dataset.id;
    const settings = this.data.settings;
    const list = settings.regions || [];
    const idx = list.indexOf(id);
    if (idx === -1) list.push(id); else list.splice(idx, 1);
    settings.regions = list;
    store.saveSettings(settings);
    this.setData({ settings });
  },

  changeGuest(e) {
    const settings = this.data.settings;
    settings.guestCount = Math.max(0, Number(e.detail.value) || 0);
    store.saveSettings(settings);
    this.setData({
      settings,
      peopleCount: this.data.members.length + settings.guestCount
    });
  },

  goPlan() {
    if (!this.data.members.length) {
      wx.showModal({
        title: '还没有家庭成员',
        content: '请先添加至少一位成员，并填写年龄、性别和身体状况，才能生成配餐方案。',
        confirmText: '去添加',
        success: r => { if (r.confirm) wx.navigateTo({ url: '/pages/members/members' }); }
      });
      return;
    }
    wx.switchTab({ url: '/pages/plan/plan' });
  },

  goMembers() { wx.navigateTo({ url: '/pages/members/members' }); },
  goMine() { wx.switchTab({ url: '/pages/mine/mine' }); },
  goRecipes() { wx.switchTab({ url: '/pages/recipes/recipes' }); },
  goKitchen() { wx.navigateTo({ url: '/pages/kitchen/kitchen' }); },
  goShopping() { wx.navigateTo({ url: '/pages/shopping/shopping' }); }
});
