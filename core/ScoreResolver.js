/**
 * 小丑牌-学术版 —— 分数结算器
 *
 * 新计分流程:
 *   1. 检测牌型 (Pair/Straight/Flush...)
 *   2. chips = 牌型baseChips + 每张卡rank值之和
 *   3. mult  = 牌型baseMult
 *   4. 应用技能卡效果(onPlay/onScore/permanent)
 *   5. 应用Boss效果
 *   6. finalScore = chips × mult
 */

const { detectHand, RANK_VALUES } = require('../config/hands')

class ScoreResolver {

  constructor() {
    this.skills = []
    this.tempEffects = []
  }

  setSkills(skills) { this.skills = skills || [] }
  addTempEffect(effect) { this.tempEffects.push(effect) }
  clearTempEffects() { this.tempEffects = [] }

  /**
   * 计算本轮打出卡牌的分数
   */
  calculateScore(playedCards, state, bossEffect) {
    if (!playedCards || playedCards.length === 0) {
      return { chips: 0, mult: 1, finalScore: 0, details: [], handType: null }
    }

    // ===== 第一阶段：检测牌型 =====
    const handResult = detectHand(playedCards)
    const handType = handResult.handType

    let chips = handResult.chipsFromRanks
    let mult = 1

    if (handType) {
      chips += handType.baseChips
      mult = handType.baseMult
    }

    const details = [{
      type: 'hand',
      handName: handType ? handType.name : '无牌型',
      handIcon: handType ? handType.icon : '',
      baseChips: handType ? handType.baseChips : 0,
      rankChips: handResult.chipsFromRanks,
      baseMult: handType ? handType.baseMult : 1
    }]

    // ===== 第二阶段：onPlay 技能效果 =====
    for (const skill of this.skills) {
      if (skill.trigger !== 'onPlay') continue
      if (!this._checkCondition(skill.condition, playedCards, state)) continue

      if (skill.effect.chipsBonus) {
        chips += skill.effect.chipsBonus
        details.push({ type: 'skill_play', name: skill.name, chipsBonus: skill.effect.chipsBonus })
      }
      if (skill.effect.multBonus) {
        mult += skill.effect.multBonus
        details.push({ type: 'skill_play', name: skill.name, multBonus: skill.effect.multBonus })
      }
      if (skill.effect.energyRestore) {
        state.resources.energy = Math.min(100, state.resources.energy + skill.effect.energyRestore)
      }
    }

    // ===== 第三阶段：onScore 技能效果 =====
    for (const skill of this.skills) {
      if (skill.trigger !== 'onScore') continue
      if (!this._checkCondition(skill.condition, playedCards, state)) continue

      if (skill.effect.chipsBonus) chips += skill.effect.chipsBonus
      if (skill.effect.multBonus) mult += skill.effect.multBonus
      if (skill.effect.multMultiply) mult *= skill.effect.multMultiply
      if (skill.effect.chipMultiply) {
        const applicable = this._filterByCondition(playedCards, skill.condition)
        const extra = applicable.reduce((s, c) => s + (RANK_VALUES[c.rank] || 0) * (skill.effect.chipMultiply - 1), 0)
        chips += Math.floor(extra)
      }
      if (skill.effect.multPerSkill) mult += this.skills.length * skill.effect.multPerSkill
      if (skill.effect.chipsBonusPerCard) chips += skill.effect.chipsBonusPerCard * playedCards.length
    }

    // ===== 第四阶段：permanent 效果 =====
    for (const skill of this.skills) {
      if (skill.trigger !== 'permanent') continue
      if (skill.effect.multMultiply) mult *= skill.effect.multMultiply
      if (skill.effect.allCardsChipsBonus) chips += skill.effect.allCardsChipsBonus * playedCards.length
    }

    // ===== 第五阶段：Boss 效果 =====
    if (bossEffect) {
      if (bossEffect.effect.allProductionMultiplier) {
        chips = Math.floor(chips * bossEffect.effect.allProductionMultiplier)
      }
      if (bossEffect.effect.productionPenalty) {
        const affected = bossEffect.effect.suit || []
        for (const card of playedCards) {
          if (affected.includes(card.suit)) {
            chips -= Math.floor((RANK_VALUES[card.rank] || 0) * bossEffect.effect.productionPenalty)
          }
        }
      }
    }

    if (mult < 1) mult = 1
    if (chips < 0) chips = 0
    const finalScore = Math.floor(chips * mult)

    return { chips, mult, finalScore, details, handType, cardCount: playedCards.length }
  }

  _checkCondition(condition, playedCards, state) {
    if (!condition) return true
    if (condition.suit) {
      if (!playedCards.some(c => c.suit === condition.suit)) return false
    }
    if (condition.chance && Math.random() > condition.chance) return false
    if (condition.minEnergy && state.resources.energy < condition.minEnergy) return false
    if (condition.minFunding && state.resources.funding < condition.minFunding) return false
    return true
  }

  _filterByCondition(cards, condition) {
    if (!condition) return cards
    if (condition.suit) return cards.filter(c => c.suit === condition.suit)
    return cards
  }

  checkPass(finalScore, levelConfig) {
    return finalScore >= levelConfig.scoreTarget
  }
}

module.exports = ScoreResolver
