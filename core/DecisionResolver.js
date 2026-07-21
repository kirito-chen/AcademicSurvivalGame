/**
 * 学术生存指南 —— 决策解析器
 * 接收玩家选择的决策，计算实际效果（含随机修正）
 */

const { resolveRange, randomFloat } = require('../utils/random')

class DecisionResolver {

  /**
   * @param {ResourceManager} resourceManager - 资源管理器实例
   */
  constructor(resourceManager) {
    this.resourceManager = resourceManager
  }

  /**
   * 检查决策是否可用
   * @param {object} decision - 决策定义
   * @param {object} state - 当前游戏状态
   * @returns {{available: boolean, reason?: string}}
   */
  checkAvailability(decision, state) {
    const reqs = decision.requirements || {}
    const res = state.resources

    if (reqs.minEnergy && res.energy < reqs.minEnergy) {
      return { available: false, reason: `精力不足（需要≥${reqs.minEnergy}）` }
    }

    if (reqs.minMoney !== undefined && res.money < reqs.minMoney) {
      return { available: false, reason: `存款不足（需要≥${reqs.minMoney}）` }
    }

    // 检查每月限次
    const monthCount = state.completedDecisions.filter(d => d === decision.id).length
    if (decision.dailyLimit && monthCount >= decision.dailyLimit) {
      return { available: false, reason: `本月已执行${monthCount}次（每月上限${decision.dailyLimit}次）` }
    }

    return { available: true }
  }

  /**
   * 执行一个决策，返回结果
   * @param {object} decision - 决策定义
   * @param {object} state - 当前游戏状态
   * @returns {object} 决策结果 { success, effects, message, changes }
   */
  execute(decision, state) {
    // 1. 检查前置条件
    const availability = this.checkAvailability(decision, state)
    if (!availability.available) {
      return { success: false, message: availability.reason, changes: [] }
    }

    // 2. 应用基础效果
    const allChanges = []
    const baseChanges = this.resourceManager.applyEffects(state.resources, decision.baseEffects)
    allChanges.push(...baseChanges)

    // 3. 计算随机修正
    let bonusMessage = ''
    if (decision.randomModifier) {
      const roll = Math.random()
      if (roll < decision.randomModifier.successRate) {
        const bonusEffects = decision.randomModifier.onSuccess.effects || {}
        const bonusChanges = this.resourceManager.applyEffects(state.resources, bonusEffects)
        allChanges.push(...bonusChanges)
        bonusMessage = decision.randomModifier.onSuccess.message
      } else {
        const failEffects = decision.randomModifier.onFailure.effects || {}
        const failChanges = this.resourceManager.applyEffects(state.resources, failEffects)
        allChanges.push(...failChanges)
        bonusMessage = decision.randomModifier.onFailure.message
      }
    }

    // 4. 记录已完成决策
    state.completedDecisions.push(decision.id)

    // 5. 更新统计数据
    if (decision.id === 'run_experiment') {
      state.totalExperimentsFailed = (state.totalExperimentsFailed || 0) + (bonusMessage.includes('坏了') ? 1 : 0)
    }
    if (decision.id === 'meeting') {
      state.totalMeetingsAttended = (state.totalMeetingsAttended || 0) + 1
    }

    return {
      success: true,
      decisionName: decision.name,
      decisionIcon: decision.icon,
      changes: allChanges,
      message: bonusMessage || `完成了"${decision.name}"`,
      eventChanceModifier: decision.eventChanceModifier || 1.0
    }
  }

  /**
   * 获取决策的预估效果（用于 UI 预览）
   * @param {object} decision - 决策定义
   * @returns {object} 预估效果
   */
  getPreview(decision) {
    const preview = {}
    for (const [key, value] of Object.entries(decision.baseEffects)) {
      preview[key] = Array.isArray(value)
        ? `${value[0]}~${value[1]}`
        : (value >= 0 ? `+${value}` : `${value}`)
    }
    return preview
  }
}

module.exports = DecisionResolver
