/**
 * 学术 Roguelike —— 分数结算器
 *
 * 处理出牌后的分数计算:
 *   1. 计算基础产出 (chips) = sum(每张卡的 baseProduction)
 *   2. 应用技能卡 onPlay 效果
 *   3. 应用技能卡 onScore 效果
 *   4. 计算最终分数 = chips × mult
 *   5. 对比关卡目标，判定过关
 */

const cardsConfig = require('../config/cards')
const skillsConfig = require('../config/skills')

class ScoreResolver {

  constructor() {
    /** @type {Array} 当前拥有的技能卡 */
    this.skills = []
    /** @type {Array} 回合内临时效果(来自机遇卡等) */
    this.tempEffects = []
  }

  /**
   * 设置技能卡列表
   */
  setSkills(skills) {
    this.skills = skills || []
  }

  /**
   * 添加临时效果
   */
  addTempEffect(effect) {
    this.tempEffects.push(effect)
  }

  /**
   * 清除临时效果(每回合重置)
   */
  clearTempEffects() {
    this.tempEffects = []
  }

  /**
   * 计算本轮打出卡牌的分数
   * @param {Array} playedCards - 打出的卡牌配置列表
   * @param {object} state - 当前游戏状态(resources等)
   * @param {object} bossEffect - Boss关卡效果(如果有)
   * @returns {object} { chips, mult, finalScore, details }
   */
  calculateScore(playedCards, state, bossEffect) {
    if (!playedCards || playedCards.length === 0) {
      return { chips: 0, mult: 1, finalScore: 0, details: [] }
    }

    const details = []
    let chips = 0
    let mult = 1

    // ========== 第一阶段: 计算基础产出 ==========
    for (const card of playedCards) {
      let cardChips = card.baseProduction || 0

      // 应用卡牌自身效果
      if (card.effects && card.effects.length > 0) {
        for (const effect of card.effects) {
          // random_bonus 在基础计算中处理
          if (effect.type === 'random_bonus') {
            const [min, max] = effect.range
            const bonus = min + Math.floor(Math.random() * (max - min + 1))
            cardChips += bonus
          }
        }
      }

      chips += cardChips
      details.push({
        cardId: card.id,
        cardName: card.name,
        cardIcon: card.icon,
        cardType: card.type,
        baseProduction: cardChips
      })
    }

    // ========== 第二阶段: 触发 onPlay 技能卡效果 ==========
    const onPlaySkills = this.skills.filter(s => s.trigger === 'onPlay')
    for (const skill of onPlaySkills) {
      const triggered = this._checkCondition(skill.condition, playedCards, state)
      if (!triggered) continue

      if (skill.effect.chipsBonus) {
        chips += skill.effect.chipsBonus
        details.push({ type: 'skill', skillId: skill.id, skillName: skill.name, chipsBonus: skill.effect.chipsBonus })
      }
      if (skill.effect.multBonus) {
        mult += skill.effect.multBonus
        details.push({ type: 'skill', skillId: skill.id, skillName: skill.name, multBonus: skill.effect.multBonus })
      }
    }

    // ========== 第三阶段: 触发 onScore 技能卡效果 ==========
    const onScoreSkills = this.skills.filter(s => s.trigger === 'onScore')
    for (const skill of onScoreSkills) {
      const triggered = this._checkCondition(skill.condition, playedCards, state)
      if (!triggered) continue

      if (skill.effect.chipsBonus) {
        chips += skill.effect.chipsBonus
        details.push({ type: 'skill_score', skillId: skill.id, skillName: skill.name, chipsBonus: skill.effect.chipsBonus })
      }
      if (skill.effect.chipsBonusPerCard) {
        const bonus = skill.effect.chipsBonusPerCard * playedCards.length
        chips += bonus
        details.push({ type: 'skill_score', skillId: skill.id, skillName: skill.name, chipsBonus: bonus })
      }
      if (skill.effect.multBonus) {
        mult += skill.effect.multBonus
        details.push({ type: 'skill_score', skillId: skill.id, skillName: skill.name, multBonus: skill.effect.multBonus })
      }
      if (skill.effect.multPerCard) {
        mult += Math.ceil(skill.effect.multPerCard * playedCards.length)
      }
      if (skill.effect.multPerType) {
        if (skill.condition && skill.condition.cardType) {
          const count = playedCards.filter(c => c.type === skill.condition.cardType).length
          mult += skill.effect.multPerType * count
        }
      }
      if (skill.effect.multBonusPerType) {
        const types = new Set(playedCards.map(c => c.type))
        mult += types.size * skill.effect.multBonusPerType
      }
      if (skill.effect.chipMultiply) {
        // 产出翻倍
        let applicableCards = playedCards
        if (skill.condition && skill.condition.cardType) {
          applicableCards = playedCards.filter(c => c.type === skill.condition.cardType)
        }
        if (skill.condition && skill.condition.minEnergy && (state.resources.energy < skill.condition.minEnergy)) {
          applicableCards = []
        }
        const extraChips = applicableCards.reduce((sum, c) => sum + (c.baseProduction * (skill.effect.chipMultiply - 1)), 0)
        chips += extraChips
      }
      if (skill.effect.multMultiply) {
        mult *= skill.effect.multMultiply
        details.push({ type: 'skill_score', skillId: skill.id, skillName: skill.name, multMultiply: skill.effect.multMultiply })
      }
      // onScore: mult per skill card owned
      if (skill.effect.multPerSkill) {
        mult += this.skills.length * skill.effect.multPerSkill
      }
      if (skill.effect.allChipMultiply) {
        chips *= skill.effect.allChipMultiply
      }
      if (skill.effect.chance && Math.random() < skill.effect.chance) {
        if (skill.effect.multMultiply) {
          mult *= skill.effect.multMultiply
        }
      }
    }

    // ========== 第四阶段: 应用Boss效果 ==========
    if (bossEffect) {
      if (bossEffect.effect.allProductionMultiplier) {
        chips = Math.floor(chips * bossEffect.effect.allProductionMultiplier)
      }
      if (bossEffect.effect.productionPenalty) {
        const affectedTypes = bossEffect.effect.cardType || []
        for (const card of playedCards) {
          if (affectedTypes.includes(card.type)) {
            const penalty = Math.floor(card.baseProduction * bossEffect.effect.productionPenalty)
            chips -= penalty
          }
        }
      }
    }

    // ========== 第五阶段: 最终结算 ==========
    // 应用永久效果 (permanent 类技能)
    const permanentSkills = this.skills.filter(s => s.trigger === 'permanent')
    for (const skill of permanentSkills) {
      if (skill.effect.multMultiply) {
        mult *= skill.effect.multMultiply
      }
      if (skill.effect.allCardsChipsBonus) {
        chips += skill.effect.allCardsChipsBonus * playedCards.length
      }
      if (skill.effect.multPerDeckSize) {
        // 牌组大小相关倍率
        // 这里需要deckManager的信息，暂时跳过
      }
    }

    // 保证倍率至少为 1
    if (mult < 1) mult = 1

    const finalScore = Math.floor(chips * mult)

    return {
      chips,
      mult,
      finalScore,
      details,
      cardCount: playedCards.length
    }
  }

  /**
   * 检查技能卡触发条件
   */
  _checkCondition(condition, playedCards, state) {
    if (!condition) return true

    // 类型条件
    if (condition.cardType && condition.cardType !== 'any') {
      const hasType = playedCards.some(c => c.type === condition.cardType)
      if (!hasType) return false
    }

    // 概率条件
    if (condition.chance) {
      if (Math.random() > condition.chance) return false
    }

    // 精力条件
    if (condition.minEnergy && state.resources.energy < condition.minEnergy) return false
    if (condition.maxEnergy && state.resources.energy > condition.maxEnergy) return false

    // 打出次数条件
    if (condition.minTypes) {
      const types = new Set(playedCards.map(c => c.type))
      if (types.size < condition.minTypes) return false
    }

    // 经费条件
    if (condition.minFunding && state.resources.funding < condition.minFunding) return false

    // 产出条件
    if (condition.minScore) return false // 在具体上下文中判断

    return true
  }

  /**
   * 检查是否过关
   */
  checkPass(finalScore, levelConfig) {
    return finalScore >= levelConfig.scoreTarget
  }
}

module.exports = ScoreResolver
