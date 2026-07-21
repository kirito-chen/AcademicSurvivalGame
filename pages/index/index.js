/**
 * 学术生存指南 —— 首页
 * 游戏标题画面，提供新游戏、继续游戏、存档管理等入口
 */

const GameEngine = require('../../core/GameEngine')
const SaveManager = require('../../core/SaveManager')
const disciplines = require('../../config/disciplines')

Page({
  data: {
    hasSave: false,
    latestSaveLabel: '',
    showAbout: false,
    showDisciplineSelect: false,  // 显示学科选择面板
    disciplines: disciplines,
    selectedDiscipline: '',
    loading: false
  },

  onLoad() {
    // 检查是否有存档
    const saveManager = new SaveManager()
    const hasSave = saveManager.hasAnySave()
    const saves = saveManager.listSaves()
    const latestSave = saves.filter(Boolean).sort((a, b) => b.timestamp - a.timestamp)[0]

    this.setData({
      hasSave,
      latestSaveLabel: latestSave ? latestSave.label : ''
    })
  },

  onShow() {
    // 每次回到首页时刷新存档状态
    const saveManager = new SaveManager()
    const hasSave = saveManager.hasAnySave()
    this.setData({ hasSave, loading: false })
  },

  /**
   * 开始新游戏 —— 第一步：显示学科选择
   */
  onNewGame() {
    try { wx.vibrateShort({ type: 'medium' }) } catch (e) {}
    this.setData({ showDisciplineSelect: true })
  },

  /**
   * 选择学科并开始游戏
   */
  onSelectDiscipline(e) {
    const discId = e.currentTarget.dataset.disciplineId
    const disc = disciplines.find(d => d.id === discId)
    if (!disc) return

    this.setData({ selectedDiscipline: discId, loading: true })

    try { wx.vibrateShort({ type: 'medium' }) } catch (e) {}

    const app = getApp()
    app.globalData.discipline = discId

    const engine = new GameEngine()
    engine.discipline = discId
    engine.disciplineConfig = disc
    engine.startNewGame()
    app.globalData.gameEngine = engine
    app.globalData.isNewGame = true

    wx.redirectTo({
      url: '/pages/game/game',
      fail: () => {
        this.setData({ loading: false })
        wx.showToast({ title: '启动游戏失败', icon: 'error' })
      }
    })
  },

  /**
   * 取消学科选择
   */
  onCancelDiscipline() {
    this.setData({ showDisciplineSelect: false, selectedDiscipline: '' })
  },

  /**
   * 继续游戏（加载最近存档）
   */
  onContinue() {
    if (!this.data.hasSave) return

    this.setData({ loading: true })

    try {
      wx.vibrateShort({ type: 'medium' })
    } catch (e) {}

    const saveManager = new SaveManager()
    const savedState = saveManager.getLatestSave()

    if (!savedState) {
      this.setData({ loading: false })
      wx.showToast({ title: '存档加载失败', icon: 'error' })
      return
    }

    const app = getApp()
    const engine = new GameEngine()
    engine.loadGame(savedState)
    app.globalData.gameEngine = engine
    app.globalData.isNewGame = false

    wx.redirectTo({
      url: '/pages/game/game',
      fail: () => {
        this.setData({ loading: false })
        wx.showToast({ title: '进入游戏失败', icon: 'error' })
      }
    })
  },

  /**
   * 跳转存档管理页
   */
  onSaveManager() {
    wx.navigateTo({
      url: '/pages/save/save'
    })
  },

  /**
   * 显示/隐藏关于信息
   */
  onToggleAbout() {
    this.setData({ showAbout: !this.data.showAbout })
  },

  /**
   * 阻止滚动穿透
   */
  preventTouchMove() {
    return
  }
})
