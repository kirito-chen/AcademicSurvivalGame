/**
 * 学术 Roguelike —— 技能卡管理器
 *
 * 管理技能卡槽位、添加/移除、触发时机分发
 *
 * 技能卡槽位默认 5 个，可通过效果扩展
 */

const skillsConfig = require('../config/skills')

class SkillManager {

  constructor() {
    /** @type {Array} 已装备的技能卡 */
    this.equipped = []
    /** @type {number} 最大槽位数 */
    this.maxSlots = 5
  }

  /**
   * 初始化（新一局）
   */
  init() {
    this.equipped = []
    this.maxSlots = 5
  }

  /**
   * 添加技能卡
   * @param {string} skillId - 技能卡ID
   * @returns {boolean} 是否成功
   */
  addSkill(skillId) {
    if (this.equipped.length >= this.maxSlots) return false

    const skill = skillsConfig.getById(skillId)
    if (!skill) return false

    // 不能重复装备同名技能卡
    if (this.equipped.find(s => s.id === skillId)) return false

    this.equipped.push({ ...skill })
    return true
  }

  /**
   * 移除技能卡
   * @param {number} index - 槽位索引
   * @returns {object|null} 被移除的技能卡
   */
  removeSkill(index) {
    if (index < 0 || index >= this.equipped.length) return null
    return this.equipped.splice(index, 1)[0]
  }

  /**
   * 增加槽位
   */
  addSlot(count = 1) {
    this.maxSlots += count
  }

  /**
   * 减少槽位
   */
  removeSlot(count = 1) {
    this.maxSlots = Math.max(1, this.maxSlots - count)
    // 如果装备的超过上限，多余的不会自动移除，只是不能再添加
  }

  /**
   * 获取所有装备的技能卡
   */
  getAll() {
    return [...this.equipped]
  }

  /**
   * 按触发时机筛选
   * @param {string} trigger - onPlay / onScore / onHand / onRound / onShop / permanent
   */
  getByTrigger(trigger) {
    return this.equipped.filter(s => s.trigger === trigger)
  }

  /**
   * 获取技能卡数量
   */
  getCount() {
    return this.equipped.length
  }

  /**
   * 获取空闲槽位数
   */
  getFreeSlots() {
    return Math.max(0, this.maxSlots - this.equipped.length)
  }

  /**
   * 应用 onRound 效果
   * @param {object} state - 游戏状态
   * @returns {object} 效果汇总 { energyRestore, fundingGain, ... }
   */
  applyRoundEffects(state) {
    const result = { energyRestore: 0, fundingGain: 0, randomTypeBonus: null }

    for (const skill of this.equipped) {
      if (skill.trigger !== 'onRound') continue

      // 条件检查
      if (skill.condition && skill.condition.maxEnergy && state.resources.energy > skill.condition.maxEnergy) continue

      if (skill.effect.energyRestore) {
        result.energyRestore += skill.effect.energyRestore
      }
      if (skill.effect.fundingGain) {
        result.fundingGain += skill.effect.fundingGain
      }
      if (skill.effect.randomTypeBonus) {
        const types = ['experiment', 'writing', 'analysis', 'social', 'teaching']
        const randomType = types[Math.floor(Math.random() * types.length)]
        result.randomTypeBonus = { type: randomType, bonus: skill.effect.randomTypeBonus }
      }
    }

    return result
  }

  /**
   * 应用 onHand 效果
   * @returns {object} { extraPlays, extraHandSize, firstCardFree, redrawCount }
   */
  getHandEffects() {
    const result = { extraPlays: 0, extraHandSize: 0, firstCardFree: false, redrawCount: 0 }

    for (const skill of this.equipped) {
      if (skill.trigger !== 'onHand' && skill.trigger !== 'permanent') continue

      if (skill.effect.playBonus) result.extraPlays += skill.effect.playBonus
      if (skill.effect.handSizeBonus) result.extraHandSize += skill.effect.handSizeBonus
      if (skill.effect.energyFree) result.firstCardFree = true
      if (skill.effect.redrawCount) result.redrawCount += skill.effect.redrawCount
      if (skill.effect.energyFreeAll) result.firstCardFree = true // energyFreeAll 也触发出牌阶段的免消耗
    }

    return result
  }

  /**
   * 应用 onShop 效果
   * @returns {object} { extraSlots, discount, upgradeDiscount }
   */
  getShopEffects() {
    const result = { extraSlots: 0, discount: 0, upgradeDiscount: 0, firstPurchaseDiscount: 0 }

    for (const skill of this.equipped) {
      if (skill.trigger !== 'onShop') continue

      if (skill.effect.shopExtraSlot) result.extraSlots += skill.effect.shopExtraSlot
      if (skill.effect.shopDiscount) result.discount = Math.max(result.discount, skill.effect.shopDiscount)
      if (skill.effect.upgradeDiscount) result.upgradeDiscount += skill.effect.upgradeDiscount
      if (skill.effect.firstPurchaseOnly && skill.effect.shopDiscount) {
        result.firstPurchaseDiscount = Math.max(result.firstPurchaseDiscount, skill.effect.shopDiscount)
      }
    }

    return result
  }

  /**
   * 获取 permanent 类效果汇总
   */
  getPermanentEffects() {
    const result = {
      handSizeBonus: 0,
      playBonus: 0,
      energyCostMultiplier: 1,
      energyFreeAll: false,
      roundEnergyLoss: 0,
      roundFundingLoss: 0,
      allCardsChipsBonus: 0,
      multMultiply: 1,
      multPerDeckSize: 0
    }

    for (const skill of this.equipped) {
      if (skill.trigger !== 'permanent') continue

      if (skill.effect.handSizeBonus) result.handSizeBonus += skill.effect.handSizeBonus
      if (skill.effect.playBonus) result.playBonus += skill.effect.playBonus
      if (skill.effect.energyCostMultiplier) result.energyCostMultiplier *= skill.effect.energyCostMultiplier
      if (skill.effect.energyFreeAll) result.energyFreeAll = true
      if (skill.effect.roundEnergyLoss) result.roundEnergyLoss += skill.effect.roundEnergyLoss
      if (skill.effect.roundFundingLoss) result.roundFundingLoss += skill.effect.roundFundingLoss
      if (skill.effect.allCardsChipsBonus) result.allCardsChipsBonus += skill.effect.allCardsChipsBonus
      if (skill.effect.multMultiply) result.multMultiply *= skill.effect.multMultiply
      if (skill.effect.multPerDeckSize) result.multPerDeckSize += skill.effect.multPerDeckSize
    }

    return result
  }

  /**
   * 序列化(存档用)
   */
  serialize() {
    return {
      equipped: this.equipped.map(s => ({ id: s.id })),
      maxSlots: this.maxSlots
    }
  }

  /**
   * 反序列化(读档用)
   */
  deserialize(data) {
    this.maxSlots = data.maxSlots || 5
    this.equipped = []
    if (data.equipped) {
      for (const s of data.equipped) {
        const config = skillsConfig.getById(s.id)
        if (config) {
          this.equipped.push({ ...config })
        }
      }
    }
  }
}

module.exports = SkillManager
