/**
 * 学术 Roguelike —— 牌组管理器
 *
 * 管理玩家的牌组: 初始化、抽牌、弃牌、洗牌、编辑
 */

const { shuffle } = require('../utils/random')
const cardsConfig = require('../config/cards')

class DeckManager {

  constructor() {
    /** @type {Array} 当前牌组(卡牌ID列表) */
    this.deck = []
    /** @type {Array} 手牌(卡牌ID列表) */
    this.hand = []
    /** @type {Array} 弃牌堆(卡牌ID列表) */
    this.discard = []
    /** @type {Array} 本轮已打出的卡 */
    this.playedThisRound = []
    /** @type {number} 手牌上限 */
    this.maxHandSize = 8
    /** @type {number} 每回合补牌数 */
    this.drawPerRound = 5
  }

  /**
   * 根据学科初始化牌组
   * @param {object} deckConfig - 学科牌组配置(来自 decks.js)
   */
  initDeck(deckConfig) {
    this.deck = []
    this.hand = []
    this.discard = []
    this.playedThisRound = []

    // 根据配置构建牌组
    for (const entry of deckConfig.cards) {
      for (let i = 0; i < entry.count; i++) {
        this.deck.push(entry.id)
      }
    }

    // 洗牌
    this.deck = shuffle(this.deck)
  }

  /**
   * 重置回合状态(不清空牌组)
   */
  resetRound() {
    this.discard.push(...this.playedThisRound)
    this.discard.push(...this.hand)
    this.playedThisRound = []
    this.hand = []
  }

  /**
   * 抽牌到手牌
   * @param {number} count - 抽牌数量
   * @returns {Array} 抽到的卡牌ID列表
   */
  drawCards(count) {
    const drawn = []

    for (let i = 0; i < count; i++) {
      // 牌组空了就从弃牌堆重新洗入
      if (this.deck.length === 0) {
        if (this.discard.length === 0) break
        this.deck = shuffle([...this.discard])
        this.discard = []
      }

      const cardId = this.deck.pop()
      drawn.push(cardId)

      // 手牌未满就加入手牌
      if (this.hand.length < this.maxHandSize) {
        this.hand.push(cardId)
      } else {
        // 手牌满了就直接弃掉
        this.discard.push(cardId)
      }
    }

    return drawn
  }

  /**
   * 初始抽满手牌
   */
  drawInitialHand() {
    this.drawCards(this.maxHandSize)
  }

  /**
   * 从手牌中打出卡
   * @param {number} handIndex - 手牌中的索引
   * @returns {object|null} 打出的卡牌配置，失败返回 null
   */
  playCard(handIndex) {
    if (handIndex < 0 || handIndex >= this.hand.length) return null

    const cardId = this.hand.splice(handIndex, 1)[0]
    this.playedThisRound.push(cardId)
    return cardsConfig.find(c => c.id === cardId) || null
  }

  /**
   * 弃掉手牌中的一张卡
   * @param {number} handIndex - 手牌中的索引
   * @returns {string|null} 弃掉的卡牌ID
   */
  discardCard(handIndex) {
    if (handIndex < 0 || handIndex >= this.hand.length) return null

    const cardId = this.hand.splice(handIndex, 1)[0]
    this.discard.push(cardId)
    return cardId
  }

  /**
   * 重抽手牌中的若干张
   * @param {number} count - 重抽数量
   */
  redrawCards(count) {
    const actualCount = Math.min(count, this.hand.length)
    for (let i = 0; i < actualCount; i++) {
      if (this.hand.length > 0) {
        const idx = Math.floor(Math.random() * this.hand.length)
        this.discardCard(idx)
      }
    }
    this.drawCards(actualCount)
  }

  /**
   * 添加卡牌到牌组
   * @param {string} cardId - 卡牌ID
   */
  addCard(cardId) {
    // 随机插入牌组
    const pos = Math.floor(Math.random() * (this.deck.length + 1))
    this.deck.splice(pos, 0, cardId)
  }

