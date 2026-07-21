/**
 * 学术 Roguelike —— 商店生成器
 *
 * 根据当前学期(Ante)和玩家状态，生成商店商品
 */

const skillsConfig = require('../config/skills')
const consumablesConfig = require('../config/consumables')
const shopConfig = require('../config/shop')
const { weightedRandom } = require('../utils/random')

class ShopGenerator {

  /**
   * 生成商店商品列表
   * @param {number} ante - 当前学期 (1-4)
   * @param {number} funding - 当前经费
   * @param {object} shopEffects - 技能卡提供的商店效果
   * @param {number} rerollCount - 已刷新次数(影响刷新价格)
   * @returns {object} { skills, consumables, services, rerollPrice }
   */
  generateShop(ante, funding, shopEffects, rerollCount) {
    const rarityWeights = shopConfig.rarityWeights[Math.min(ante, 4)] || shopConfig.rarityWeights[1]

    // 技能卡槽位数量
    let skillSlots = shopConfig.baseShopSlots.skills
    const anteBonus = shopConfig.anteSlotBonus[Math.min(ante, 4)]
    if (anteBonus) skillSlots += anteBonus.skills
    if (shopEffects && shopEffects.extraSlots) skillSlots += shopEffects.extraSlots

    // 机遇卡槽位数量
    let consumableSlots = shopConfig.baseShopSlots.consumables
    if (anteBonus) consumableSlots += anteBonus.consumables

    // 生成技能卡商品
    const skills = []
    const usedSkillIds = new Set()
    for (let i = 0; i < skillSlots; i++) {
      const skill = this._generateSkill(rarityWeights, usedSkillIds)
      if (skill) {
        skills.push(skill)
        usedSkillIds.add(skill.id)
      }
    }

    // 生成机遇卡商品
    const consumables = []
    const usedConsumableIds = new Set()
    for (let i = 0; i < consumableSlots; i++) {
      const consumable = this._generateConsumable(ante, usedConsumableIds)
      if (consumable) {
        consumables.push(consumable)
        usedConsumableIds.add(consumable.id)
      }
    }

    // 服务列表(固定)
    const services = [
      {
        id: 'upgrade',
        name: '升级卡牌',
        icon: '⬆️',
        description: '选择牌组中一张卡，基础产出 +5',
        price: this._applyDiscount(shopConfig.servicePrices.upgradeCard, shopEffects),
        type: 'service'
      },
      {
        id: 'delete',
        name: '精简牌组',
        icon: '🗑️',
        description: '移除牌组中一张卡',
        price: this._applyDiscount(shopConfig.servicePrices.deleteCard, shopEffects),
        type: 'service'
      },
      {
        id: 'reroll',
        name: '刷新商店',
        icon: '🎰',
        description: '刷新所有商品',
        price: this._calculateRerollPrice(rerollCount),
        type: 'service'
      }
    ]

    return {
      skills,
      consumables,
      services,
      rerollPrice: this._calculateRerollPrice(rerollCount)
    }
  }

  /**
   * 生成单张技能卡
   */
  _generateSkill(rarityWeights, usedIds) {
    const rarity = weightedRandom(rarityWeights)
    if (!rarity) return null

    const pool = skillsConfig.getByRarity(rarity).filter(s => !usedIds.has(s.id))
    if (pool.length === 0) return null

    const skill = pool[Math.floor(Math.random() * pool.length)]
    const price = shopConfig.skillPrices[rarity] || 3

    return {
      ...skill,
      price,
      itemType: 'skill'
    }
  }

  /**
   * 生成单张机遇卡
   */
  _generateConsumable(ante, usedIds) {
    // 学期1-2主要common，学期3-4混入uncommon
    const pool = consumablesConfig.getShopConsumables().filter(c => !usedIds.has(c.id))
    if (pool.length === 0) return null

    const consumable = pool[Math.floor(Math.random() * pool.length)]
    const price = shopConfig.consumablePrices[consumable.rarity] || consumable.cost || 3

    return {
      ...consumable,
      price,
      itemType: 'consumable'
    }
  }

  /**
   * 计算折扣
   */
  _applyDiscount(price, shopEffects) {
    if (!shopEffects) return price
    let finalPrice = price
    if (shopEffects.discount > 0) {
      finalPrice = Math.floor(finalPrice * (1 - shopEffects.discount))
    }
    if (shopEffects.upgradeDiscount > 0) {
      finalPrice = Math.max(1, finalPrice - shopEffects.upgradeDiscount)
    }
    return finalPrice
  }

  /**
   * 计算刷新价格
   */
  _calculateRerollPrice(rerollCount) {
    const base = shopConfig.servicePrices.rerollShop
    const multiplier = Math.pow(shopConfig.rerollMultiplier, rerollCount)
    return Math.floor(base * multiplier)
  }
}

module.exports = ShopGenerator
