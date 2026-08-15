/**
 * 本地数据存储（wx.storage）
 * 数据全部保存在用户手机本地，不上传服务器
 */
var KEY_MEMBERS = 'fd_members';
var KEY_SETTINGS = 'fd_settings';
var KEY_PLANS = 'fd_plans';        // { '2026-08-09': planSnapshot }
var KEY_FAVS = 'fd_favs';
var KEY_HISTORY = 'fd_history';    // 最近吃过的菜 id

var DEFAULT_SETTINGS = {
  regions: ['chaoshan', 'common'],
  guestCount: 0,
  maxTime: 0,
  exclude: [],          // 全家忌口 / 不吃的食材（引擎硬排除）
  showNutrition: true,
  regularDishes: [],    // 常吃菜（菜谱 id 列表，用于「我的厨房」）
  inventory: []         // 现有食材 / 剩菜（字符串标签，用于「我的厨房」清库存）
};

function get(key, def) {
  try {
    var v = wx.getStorageSync(key);
    if (v === '' || v === null || v === undefined) return def;
    return v;
  } catch (e) {
    return def;
  }
}

function set(key, val) {
  try {
    wx.setStorageSync(key, val);
  } catch (e) { }
}

function uid() {
  return 'm' + Date.now().toString(36) + Math.floor(Math.random() * 1000).toString(36);
}

/* ---------------- 成员 ---------------- */

function getMembers() {
  return get(KEY_MEMBERS, []);
}

function saveMembers(list) {
  set(KEY_MEMBERS, list);
}

function addMember(member) {
  var list = getMembers();
  member.id = member.id || uid();
  list.push(member);
  saveMembers(list);
  return member;
}

function updateMember(member) {
  var list = getMembers();
  for (var i = 0; i < list.length; i++) {
    if (list[i].id === member.id) {
      list[i] = member;
      break;
    }
  }
  saveMembers(list);
}

function removeMember(id) {
  var list = getMembers().filter(function (m) { return m.id !== id; });
  saveMembers(list);
}

/* ---------------- 设置 ---------------- */

function getSettings() {
  var s = get(KEY_SETTINGS, null);
  if (!s) return JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
  for (var k in DEFAULT_SETTINGS) {
    if (s[k] === undefined) s[k] = DEFAULT_SETTINGS[k];
  }
  return s;
}

function saveSettings(s) {
  set(KEY_SETTINGS, s);
}

/* ---------------- 我的厨房：常吃菜 / 现有食材 ---------------- */

function getRegularDishes() {
  var s = getSettings();
  return s.regularDishes || [];
}

function saveRegularDishes(ids) {
  var s = getSettings();
  s.regularDishes = ids || [];
  saveSettings(s);
  return s.regularDishes;
}

function getInventory() {
  var s = getSettings();
  return s.inventory || [];
}

function saveInventory(list) {
  var s = getSettings();
  s.inventory = list || [];
  saveSettings(s);
  return s.inventory;
}

/* ---------------- 方案 ---------------- */

function getPlan(dateKey) {
  var plans = get(KEY_PLANS, {});
  return plans[dateKey] || null;
}

function savePlan(dateKey, plan) {
  var plans = get(KEY_PLANS, {});
  plans[dateKey] = plan;
  // 只保留最近 14 天
  var keys = Object.keys(plans).sort();
  while (keys.length > 14) {
    delete plans[keys.shift()];
  }
  set(KEY_PLANS, plans);
}

function clearPlan(dateKey) {
  var plans = get(KEY_PLANS, {});
  delete plans[dateKey];
  set(KEY_PLANS, plans);
}

/* ---------------- 历史（用于避免重复） ---------------- */

function getRecentIds() {
  return get(KEY_HISTORY, []);
}

function pushRecentIds(ids) {
  var h = getRecentIds();
  h = ids.concat(h);
  if (h.length > 40) h = h.slice(0, 40);
  set(KEY_HISTORY, h);
}

/* ---------------- 收藏 ---------------- */

function getFavs() {
  return get(KEY_FAVS, []);
}

function toggleFav(id) {
  var f = getFavs();
  var idx = f.indexOf(id);
  if (idx === -1) f.push(id); else f.splice(idx, 1);
  set(KEY_FAVS, f);
  return f.indexOf(id) !== -1;
}

/* ---------------- 初始化示例数据 ---------------- */

function initIfEmpty() {
  var m = get(KEY_MEMBERS, null);
  if (m && m.length) return;
  saveMembers([
    {
      id: uid(),
      name: '爸爸',
      gender: 'male',
      age: 58,
      conditions: ['hypertension', 'hyperlipidemia'],
      dislikes: [],
      allergies: [],
      note: '体检血压 150/95，血脂偏高'
    },
    {
      id: uid(),
      name: '妈妈',
      gender: 'female',
      age: 54,
      conditions: ['spleen_weak', 'menstrual', 'palpitation'],
      dislikes: [],
      allergies: [],
      note: '胃口一般，怕冷，偶有心慌'
    },
    {
      id: uid(),
      name: '我',
      gender: 'female',
      age: 29,
      conditions: ['menstrual', 'anemia'],
      dislikes: [],
      allergies: [],
      note: '经期不准，容易累'
    },
    {
      id: uid(),
      name: '孩子',
      gender: 'male',
      age: 8,
      conditions: ['child_growth'],
      dislikes: ['苦瓜'],
      allergies: [],
      note: '有点挑食'
    }
  ]);
  saveSettings(JSON.parse(JSON.stringify(DEFAULT_SETTINGS)));
}

module.exports = {
  getMembers: getMembers,
  saveMembers: saveMembers,
  addMember: addMember,
  updateMember: updateMember,
  removeMember: removeMember,
  getSettings: getSettings,
  saveSettings: saveSettings,
  getRegularDishes: getRegularDishes,
  saveRegularDishes: saveRegularDishes,
  getInventory: getInventory,
  saveInventory: saveInventory,
  getPlan: getPlan,
  savePlan: savePlan,
  clearPlan: clearPlan,
  getRecentIds: getRecentIds,
  pushRecentIds: pushRecentIds,
  getFavs: getFavs,
  toggleFav: toggleFav,
  initIfEmpty: initIfEmpty,
  uid: uid,
  DEFAULT_SETTINGS: DEFAULT_SETTINGS
};
