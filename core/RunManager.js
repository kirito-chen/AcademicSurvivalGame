/**
 * 学术 Roguelike —— 单局管理器
 *
 * 管理一局游戏(Run)的完整生命周期:
 *   初始化 → 关卡循环(抽牌→出牌→计分→过关/失败) → 商店 → 下一关 → ... → 结局
 */

const ResourceManager = require('./ResourceManager')
const DeckManager = require('./DeckManager')
const ScoreResolver = require('./ScoreResolver')
const SkillManager = require('./SkillManager')
const SaveManager = require('./SaveManager')

const constants = require('../config/constants')
const levelsConfig = require('../config/levels')
const decksConfig = require('../config/decks')
const metaConfig = require('../config/meta')
const shopConfig = require('../config/shop')

class RunManager {

  constructor() {
    this.resourceManager = new ResourceManager()
    this.deckManager = new DeckManager()
    this.scoreResolver = new ScoreResolver()
    this.skillManager = new SkillManager()
    this.saveManager = new SaveManager()

    /** @type {object} 当前状态 */
    this.state = null
    /** @type {number} 当前关卡索引(0-based) */
    this.currentRoundIndex = 0
    /** @type {string} 学科ID */
    this.discipline = ''
    /** @type {string} 难度ID */
    this.difficulty = 'normal'
    /** @type {Array} 游戏日志 */
    this.log = []
    /** @type {Function} 状态变更回调 */
    this.onStateChange = null
    /** @type {boolean} 是否在商店阶段 */
    this.inShop = false
    /** @type {object} 当前Boss效果 */
    this.currentBossEffect = null
    /** @type {number} 本局总产出 */
    this.totalScore = 0
    /** @type {Array} 本局解锁的成就 */
    this.newAchievements = []
  }

  /**
   * 开始新的一局
   * @param {string} disciplineId - 学科ID
   * @param {string} difficultyId - 难度ID
   */
  startNewRun(disciplineId, difficultyId) {
    this.discipline = disciplineId
    this.difficulty = difficultyId || 'normal'

    const deckConfig = decksConfig.getById(disciplineId)
    if (!deckConfig) {
      throw new Error(`未知学科: ${disciplineId}`)
    }

    const difficultyConfig = metaConfig.difficulties.find(d => d.id === this.difficulty) || metaConfig.difficulties[0]

    // 初始化各子系统
    this.deckManager.initDeck(deckConfig)
    this.skillManager.init()
    this.scoreResolver.setSkills([])
    this.scoreResolver.clearTempEffects()

    // 应用难度修正
    if (difficultyConfig.modifiers.handSizePenalty) {
      this.deckManager.maxHandSize -= difficultyConfig.modifiers.handSizePenalty
    }
    if (difficultyConfig.modifiers.skillSlotPenalty) {
      this.skillManager.removeSlot(difficultyConfig.modifiers.skillSlotPenalty)
    }

    // 初始化游戏状态
    this.state = {
      resources: this.resourceManager.createInitialResources({
        energy: 80,
        funding: 200,
        paperProgress: 0,
        advisorSatisfaction: 60
      }),
      flags: {},
      phase: 'running',
      eventHistory: [],
      statistics: {
        totalCardsPlayed: 0,
        totalRoundsCleared: 0,
        totalFundingEarned: 0,
        totalFundingSpent: 0,
        highestSingleScore: 0
      }
    }

    this.currentRoundIndex = 0
    this.inShop = false
    this.currentBossEffect = null
    this.totalScore = 0
    this.newAchievements = []
    this.log = []

    // 开始第一关
    this._startRound()

    const discName = deckConfig.name
    this._addLog('system', `🎓 欢迎来到学术 Roguelike！`)
    this._addLog('system', `📚 学科：${discName}（${deckConfig.description}）`)
    this._addLog('system', `🎯 难度：${difficultyConfig.name}`)
    this._addLog('system', `📋 第 1 关：${this.getCurrentLevel().name} —— 目标产出 ${this.getCurrentLevel().scoreTarget}`)

    this._notifyChange()
    return this.state
  }

  /**
   * 获取当前关卡配置
   */
  getCurrentLevel() {
    return levelsConfig.getByIndex(this.currentRoundIndex)
  }

  /**
   * 获取关卡编号(1-based)
   */
  getCurrentRoundNumber() {
    return this.currentRoundIndex + 1
  }

