function pad(n) {
  return n < 10 ? '0' + n : '' + n;
}

function dateKey(d) {
  d = d || new Date();
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
}

function addDays(base, n) {
  var d = new Date(base.getTime());
  d.setDate(d.getDate() + n);
  return d;
}

var WEEK = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

function dateLabel(d) {
  var today = dateKey(new Date());
  var k = dateKey(d);
  var prefix = '';
  if (k === today) prefix = '今天 · ';
  else if (k === dateKey(addDays(new Date(), 1))) prefix = '明天 · ';
  else if (k === dateKey(addDays(new Date(), -1))) prefix = '昨天 · ';
  return prefix + (d.getMonth() + 1) + '月' + d.getDate() + '日 ' + WEEK[d.getDay()];
}

function genderName(g) {
  return g === 'female' ? '女' : '男';
}

function ageStage(age) {
  age = Number(age) || 0;
  if (age <= 6) return '幼儿';
  if (age <= 12) return '儿童';
  if (age <= 17) return '青少年';
  if (age <= 40) return '青年';
  if (age <= 64) return '中年';
  return '老年';
}

module.exports = {
  pad: pad,
  dateKey: dateKey,
  addDays: addDays,
  dateLabel: dateLabel,
  genderName: genderName,
  ageStage: ageStage,
  WEEK: WEEK
};