  /**
   * 从牌组中删除一张卡(不包括手牌和弃牌堆的)
   * @param {string} cardId - 卡牌ID
   * @returns {boolean} 是否删除成功
   */
  removeCard(cardId) {
    const idx = this.deck.indexOf(cardId)
    if (idx !== -1) {
      this.deck.splice(idx, 1)
      return true
    }
    // 也检查弃牌堆
    const discIdx = this.discard.indexOf(cardId)
    if (discIdx !== -1) {
      this.discard.splice(discIdx, 1)
      return true
    }
    return false
  }

  /**
   * 复制牌组中的一张卡
   * @param {string} cardId - 卡牌ID
   * @returns {boolean} 是否成功
   */
  duplicateCard(cardId) {
    // 检查卡牌是否在牌组或弃牌堆中
    const inDeck = this.deck.includes(cardId)
    const inDiscard = this.discard.includes(cardId)
    if (inDeck || inDiscard) {
      this.addCard(cardId)
      return true
    }
    return false
  }

  /**
   * 获取牌组统计
   */
  getStats() {
    const allCards = [...this.deck, ...this.hand, ...this.discard, ...this.playedThisRound]
    const stats = {
      total: allCards.length,
      byType: {},
      byRarity: {}
    }

    for (const cardId of allCards) {
      const card = cardsConfig.find(c => c.id === cardId)
      if (card) {
        stats.byType[card.type] = (stats.byType[card.type] || 0) + 1
        stats.byRarity[card.rarity] = (stats.byRarity[card.rarity] || 0) + 1
      }
    }

    return stats
  }

  /**
   * 获取手牌详情(含卡牌配置)
   */
  getHandDetails() {
    return this.hand.map(id => cardsConfig.find(c => c.id === id)).filter(Boolean)
  }

  /**
   * 获取本轮已打出卡牌详情
   */
  getPlayedDetails() {
    return this.playedThisRound.map(id => cardsConfig.find(c => c.id === id)).filter(Boolean)
  }

  /**
   * 获取牌组中所有唯一卡牌
   */
  getUniqueCards() {
    const allIds = [...this.deck, ...this.hand, ...this.discard, ...this.playedThisRound]
    const unique = [...new Set(allIds)]
    return unique.map(id => {
      const config = cardsConfig.find(c => c.id === id)
      const count = allIds.filter(i => i === id).length
      return { ...config, count }
    }).filter(Boolean)
  }

  /**
   * 升级一张卡牌的基础产出
   * @param {string} cardId - 卡牌ID
   * @param {number} amount - 升级量
   * @returns {boolean} 是否成功
   */
  upgradeCard(cardId, amount) {
    const card = cardsConfig.find(c => c.id === cardId)
    if (!card) return false

    // 检查是否达到最大升级次数
    if (card.upgradeLevel >= card.maxUpgrade) return false

    card.baseProduction += (amount || 5)
    card.upgradeLevel++
    return true
  }

  /**
   * 序列化(存档用)
   */
  serialize() {
    return {
      deck: [...this.deck],
      hand: [...this.hand],
      discard: [...this.discard],
      playedThisRound: [...this.playedThisRound],
      maxHandSize: this.maxHandSize,
      drawPerRound: this.drawPerRound
    }
  }

  /**
   * 反序列化(读档用)
   */
  deserialize(data) {
    this.deck = data.deck || []
    this.hand = data.hand || []
    this.discard = data.discard || []
    this.playedThisRound = data.playedThisRound || []
    this.maxHandSize = data.maxHandSize || 8
    this.drawPerRound = data.drawPerRound || 5
  }

  /**
   * 重置卡牌升级状态(新一局用)
   */
  static resetAllUpgrades() {
    cardsConfig.forEach(c => {
      c.upgradeLevel = 0
      // 重置基础产出到原始值...
      // 注意: 由于require缓存，这里实际上无法真正重置
      // 实际项目中应该在开始新局时深拷贝卡牌数据
    })
  }
}

module.exports = DeckManager
