/**
 * 小丑牌-学术版 —— 牌组管理器
 *
 * 使用标准 52 张牌组 (4 suit × 13 rank)
 * 每种 suit 有 13 张卡: 2,3,4,5,6,7,8,9,10,J,Q,K,A
 */

const { shuffle } = require('../utils/random')
const cardsConfig = require('../config/cards')

class DeckManager {

  constructor() {
    this.deck = []
    this.hand = []
    this.discard = []
    this.playedThisRound = []
    this.maxHandSize = 8
    this.drawPerRound = 5
  }

  /**
   * 根据学科配置生成初始牌组
   * suitWeights: { experiment: 15, writing: 13, analysis: 12, social: 12 }
   */
  initDeck(deckConfig) {
    this.deck = []
    this.hand = []
    this.discard = []
    this.playedThisRound = []

    const suits = ['experiment', 'writing', 'analysis', 'social']
    const ranks = ['2','3','4','5','6','7','8','9','10','J','Q','K','A']

    // 按学科权重填充牌组
    for (const suit of suits) {
      const count = deckConfig.suitWeights[suit] || 13
      // 获取该 suit 的所有卡
      const suitCards = cardsConfig.filter(c => c.suit === suit)
      // 按 rank 循环填充到目标数量
      for (let i = 0; i < count; i++) {
        const card = suitCards[i % suitCards.length]
        if (card) this.deck.push(card.id)
      }
    }

    this.deck = shuffle(this.deck)
  }

  resetRound() {
    this.discard.push(...this.playedThisRound)
    this.discard.push(...this.hand)
    this.playedThisRound = []
    this.hand = []
  }

  drawCards(count) {
    const drawn = []
    for (let i = 0; i < count; i++) {
      if (this.deck.length === 0) {
        if (this.discard.length === 0) break
        this.deck = shuffle([...this.discard])
        this.discard = []
      }
      const cardId = this.deck.pop()
      drawn.push(cardId)
      if (this.hand.length < this.maxHandSize) {
        this.hand.push(cardId)
      } else {
        this.discard.push(cardId)
      }
    }
    return drawn
  }

  drawInitialHand() { this.drawCards(this.maxHandSize) }

  playCard(handIndex) {
    if (handIndex < 0 || handIndex >= this.hand.length) return null
    const cardId = this.hand.splice(handIndex, 1)[0]
    this.playedThisRound.push(cardId)
    return cardsConfig.find(c => c.id === cardId) || null
  }

  discardCard(handIndex) {
    if (handIndex < 0 || handIndex >= this.hand.length) return null
    const cardId = this.hand.splice(handIndex, 1)[0]
    this.discard.push(cardId)
    return cardId
  }

  redrawCards(count) {
    const actual = Math.min(count, this.hand.length)
    for (let i = 0; i < actual; i++) {
      if (this.hand.length > 0) {
        this.discardCard(Math.floor(Math.random() * this.hand.length))
      }
    }
    this.drawCards(actual)
  }

  addCard(cardId) {
    const pos = Math.floor(Math.random() * (this.deck.length + 1))
    this.deck.splice(pos, 0, cardId)
  }

  removeCard(cardId) {
    const idx = this.deck.indexOf(cardId)
    if (idx !== -1) { this.deck.splice(idx, 1); return true }
    const discIdx = this.discard.indexOf(cardId)
    if (discIdx !== -1) { this.discard.splice(discIdx, 1); return true }
    return false
  }

  duplicateCard(cardId) {
    if (this.deck.includes(cardId) || this.discard.includes(cardId)) {
      this.addCard(cardId); return true
    }
    return false
  }

  getStats() {
    const all = [...this.deck, ...this.hand, ...this.discard, ...this.playedThisRound]
    const bySuit = {}
    for (const id of all) {
      const c = cardsConfig.find(card => card.id === id)
      if (c) bySuit[c.suit] = (bySuit[c.suit] || 0) + 1
    }
    return { total: all.length, bySuit }
  }

  getHandDetails() {
    return this.hand.map(id => cardsConfig.find(c => c.id === id)).filter(Boolean)
  }

  getPlayedDetails() {
    return this.playedThisRound.map(id => cardsConfig.find(c => c.id === id)).filter(Boolean)
  }

  getUniqueCards() {
    const all = [...this.deck, ...this.hand, ...this.discard, ...this.playedThisRound]
    const unique = [...new Set(all)]
    return unique.map(id => {
      const config = cardsConfig.find(c => c.id === id)
      const count = all.filter(i => i === id).length
      return { ...config, count }
    }).filter(Boolean)
  }

  upgradeCard(cardId, amount) {
    // 在新系统中"升级"通过技能卡实现，这里保留接口兼容
    return true
  }

  serialize() {
    return {
      deck: [...this.deck], hand: [...this.hand], discard: [...this.discard],
      playedThisRound: [...this.playedThisRound], maxHandSize: this.maxHandSize, drawPerRound: this.drawPerRound
    }
  }

  deserialize(data) {
    this.deck = data.deck || []; this.hand = data.hand || []
    this.discard = data.discard || []; this.playedThisRound = data.playedThisRound || []
    this.maxHandSize = data.maxHandSize || 8; this.drawPerRound = data.drawPerRound || 5
  }
}

module.exports = DeckManager