  /**
   * 是否在Boss关
   */
  isBossRound() {
    const level = this.getCurrentLevel()
    return level ? level.isBoss : false
  }

  /**
   * 开始新的一关
   */
  _startRound() {
    const level = this.getCurrentLevel()
    if (!level) return

    this.deckManager.resetRound()

    // 设置手牌上限和抽牌数
    const handEffects = this.skillManager.getHandEffects()
    const permEffects = this.skillManager.getPermanentEffects()
    this.deckManager.maxHandSize = (level.handSize || 8) + handEffects.extraHandSize + permEffects.handSizeBonus
    this.deckManager.drawPerRound = level.drawSize || 5

    // 应用 onRound 技能效果
    const roundEffects = this.skillManager.applyRoundEffects(this.state)
    if (roundEffects.energyRestore > 0) {
      this.resourceManager.applyEffects(this.state.resources, { energy: roundEffects.energyRestore })
    }
    if (roundEffects.fundingGain > 0) {
      this.resourceManager.applyEffects(this.state.resources, { funding: roundEffects.fundingGain })
    }

    // 应用 permanent 效果中的每回合损失
    if (permEffects.roundEnergyLoss > 0) {
      this.resourceManager.applyEffects(this.state.resources, { energy: -permEffects.roundEnergyLoss })
    }
    if (permEffects.roundFundingLoss > 0) {
      this.resourceManager.applyEffects(this.state.resources, { funding: -permEffects.roundFundingLoss })
    }

    // Boss关设置
    if (level.isBoss) {
      this.currentBossEffect = level.bossEffect
      this._addLog('event', `⚡ Boss关：${level.name}！${level.bossEffect.description}`)
    } else {
      this.currentBossEffect = null
    }

    // 初始抽牌
    this.deckManager.drawInitialHand()

    // 清除临时效果
    this.scoreResolver.clearTempEffects()

    this.inShop = false
  }

  /**
   * 打出一张手牌
   * @param {number} handIndex - 手牌索引
   * @returns {object} 结果
   */
  playCard(handIndex) {
    const level = this.getCurrentLevel()
    if (!level) return { success: false, message: '没有当前关卡' }

    const card = this.deckManager.playCard(handIndex)
    if (!card) return { success: false, message: '无法打出这张牌' }

    // 计算精力消耗
    let energyCost = card.energyCost || 0

    // 检查是否首张免费
    const handEffects = this.skillManager.getHandEffects()
    const permEffects = this.skillManager.getPermanentEffects()
    if (handEffects.firstCardFree && this.deckManager.playedThisRound.length === 1) {
      energyCost = 0
    }
    if (permEffects.energyFreeAll) {
      energyCost = 0
    }

    // 应用难度修正
    const difficultyConfig = metaConfig.difficulties.find(d => d.id === this.difficulty)
    if (difficultyConfig && difficultyConfig.modifiers.energyCostMultiplier) {
      energyCost = Math.floor(energyCost * difficultyConfig.modifiers.energyCostMultiplier)
    }

    // 应用Boss效果
    if (this.currentBossEffect && this.currentBossEffect.effect.extraEnergyCost) {
      energyCost += this.currentBossEffect.effect.extraEnergyCost
    }
    if (this.currentBossEffect && this.currentBossEffect.effect.energyCostMultiplier) {
      energyCost = Math.floor(energyCost * this.currentBossEffect.effect.energyCostMultiplier)
    }

    // 应用精力消耗
    if (energyCost > 0) {
      this.resourceManager.applyEffects(this.state.resources, { energy: -energyCost })
    }

    // 检查经费消耗(卡牌自带效果)
    if (card.effects) {
      for (const effect of card.effects) {
        if (effect.type === 'cost_funding') {
          this.resourceManager.applyEffects(this.state.resources, { funding: -effect.amount })
          this.state.statistics.totalFundingSpent += effect.amount
        }
        if (effect.type === 'gain_funding') {
          this.resourceManager.applyEffects(this.state.resources, { funding: effect.amount })
          this.state.statistics.totalFundingEarned += effect.amount
        }
        if (effect.type === 'energy_restore') {
          this.resourceManager.applyEffects(this.state.resources, { energy: effect.amount })
        }
        if (effect.type === 'draw_cards') {
          this.deckManager.drawCards(effect.count)
        }
      }
    }

    this.state.statistics.totalCardsPlayed++

    this._addLog('decision', `${card.icon} 打出了「${card.name}」—— 产出 +${card.baseProduction}，精力 -${energyCost}`)

    // 检查精力耗尽
    if (this.state.resources.energy <= 0) {
      const result = this._endRun(false, 'energy_exhausted')
      this._notifyChange()
      return { type: 'game_over', result, success: true }
    }

    // 检查经费耗尽
    if (this.state.resources.funding < 0) {
      this.state.resources.funding = 0
    }

    this._notifyChange()
    return { type: 'card_played', card, energyCost, success: true }
  }

