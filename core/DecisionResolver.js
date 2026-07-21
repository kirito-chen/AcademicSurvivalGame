/**
 * 学术生存指南 —— 决策解析器
 * 接收玩家选择的决策，计算实际效果（含随机修正 + 特长修正）
 */

const { resolveRange } = require('../utils/random')
const { RESOURCE_LIMITS } = require('../config/constants')

class DecisionResolver {

  constructor(resourceManager) {
    this.resourceManager = resourceManager
  }

  checkAvailability(decision, state) {
    const reqs = decision.requirements || {}
    const res = state.resources

    if (reqs.minEnergy && res.energy < reqs.minEnergy) {
      return { available: false, reason: `精力不足（需要≥${reqs.minEnergy}）` }
    }

    if (reqs.minMoney !== undefined && res.money < reqs.minMoney) {
      return { available: false, reason: `存款不足（需要≥${reqs.minMoney}）` }
    }

    const monthCount = state.completedDecisions.filter(d => d === decision.id).length
    if (decision.dailyLimit && monthCount >= decision.dailyLimit) {
      return { available: false, reason: `本月已执行${monthCount}次（每月上限${decision.dailyLimit}次）` }
    }

    return { available: true }
  }

  /**
   * 执行决策，返回结果
   * @param {object} decision - 决策定义
   * @param {object} state - 当前游戏状态
   * @param {object} talentConfig - 特长配置（可选）
   */
  execute(decision, state, talentConfig) {
    const availability = this.checkAvailability(decision, state)
    if (!availability.available) {
      return { success: false, message: availability.reason, changes: [] }
    }

    // 1. 应用基础效果
    const allChanges = []
    const baseChanges = this.resourceManager.applyEffects(state.resources, decision.baseEffects)
    allChanges.push(...baseChanges)

    // 2. 计算随机修正
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

    // 3. 应用特长修正
    if (talentConfig && talentConfig.modifiers) {
      this._applyTalentModifiers(decision, state, allChanges, talentConfig.modifiers)
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
   * 应用特长修正到效果变化量
   * 在效果已应用到资源后，按比例回溯调整
   */
  _applyTalentModifiers(decision, state, changes, mods) {
    for (const change of changes) {
      let multiplier = 1.0

      // 精力消耗修正（仅负值）
      if (mods.energyCost && change.key === 'energy' && change.delta < 0) {
        multiplier = mods.energyCost
      }

      // 论文进度修正：实验有独立系数，否则用通用系数
      if (change.key === 'paperProgress' && change.delta > 0) {
        if (mods.experimentEffect && decision.id === 'run_experiment') {
          multiplier = mods.experimentEffect
        } else if (mods.paperGain) {
          multiplier = mods.paperGain
        }
      }

      // 社交资本修正（仅正值）
      if (mods.socialGain && change.key === 'socialCapital' && change.delta > 0) {
        multiplier = mods.socialGain
      }

      // 导师满意度修正（仅正值）
      if (mods.advisorGain && change.key === 'advisorSatisfaction' && change.delta > 0) {
        multiplier = mods.advisorGain
      }

      // 金钱修正（仅正值）
      if (mods.moneyGain && change.key === 'money' && change.delta > 0) {
        multiplier = mods.moneyGain
      }

      // 应用修正
      if (multiplier !== 1.0) {
        const adjustment = Math.round(change.delta * (multiplier - 1))
        const limits = RESOURCE_LIMITS[change.key]
        if (limits) {
          const newVal = Math.max(limits.min, Math.min(limits.max, (state.resources[change.key] || 0) + adjustment))
          state.resources[change.key] = newVal
          change.delta += adjustment
          change.newValue = newVal
        }
      }
    }
  }

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
