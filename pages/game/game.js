/**
 * 小丑牌-学术版 —— 游戏主页面
 *
 * 核心交互: 多选手牌(1-5张) → 预览牌型 → 打出 → 计分 → 过关/商店/结局
 */

const app = getApp()
const { detectHand, HAND_TYPES } = require('../../config/hands')

Page({
  data: {
    // 关卡信息
    roundNumber: 1, totalRounds: 12, levelName: '', scoreTarget: 0, isBoss: false,
    // 资源
    energy: 80, funding: 200,
    // 手牌区
    hand: [], handSize: 0, maxHandSize: 8,
    // 出牌区
    playedCards: [], maxPlays: 4,
    // 技能槽
    skills: [], maxSkillSlots: 5,
    // 计分
    totalScore: 0, playedTotalChips: 0, handTypeName: '', handTypeIcon: '',
    // 多选
    selectedIndices: [],
    selectedPreview: { chips: 0, handName: '', handIcon: '' },
    // 状态
    inShop: false, gameOver: false, bossEffect: null,
    roundScore: 0, playsRemaining: 4, discardsRemaining: 3, deckCount: 52,
    // 日志
    logs: [],
    // UI
    showToast: false, toastText: '',
    showHandRef: false,
    HAND_TYPES: HAND_TYPES
  },

  onLoad() {
    const engine = app.globalData.gameEngine
    if (!engine) { wx.redirectTo({ url: '/pages/index/index' }); return }

    engine.setPageCallback((summary, logs) => { this._syncState(summary, logs) })

    const summary = engine.getStateSummary()
    const logs = engine.getLog()
    this._syncState(summary, logs)
  },

  onShow() {
    const engine = app.globalData.gameEngine
    if (!engine) return
    const summary = engine.getStateSummary()
    if (summary) this._syncState(summary, engine.getLog())
  },

  _syncState(summary, logs) {
    if (!summary) return
    const data = { logs: logs ? logs.slice(-20) : [] }

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
    if (summary.playedCards !== undefined) {
      data.playedCards = summary.playedCards
      if (summary.playedCards.length > 0) {
        const hr = detectHand(summary.playedCards)
        data.playedTotalChips = hr.chipsFromRanks
        data.handTypeName = hr.handType ? hr.handType.name : ''
        data.handTypeIcon = hr.handType ? hr.handType.icon : ''
      } else {
        data.playedTotalChips = 0; data.handTypeName = ''; data.handTypeIcon = ''
      }
    }
    if (summary.maxPlays !== undefined) data.maxPlays = summary.maxPlays
    if (summary.skills !== undefined) data.skills = summary.skills
    if (summary.maxSkillSlots !== undefined) data.maxSkillSlots = summary.maxSkillSlots
    if (summary.inShop !== undefined) data.inShop = summary.inShop
    if (summary.bossEffect !== undefined) data.bossEffect = summary.bossEffect
    if (summary.totalScore !== undefined) data.totalScore = summary.totalScore
    if (summary.roundScore !== undefined) data.roundScore = summary.roundScore
    if (summary.playsRemaining !== undefined) data.playsRemaining = summary.playsRemaining
    if (summary.discardsRemaining !== undefined) data.discardsRemaining = summary.discardsRemaining
    if (summary.deckCount !== undefined) data.deckCount = summary.deckCount

    this.setData(data)
  },

  // ========== 多选手牌 ==========

  onSelectCard(e) {
    const index = e.currentTarget.dataset.index
    if (index === undefined) return
    let selected = [...this.data.selectedIndices]
    const pos = selected.indexOf(index)

    if (pos >= 0) {
      selected.splice(pos, 1)
    } else {
      if (selected.length >= 5) {
        this._showToast('最多选择 5 张手牌')
        return
      }
      selected.push(index)
    }

    // 预览选中卡牌可形成的牌型
    const selectedCards = selected.map(i => this.data.hand[i]).filter(Boolean)
    const preview = { chips: 0, handName: '', handIcon: '' }
    if (selectedCards.length >= 2) {
      const hr = detectHand(selectedCards)
      preview.chips = hr.chipsFromRanks
      if (hr.handType) {
        preview.handName = hr.handType.name
        preview.handIcon = hr.handType.icon
        preview.baseChips = hr.handType.baseChips
        preview.baseMult = hr.handType.baseMult
      }
    }

    this.setData({ selectedIndices: selected, selectedPreview: preview })
  },

  // ========== 打出选中的卡牌 ==========

  onPlayCards() {
    const { selectedIndices, inShop } = this.data
    if (selectedIndices.length === 0 || inShop) return

    const engine = app.globalData.gameEngine
    const sorted = [...selectedIndices].sort((a, b) => b - a)
    const result = engine.playCards(sorted)

    this.setData({ selectedIndices: [], selectedPreview: { chips: 0, handName: '', handIcon: '' } })

    if (result.type === 'game_over') {
      this._handleGameOver(result.result)
    } else if (result.type === 'cards_played') {
      const sr = result.scoreResult
      const ht = sr.handType
      this._showToast(`${ht ? ht.icon + ' ' + ht.name : '高牌'} +${sr.finalScore}分 · 剩余${result.playsRemaining}次出牌`)
    } else if (result.type === 'round_cleared') {
      this._showToast(`✅ 过关！进入商店`)
      setTimeout(() => { wx.navigateTo({ url: '/pages/shop/shop' }) }, 800)
    }
  },

  // ========== 弃牌 ==========

  onDiscardCards() {
    const { selectedIndices, inShop } = this.data
    if (selectedIndices.length === 0 || inShop) return

    const engine = app.globalData.gameEngine
    const sorted = [...selectedIndices].sort((a, b) => b - a)
    const result = engine.discardCards(sorted)

    this.setData({ selectedIndices: [], selectedPreview: { chips: 0, handName: '', handIcon: '' } })
    if (result.success) this._showToast(`🗑️ 弃掉 ${result.count} 张 · 剩余${result.discardsRemaining}次弃牌`)
  },

  // ========== 结算 ==========

  onSkipRound() {
    wx.showModal({
      title: '跳过回合', content: '跳过当前回合将直接失败。确定吗？',
      success: (res) => {
        if (res.confirm) {
          const engine = app.globalData.gameEngine
          // 模拟出牌次数用完
          engine.runManager.state.playsRemaining = 0
          const result = engine.runManager.playCards([])
          if (result.type === 'game_over') this._handleGameOver(result.result)
        }
      }
    })
  },

  // ========== 牌型参考 ==========

  onToggleHandRef() {
    this.setData({ showHandRef: !this.data.showHandRef })
  },

  // ========== 其他 ==========

  _handleGameOver(result) {
    app.globalData.gameEngine.handleRunEnd(result)
    app.globalData.runResult = result
    this.setData({ gameOver: true })
    try { wx.vibrateLong() } catch (e) {}
    setTimeout(() => { wx.redirectTo({ url: '/pages/ending/ending' }) }, 1500)
  },

  _showToast(text) {
    this.setData({ showToast: true, toastText: text })
    if (this._toastTimer) clearTimeout(this._toastTimer)
    this._toastTimer = setTimeout(() => { this.setData({ showToast: false, toastText: '' }) }, 2500)
  },

  onBackHome() {
    wx.showModal({
      title: '确认退出', content: '退出将丢失当前进度。确定返回首页吗？',
      success: (res) => { if (res.confirm) wx.redirectTo({ url: '/pages/index/index' }) }
    })
  },

  onSave() {
    const engine = app.globalData.gameEngine
    wx.showActionSheet({
      itemList: ['存档槽位 1', '存档槽位 2', '存档槽位 3'],
      success: (res) => { engine.saveRun(res.tapIndex); this._showToast(`💾 已保存到槽位 ${res.tapIndex + 1}`) }
    })
  },

  noop() {}
})
