/**
 * 学术 Roguelike —— 结局展示页
 *
 * 显示 Run 结果: 胜负、统计、学术声望结算
 */

Page({
  data: {
    ending: null,
    won: false,
    typeIcon: '',
    typeClass: '',

    // 统计
    totalScore: 0,
    anteReached: 0,
    totalCardsPlayed: 0,
    totalRoundsCleared: 0,
    highestSingleScore: 0,

    // Meta
    apGained: 0,
    discipline: '',
    difficulty: ''
  },

  onLoad() {
    const app = getApp()
    const ending = app.globalData.runResult

    if (!ending) {
      wx.redirectTo({ url: '/pages/index/index' })
      return
    }

    const won = ending.won === true
    const typeIcon = won ? '🎉' : '💔'
    const typeClass = won ? 'ending-victory' : 'ending-failure'

    this.setData({
      ending,
      won,
      typeIcon,
      typeClass,
      totalScore: ending.totalScore || 0,
      anteReached: ending.anteReached || 0,
      totalCardsPlayed: ending.stats ? ending.stats.totalCardsPlayed : 0,
      totalRoundsCleared: ending.stats ? ending.stats.totalRoundsCleared : 0,
      highestSingleScore: ending.stats ? ending.stats.highestSingleScore : 0,
      apGained: ending.apGained || 0,
      discipline: ending.discipline || '',
      difficulty: ending.difficulty || ''
    })

    try { wx.vibrateLong() } catch (e) {}
  },

  /**
   * 再来一局
   */
  onPlayAgain() {
    const app = getApp()
    app.globalData.runResult = null

    // 使用同样的学科和难度
    const engine = app.globalData.gameEngine
    if (engine) {
      engine.selectDiscipline(engine.selectedDiscipline)
      engine.selectDifficulty(engine.selectedDifficulty)
      engine.startNewRun()
    }

    wx.redirectTo({ url: '/pages/game/game' })
  },

  /**
   * 返回首页
   */
  onBackHome() {
    const app = getApp()
    app.globalData.runResult = null
    wx.redirectTo({ url: '/pages/index/index' })
  }
})
