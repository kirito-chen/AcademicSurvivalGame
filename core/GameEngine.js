/**
 * 学术生存指南 —— 游戏主引擎
 * 协调所有子系统：资源管理、决策解析、事件触发、胜负判定、阶段推进
 */

const ResourceManager = require('./ResourceManager')
const DecisionResolver = require('./DecisionResolver')
const EventManager = require('./EventManager')
const SaveManager = require('./SaveManager')

const {
  INITIAL_STATE,
  MONTHLY_DECAY,
  PHASES,
  PHASE_NAMES,
  MAX_YEAR,
  MONTHS_PER_YEAR
} = require('../config/constants')

const decisionsConfig = require('../config/decisions')
const eventsConfig = require('../config/events')
const endingsConfig = require('../config/endings')

class GameEngine {

  constructor() {
    this.resourceManager = new ResourceManager()
    this.decisionResolver = new DecisionResolver(this.resourceManager)
    this.eventManager = new EventManager(eventsConfig, this.resourceManager)
    this.saveManager = new SaveManager()

    /** @type {object} 当前游戏状态 */
    this.state = null
    /** @type {Array} 游戏消息日志 */
    this.log = []
    /** @type {Function|null} 状态变更回调（由页面绑定） */
    this.onStateChange = null
    /** 学科 ID（在 startNewGame 前由页面设置） */
    this.discipline = ''
    /** 学科配置对象 */
    this.disciplineConfig = null
  }

  /**
   * 开始新游戏
   * @returns {object} 初始游戏状态
   */
  startNewGame() {
    this.eventManager.reset()

    this.state = {
      // 核心资源
      resources: this.resourceManager.createInitialResources(INITIAL_STATE),
      // 游戏进度
      month: INITIAL_STATE.month || 1,
      year: INITIAL_STATE.year || 1,
      phase: INITIAL_STATE.phase || 'enrollment',
      // 标记位
      flags: {},
      // 本月已完成的决策
      completedDecisions: [],
      // 历史记录
      eventHistory: [],
      // 当前事件
      currentEvent: null,
      // 统计数据
      totalPapersPublished: 0,
      totalExperimentsFailed: 0,
      totalMeetingsAttended: 0,
      // 上次自动存档的月份
      lastAutoSaveMonth: 0,
      // 学科（持久化到存档）
      discipline: this.discipline || ''
    }

    // 学科相关的启动日志
    const discName = this.disciplineConfig ? this.disciplineConfig.name : '未知领域'

    this.log = [{
      type: 'system',
      text: `🎓 欢迎来到博士生的世界！你选择了「${discName}」作为研究方向。努力生存下去，顺利毕业吧！`,
      month: 0
    }, {
      type: 'system',
      text: `📋 当前阶段：${PHASE_NAMES[this.state.phase]}`,
      month: 1
    }]

    this._notifyChange()
    return this.state
  }

  /**
   * 加载已有存档
   * @param {object} savedState - 从 SaveManager 加载的游戏状态
   * @returns {object} 恢复的游戏状态
   */
  loadGame(savedState) {
    if (!savedState) return null

    this.eventManager.reset()
    this.state = savedState
    this.state.currentEvent = null  // 清除可能存档中的事件

    this.log = [{
      type: 'system',
      text: `💾 存档已加载 —— 第${this.state.month}个月，${PHASE_NAMES[this.state.phase]}`,
      month: this.state.month
    }]

    this._notifyChange()
    return this.state
  }

  /**
   * 进入下一个月
   * @returns {object} 每月开始信息
   */
  advanceMonth() {
    this.state.month++
    this.state.year = Math.ceil(this.state.month / MONTHS_PER_YEAR)

    // 重置每月状态
    this.state.completedDecisions = []

    // 每月自然衰减
    const decayChanges = this.resourceManager.applyMonthlyDecay(
      this.state.resources,
      MONTHLY_DECAY
    )

    if (decayChanges.length > 0) {
      this._addLog('system', `🌅 新的一月。生活费-3000，补助+2000，净支出-1000。`, this.state.month)
    }

    // 检查阶段推进
    this._checkPhaseTransition()

    // 检查游戏结束条件
    const gameOverResult = this._checkGameOver()
    if (gameOverResult) {
      return { type: 'game_over', result: gameOverResult }
    }

    this._notifyChange()
    return { type: 'month_start', month: this.state.month, phase: this.state.phase }
  }

  /**
   * 执行玩家决策
   * @param {string} decisionId - 决策 ID
   * @returns {object} 执行结果
   */
  executeDecision(decisionId) {
    const decision = decisionsConfig.find(d => d.id === decisionId)
    if (!decision) {
      return { success: false, message: '未知的决策' }
    }

    // 执行决策
    const result = this.decisionResolver.execute(decision, this.state)

    if (!result.success) {
      return result
    }

    // 添加日志
    this._addLog('decision', `${result.decisionIcon} ${result.message}`, this.state.month)

    // 检查随机事件
    const event = this.eventManager.checkAndTrigger(this.state, result.eventChanceModifier)

    if (event) {
      this.state.currentEvent = event
      this._addLog('event', `⚡ 触发事件：${event.title}`, this.state.month)
      this._notifyChange()
      return { type: 'event_triggered', decisionResult: result, event }
    }

    // 检查游戏结束
    const gameOverResult = this._checkGameOver()
    if (gameOverResult) {
      this._notifyChange()
      return { type: 'game_over', result: gameOverResult }
    }

    // 检查阶段过渡
    const phaseChanged = this._checkPhaseTransition()
    if (phaseChanged) {
      this._addLog('system', `📢 进入新阶段：${PHASE_NAMES[this.state.phase]}`, this.state.month)
    }

    // 自动存档（每3个月）
    if (this.state.month - this.state.lastAutoSaveMonth >= 3) {
      this.saveManager.autoSave(this.state)
      this.state.lastAutoSaveMonth = this.state.month
    }

    this._notifyChange()
    return { type: 'day_complete', decisionResult: result }
  }

