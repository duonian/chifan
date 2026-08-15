const store = require('../../utils/store.js');
const util = require('../../utils/util.js');
const { CONDITIONS, CONDITION_GROUPS, CONDITION_MAP } = require('../../data/conditions.js');

function buildGroups() {
  return CONDITION_GROUPS.map(g => ({
    key: g.key,
    name: g.name,
    items: CONDITIONS.filter(c => c.group === g.key)
  }));
}

const EMPTY_FORM = {
  id: '',
  name: '',
  gender: 'female',
  age: '',
  conditions: [],
  dislikesText: '',
  allergiesText: '',
  note: ''
};

Page({
  data: {
    list: [],
    groups: buildGroups(),
    editing: false,
    form: { ...EMPTY_FORM },
    openGroup: 'digest',
    detailCond: null
  },

  onShow() { this.load(); },

  load() {
    const list = store.getMembers().map(m => ({
      ...m,
      initial: m.name ? m.name.slice(0, 1) : '?',
      genderName: util.genderName(m.gender),
      stage: util.ageStage(m.age),
      condList: (m.conditions || []).map(id => CONDITION_MAP[id]).filter(Boolean)
    }));
    this.setData({ list });
  },

  /* ---------- 编辑 ---------- */
  addMember() {
    this.setData({ editing: true, form: { ...EMPTY_FORM, conditions: [] }, openGroup: 'digest' });
  },

  editMember(e) {
    const id = e.currentTarget.dataset.id;
    const m = store.getMembers().find(x => x.id === id);
    if (!m) return;
    this.setData({
      editing: true,
      form: {
        id: m.id,
        name: m.name,
        gender: m.gender,
        age: String(m.age || ''),
        conditions: (m.conditions || []).slice(),
        dislikesText: (m.dislikes || []).join('、'),
        allergiesText: (m.allergies || []).join('、'),
        note: m.note || ''
      },
      openGroup: 'digest'
    });
  },

  closeEdit() { this.setData({ editing: false, detailCond: null }); },

  onName(e) { this.setData({ 'form.name': e.detail.value }); },
  onAge(e) { this.setData({ 'form.age': e.detail.value }); },
  onNote(e) { this.setData({ 'form.note': e.detail.value }); },
  onDislikes(e) { this.setData({ 'form.dislikesText': e.detail.value }); },
  onAllergies(e) { this.setData({ 'form.allergiesText': e.detail.value }); },
  setGender(e) { this.setData({ 'form.gender': e.currentTarget.dataset.g }); },

  toggleGroup(e) {
    const k = e.currentTarget.dataset.k;
    this.setData({ openGroup: this.data.openGroup === k ? '' : k });
  },

  toggleCond(e) {
    const id = e.currentTarget.dataset.id;
    const list = this.data.form.conditions.slice();
    const i = list.indexOf(id);
    if (i === -1) list.push(id); else list.splice(i, 1);
    this.setData({ 'form.conditions': list });
  },

  showCondDetail(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({ detailCond: CONDITION_MAP[id] || null });
  },
  hideCondDetail() { this.setData({ detailCond: null }); },

  save() {
    const f = this.data.form;
    if (!f.name.trim()) {
      wx.showToast({ title: '请填写称呼', icon: 'none' });
      return;
    }
    const age = Number(f.age);
    if (!age || age < 1 || age > 120) {
      wx.showToast({ title: '请填写有效年龄', icon: 'none' });
      return;
    }
    const splitText = t => (t || '').split(/[、,，\s]+/).filter(Boolean);
    const member = {
      id: f.id,
      name: f.name.trim(),
      gender: f.gender,
      age,
      conditions: f.conditions,
      dislikes: splitText(f.dislikesText),
      allergies: splitText(f.allergiesText),
      note: f.note
    };
    if (f.id) store.updateMember(member);
    else store.addMember(member);

    this.setData({ editing: false });
    this.load();
    wx.showToast({ title: '已保存', icon: 'success' });
  },

  removeMember(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '删除成员',
      content: '删除后该成员的健康档案将一并移除，确定吗？',
      confirmColor: '#C0504D',
      success: r => {
        if (r.confirm) {
          store.removeMember(id);
          this.load();
        }
      }
    });
  },

  goPlan() { wx.switchTab({ url: '/pages/plan/plan' }); },

  noop() { }
});
