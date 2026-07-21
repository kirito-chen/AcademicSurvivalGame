/**
 * 学术生存指南 —— 结局展示页
 * 显示游戏结局、统计数据和趣味评价
 */

Page({
  data: {
    ending: null,
    gradeEmoji: '',
    gradeClass: ''
  },

  onLoad() {
    const app = getApp()
    const ending = app.globalData.ending

    if (!ending) {
      // 如果没有结局数据，返回首页
      wx.redirectTo({ url: '/pages/index/index' })
      return
    }

    // 根据结局类型设置展示样式
    let gradeEmoji = ''
    let gradeClass = ''
    if (ending.type === 'victory') {
      gradeEmoji = '🎉'
      gradeClass = 'ending-victory'
    } else {
      gradeEmoji = '💔'
      gradeClass = 'ending-failure'
    }

    this.setData({ ending, gradeEmoji, gradeClass })

    // 震动反馈
    try {
      wx.vibrateLong()
    } catch (e) {}
  },

  /**
   * 再来一局
   */
  onPlayAgain() {
    const GameEngine = require('../../core/GameEngine')
    const app = getApp()
    const engine = new GameEngine()
    engine.startNewGame()
    app.globalData.gameEngine = engine
    app.globalData.isNewGame = true
    app.globalData.ending = null

    wx.redirectTo({ url: '/pages/game/game' })
  },

  /**
   * 返回首页
   */
  onBackHome() {
    const app = getApp()
    app.globalData.ending = null
    wx.redirectTo({ url: '/pages/index/index' })
  }
})