  /**
   * 处理事件选项选择
   * @param {string} optionId - 选项 ID
   * @returns {object} 处理结果
   */
  resolveEvent(optionId) {
    if (!this.state.currentEvent) {
      return { success: false, message: '没有待处理的事件' }
    }

    const result = this.eventManager.resolveEvent(
      this.state.currentEvent,
      optionId,
      this.state
    )

    if (result.success) {
      this._addLog('event', `↳ ${result.message}`, this.state.month)
    }

    // 清除当前事件
    this.state.currentEvent = null

    // 检查游戏结束
    const gameOverResult = this._checkGameOver()
    if (gameOverResult) {
      this._notifyChange()
      return { type: 'game_over', result: gameOverResult }
    }

    this._notifyChange()
    return { type: 'event_resolved', result }
  }

  /**
   * 跳过当前事件（不选择，相当于忽略——但通常不允许）
   */
  dismissEvent() {
    this.state.currentEvent = null
    this._notifyChange()
  }

  /**
   * 手动存档到指定槽位
   * @param {number} slotId
   */
  manualSave(slotId) {
    const success = this.saveManager.save(slotId, this.state)
    if (success) {
      this._addLog('system', `💾 已保存到存档槽位 ${slotId + 1}`, this.state.month)
      this._notifyChange()
    }
    return success
  }

  /**
   * 获取当前状态摘要（供页面使用）
   * @returns {object}
   */
  getState() {
    return this.state
  }

  /**
   * 获取消息日志
   * @returns {Array}
   */
  getLog() {
    return this.log
  }

  /**
   * 获取所有决策定义
   * @returns {Array}
   */
  getDecisions() {
    return decisionsConfig.map(d => ({
      ...d,
      available: this.decisionResolver.checkAvailability(d, this.state).available
    }))
  }

  /**
   * 绑定状态变更回调
   * @param {Function} callback
   */
  bindStateChange(callback) {
    this.onStateChange = callback
  }

  // ==================== 私有方法 ====================

  /**
   * 检查并推进游戏阶段
   * @returns {boolean} 阶段是否发生变化
   */
  _checkPhaseTransition() {
    const currentPhaseConfig = PHASES[this.state.phase]
    if (!currentPhaseConfig || !currentPhaseConfig.transitionCondition) return false

    if (currentPhaseConfig.transitionCondition(this.state)) {
      const oldPhase = this.state.phase
      this.state.phase = currentPhaseConfig.nextPhase

      this._addLog('phase', `🎯 从「${PHASE_NAMES[oldPhase]}」进入「${PHASE_NAMES[this.state.phase]}」`, this.state.month)
      return true
    }

    return false
  }

  /**
   * 检查游戏是否结束（胜负判定）
   * @returns {object|null} 结局对象，或 null（游戏继续）
   */
  _checkGameOver() {
    const res = this.state.resources

    // 检查胜利条件
    if (this.state.phase === 'graduated') {
      return this._getEnding('graduation_honors')
    }

    // 检查失败条件
    // 1. 精力归零
    if (res.energy <= 0) {
      return this._getEnding('energy_exhausted')
    }

    // 2. 存款归零
    if (res.money <= 0) {
      return this._getEnding('money_bankrupt')
    }

    // 3. 导师满意度归零
    if (res.advisorSatisfaction <= 0) {
      return this._getEnding('advisor_expelled')
    }

    // 4. 超过最长年限（6年 = 72个月）
    if (this.state.year > MAX_YEAR || this.state.month > MAX_YEAR * MONTHS_PER_YEAR) {
      return this._getEnding('time_expired')
    }

    // 5. 在答辩阶段论文进度达到100 → 触发毕业判定
    if (this.state.phase === 'defense' && res.paperProgress >= 100) {
      // 根据导师满意度和心理健康决定结局等级
      if (res.advisorSatisfaction >= 70 && res.mentalHealth >= 50) {
        return this._getEnding('graduation_honors')
      } else {
        return this._getEnding('graduation_barely')
      }
    }

    return null
  }

  /**
   * 获取结局配置
   * @param {string} endingId
   * @returns {object} 结局信息
   */
  _getEnding(endingId) {
    const ending = endingsConfig.find(e => e.id === endingId)
    if (!ending) return { id: endingId, title: '未知结局', description: '游戏结束' }

    return {
      id: ending.id,
      name: ending.name,
      title: ending.title,
      description: ending.description,
      type: ending.type,
      grade: ending.grade || null,
      flavorText: ending.flavorText || '',
      stats: {
        month: this.state.month,
        year: this.state.year,
        phase: this.state.phase,
        paperProgress: this.state.resources.paperProgress,
        totalPapersPublished: this.state.totalPapersPublished,
        totalExperimentsFailed: this.state.totalExperimentsFailed,
        totalMeetingsAttended: this.state.totalMeetingsAttended,
        eventHistory: [...this.state.eventHistory]
      }
    }
  }

  /**
   * 添加日志消息
   * @param {string} type - 类型：'system'|'decision'|'event'|'phase'
   * @param {string} text - 消息内容
   * @param {number} month - 当前月份
   */
  _addLog(type, text, month) {
    this.log.push({ type, text, month, time: Date.now() })
    // 只保留最近 100 条日志
    if (this.log.length > 100) {
      this.log = this.log.slice(-100)
    }
  }

  /**
   * 通知页面状态已变更
   */
  _notifyChange() {
    if (this.onStateChange) {
      this.onStateChange(this.state, this.log)
    }
  }
}

module.exports = GameEngine
