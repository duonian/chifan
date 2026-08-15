const store = require('./utils/store.js');

App({
  globalData: {
    version: '1.0.0'
  },

  onLaunch() {
    // 首次启动写入示例家庭，方便直接看到效果
    store.initIfEmpty();
  }
});
