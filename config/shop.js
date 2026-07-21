/**
 * 学术 Roguelike —— 商店配置
 *
 * 每通过一关后进入商店阶段，可使用经费购买技能卡、机遇卡或编辑牌组
 */

module.exports = {
  // 商店基础商品数量
  baseShopSlots: {
    skills: 2,       // 技能卡槽位数
    consumables: 2,  // 机遇卡槽位数
    services: 3      // 服务槽位数 (升级卡/删除卡/刷新)
  },

  // 每学期(Ante)商店槽位递增
  anteSlotBonus: {
    1: { skills: 0, consumables: 0 },
    2: { skills: 1, consumables: 0 },
    3: { skills: 1, consumables: 1 },
    4: { skills: 2, consumables: 1 }
  },

  // 技能卡价格（按稀有度）— 降低初始门槛
  skillPrices: {
    common: 1,
    uncommon: 2,
    rare: 4,
    legendary: 6
  },

  // 机遇卡价格
  consumablePrices: {
    common: 1,
    uncommon: 2,
    rare: 4
  },

  // 服务价格
  servicePrices: {
    upgradeCard: 2,
    deleteCard: 1,
    duplicateCard: 3,
    rerollShop: 1   // 刷新商店所有商品
  },

  // 刷新费用递增倍率
  rerollMultiplier: 1.5,

  // 稀有度出现概率（不同学期不同权重）
  // 越往后越容易出现高稀有度
  rarityWeights: {
    1: { common: 80, uncommon: 18, rare: 2, legendary: 0 },
    2: { common: 60, uncommon: 30, rare: 8, legendary: 2 },
    3: { common: 45, uncommon: 35, rare: 15, legendary: 5 },
    4: { common: 30, uncommon: 35, rare: 25, legendary: 10 }
  },

  // 经费奖励 (过关时获得，按学期，紧缩经济)
  anteClearFunding: {
    1: 5,
    2: 8,
    3: 12,
    4: 18
  },

  // Boss关额外经费奖励
  bossClearBonus: 10,

  // 剩余经费结算加成
  leftoverFundingMultiplier: 0.1
}
