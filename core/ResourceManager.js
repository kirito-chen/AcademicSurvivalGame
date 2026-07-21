/**
 * 学术生存指南 —— 资源管理器
 * 负责所有资源（精力、论文进度、导师满意度、存款等）的增减与边界保护
 */

const { RESOURCE_LIMITS } = require('../config/constants')
const { resolveRange } = require('../utils/random')

class ResourceManager {

  /**
   * 初始化资源为初始值
   * @param {object} initialState - 初始状态配置
   * @returns {object} 资源对象
   */
  createInitialResources(initialState) {
    return {
      energy: initialState.energy,
      paperProgress: initialState.paperProgress,
      advisorSatisfaction: initialState.advisorSatisfaction,
      money: initialState.money,
      mentalHealth: initialState.mentalHealth,
      socialCapital: initialState.socialCapital,
      luck: initialState.luck
    }
  }

  /**
   * 应用效果列表到资源上，返回变化详情
   * @param {object} resources - 当前资源对象（会被直接修改）
   * @param {object} effects - 效果对象，值可以是固定数值或 [min, max] 范围
   * @returns {Array<{key: string, delta: number, newValue: number}>} 变化列表
   */
  applyEffects(resources, effects) {
    const changes = []

    for (const [key, rawValue] of Object.entries(effects)) {
      // 跳过非资源字段
      if (!RESOURCE_LIMITS[key] && key !== 'flags') continue

      const oldValue = resources[key] || 0
      const delta = resolveRange(rawValue)
      let newValue = oldValue + delta

      // 边界保护
      const limits = RESOURCE_LIMITS[key]
      if (limits) {
        newValue = Math.max(limits.min, Math.min(limits.max, Math.round(newValue)))
      }

      resources[key] = newValue
      changes.push({ key, delta: newValue - oldValue, newValue })
    }

    return changes
  }

  /**
   * 应用每月自然衰减
   * @param {object} resources - 当前资源对象
   * @param {object} monthlyDecay - 每月衰减配置
   * @returns {Array} 变化列表
   */
  applyMonthlyDecay(resources, monthlyDecay) {
    const changes = []

    // 基础每月消耗
    for (const [key, value] of Object.entries(monthlyDecay)) {
      const oldValue = resources[key] || 0
      let newValue = oldValue + value
      const limits = RESOURCE_LIMITS[key]
      if (limits) {
        newValue = Math.max(limits.min, Math.min(limits.max, newValue))
      }
      resources[key] = newValue
      if (newValue !== oldValue) {
        changes.push({ key, delta: newValue - oldValue, newValue })
      }
    }

    // 焦虑高于70时，额外精力消耗
    if (resources.anxiety > 70) {
      const oldEnergy = resources.energy
      resources.energy = Math.max(0, oldEnergy - 8)
      changes.push({ key: 'energy', delta: resources.energy - oldEnergy, newValue: resources.energy })
    }

    return changes
  }

  /**
   * 检查是否有资源归零（触发失败条件）
   * @param {object} resources - 当前资源对象
   * @returns {string|null} 归零的资源 key，若没有则返回 null
   */
  checkResourceZero(resources) {
    const criticalResources = ['energy', 'money', 'advisorSatisfaction']
    for (const key of criticalResources) {
      if (resources[key] <= 0) {
        return key
      }
    }
    return null
  }

  /**
   * 获取资源当前值的百分比展示
   * @param {object} resources - 当前资源对象
   * @param {string} key - 资源 key
   * @returns {number} 百分比 (0~100)
   */
  getResourcePercent(resources, key) {
    const limits = RESOURCE_LIMITS[key]
    if (!limits || limits.max === 0) return 0
    return Math.round(((resources[key] || 0) - limits.min) / (limits.max - limits.min) * 100)
  }

  /**
   * 获取资源状态等级（用于 UI 颜色显示）
   * @param {object} resources - 当前资源对象
   * @param {string} key - 资源 key
   * @returns {string} 'danger' | 'warning' | 'normal' | 'good'
   */
  getResourceStatus(resources, key) {
    const percent = this.getResourcePercent(resources, key)
    if (percent <= 20) return 'danger'
    if (percent <= 40) return 'warning'
    if (percent >= 80) return 'good'
    return 'normal'
  }
}

module.exports = ResourceManager