  /**
   * 结算本回合(出牌完毕，计算分数)
   * @returns {object} 结算结果
   */
  finishRound() {
    const level = this.getCurrentLevel()
    if (!level) return { success: false, message: '没有当前关卡' }

    // 更新技能卡给分结算器
    this.scoreResolver.setSkills(this.skillManager.getAll())

    // 计算分数
    const playedCards = this.deckManager.getPlayedDetails()
    const scoreResult = this.scoreResolver.calculateScore(playedCards, this.state, this.currentBossEffect)

    // 更新最高分记录
    if (scoreResult.finalScore > this.state.statistics.highestSingleScore) {
      this.state.statistics.highestSingleScore = scoreResult.finalScore
    }
    this.totalScore += scoreResult.finalScore

    this._addLog('score', `📊 本回合产出 ${scoreResult.chips} × ${scoreResult.mult} 倍率 = ${scoreResult.finalScore} 分`)

    // 检查Boss关的类型要求
    if (this.currentBossEffect && this.currentBossEffect.effect.requiredTypes) {
      const reqTypes = this.currentBossEffect.effect.requiredTypes
      for (const [type, count] of Object.entries(reqTypes)) {
        const actual = playedCards.filter(c => c.type === type).length
        if (actual < count) {
          this._addLog('event', `❌ Boss要求未满足：需要 ${count} 张${this._getTypeName(type)}卡，实际打出 ${actual} 张`)
          const result = this._endRun(false, 'boss_failed')
          this._notifyChange()
          return { type: 'game_over', result, scoreResult }
        }
      }
    }

    // 判断是否过关
    const passed = this.scoreResolver.checkPass(scoreResult.finalScore, level)

    if (!passed) {
      this._addLog('event', `❌ 未达标！需要 ${level.scoreTarget} 分，实际 ${scoreResult.finalScore} 分`)
      const result = this._endRun(false, 'score_not_met')
      this._notifyChange()
      return { type: 'game_over', result, scoreResult }
    }

    // 过关！
    this.state.statistics.totalRoundsCleared++
    this._addLog('system', `✅ 过关！产出 ${scoreResult.finalScore} / 目标 ${level.scoreTarget}`)

    // 发放过关经费
    const anteClearBonus = shopConfig.anteClearFunding[level.ante] || 200
    let fundingReward = anteClearBonus
    if (level.isBoss) {
      fundingReward += shopConfig.bossClearBonus
    }
    this.resourceManager.applyEffects(this.state.resources, { funding: fundingReward })
    this.state.statistics.totalFundingEarned += fundingReward
    this._addLog('system', `💰 获得 ${fundingReward} 经费`)

    // 检查是否通关
    if (this.currentRoundIndex >= levelsConfig.getTotalRounds() - 1) {
      // 最终答辩通过！
      const result = this._endRun(true, 'graduated')
      this._notifyChange()
      return { type: 'game_over', result, scoreResult }
    }

    // 进入下一关(先进入商店)
    this.currentRoundIndex++
    this.inShop = true
    this._notifyChange()
    return { type: 'round_cleared', scoreResult, enterShop: true }
  }

  /**
   * 跳过当前回合(不打出任何牌)
   */
  skipRound() {
    this._addLog('system', '⏭️ 跳过本回合')
    this.deckManager.resetRound()
    this._startRound()
    this._notifyChange()
    return { type: 'round_skipped' }
  }

  /**
   * 离开商店，开始下一关
   */
  leaveShop() {
    this.inShop = false
    this._startRound()

    const level = this.getCurrentLevel()
    this._addLog('system', `📋 进入第 ${this.getCurrentRoundNumber()} 关：${level.name} —— 目标产出 ${level.scoreTarget}`)
    if (level.isBoss) {
      this._addLog('event', `⚡ Boss关：${level.name}！${level.bossEffect.description}`)
    }

    this._notifyChange()
  }

