const store = require('../../utils/store.js');
const { REGIONS } = require('../../data/regions.js');

Page({
  data: {
    regions: REGIONS,
    settings: {},
    memberCount: 0,
    peopleCount: 0,
    excludeInput: '',
    excludeSuggestions: ['香菜', '葱花', '蒜', '辣椒', '羊肉', '海鲜', '牛肉', '芹菜', '木耳', '豆腐']
  },

  onShow() {
    this.load();
  },

  load() {
    const members = store.getMembers();
    const settings = store.getSettings();
    if (!settings.exclude) settings.exclude = [];
    if (!settings.regions) settings.regions = [];
    this.setData({
      settings,
      memberCount: members.length,
      peopleCount: members.length + (settings.guestCount || 0)
    });
  },

  /* ---------------- 地区口味 ---------------- */
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

  /* ---------------- 客人人数 ---------------- */
  guestMinus() {
    const settings = this.data.settings;
    settings.guestCount = Math.max(0, (settings.guestCount || 0) - 1);
    store.saveSettings(settings);
    this.setData({ settings, peopleCount: this.data.memberCount + settings.guestCount });
  },
  guestPlus() {
    const settings = this.data.settings;
    settings.guestCount = Math.min(20, (settings.guestCount || 0) + 1);
    store.saveSettings(settings);
    this.setData({ settings, peopleCount: this.data.memberCount + settings.guestCount });
  },

  /* ---------------- 最长烹饪时间 ---------------- */
  timeMinus() {
    const settings = this.data.settings;
    settings.maxTime = Math.max(0, (settings.maxTime || 0) - 10);
    store.saveSettings(settings);
    this.setData({ settings });
  },
  timePlus() {
    const settings = this.data.settings;
    settings.maxTime = Math.min(120, (settings.maxTime || 0) + 10);
    store.saveSettings(settings);
    this.setData({ settings });
  },

  /* ---------------- 全家忌口 / 不吃的东西 ---------------- */
  onExcludeInput(e) {
    this.setData({ excludeInput: e.detail.value });
  },
  addExclude() {
    const v = (this.data.excludeInput || '').trim();
    if (!v) return;
    const settings = this.data.settings;
    const list = settings.exclude || [];
    if (list.indexOf(v) === -1) list.push(v);
    settings.exclude = list;
    store.saveSettings(settings);
    this.setData({ settings, excludeInput: '' });
    wx.showToast({ title: '已加入忌口清单', icon: 'none' });
  },
  removeExclude(e) {
    const name = e.currentTarget.dataset.name;
    const settings = this.data.settings;
    settings.exclude = (settings.exclude || []).filter(x => x !== name);
    store.saveSettings(settings);
    this.setData({ settings });
  },
  quickExclude(e) {
    const name = e.currentTarget.dataset.name;
    const settings = this.data.settings;
    const list = settings.exclude || [];
    if (list.indexOf(name) !== -1) return;
    list.push(name);
    settings.exclude = list;
    store.saveSettings(settings);
    this.setData({ settings });
  },

  /* ---------------- 跳转 ---------------- */
  goMembers() { wx.navigateTo({ url: '/pages/members/members' }); },
  goKitchen() { wx.navigateTo({ url: '/pages/kitchen/kitchen' }); },
  goPlan() { wx.switchTab({ url: '/pages/plan/plan' }); },

  /* ---------------- 清空示例数据 ---------------- */
  clearData() {
    wx.showModal({
      title: '清空本地数据',
      content: '将删除全部家庭成员、设置与已生成的食谱（仅本机数据，不会上传）。确定继续？',
      confirmColor: '#B24C3C',
      success: r => {
        if (!r.confirm) return;
        try {
          wx.clearStorageSync();
          store.initIfEmpty();
          this.load();
          wx.showToast({ title: '已重置为示例', icon: 'success' });
        } catch (e) {
          wx.showToast({ title: '清空失败', icon: 'none' });
        }
      }
    });
  }
});
