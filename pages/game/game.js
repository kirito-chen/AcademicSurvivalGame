/**
 * 学术 Roguelike —— 游戏主页面
 *
 * 核心交互: 查看手牌 → 选中 → 打出 → 计分 → 过关/商店/结局
 */

const app = getApp()

Page({
  data: {
    // 关卡信息
    roundNumber: 1,
    totalRounds: 12,
    levelName: '',
    scoreTarget: 0,
    isBoss: false,

    // 资源
    energy: 80,
    funding: 200,

    // 手牌区
    hand: [],
    handSize: 0,
    maxHandSize: 8,

    // 出牌区
    playedCards: [],
    maxPlays: 4,

    // 技能槽
    skills: [],
    maxSkillSlots: 5,

    // 计分
    totalScore: 0,

    // 状态
    inShop: false,
    gameOver: false,
    bossEffect: null,
    selectedCardIndex: -1,

    // 日志
    logs: [],

    // UI
    showToast: false,
    toastText: ''
  },

  onLoad() {
    const engine = app.globalData.gameEngine
    if (!engine) {
      wx.redirectTo({ url: '/pages/index/index' })
      return
    }

    // 绑定状态变更
    engine.setPageCallback((summary, logs) => {
      this._syncState(summary, logs)
    })

    // 获取当前状态
    const summary = engine.getStateSummary()
    const logs = engine.getLog()
    this._syncState(summary, logs)
  },

  /**
   * 同步状态到页面 data
   */
  _syncState(summary, logs) {
    if (!summary) return

    const data = {
      logs: logs ? logs.slice(-20) : []
    }

    if (summary.resources) {
      data.energy = summary.resources.energy || 0
      data.funding = summary.resources.funding || 0
    }

    if (summary.roundNumber !== undefined) data.roundNumber = summary.roundNumber
    if (summary.totalRounds !== undefined) data.totalRounds = summary.totalRounds
    if (summary.levelName !== undefined) data.levelName = summary.levelName
    if (summary.scoreTarget !== undefined) data.scoreTarget = summary.scoreTarget
    if (summary.isBoss !== undefined) data.isBoss = summary.isBoss
    if (summary.hand !== undefined) data.hand = summary.hand
    if (summary.handSize !== undefined) data.handSize = summary.handSize
    if (summary.maxHandSize !== undefined) data.maxHandSize = summary.maxHandSize
    if (summary.playedCards !== undefined) data.playedCards = summary.playedCards
    if (summary.maxPlays !== undefined) data.maxPlays = summary.maxPlays
    if (summary.skills !== undefined) data.skills = summary.skills
    if (summary.maxSkillSlots !== undefined) data.maxSkillSlots = summary.maxSkillSlots
    if (summary.inShop !== undefined) data.inShop = summary.inShop
    if (summary.bossEffect !== undefined) data.bossEffect = summary.bossEffect
    if (summary.totalScore !== undefined) data.totalScore = summary.totalScore

    this.setData(data)
  },

  /**
   * 选中手牌
   */
  onSelectCard(e) {
    const index = e.currentTarget.dataset.index
    const { selectedCardIndex } = this.data

    if (selectedCardIndex === index) {
      this.setData({ selectedCardIndex: -1 })
    } else {
      this.setData({ selectedCardIndex: index })
    }
  },

  /**
   * 打出选中卡牌
   */
  onPlayCard() {
    const { selectedCardIndex, inShop } = this.data
    if (selectedCardIndex < 0 || inShop) return

    const engine = app.globalData.gameEngine
    const result = engine.playCard(selectedCardIndex)

    if (result.success) {
      this.setData({ selectedCardIndex: -1 })

      if (result.card) {
        this._showToast(`${result.card.icon} ${result.card.name} +${result.card.baseProduction}`)
      }

      if (result.type === 'game_over') {
        this._handleGameOver(result.result)
      }
    } else {
      this._showToast(result.message || '无法打出此牌')
    }
  },

  /**
   * 结算回合
   */
  onFinishRound() {
    const engine = app.globalData.gameEngine
    const result = engine.finishRound()

    if (result.type === 'game_over') {
      this._handleGameOver(result.result)
    } else if (result.type === 'round_cleared') {
      const sr = result.scoreResult
      this._showToast(`✅ 过关！${sr.chips} × ${sr.mult} = ${sr.finalScore} 分`)

      if (result.enterShop) {
        setTimeout(() => {
          wx.navigateTo({ url: '/pages/shop/shop' })
        }, 800)
      }
    }
  },

  /**
   * 跳过回合
   */
  onSkipRound() {
    wx.showModal({
      title: '跳过回合',
      content: '跳过当前回合将直接进入下一关，不会获得任何产出。确定吗？',
      success: (res) => {
        if (res.confirm) {
          const engine = app.globalData.gameEngine
          engine.skipRound()
          this._showToast('⏭️ 已跳过本回合')
        }
      }
    })
  },

  /**
   * 游戏结束处理
   */
  _handleGameOver(result) {
    app.globalData.gameEngine.handleRunEnd(result)
    app.globalData.runResult = result

    this.setData({ gameOver: true })

    try { wx.vibrateLong() } catch (e) {}

    setTimeout(() => {
      wx.redirectTo({ url: '/pages/ending/ending' })
    }, 1500)
  },

  /**
   * Toast 提示
   */
  _showToast(text) {
    this.setData({ showToast: true, toastText: text })
    if (this._toastTimer) clearTimeout(this._toastTimer)
    this._toastTimer = setTimeout(() => {
      this.setData({ showToast: false, toastText: '' })
    }, 2000)
  },

  /**
   * 返回首页
   */
  onBackHome() {
    wx.showModal({
      title: '确认退出',
      content: '退出将丢失当前进度。确定返回首页吗？',
      success: (res) => {
        if (res.confirm) {
          wx.redirectTo({ url: '/pages/index/index' })
        }
      }
    })
  },

  /**
   * 存档
   */
  onSave() {
    const engine = app.globalData.gameEngine
    wx.showActionSheet({
      itemList: ['存档槽位 1', '存档槽位 2', '存档槽位 3'],
      success: (res) => {
        const slotId = res.tapIndex
        engine.saveRun(slotId)
        this._showToast(`💾 已保存到槽位 ${slotId + 1}`)
      }
    })
  }
})