  /**
   * 获取当前状态摘要(给页面渲染用)
   */
  getStateSummary() {
    const level = this.getCurrentLevel()
    return {
      roundNumber: this.getCurrentRoundNumber(),
      totalRounds: levelsConfig.getTotalRounds(),
      levelName: level ? level.name : '',
      scoreTarget: level ? level.scoreTarget : 0,
      isBoss: this.isBossRound(),
      inShop: this.inShop,
      resources: this.state ? this.state.resources : {},
      hand: this.deckManager ? this.deckManager.getHandDetails() : [],
      handSize: this.deckManager ? this.deckManager.hand.length : 0,
      maxHandSize: this.deckManager ? this.deckManager.maxHandSize : 8,
      playedCards: this.deckManager ? this.deckManager.getPlayedDetails() : [],
      maxPlays: level ? level.maxPlays : 4,
      skills: this.skillManager ? this.skillManager.getAll() : [],
      maxSkillSlots: this.skillManager ? this.skillManager.maxSlots : 5,
      deckStats: this.deckManager ? this.deckManager.getStats() : {},
      bossEffect: this.currentBossEffect,
      totalScore: this.totalScore
    }
  }

  /**
   * 结束本局
   */
  _endRun(won, reason) {
    this.state.phase = won ? 'graduated' : 'failed'

    const anteReached = this.getCurrentLevel() ? this.getCurrentLevel().ante : 0
    const apGained = metaConfig.calculateAP({
      won,
      anteReached,
      newAchievements: this.newAchievements
    })

    // 检查是否打出过所有类型
    const allPlayedCards = this.deckManager ? [
      ...this.deckManager.deck,
      ...this.deckManager.hand,
      ...this.deckManager.discard,
      ...this.deckManager.playedThisRound
    ] : []
    const playedTypes = new Set()
    const cardsConfig = require('../config/cards')
    allPlayedCards.forEach(id => {
      const c = cardsConfig.find(card => card.id === id)
      if (c) playedTypes.add(c.type)
    })

    return {
      won,
      reason,
      anteReached,
      totalScore: this.totalScore,
      stats: {
        ...this.state.statistics,
        skillCount: this.skillManager ? this.skillManager.getCount() : 0,
        finalEnergy: this.state.resources.energy,
        finalFunding: this.state.resources.funding,
        allTypesPlayed: playedTypes.size >= 5
      },
      apGained,
      discipline: this.discipline,
      difficulty: this.difficulty
    }
  }

  /**
   * 存档当前Run
   */
  saveRun(slotId) {
    const saveData = {
      state: this.state,
      currentRoundIndex: this.currentRoundIndex,
      discipline: this.discipline,
      difficulty: this.difficulty,
      totalScore: this.totalScore,
      newAchievements: this.newAchievements,
      deckManager: this.deckManager.serialize(),
      skillManager: this.skillManager.serialize(),
      log: this.log.slice(-50)
    }
    return this.saveManager.save(slotId, saveData)
  }

  /**
   * 读取Run存档
   */
  loadRun(slotId) {
    const saveData = this.saveManager.load(slotId)
    if (!saveData) return false

    this.state = saveData.state
    this.currentRoundIndex = saveData.currentRoundIndex
    this.discipline = saveData.discipline
    this.difficulty = saveData.difficulty
    this.totalScore = saveData.totalScore
    this.newAchievements = saveData.newAchievements || []
    this.deckManager.deserialize(saveData.deckManager)
    this.skillManager.deserialize(saveData.skillManager)
    this.log = saveData.log || []
    this.inShop = false

    this._addLog('system', `💾 存档已加载 —— 第 ${this.getCurrentRoundNumber()} 关`)
    this._notifyChange()
    return true
  }

  // ==================== 日志 ====================

  _addLog(type, text) {
    this.log.push({ type, text, time: Date.now() })
    if (this.log.length > 200) {
      this.log = this.log.slice(-200)
    }
  }

  _notifyChange() {
    if (this.onStateChange) {
      this.onStateChange(this.getStateSummary(), this.log)
    }
  }

  bindStateChange(callback) {
    this.onStateChange = callback
  }

  _getTypeName(type) {
    const map = {
      experiment: '实验',
      writing: '写作',
      analysis: '数据分析',
      social: '社交',
      teaching: '教学'
    }
    return map[type] || type
  }
}

module.exports = RunManager
