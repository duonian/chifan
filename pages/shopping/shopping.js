const store = require('../../utils/store.js');
const util = require('../../utils/util.js');

function parseDateKey(k) {
  const p = (k || '').split('-');
  if (p.length !== 3) return null;
  return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
}

Page({
  data: {
    dateKey: '',
    dateLabel: '',
    peopleCount: 0,
    planExists: false,
    items: [],
    checkedCount: 0,
    total: 0,
    allChecked: false
  },

  onLoad(query) {
    const dk = (query && query.date) || util.dateKey(new Date());
    const dt = parseDateKey(dk);
    const label = dt ? util.dateLabel(dt) : dk;
    this.setData({ dateKey: dk, dateLabel: label });
    this.loadPlan();
  },

  onShow() {
    // 从其它页面返回时刷新勾选状态
    if (this._ready) this.loadPlan();
  },

  loadPlan() {
    const plan = store.getPlan(this.data.dateKey);
    if (!plan || !plan.shopping || !plan.shopping.length) {
      this.setData({ planExists: false, items: [], checkedCount: 0, total: 0, allChecked: false });
      this._ready = true;
      return;
    }
    const checkedMap = this.getChecked();
    const items = plan.shopping.map(it => {
      const key = it.name + '|' + it.unit;
      const from = (it.from || []).slice(0, 4);
      let fromText = from.join('、');
      if ((it.from || []).length > 4) fromText += ' 等';
      return {
        key,
        name: it.name,
        display: it.display,
        unit: it.unit,
        qty: it.qty,
        fromText,
        checked: checkedMap.indexOf(key) !== -1
      };
    });
    const checkedCount = items.filter(i => i.checked).length;
    this.setData({
      planExists: true,
      peopleCount: plan.peopleCount || 0,
      items,
      total: items.length,
      checkedCount,
      allChecked: items.length > 0 && checkedCount === items.length,
      _ready: true
    });
  },

  getChecked() {
    try {
      return wx.getStorageSync('shopping_checked_' + this.data.dateKey) || [];
    } catch (e) {
      return [];
    }
  },

  saveChecked(arr) {
    try {
      wx.setStorageSync('shopping_checked_' + this.data.dateKey, arr);
    } catch (e) {}
  },

  toggleItem(e) {
    const key = e.currentTarget.dataset.key;
    const items = this.data.items.slice();
    let checkedCount = 0;
    for (let i = 0; i < items.length; i++) {
      if (items[i].key === key) items[i].checked = !items[i].checked;
      if (items[i].checked) checkedCount++;
    }
    const checkedKeys = items.filter(i => i.checked).map(i => i.key);
    this.saveChecked(checkedKeys);
    this.setData({
      items,
      checkedCount,
      allChecked: items.length > 0 && checkedCount === items.length
    });
  },

  toggleAll() {
    const next = !this.data.allChecked;
    const items = this.data.items.map(i => ({ ...i, checked: next }));
    const checkedKeys = next ? items.map(i => i.key) : [];
    this.saveChecked(checkedKeys);
    this.setData({ items, checkedCount: next ? items.length : 0, allChecked: next });
  },

  copyList() {
    const lines = this.data.items.map(i => (i.checked ? '☑ ' : '☐ ') + i.name + ' ' + i.display);
    const text = '采购清单（' + this.data.dateLabel + ' · ' + this.data.peopleCount + '人）\n' + lines.join('\n');
    wx.setClipboardData({ data: text, success: () => wx.showToast({ title: '已复制清单', icon: 'success' }) });
  },

  goPlan() {
    wx.navigateBack({
      fail: () => wx.switchTab({ url: '/pages/plan/plan' })
    });
  }
});
