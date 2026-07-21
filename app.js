/**
 * 学术 Roguelike —— 微信小程序入口文件
 *
 * 牌组构建 Roguelike: 选择学科牌组 → 闯关 → 商店 → Boss → 最终答辩
 */

const GameEngine = require('./core/GameEngine')

App({
  onLaunch() {
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync()
    this.globalData.systemInfo = systemInfo
    this.globalData.statusBarHeight = systemInfo.statusBarHeight

    // 初始化游戏引擎
    this.globalData.gameEngine = new GameEngine()

    // 检查存档
    try {
      const saves = wx.getStorageSync('academic_roguelike_saves')
      if (saves && saves.length > 0) {
        const latest = saves.filter(Boolean).sort((a, b) => b.timestamp - a.timestamp)[0]
        if (latest) {
          this.globalData.hasSave = true
          this.globalData.latestSaveLabel = latest.label
        }
      }
    } catch (e) {
      console.warn('读取存档失败:', e)
    }
  },

  globalData: {
    systemInfo: null,
    statusBarHeight: 20,
    hasSave: false,
    latestSaveLabel: '',
    gameEngine: null,
    runResult: null
  }
})
