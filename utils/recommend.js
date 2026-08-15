/**
 * 家庭多人配餐推荐引擎
 * ============================================================
 * 设计要点：
 * 1. 逐成员打分：命中适宜 +，命中禁忌 -，硬禁忌直接淘汰
 * 2. 家庭总分 = 0.55 × 平均分 + 0.45 × 最低分
 *    —— 最低分保护，避免"只照顾一个人、饿着另一个人"
 * 3. 权重 severity：三高、孕期等需重点照顾的病症权重更高
 * 4. 结构化出餐：按人数决定菜数，按餐次筛选候选
 * 5. 冲突检测：体质相反（如寒凉 vs 虚寒）时给出分餐/改良建议
 */

var _dep = (function () {
  if (typeof require === 'function' && typeof window === 'undefined') {
    var c = require('../data/conditions.js');
    var r = require('../data/recipes.js');
    return { CONDITION_MAP: c.CONDITION_MAP, RECIPES: r.RECIPES, RECIPE_MAP: r.RECIPE_MAP };
  }
  return { CONDITION_MAP: window.CONDITION_MAP, RECIPES: window.RECIPES, RECIPE_MAP: window.RECIPE_MAP };
})();

var CONDITION_MAP = _dep.CONDITION_MAP;
var ALL_RECIPES = _dep.RECIPES;
var RECIPE_MAP = _dep.RECIPE_MAP || {};

/* ---------------- 工具函数 ---------------- */

