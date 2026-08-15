/**
 * 菜谱库汇总
 * ------------------------------------------------------------
 * 单条菜谱字段：
 *   id      唯一标识
 *   name    菜名
 *   region  所属地区（对应 regions.js 的 id）
 *   cat     分类  meat 荤菜 / veg 素菜 / soup 汤羹 / staple 主食 / porridge 粥品 / snack 加餐
 *   meals   适合的餐次 breakfast / lunch / dinner / snack
 *   nature  食性 寒/凉/平/温/热
 *   time    烹饪耗时（分钟）
 *   kcal    每人份热量（千卡，估算）
 *   protein 每人份蛋白质（克，估算）
 *   na      每人份钠（毫克，估算，按菜谱中给出的调味量计）
 *   tags    功能标签，与 conditions 的 preferTags / avoidTags 匹配
 *   ing     食材，q 为「每人份」用量
 *   season  调味料
 *   steps   做法步骤
 *   good    适宜的病症 id
 *   bad     不适宜的病症 id（会被重扣分或直接排除）
 *   tips    专业提示
 * ------------------------------------------------------------
 */
var __rl, __ro, __rc, __re;
if (typeof require === 'function' && typeof window === 'undefined') {
  __rl = require('./recipes-lingnan.js').RECIPES_LINGNAN;
  __ro = require('./recipes-other.js').RECIPES_OTHER;
  __rc = require('./recipes-common.js').RECIPES_COMMON;
  __re = require('./recipes-extra.js').RECIPES_EXTRA;
} else {
  __rl = (typeof RECIPES_LINGNAN !== 'undefined') ? RECIPES_LINGNAN : [];
  __ro = (typeof RECIPES_OTHER !== 'undefined') ? RECIPES_OTHER : [];
  __rc = (typeof RECIPES_COMMON !== 'undefined') ? RECIPES_COMMON : [];
  __re = (typeof RECIPES_EXTRA !== 'undefined') ? RECIPES_EXTRA : [];
}

var RECIPES = [].concat(__rl, __ro, __rc, __re);

var RECIPE_MAP = {};
for (var i = 0; i < RECIPES.length; i++) {
  RECIPE_MAP[RECIPES[i].id] = RECIPES[i];
}

var CATEGORIES = [
  { key: 'meat', name: '荤菜' },
  { key: 'veg', name: '素菜' },
  { key: 'soup', name: '汤羹' },
  { key: 'staple', name: '主食' },
  { key: 'porridge', name: '粥品' },
  { key: 'snack', name: '加餐' }
];

var MEAL_NAMES = { breakfast: '早餐', lunch: '午餐', dinner: '晚餐', snack: '加餐' };

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    RECIPES: RECIPES,
    RECIPE_MAP: RECIPE_MAP,
    CATEGORIES: CATEGORIES,
    MEAL_NAMES: MEAL_NAMES
  };
}
if (typeof window !== 'undefined') {
  window.RECIPES = RECIPES;
  window.RECIPE_MAP = RECIPE_MAP;
  window.CATEGORIES = CATEGORIES;
  window.MEAL_NAMES = MEAL_NAMES;
}
