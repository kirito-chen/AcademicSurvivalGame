/**
 * 学术生存指南 —— 事件管理器
 * 负责随机事件的筛选、触发、与事件选项的解析
 */

const { weightedRandom } = require('../utils/random')

class EventManager {

  /**
   * @param {Array} eventsConfig - 事件配置数组 (events.json)
   * @param {ResourceManager} resourceManager - 资源管理器实例
   */
  constructor(eventsConfig, resourceManager) {
    this.eventsConfig = eventsConfig
    this.resourceManager = resourceManager
    // 已触发的唯一事件 ID 集合
    this.usedUniqueEvents = new Set()
    // 事件冷却（事件ID -> 冷却结束的月份）
    this.eventCooldowns = {}
  }

  /**
   * 重置事件系统（新游戏时调用）
   */
  reset() {
    this.usedUniqueEvents = new Set()
    this.eventCooldowns = {}
  }

  /**
   * 根据当前游戏状态，随机抽取一个事件
   * @param {object} state - 当前游戏状态
   * @param {number} eventChanceModifier - 事件概率修正系数（来自决策）
   * @returns {object|null} 触发的事件对象，或 null（无事发生）
   */
  checkAndTrigger(state, eventChanceModifier = 1.0) {
    // 如果当前已经有事件在处理中，不再触发
    if (state.currentEvent) return null

    // 筛选符合条件的候选事件
    const candidates = this.eventsConfig.filter(event => {
      const cond = event.triggerConditions

      // 已触发的唯一事件不再出现
      if (event.unique && this.usedUniqueEvents.has(event.id)) return false

      // 事件冷却中
      if (this.eventCooldowns[event.id] && this.eventCooldowns[event.id] > state.month) return false

      // 阶段条件
      if (cond.phase && !cond.phase.includes(state.phase)) return false

      // 最小月份
      if (cond.minMonth && state.month < cond.minMonth) return false
      if (cond.maxMonth && state.month > cond.maxMonth) return false

      // 标记位条件
      if (cond.requireFlag && !state.flags[cond.requireFlag]) return false
      if (cond.excludeFlag && state.flags[cond.excludeFlag]) return false

      return true
    })

    if (candidates.length === 0) return null

    // 按概率抽取
    for (const event of candidates) {
      const probability = event.triggerConditions.probability * eventChanceModifier
      if (Math.random() < probability) {
        // 唯一事件标记已使用
        if (event.unique) {
          this.usedUniqueEvents.add(event.id)
        }

        // 设置冷却（若干月内不再重复触发同一事件）
        if (event.cooldown !== 0) {
          this.eventCooldowns[event.id] = state.month + (event.cooldown || 6)
        }

        return event
      }
    }

    return null // 无事发生
  }

  /**
   * 处理玩家对事件选项的选择
   * @param {object} event - 当前事件对象
   * @param {string} optionId - 玩家选择的选项 ID
   * @param {object} state - 当前游戏状态
   * @returns {object} { success, message, changes, setFlags }
   */
  resolveEvent(event, optionId, state) {
    const option = event.options.find(o => o.id === optionId)
    if (!option) {
      return { success: false, message: '无效的选择' }
    }

    // 检查组内前置条件
    if (option.requirements) {
      const res = state.resources
      for (const [key, minValue] of Object.entries(option.requirements)) {
        if ((res[key] || 0) < minValue) {
          return { success: false, message: `不满足条件：${key} 需要 ≥${minValue}` }
        }
      }
    }

    // 应用效果
    const changes = this.resourceManager.applyEffects(state.resources, option.effects)

    // 设置标记位
    if (option.setFlags) {
      for (const [flag, value] of Object.entries(option.setFlags)) {
        state.flags[flag] = value
      }
    }

    // 记录事件历史
    state.eventHistory.push({
      day: state.month,
      eventId: event.id,
      eventTitle: event.title,
      optionId: optionId,
      optionText: option.text
    })

    return {
      success: true,
      message: option.message,
      changes,
      setFlags: option.setFlags || {}
    }
  }
}

module.exports = EventManager
