/**
 * 学术 Roguelike —— 游戏主引擎
 *
 * 简化后的引擎，作为 RunManager 的轻量包装层
 * 负责在页面间共享实例 (通过 app.globalData)
 *
 * 游戏循环:
 *   选择学科/难度 → startNewRun() → 循环(出牌→计分→过关→商店→下一关) → 结局
 */

const RunManager = require('./RunManager')
const decksConfig = require('../config/decks')
const metaConfig = require('../config/meta')

class GameEngine {

  constructor() {
    /** @type {RunManager} 单局管理器 */
    this.runManager = new RunManager()

    /** @type {object} 当前 Run 结果(用于结局页) */
    this.runResult = null

    /** @type {string} 选中的学科 */
    this.selectedDiscipline = ''

    /** @type {string} 选中的难度 */
    this.selectedDifficulty = 'normal'

    /** @type {object} Meta 数据 */
    this.metaData = null

    // 加载 meta 数据
    this._loadMeta()
  }

  /**
   * 选择学科
   */
  selectDiscipline(disciplineId) {
    const deck = decksConfig.getById(disciplineId)
    if (!deck) return false

    this.selectedDiscipline = disciplineId
    return true
  }

  /**
   * 选择难度
   */
  selectDifficulty(difficultyId) {
    const diff = metaConfig.difficulties.find(d => d.id === difficultyId)
    if (!diff) return false

    // 检查是否解锁
    if (diff.requirement && this.metaData) {
      const isUnlocked = this.metaData.unlockedDifficulties.includes(difficultyId) ||
                         difficultyId === 'normal'
      if (!isUnlocked) return false
    }

    this.selectedDifficulty = difficultyId
    return true
  }

  /**
   * 获取某难度是否解锁
   */
  isUnlocked(difficultyId) {
    if (difficultyId === 'normal') return true
    if (!this.metaData) return false
    return this.metaData.unlockedDifficulties.includes(difficultyId)
  }

  /**
   * 获取某学科是否解锁
   */
  isDisciplineUnlocked(disciplineId) {
    // 检查是否在锁定列表中
    const locked = metaConfig.lockedDisciplines.find(d => d.id === disciplineId)
    if (!locked) return true // 不在锁定列表 = 默认解锁

    if (!this.metaData) return false
    return this.metaData.totalAP >= locked.requirement.ap
  }

  /**
   * 开始新游戏
   */
  startNewRun() {
    if (!this.selectedDiscipline) return null

    this.runManager = new RunManager()

    // 绑定状态变更回调
    this.runManager.bindStateChange((summary, log) => {
      this._onRunStateChange(summary, log)
    })

    const state = this.runManager.startNewRun(
      this.selectedDiscipline,
      this.selectedDifficulty
    )

    return this.runManager.getStateSummary()
  }

  /**
   * 打出多张手牌
   */
  playCards(handIndices) {
    return this.runManager.playCards(handIndices)
  }

  /**
   * 弃牌
   */
  discardCards(handIndices) {
    return this.runManager.discardCards(handIndices)
  }

  /**
   * 跳过回合
   */
  skipRound() {
    return this.runManager.skipRound()
  }

  /**
   * 离开商店
   */
  leaveShop() {
    return this.runManager.leaveShop()
  }

  /**
   * 获取当前状态
   */
  getStateSummary() {
    return this.runManager.getStateSummary()
  }

  /**
   * 获取游戏日志
   */
  getLog() {
    return this.runManager.log
  }

  /**
   * 绑定状态变更回调
   */
  bindStateChange(callback) {
    this.runManager.bindStateChange(callback)
  }

  /**
   * Run 状态变更时的处理
   */
  _onRunStateChange(summary, log) {
    // 检查是否结束
    if (summary && summary.phase === 'game_over') {
      // 不在这里处理，由 finishRound 返回的 game_over 类型处理
    }

    // 转发给页面绑定的回调
    if (this._pageCallback) {
      this._pageCallback(summary, log)
    }
  }

