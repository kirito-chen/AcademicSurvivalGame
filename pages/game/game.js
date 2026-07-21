/**
 * 学术生存指南 —— 游戏主页面
 * 核心游戏界面：状态栏 + 决策按钮 + 日志 + 事件弹窗 + 实时反馈
 */

const GameEngine = require('../../core/GameEngine')
const { PHASE_NAMES } = require('../../config/constants')

// 资源中文名映射
const RESOURCE_LABELS = {
  energy: '精力', paperProgress: '论文进度',
  advisorSatisfaction: '导师满意度', money: '存款',
  mentalHealth: '心理健康', socialCapital: '社交资本', luck: '运气'
}

Page({
  data: {
    // 游戏状态
    gameState: null,
    resources: {},
    month: 1,
    phase: '',
    phaseName: '',
    discipline: '',

    // 决策列表（含可用状态）
    decisions: [],

    // 日志
    logs: [],

    // 事件弹窗
    currentEvent: null,
    showEventModal: false,

    // 实时反馈
    resourceDeltas: {},     // { energy: -20, paperProgress: 15, ... }
    actionToast: '',        // 当前操作提示文字
    showActionToast: false,

    // 结局
    ending: null,
    loading: true,
    gameOver: false
  },

  onLoad() {
    const app = getApp()
    /** @type {GameEngine} */
    this.engine = app.globalData.gameEngine

    if (!this.engine || !this.engine.state) {
      this.engine = new GameEngine()
      // 如果从首页传入的学科选择，设置到引擎中
      if (app.globalData.discipline) {
        this.engine.discipline = app.globalData.discipline
        this.setData({ discipline: app.globalData.discipline })
      }
      this.engine.startNewGame()
      app.globalData.gameEngine = this.engine
    } else {
      this.setData({ discipline: this.engine.discipline || '' })
    }

    // 保存一份资源快照用于计算变化量
    this._prevResources = this.engine.state
      ? { ...this.engine.state.resources }
      : {}

    // 绑定状态变更回调
    this.engine.bindStateChange((state, logs) => {
      this._syncState(state, logs)
    })

    this._syncState(this.engine.state, this.engine.log)
    this.setData({ loading: false })
  },

  /**
   * 同步引擎状态到页面数据（含增量计算）
   */
  _syncState(state, logs) {
    if (!state) return

    // 计算资源变化量
    const newResources = state.resources
    const deltas = {}
    if (this._prevResources) {
      for (const [key, newVal] of Object.entries(newResources)) {
        const oldVal = this._prevResources[key] || 0
        const delta = newVal - oldVal
        if (delta !== 0) {
          deltas[key] = delta
        }
      }
    }
    // 更新快照
    this._prevResources = { ...newResources }

    const decisions = this.engine.getDecisions()
    const currentEvent = state.currentEvent

    this.setData({
      gameState: state,
      resources: newResources,
      month: state.month,
      phase: state.phase,
      phaseName: PHASE_NAMES[state.phase] || state.phase,
      decisions,
      logs: logs ? logs.slice(-30) : [],
      currentEvent: currentEvent,
      showEventModal: !!currentEvent,
      resourceDeltas: deltas,
      gameOver: false
    })

    // 3 秒后清除增量高亮
    if (Object.keys(deltas).length > 0) {
      setTimeout(() => {
        this.setData({ resourceDeltas: {} })
      }, 3000)
    }
  },

  /**
   * 进入下一个月
   */
  onNextMonth() {
    if (this.data.gameOver) return
    try { wx.vibrateShort({ type: 'light' }) } catch (e) {}

    const result = this.engine.advanceMonth()
    this._showActionToast('🌅 新的一月开始了')

    if (result && result.type === 'game_over') {
      this.setData({ ending: result.result, gameOver: true })
      this._handleGameOver(result.result)
    }
  },

  /**
   * 选择决策
   */
  onSelectDecision(e) {
    if (this.data.gameOver) return

    const { decisionId } = e.detail
    try { wx.vibrateShort({ type: 'medium' }) } catch (e) {}

    const result = this.engine.executeDecision(decisionId)

    if (result.decisionResult) {
      // 显示操作反馈 Toast
      const name = result.decisionResult.decisionName
      const icon = result.decisionResult.decisionIcon
      const msg = result.decisionResult.message
      this._showActionToast(`${icon} ${name}：${msg}`)
    }

    if (result.type === 'game_over') {
      this.setData({ ending: result.result, gameOver: true })
      this._handleGameOver(result.result)
    }
  },

  /**
   * 处理事件选项
   */
  onResolveEvent(e) {
    const { optionId } = e.detail
    try { wx.vibrateShort({ type: 'medium' }) } catch (e) {}

    const result = this.engine.resolveEvent(optionId)

    if (result && result.type === 'game_over') {
      this.setData({ ending: result.result, gameOver: true })
      this._handleGameOver(result.result)
    }
  },

  /**
   * 游戏结束处理
   */
  _handleGameOver(ending) {
    try { wx.vibrateLong() } catch (e) {}
    setTimeout(() => {
      const app = getApp()
      app.globalData.ending = ending
      wx.redirectTo({ url: '/pages/ending/ending' })
    }, 2000)
  },

  /**
   * 显示操作反馈 Toast（弹窗形式）
   */
  _showActionToast(text) {
    this.setData({ actionToast: text, showActionToast: true })
    // 2.5 秒后自动隐藏
    if (this._toastTimer) clearTimeout(this._toastTimer)
    this._toastTimer = setTimeout(() => {
      this.setData({ showActionToast: false })
    }, 2500)
  },

  /**
   * 手动保存
   */
  onSave() {
    if (this.data.gameOver) return
    wx.showActionSheet({
      itemList: ['存档槽位 1', '存档槽位 2', '存档槽位 3'],
      success: (res) => {
        const slotId = res.tapIndex
        const success = this.engine.manualSave(slotId)
        if (success) {
          wx.showToast({ title: `已保存到槽位 ${slotId + 1}`, icon: 'success', duration: 1500 })
        } else {
          wx.showToast({ title: '保存失败，请重试', icon: 'error' })
        }
      }
    })
  },

  /**
   * 退出游戏（返回首页）
   */
  onQuit() {
    if (this.data.gameOver) {
      wx.redirectTo({ url: '/pages/index/index' })
      return
    }
    wx.showModal({
      title: '退出游戏',
      content: '确定要退出吗？退出前会自动存档。',
      success: (res) => {
        if (res.confirm) {
          this.engine.manualSave(0)
          wx.redirectTo({ url: '/pages/index/index' })
        }
      }
    })
  }
})
