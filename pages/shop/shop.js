/**
 * 学术 Roguelike —— 商店页面
 *
 * 每通过一关后进入，可花费经费购买技能卡/机遇卡/服务
 */

const app = getApp()
const ShopGenerator = require('../../core/ShopGenerator')

Page({
  data: {
    // 商店商品
    skills: [],
    consumables: [],
    services: [],

    // 玩家信息
    funding: 0,
    roundNumber: 1,
    ante: 1,

    // 牌组信息
    deckCards: [],

    // 当前选中
    selectedItem: null,
    selectedIndex: -1,
    selectedType: '',

    // UI
    rerollPrice: 3,
    showDetail: false,
    detailItem: null
  },

  onLoad() {
    const engine = app.globalData.gameEngine
    if (!engine) {
      wx.redirectTo({ url: '/pages/index/index' })
      return
    }

    this._generateShop()
  },

  /**
   * 生成商店
   */
  _generateShop() {
    const engine = app.globalData.gameEngine
    const summary = engine.getStateSummary()
    const ante = Math.ceil(summary.roundNumber / 3) || 1
    const funding = summary.resources ? summary.resources.funding : 0

    // 获取技能卡的商店效果
    const skillManager = engine.runManager.skillManager
    const shopEffects = skillManager ? skillManager.getShopEffects() : {}

    const generator = new ShopGenerator()
    const shop = generator.generateShop(ante, funding, shopEffects, this._rerollCount || 0)

    // 获取牌组中所有唯一卡(用于升级/删除选择)
    const deckManager = engine.runManager.deckManager
    const deckCards = deckManager ? deckManager.getUniqueCards() : []

    this.setData({
      skills: shop.skills,
      consumables: shop.consumables,
      services: shop.services,
      funding: funding,
      roundNumber: summary.roundNumber,
      ante: ante,
      deckCards: deckCards,
      rerollPrice: shop.rerollPrice
    })
  },

  /**
   * 购买技能卡
   */
  onBuySkill(e) {
    const index = e.currentTarget.dataset.index
    const skill = this.data.skills[index]
    if (!skill) return

    if (this.data.funding < skill.price) {
      wx.showToast({ title: '经费不足！', icon: 'none' })
      return
    }

    const engine = app.globalData.gameEngine
    const skillManager = engine.runManager.skillManager

    if (skillManager.getFreeSlots() <= 0) {
      wx.showToast({ title: '技能槽位已满！', icon: 'none' })
      return
    }

    // 扣除经费
    engine.runManager.state.resources.funding -= skill.price
    engine.runManager.state.statistics.totalFundingSpent += skill.price

    // 添加技能卡
    skillManager.addSkill(skill.id)

    // 从商店移除
    const skills = [...this.data.skills]
    skills.splice(index, 1)
    this.setData({
      skills,
      funding: engine.runManager.state.resources.funding
    })

    wx.showToast({ title: `获得技能：${skill.name}`, icon: 'success' })
  },

  /**
   * 购买机遇卡
   */
  onBuyConsumable(e) {
    const index = e.currentTarget.dataset.index
    const consumable = this.data.consumables[index]
    if (!consumable) return

    if (this.data.funding < consumable.price) {
      wx.showToast({ title: '经费不足！', icon: 'none' })
      return
    }

    const engine = app.globalData.gameEngine
    engine.runManager.state.resources.funding -= consumable.price
    engine.runManager.state.statistics.totalFundingSpent += consumable.price

    // 应用机遇卡效果
    this._applyConsumable(consumable)

    const consumables = [...this.data.consumables]
    consumables.splice(index, 1)
    this.setData({
      consumables,
      funding: engine.runManager.state.resources.funding
    })

    wx.showToast({ title: `使用：${consumable.name}`, icon: 'success' })
  },

  /**
   * 使用服务
   */
  onUseService(e) {
    const index = e.currentTarget.dataset.index
    const service = this.data.services[index]
    if (!service) return

    if (service.id === 'reroll') {
      if (this.data.funding < service.price) {
        wx.showToast({ title: '经费不足！', icon: 'none' })
        return
      }
      const engine = app.globalData.gameEngine
      engine.runManager.state.resources.funding -= service.price
      engine.runManager.state.statistics.totalFundingSpent += service.price
      this._rerollCount = (this._rerollCount || 0) + 1
      this._generateShop()
      return
    }

    if (service.id === 'upgrade' || service.id === 'delete') {
      if (this.data.funding < service.price) {
        wx.showToast({ title: '经费不足！', icon: 'none' })
        return
      }

      if (this.data.deckCards.length === 0) {
        wx.showToast({ title: '牌组已空', icon: 'none' })
        return
      }

      // 弹窗选择卡牌
      this._showCardSelector(service)
      return
    }
  },

  /**
   * 显示卡牌选择器(用于升级/删除)
   */
  _showCardSelector(service) {
    const cards = this.data.deckCards.map(c => ({
      id: c.id,
      name: c.name,
      icon: c.icon,
      type: c.type,
      production: c.baseProduction,
      count: c.count
    }))

    const itemList = cards.map(c => `${c.icon} ${c.name} (产出:${c.production}, 数量:${c.count})`)

    wx.showActionSheet({
      itemList: itemList,
      success: (res) => {
        const card = cards[res.tapIndex]
        if (!card) return

        const engine = app.globalData.gameEngine
        engine.runManager.state.resources.funding -= service.price
        engine.runManager.state.statistics.totalFundingSpent += service.price

        if (service.id === 'upgrade') {
          engine.runManager.deckManager.upgradeCard(card.id, 5)
          wx.showToast({ title: `${card.name} 已升级 +5`, icon: 'success' })
        } else if (service.id === 'delete') {
          engine.runManager.deckManager.removeCard(card.id)
          wx.showToast({ title: `${card.name} 已移除`, icon: 'success' })
        }

        // 刷新
        const deckManager = engine.runManager.deckManager
        this.setData({
          funding: engine.runManager.state.resources.funding,
          deckCards: deckManager.getUniqueCards()
        })
      }
    })
  },

  /**
   * 应用机遇卡效果
   */
  _applyConsumable(consumable) {
    const engine = app.globalData.gameEngine
    const dm = engine.runManager.deckManager

    switch (consumable.id) {
      case 'energy_drink':
        engine.runManager.state.resources.energy = Math.min(100,
          engine.runManager.state.resources.energy + 30)
        break
      case 'small_grant':
        engine.runManager.state.resources.funding += 300
        break
      case 'big_grant':
        engine.runManager.state.resources.funding += 800
        break
      case 'draw_boost':
        dm.drawCards(4)
        break
      case 'reroll_token':
        // 下次刷新免费
        this._freeReroll = true
        break
      case 'extension_deadline':
        // 当前回合额外打出次数(效果在下回合体现)
        engine.runManager.scoreResolver.addTempEffect({ extraPlays: 2 })
        break
      case 'sabbatical':
        engine.runManager.state.resources.energy = Math.min(100,
          engine.runManager.state.resources.energy + 50)
        engine.runManager.state.resources.funding += 200
        break
      case 'random_skill':
        const skillsConfig = require('../../config/skills')
        const commonSkill = skillsConfig.randomByRarity()
        if (commonSkill) {
          engine.runManager.skillManager.addSkill(commonSkill.id)
        }
        break
      case 'rare_skill_token':
        const skillsConfig2 = require('../../config/skills')
        const uncommon = skillsConfig2.getByRarity('uncommon')
        if (uncommon.length > 0) {
          const skill = uncommon[Math.floor(Math.random() * uncommon.length)]
          engine.runManager.skillManager.addSkill(skill.id)
        }
        break
      case 'free_purchase':
        // 记下免费购买标记
        this._freePurchase = true
        break
      default:
        break
    }
  },

  /**
   * 离开商店
   */
  onLeaveShop() {
    const engine = app.globalData.gameEngine
    engine.leaveShop()
    wx.navigateBack()
  }
})