  /**
   * 设置页面回调
   */
  setPageCallback(callback) {
    this._pageCallback = callback
  }

  /**
   * 保存Run
   */
  saveRun(slotId) {
    return this.runManager.saveRun(slotId)
  }

  /**
   * 读取Run
   */
  loadRun(slotId) {
    return this.runManager.loadRun(slotId)
  }

  /**
   * 结束Run时调用，结算 meta 点数
   */
  handleRunEnd(result) {
    this.runResult = result

    // 更新 meta 数据
    if (this.metaData) {
      this.metaData.totalAP = (this.metaData.totalAP || 0) + result.apGained
      this.metaData.totalRuns = (this.metaData.totalRuns || 0) + 1

      // 检查新解锁
      const unlocks = this._checkUnlocks()
      result.unlocks = unlocks
    }

    this._saveMeta()
    return result
  }

  /**
   * 获取游戏结果(给结局页)
   */
  getRunResult() {
    return this.runResult
  }

  // ==================== Meta 系统 ====================

  /**
   * 加载 Meta 数据
   */
  _loadMeta() {
    try {
      const raw = wx.getStorageSync(require('../config/constants').META_STORAGE_KEY)
      if (raw) {
        this.metaData = JSON.parse(raw)
      }
    } catch (e) {
      // wx 不可用时降级
    }

    if (!this.metaData) {
      this.metaData = {
        totalAP: 0,
        unlockedDifficulties: ['normal'],
        unlockedSkillIds: [],
        unlockedConsumableIds: [],
        unlockedDisciplineIds: []
      }
    }
  }

  /**
   * 保存 Meta 数据
   */
  _saveMeta() {
    try {
      wx.setStorageSync(
        require('../config/constants').META_STORAGE_KEY,
        JSON.stringify(this.metaData)
      )
    } catch (e) {
      // wx 不可用时降级
    }
  }

  /**
   * 检查解锁
   */
  _checkUnlocks() {
    const ap = this.metaData.totalAP
    const unlocks = []

    // 检查难度解锁
    for (const diff of metaConfig.difficulties) {
      if (diff.requirement && !this.metaData.unlockedDifficulties.includes(diff.id)) {
        if (ap >= diff.requirement.ap) {
          this.metaData.unlockedDifficulties.push(diff.id)
          unlocks.push({ type: 'difficulty', id: diff.id, name: diff.name })
        }
      }
    }

    // 检查学科解锁
    for (const disc of metaConfig.lockedDisciplines) {
      if (!this.metaData.unlockedDisciplineIds.includes(disc.id)) {
        if (ap >= disc.requirement.ap) {
          this.metaData.unlockedDisciplineIds.push(disc.id)
          unlocks.push({ type: 'discipline', id: disc.id, message: disc.unlockMessage })
        }
      }
    }

    // 检查技能卡解锁
    for (const skill of metaConfig.lockedSkills) {
      if (!this.metaData.unlockedSkillIds.includes(skill.id)) {
        if (ap >= skill.requirement.ap) {
          this.metaData.unlockedSkillIds.push(skill.id)
          unlocks.push({ type: 'skill', id: skill.id })
        }
      }
    }

    // 检查机遇卡解锁
    for (const cons of metaConfig.lockedConsumables) {
      if (!this.metaData.unlockedConsumableIds.includes(cons.id)) {
        if (ap >= cons.requirement.ap) {
          this.metaData.unlockedConsumableIds.push(cons.id)
          unlocks.push({ type: 'consumable', id: cons.id })
        }
      }
    }

    return unlocks
  }

  /**
   * 获取已解锁的技能卡ID列表
   */
  _getUnlockedSkillIds() {
    return this.metaData ? this.metaData.unlockedSkillIds : []
  }

  /**
   * 获取已解锁的机遇卡ID列表
   */
  _getUnlockedConsumableIds() {
    return this.metaData ? this.metaData.unlockedConsumableIds : []
  }

  /**
   * 获取 meta 数据
   */
  getMetaData() {
    return this.metaData
  }
}

module.exports = GameEngine
