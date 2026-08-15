const store = require('../../utils/store.js');
const rec = require('../../utils/recommend.js');
const { REGIONS, REGION_MAP } = require('../../data/regions.js');
const { CATEGORIES } = require('../../data/recipes.js');
const { CONDITIONS, CONDITION_MAP } = require('../../data/conditions.js');

const SUIT_TEXT = {
  best: { text: '非常适合', cls: 'suit-best' },
  good: { text: '适合', cls: 'suit-good' },
  normal: { text: '一般', cls: 'suit-normal' },
  avoid: { text: '不建议', cls: 'suit-avoid' },
  block: { text: '禁忌', cls: 'suit-block' }
};

Page({
  data: {
    keyword: '',
    regionFilter: '',
    catFilter: '',
    condFilter: '',
    regions: REGIONS,
    cats: CATEGORIES,
    conditions: CONDITIONS,
    list: [],
    total: 0,
    members: [],
    hasMembers: false,
    showFilter: false
  },

  onShow() { this.run(); },

  run() {
    const members = store.getMembers();
    const settings = store.getSettings();
    const kw = (this.data.keyword || '').trim();
    const rf = this.data.regionFilter;
    const cf = this.data.catFilter;
    const condf = this.data.condFilter;

    const filterFn = r => {
      if (rf && r.region !== rf) return false;
      if (cf && r.cat !== cf) return false;
      if (condf && (!r.good || r.good.indexOf(condf) === -1)) return false;
      if (kw) {
        const txt = r.name + ' ' + r.ing.map(i => i.n).join(' ') + ' ' + (r.tags || []).join(' ');
        if (txt.indexOf(kw) === -1) return false;
      }
      return true;
    };

    let ranked;
    if (members.length) {
      ranked = rec.rankAll(members, { regions: settings.regions || [] }, filterFn);
    } else {
      const { RECIPES } = require('../../data/recipes.js');
      ranked = RECIPES.filter(filterFn).map(r => ({
        recipe: r, total: 0, blocked: false, suitLevel: '', detail: []
      }));
    }

    const list = ranked.slice(0, 120).map(item => {
      const r = item.recipe;
      const region = REGION_MAP[r.region] || {};
      const s = SUIT_TEXT[item.suitLevel] || null;
      const goodFor = (r.good || []).slice(0, 3)
        .map(id => (CONDITION_MAP[id] ? CONDITION_MAP[id].name : ''))
        .filter(Boolean).join('、');
      return {
        id: r.id,
        name: r.name,
        regionName: region.name || '家常',
        regionColor: region.color || '#8A8A8A',
        catName: (CATEGORIES.find(c => c.key === r.cat) || {}).name || '',
        time: r.time,
        kcal: r.kcal,
        tags: (r.tags || []).slice(0, 3),
        goodFor,
        suitText: s ? s.text : '',
        suitCls: s ? s.cls : ''
      };
    });

    this.setData({
      list,
      total: ranked.length,
      members,
      hasMembers: members.length > 0
    });
  },

  onKeyword(e) {
    this.setData({ keyword: e.detail.value }, () => this.run());
  },
  pickRegion(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({ regionFilter: this.data.regionFilter === id ? '' : id }, () => this.run());
  },
  pickCat(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({ catFilter: this.data.catFilter === id ? '' : id }, () => this.run());
  },
  pickCond(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({ condFilter: this.data.condFilter === id ? '' : id }, () => this.run());
  },
  toggleFilter() { this.setData({ showFilter: !this.data.showFilter }); },
  reset() {
    this.setData({ regionFilter: '', catFilter: '', condFilter: '', keyword: '' }, () => this.run());
  },
  openDetail(e) {
    wx.navigateTo({ url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id });
  }
});
