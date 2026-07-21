/**
 * 学术 Roguelike —— 首页
 *
 * 新游戏流程: 选择学科 → 选择难度 → 开始 Run
 * 移除了特长选择(改为局内技能卡)
 */

const GameEngine = require('../../core/GameEngine')
const SaveManager = require('../../core/SaveManager')
const decksConfig = require('../../config/decks')
const metaConfig = require('../../config/meta')

Page({
  data: {
    hasSave: false,
    latestSaveLabel: '',

    // 学科选择
    showDisciplineSelect: false,
    disciplines: decksConfig,
    selectedDiscipline: '',

    // 难度选择
    showDifficultySelect: false,
    difficulties: [],
    selectedDifficulty: 'normal',
    pendingDiscipline: '',

    // meta
    metaAP: 0,
    metaIcon: '⭐',

    // 关于
    showAbout: false,
    loading: false
  },

  onLoad() {
    const saveManager = new SaveManager()
    const hasSave = saveManager.hasAnySave()
    const saves = saveManager.listSaves()
    const latestSave = saves.filter(Boolean).sort((a, b) => b.timestamp - a.timestamp)[0]

    const app = getApp()
    if (!app.globalData.gameEngine) {
      app.globalData.gameEngine = new GameEngine()
    }

    const engine = app.globalData.gameEngine
    const metaData = engine.getMetaData()

    // 构建可选难度列表（含解锁状态）
    const difficulties = metaConfig.difficulties.map(d => ({
      ...d,
      unlocked: engine.isUnlocked(d.id)
    }))

    // 构建学科列表（含解锁状态）
    const disciplines = decksConfig.map(d => ({
      ...d,
      unlocked: engine.isDisciplineUnlocked(d.id)
    }))

    this.setData({
      hasSave,
      latestSaveLabel: latestSave ? latestSave.label : '',
      metaAP: metaData ? metaData.totalAP : 0,
      difficulties,
      disciplines
    })
  },

  onShow() {
    const saveManager = new SaveManager()
    const hasSave = saveManager.hasAnySave()
    this.setData({ hasSave, loading: false })
  },

  /**
   * 新游戏 —— 第一步：选学科
   */
  onNewGame() {
    try { wx.vibrateShort({ type: 'medium' }) } catch (e) {}
    this.setData({ showDisciplineSelect: true, selectedDiscipline: '' })
  },

  /**
   * 选择学科 → 进入难度选择
   */
  onSelectDiscipline(e) {
    const discId = e.currentTarget.dataset.disciplineId
    const disc = this.data.disciplines.find(d => d.id === discId)
    if (!disc || !disc.unlocked) return

    this.setData({ selectedDiscipline: discId, pendingDiscipline: discId })
    try { wx.vibrateShort({ type: 'medium' }) } catch (e) {}

    this.setData({
      showDisciplineSelect: false,
      showDifficultySelect: true,
      selectedDifficulty: 'normal'
    })
  },

  /**
   * 选择难度 → 开始游戏
   */
  onSelectDifficulty(e) {
    const diffId = e.currentTarget.dataset.difficultyId
    const diff = this.data.difficulties.find(d => d.id === diffId)
    if (!diff || !diff.unlocked) return

    this.setData({ selectedDifficulty: diffId, loading: true })
    try { wx.vibrateShort({ type: 'medium' }) } catch (e) {}

    const app = getApp()
    const engine = app.globalData.gameEngine || new GameEngine()
    engine.selectDiscipline(this.data.pendingDiscipline)
    engine.selectDifficulty(diffId)
    engine.startNewRun()
    app.globalData.gameEngine = engine

    wx.redirectTo({
      url: '/pages/game/game',
      fail: () => {
        this.setData({ loading: false })
        wx.showToast({ title: '启动游戏失败', icon: 'error' })
      }
    })
  },

  onCancelDiscipline() {
    this.setData({ showDisciplineSelect: false, selectedDiscipline: '', pendingDiscipline: '' })
  },

  onCancelDifficulty() {
    this.setData({ showDifficultySelect: false, selectedDifficulty: 'normal', showDisciplineSelect: true })
  },

  /**
   * 继续游戏
   */
  onContinue() {
    if (!this.data.hasSave) return
    this.setData({ loading: true })
    try { wx.vibrateShort({ type: 'medium' }) } catch (e) {}

    const app = getApp()
    const engine = app.globalData.gameEngine || new GameEngine()
    const loaded = engine.loadRun(0) // 自动存档槽位

    if (!loaded) {
      this.setData({ loading: false })
      wx.showToast({ title: '存档加载失败', icon: 'error' })
      return
    }

    app.globalData.gameEngine = engine
    wx.redirectTo({
      url: '/pages/game/game',
      fail: () => {
        this.setData({ loading: false })
        wx.showToast({ title: '进入游戏失败', icon: 'error' })
      }
    })
  },

  onSaveManager() {
    wx.navigateTo({ url: '/pages/save/save' })
  },

  onToggleAbout() {
    this.setData({ showAbout: !this.data.showAbout })
  },

  preventTouchMove() { return }
})