function makeRandom(seed) {
  var s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function hashString(str) {
  var h = 0;
  for (var i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

// 食材/调味料的全部文字，用于关键词匹配
function recipeText(recipe) {
  if (recipe.__text) return recipe.__text;
  var parts = [recipe.name];
  for (var i = 0; i < recipe.ing.length; i++) parts.push(recipe.ing[i].n);
  if (recipe.season) parts = parts.concat(recipe.season);
  recipe.__text = parts.join(' ');
  return recipe.__text;
}

function hitList(text, list) {
  var hits = [];
  if (!list) return hits;
  for (var i = 0; i < list.length; i++) {
    var kw = list[i].split('(')[0];
    if (kw && text.indexOf(kw) !== -1) hits.push(list[i]);
  }
  return hits;
}

function intersect(a, b) {
  var out = [];
  if (!a || !b) return out;
  for (var i = 0; i < a.length; i++) {
    if (b.indexOf(a[i]) !== -1) out.push(a[i]);
  }
  return out;
}

/* ---------------- 单成员打分 ---------------- */

/**
 * @returns {score, blocked, plus:[], minus:[]}
 */
function scoreForMember(recipe, member, opts) {
  opts = opts || {};
  var score = 60;
  var blocked = false;
  var plus = [];
  var minus = [];
  var text = recipeText(recipe);
  var conds = member.conditions || [];

  for (var i = 0; i < conds.length; i++) {
    var cond = CONDITION_MAP[conds[i]];
    if (!cond) continue;
    var w = cond.severity || 1;

    // 硬禁忌：直接淘汰
    var hard = hitList(text, cond.hardAvoid);
    if (hard.length) {
      blocked = true;
      minus.push('【' + cond.name + '】绝对忌口：' + hard.join('、'));
    }

    // 菜谱层面的适宜 / 不宜
    if (recipe.bad && recipe.bad.indexOf(cond.id) !== -1) {
      score -= 35 * w;
      minus.push('不适合' + cond.name);
    }
    if (recipe.good && recipe.good.indexOf(cond.id) !== -1) {
      score += 18 * w;
      plus.push('对' + cond.name + '有益');
    }

    // 标签匹配
    var goodTags = intersect(recipe.tags, cond.preferTags);
    if (goodTags.length) {
      score += Math.min(goodTags.length * 5, 18) * w;
      plus.push(goodTags.join('/'));
    }
    var badTags = intersect(recipe.tags, cond.avoidTags);
    if (badTags.length) {
      score -= badTags.length * 10 * w;
      minus.push('含' + badTags.join('/') + '，' + cond.name + '需注意');
    }

    // 食材匹配
    var goodFoods = hitList(text, cond.preferFoods);
    if (goodFoods.length) {
      score += Math.min(goodFoods.length * 5, 15) * w;
    }
    var badFoods = hitList(text, cond.avoidFoods);
    if (badFoods.length) {
      score -= badFoods.length * 11 * w;
      minus.push(cond.name + '应少吃：' + badFoods.slice(0, 3).join('、'));
    }

    // 特殊数值规则
    if (cond.id === 'hypertension' && recipe.na > 420) {
      score -= 14;
      minus.push('钠偏高（' + recipe.na + 'mg/份）');
    }
    if (cond.id === 'diabetes') {
      var lowGi = intersect(recipe.tags, ['低GI', '低糖', '粗粮', '高纤']).length > 0;
      if (recipe.cat === 'porridge' && !lowGi) {
        // 粥类（尤其米粥/小米粥）升糖快，血糖高者直接忌口
        blocked = true;
        minus.push('粥类升糖快，血糖高者不建议吃');
      } else if (recipe.cat === 'staple' && !lowGi) {
        score -= 42;
        minus.push('精制主食升糖较快，建议换成杂粮饭/薯类');
      }
    }
    if (cond.id === 'pre_diabetes') {
      // 糖尿病前期：不硬禁，但非低 GI 主食/粥品明显扣分，提前控糖
      var lowGi2 = intersect(recipe.tags, ['低GI', '低糖', '粗粮', '高纤']).length > 0;
      if (recipe.cat === 'porridge' && !lowGi2) {
        score -= 22;
        minus.push('粥升糖较快，建议杂粮粥或杂粮饭');
      } else if (recipe.cat === 'staple' && !lowGi2) {
        score -= 30;
        minus.push('精制主食升糖较快，建议换成杂粮饭/薯类');
      }
    }
    if (cond.id === 'hyperlipidemia' && recipe.kcal > 230) {
      score -= 6;
    }
    if (cond.id === 'gout' && recipe.cat === 'soup' && /排骨|猪骨|老火|鸭|鸡|肉汤/.test(recipe.name)) {
      score -= 12;
      minus.push('肉汤嘌呤高，建议只吃料不喝汤');
    }
  }

  // 年龄修正
  var age = Number(member.age) || 30;
  if (age >= 65) {
    if (recipe.cat === 'porridge' || recipe.cat === 'soup') score += 5;
    if (intersect(recipe.tags, ['软烂', '易消化']).length) score += 7;
    if (intersect(recipe.tags, ['生冷', '难消化', '高纤粗糙']).length) {
      score -= 10;
      minus.push('老人不宜生冷／过硬');
    }
  }
  if (age <= 12) {
    if (intersect(recipe.tags, ['重口', '重辣']).length) {
      score -= 22;
      minus.push('儿童不宜重辣重口');
    }
    if (intersect(recipe.tags, ['高蛋白', '补钙']).length) score += 8;
  }
  if (age >= 13 && age <= 18) {
    if (intersect(recipe.tags, ['高蛋白', '补钙', '补血']).length) score += 5;
  }

  // 口味偏好
  if (member.dislikes && member.dislikes.length) {
    var dis = hitList(text, member.dislikes);
    if (dis.length) {
      score -= 25;
      minus.push('含不吃的食材：' + dis.join('、'));
    }
  }
  if (member.allergies && member.allergies.length) {
    var alg = hitList(text, member.allergies);
    if (alg.length) {
      blocked = true;
      minus.push('过敏原：' + alg.join('、'));
    }
  }

  // 家庭级「不吃/忌口」清单：命中任意食材直接淘汰
  if (opts.exclude && opts.exclude.length) {
    var ex = hitList(text, opts.exclude);
    if (ex.length) {
      blocked = true;
      minus.push('已排除的食材：' + ex.join('、'));
    }
  }

  return { score: score, blocked: blocked, plus: plus, minus: minus };
}

/* ---------------- 家庭综合评分 ---------------- */

function scoreForFamily(recipe, members, opts) {
  opts = opts || {};
  var scores = [];
  var detail = [];
  var blocked = false;

  for (var i = 0; i < members.length; i++) {
    var r = scoreForMember(recipe, members[i], opts);
    if (r.blocked) blocked = true;
    scores.push(r.score);
    detail.push({
      memberId: members[i].id,
      name: members[i].name,
      score: Math.round(r.score),
      plus: r.plus,
      minus: r.minus
    });
  }

  if (!scores.length) scores = [60];
  var sum = 0, min = Infinity;
  for (var j = 0; j < scores.length; j++) {
    sum += scores[j];
    if (scores[j] < min) min = scores[j];
  }
  var avg = sum / scores.length;
  var total = 0.55 * avg + 0.45 * min;

  // 地区偏好
  var regions = opts.regions || [];
  if (regions.length) {
    if (regions.indexOf(recipe.region) !== -1) total += 12;
    else if (recipe.region === 'common') total += 5;
    else total -= 8;
  }

  // 烹饪时间偏好
  if (opts.maxTime && recipe.time > opts.maxTime) {
    total -= (recipe.time - opts.maxTime) * 0.35;
  }

  // 近期重复
  if (opts.recentIds && opts.recentIds.indexOf(recipe.id) !== -1) total -= 28;

  return {
    recipe: recipe,
    total: Math.round(total * 10) / 10,
    avg: Math.round(avg),
    min: Math.round(min),
    blocked: blocked,
    detail: detail
  };
}

/* ---------------- 候选筛选与挑选 ---------------- */

function candidates(members, opts, filterFn) {
  var out = [];
  for (var i = 0; i < ALL_RECIPES.length; i++) {
    var rec = ALL_RECIPES[i];
    if (filterFn && !filterFn(rec)) continue;
    var s = scoreForFamily(rec, members, opts);
    if (s.blocked) continue;
    out.push(s);
  }
  out.sort(function (a, b) { return b.total - a.total; });
  return out;
}

/**
 * 从候选中挑一道：在前 topN 中带权随机，保证每天不完全一样
 */
function pick(list, used, rand, topN) {
  topN = topN || 5;
  var pool = [];
  for (var i = 0; i < list.length && pool.length < topN; i++) {
    if (used.indexOf(list[i].recipe.id) === -1) pool.push(list[i]);
  }
  if (!pool.length) return null;
  // 越靠前权重越高
  var weights = [];
  var totalW = 0;
  for (var k = 0; k < pool.length; k++) {
    var w = Math.pow(0.62, k);
    weights.push(w);
    totalW += w;
  }
  var r = rand() * totalW;
  for (var m = 0; m < pool.length; m++) {
    r -= weights[m];
    if (r <= 0) {
      used.push(pool[m].recipe.id);
      return pool[m];
    }
  }
  used.push(pool[0].recipe.id);
  return pool[0];
}

/* ---------------- 餐次结构 ---------------- */

function mealStructure(peopleCount) {
  var n = Math.max(1, peopleCount);
  if (n <= 2) return { meat: 1, veg: 1, soup: 1, staple: 1 };
  if (n <= 4) return { meat: 1, veg: 2, soup: 1, staple: 1 };
  if (n <= 6) return { meat: 2, veg: 2, soup: 1, staple: 1 };
  if (n <= 8) return { meat: 2, veg: 3, soup: 1, staple: 1 };
  return { meat: 3, veg: 3, soup: 1, staple: 1 };
}

function buildMeal(mealKey, members, opts, used, rand, peopleCount) {
  var dishes = [];
  var byMeal = function (rec) { return rec.meals.indexOf(mealKey) !== -1; };

  if (mealKey === 'breakfast') {
    var mainList = candidates(members, opts, function (rec) {
      return byMeal(rec) && (rec.cat === 'porridge' || rec.cat === 'staple');
    });
    var main = pick(mainList, used, rand, 5);
    if (main) dishes.push(main);

    var sideList = candidates(members, opts, function (rec) {
      return byMeal(rec) && (rec.cat === 'veg' || rec.cat === 'soup' || rec.cat === 'meat') && rec.time <= 25;
    });
    var side = pick(sideList, used, rand, 5);
    if (side) dishes.push(side);
    return dishes;
  }

  var struct = mealStructure(peopleCount);
  var order = ['soup', 'meat', 'veg', 'staple'];
  for (var oi = 0; oi < order.length; oi++) {
    var cat = order[oi];
    var count = struct[cat] || 0;
    if (!count) continue;
    var list = candidates(members, opts, function (rec) {
      return byMeal(rec) && rec.cat === cat;
    });
    for (var c = 0; c < count; c++) {
      var got = pick(list, used, rand, 6);
      if (got) dishes.push(got);
    }
  }
  return dishes;
}

/* ---------------- 冲突与提示 ---------------- */

var CONFLICT_RULES = [
  {
    a: ['spleen_weak', 'stomach_cold', 'palace_cold', 'yang_deficiency'],
    b: ['diabetes', 'liver_yang', 'yin_deficiency', 'hypertension'],
    title: '虚寒体质 × 需清凉控糖',
    advice: '同桌时优先做"温性但清淡"的菜（如清蒸鱼、山药木耳、四神汤）。苦瓜、凉拌类单独盛一小碟给需要的人，虚寒成员那份加姜丝同炒。'
  },
  {
    a: ['hypertension', 'gout', 'hyperlipidemia'],
    b: ['anemia', 'qi_deficiency', 'menstrual', 'child_growth'],
    title: '需限盐限嘌呤 × 需补养',
    advice: '炖汤时先盛出一碗不加盐的给控盐成员，剩下的再调味；补血的猪肝、红肉给需要的人多分一些，痛风成员以鸡蛋、牛奶、豆腐补蛋白。'
  },
  {
    a: ['diabetes'],
    b: ['child_growth', 'elderly', 'spleen_weak'],
    title: '控糖 × 需要好消化的主食',
    advice: '主食做"双拼"：一锅杂粮饭给糖友，另备少量软白米饭或粥给老人小孩，避免互相迁就。'
  },
  {
    a: ['child_growth'],
    b: ['hypertension', 'hyperlipidemia'],
    title: '儿童重口 × 成人需清淡',
    advice: '全家统一按清淡标准做，儿童那份可用番茄、玉米、虾仁等天然鲜甜食材增味，不要靠额外加盐加糖。'
  }
];

function detectConflicts(members) {
  var all = {};
  for (var i = 0; i < members.length; i++) {
    var cs = members[i].conditions || [];
    for (var j = 0; j < cs.length; j++) {
      if (!all[cs[j]]) all[cs[j]] = [];
      all[cs[j]].push(members[i].name);
    }
  }
  var found = [];
  for (var k = 0; k < CONFLICT_RULES.length; k++) {
    var rule = CONFLICT_RULES[k];
    var sideA = [], sideB = [];
    for (var x = 0; x < rule.a.length; x++) if (all[rule.a[x]]) sideA = sideA.concat(all[rule.a[x]]);
    for (var y = 0; y < rule.b.length; y++) if (all[rule.b[y]]) sideB = sideB.concat(all[rule.b[y]]);
    if (sideA.length && sideB.length) {
      found.push({
        title: rule.title,
        advice: rule.advice,
        sideA: unique(sideA).join('、'),
        sideB: unique(sideB).join('、')
      });
    }
  }
  return found;
}

function unique(arr) {
  var o = {}, out = [];
  for (var i = 0; i < arr.length; i++) {
    if (!o[arr[i]]) { o[arr[i]] = 1; out.push(arr[i]); }
  }
  return out;
}

/**
 * 针对今日菜单，给每个成员生成个性化提醒
 */
function memberNotes(members, allDishes) {
  var notes = [];
  for (var i = 0; i < members.length; i++) {
    var m = members[i];
    var warn = [];
    var tips = [];
    var conds = m.conditions || [];

    for (var d = 0; d < allDishes.length; d++) {
      var dish = allDishes[d];
      var res = scoreForMember(dish.recipe, m);
      if (res.score < 45 && res.minus.length) {
        warn.push({ dish: dish.recipe.name, reason: res.minus[0] });
      }
    }

    for (var c = 0; c < conds.length; c++) {
      var cond = CONDITION_MAP[conds[c]];
      if (!cond) continue;
      for (var t = 0; t < cond.dailyTips.length && tips.length < 4; t++) {
        if (tips.indexOf(cond.dailyTips[t]) === -1) tips.push(cond.dailyTips[t]);
      }
    }

    notes.push({
      memberId: m.id,
      name: m.name,
      conditionNames: conds.map(function (id) {
        return CONDITION_MAP[id] ? CONDITION_MAP[id].name : id;
      }),
      warns: warn.slice(0, 3),
      tips: tips
    });
  }
  return notes;
}

/* ---------------- 营养汇总 ---------------- */

function nutritionSummary(meals, peopleCount) {
  var kcal = 0, protein = 0, na = 0;
  var keys = ['breakfast', 'lunch', 'dinner', 'snack'];
  for (var i = 0; i < keys.length; i++) {
    var list = meals[keys[i]] || [];
    for (var j = 0; j < list.length; j++) {
      kcal += list[j].recipe.kcal || 0;
      protein += list[j].recipe.protein || 0;
      na += list[j].recipe.na || 0;
    }
  }
  return {
    kcalPerPerson: Math.round(kcal),
    proteinPerPerson: Math.round(protein),
    naPerPerson: Math.round(na),
    kcalTotal: Math.round(kcal * peopleCount),
    saltGram: Math.round(na * 2.54 / 1000 * 10) / 10, // 钠 mg → 盐 g
    naLevel: na > 2000 ? 'high' : (na > 1500 ? 'mid' : 'ok')
  };
}

/* ---------------- 采购清单 ---------------- */

function shoppingList(meals, peopleCount) {
  var map = {};
  var keys = ['breakfast', 'lunch', 'dinner', 'snack'];
  for (var i = 0; i < keys.length; i++) {
    var list = meals[keys[i]] || [];
    for (var j = 0; j < list.length; j++) {
      var ing = list[j].recipe.ing;
      for (var k = 0; k < ing.length; k++) {
        var key = ing[k].n + '|' + ing[k].u;
        if (!map[key]) map[key] = { name: ing[k].n, unit: ing[k].u, qty: 0, from: [] };
        map[key].qty += ing[k].q * peopleCount;
        if (map[key].from.indexOf(list[j].recipe.name) === -1) map[key].from.push(list[j].recipe.name);
      }
    }
  }
  var out = [];
  for (var key2 in map) {
    if (!map.hasOwnProperty(key2)) continue;
    var item = map[key2];
    item.qty = Math.round(item.qty);
    item.display = item.qty >= 1000 && item.unit === 'g'
      ? (Math.round(item.qty / 100) / 10) + ' kg'
      : item.qty + ' ' + item.unit;
    out.push(item);
  }
  out.sort(function (a, b) { return b.qty - a.qty; });
  return out;
}

/* ---------------- 主入口 ---------------- */

/**
 * 生成一天的家庭食谱
 * @param {Array} members  成员数组
 * @param {Object} options {regions:[], dateKey:'2026-08-09', peopleCount, recentIds:[], maxTime, seedOffset}
 */
function generateDayPlan(members, options) {
  options = options || {};
  var peopleCount = options.peopleCount || members.length || 1;
  var dateKey = options.dateKey || '';
  var seed = hashString(dateKey + '|' + (options.seedOffset || 0) + '|' + members.map(function (m) { return m.id; }).join(','));
  var rand = makeRandom(seed || 1);

  var opts = {
    regions: options.regions || [],
    recentIds: options.recentIds || [],
    maxTime: options.maxTime || 0,
    exclude: options.exclude || []
  };

  var used = [];
  var meals = {
    breakfast: buildMeal('breakfast', members, opts, used, rand, peopleCount),
    lunch: buildMeal('lunch', members, opts, used, rand, peopleCount),
    dinner: buildMeal('dinner', members, opts, used, rand, peopleCount),
    snack: []
  };

  // 需要加餐的情况
  var needSnack = false;
  for (var i = 0; i < members.length; i++) {
    var cs = members[i].conditions || [];
    if (intersect(cs, ['palpitation', 'anemia', 'menstrual', 'palace_cold', 'diabetes', 'insomnia', 'hyperlipidemia']).length) {
      needSnack = true;
      break;
    }
  }
  if (needSnack) {
    var snackList = candidates(members, opts, function (rec) {
      return rec.meals.indexOf('snack') !== -1;
    });
    var s = pick(snackList, used, rand, 4);
    if (s) meals.snack.push(s);
  }

  var allDishes = [].concat(meals.breakfast, meals.lunch, meals.dinner, meals.snack);

  return {
    dateKey: dateKey,
    peopleCount: peopleCount,
    meals: meals,
    allIds: allDishes.map(function (d) { return d.recipe.id; }),
    conflicts: detectConflicts(members),
    notes: memberNotes(members, allDishes),
    nutrition: nutritionSummary(meals, peopleCount),
    shopping: shoppingList(meals, peopleCount)
  };
}

/**
 * 替换单道菜：返回同餐次同分类的下一个最佳选项
 */
function replaceDish(members, options, mealKey, cat, excludeIds) {
  var opts = {
    regions: options.regions || [],
    recentIds: [],
    maxTime: options.maxTime || 0,
    exclude: options.exclude || []
  };
  var list = candidates(members, opts, function (rec) {
    return rec.meals.indexOf(mealKey) !== -1 && rec.cat === cat;
  });
  for (var i = 0; i < list.length; i++) {
    if (excludeIds.indexOf(list[i].recipe.id) === -1) return list[i];
  }
  return list[0] || null;
}

/**
 * 菜谱库排序：按当前家庭适配度给全部菜谱打分
 */
function rankAll(members, options, filterFn) {
  var opts = {
    regions: (options && options.regions) || [],
    recentIds: [],
    maxTime: 0,
    exclude: (options && options.exclude) || []
  };
  var out = [];
  for (var i = 0; i < ALL_RECIPES.length; i++) {
    var rec = ALL_RECIPES[i];
    if (filterFn && !filterFn(rec)) continue;
    var s = scoreForFamily(rec, members, opts);
    s.suitLevel = s.blocked ? 'block' : (s.total >= 82 ? 'best' : (s.total >= 66 ? 'good' : (s.total >= 50 ? 'normal' : 'avoid')));
    out.push(s);
  }
  out.sort(function (a, b) {
    if (a.blocked !== b.blocked) return a.blocked ? 1 : -1;
    return b.total - a.total;
  });
  return out;
}

/* ---------------- 我的厨房：常吃菜 + 剩菜搭配 ---------------- */

/**
 * 根据「全家常吃菜」与「现有食材/剩菜」给出搭配建议
 * @param {Array} members
 * @param {Object} options {regions, exclude, maxTime}
 * @param {Array} inventory 现有食材/剩菜（字符串数组）
 * @param {Array} regularIds 常吃菜的菜谱 id
 * @returns {{regular, useUp, complement, needBuy}}
 */
function kitchenSuggestion(members, options, inventory, regularIds) {
  options = options || {};
  var opts = {
    regions: options.regions || [],
    recentIds: [],
    maxTime: options.maxTime || 0,
    exclude: options.exclude || []
  };
  var inv = (inventory || []).map(function (s) { return String(s == null ? '' : s).trim(); }).filter(Boolean);

  // 1. 常吃的菜（按家庭适配度排序，被排除的不列）
  var regular = (regularIds || []).map(function (id) { return RECIPE_MAP[id]; }).filter(Boolean)
    .map(function (r) {
      var s = scoreForFamily(r, members, opts);
      return { id: r.id, name: r.name, region: r.region, cat: r.cat, total: Math.round(s.total), blocked: s.blocked, tags: r.tags };
    })
    .filter(function (x) { return !x.blocked; })
    .sort(function (a, b) { return b.total - a.total; });

  // 2. 用现有食材能做（清库存）：食材命中越多越靠前
  var useUp = [];
  for (var i = 0; i < ALL_RECIPES.length; i++) {
    var rec = ALL_RECIPES[i];
    var text = recipeText(rec);
    var used = [];
    for (var k = 0; k < inv.length; k++) {
      if (text.indexOf(inv[k]) !== -1) used.push(inv[k]);
    }
    if (!used.length) continue;
    var s2 = scoreForFamily(rec, members, opts);
    if (s2.blocked) continue;
    useUp.push({ id: rec.id, name: rec.name, region: rec.region, cat: rec.cat, total: Math.round(s2.total), used: used, tags: rec.tags });
  }
  useUp.sort(function (a, b) {
    if (b.used.length !== a.used.length) return b.used.length - a.used.length;
    return b.total - a.total;
  });
  useUp = useUp.slice(0, 8);

  // 3. 互补建议：从家庭高分菜里挑不同分类补充（汤/荤/素/主食 各一）
  var ranked = rankAll(members, options, null);
  var takenIds = {};
  regular.forEach(function (x) { takenIds[x.id] = 1; });
  useUp.forEach(function (x) { takenIds[x.id] = 1; });
  var needCats = { soup: 0, meat: 0, veg: 0, staple: 0 };
  var complement = [];
  for (var j = 0; j < ranked.length && complement.length < 5; j++) {
    var it = ranked[j];
    if (it.blocked) continue;
    if (takenIds[it.recipe.id]) continue;
    var cat = it.recipe.cat;
    if (cat === 'porridge' || cat === 'snack') continue;
    if (needCats[cat] >= 1) continue;
    needCats[cat]++;
    complement.push({ id: it.recipe.id, name: it.recipe.name, region: it.recipe.region, cat: cat, total: Math.round(it.total), tags: it.recipe.tags });
    takenIds[it.recipe.id] = 1;
  }

  // 4. 需要买：互补菜里、且不在现有食材中的关键食材
  var needBuy = [];
  complement.forEach(function (c) {
    var r = RECIPE_MAP[c.id];
    if (!r) return;
    r.ing.forEach(function (ing) {
      var has = false;
      for (var m = 0; m < inv.length; m++) {
        if (ing.n.indexOf(inv[m]) !== -1 || inv[m].indexOf(ing.n) !== -1) { has = true; break; }
      }
      if (!has) {
        var exist = false;
        for (var n = 0; n < needBuy.length; n++) { if (needBuy[n] === ing.n) { exist = true; break; } }
        if (!exist) needBuy.push(ing.n);
      }
    });
  });

  return { regular: regular, useUp: useUp, complement: complement, needBuy: needBuy };
}

var api = {
  generateDayPlan: generateDayPlan,
  replaceDish: replaceDish,
  rankAll: rankAll,
  scoreForFamily: scoreForFamily,
  scoreForMember: scoreForMember,
  detectConflicts: detectConflicts,
  shoppingList: shoppingList,
  mealStructure: mealStructure,
  kitchenSuggestion: kitchenSuggestion
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = api;
}
if (typeof window !== 'undefined') {
  window.Recommend = api;
}
