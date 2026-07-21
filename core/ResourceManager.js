/**
 * 学术 Roguelike —— 资源管理器
 * 负责所有资源的增减与边界保护
 *
 * 简化后的资源系统(4项):
 *   energy            - 精力 (0-100)
 *   funding           - 经费 (0-99999)
 *   paperProgress     - 论文进度 (0-100)
 *   advisorSatisfaction - 导师满意度 (0-100)
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
      energy: initialState.energy || 80,
      funding: initialState.funding || 200,
      paperProgress: initialState.paperProgress || 0,
      advisorSatisfaction: initialState.advisorSatisfaction || 60
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
      // 只处理资源字段
      if (!RESOURCE_LIMITS[key]) continue

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
   * 检查是否有关键资源归零
   * @param {object} resources - 当前资源对象
   * @returns {string|null} 归零的资源 key，若没有则返回 null
   */
  checkResourceZero(resources) {
    const criticalResources = ['energy', 'funding', 'advisorSatisfaction']
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
