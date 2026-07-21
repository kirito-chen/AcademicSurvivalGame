/**
 * 学术 Roguelike —— 机遇卡库 (Tarot/Planet 类)
 * 15 张一次性消耗卡，使用后立即生效并消失
 *
 * 每张机遇卡字段:
 *   id          - 唯一标识
 *   name        - 中文名称
 *   icon        - emoji 图标
 *   rarity      - 稀有度: common / uncommon / rare
 *   cost        - 商店价格
 *   effect      - 效果对象
 *   description - 中文描述
 *   targetType  - 目标类型: 'self'(即时生效) / 'card'(需选择一张卡) / 'deck'(影响牌组)
 */

module.exports = [
  // ==================== 即时效果类 ====================
  {
    id: 'energy_drink',
    name: '精力饮料',
    icon: '🧃',
    rarity: 'common',
    cost: 2,
    effect: { energyRestore: 30 },
    description: '恢复 30 点精力',
    targetType: 'self'
  },
  {
    id: 'small_grant',
    name: '小额资助',
    icon: '💵',
    rarity: 'common',
    cost: 2,
    effect: { fundingGain: 300 },
    description: '获得 300 经费',
    targetType: 'self'
  },
  {
    id: 'big_grant',
    name: '大额基金',
    icon: '💎',
    rarity: 'uncommon',
    cost: 4,
    effect: { fundingGain: 800 },
    description: '获得 800 经费',
    targetType: 'self'
  },
  {
    id: 'draw_boost',
    name: '灵感乍现',
    icon: '⚡',
    rarity: 'common',
    cost: 2,
    effect: { drawCards: 4 },
    description: '立即抽 4 张牌',
    targetType: 'self'
  },
  {
    id: 'reroll_token',
    name: '商店刷新券',
    icon: '🎫',
    rarity: 'common',
    cost: 2,
    effect: { freeShopReroll: 1 },
    description: '下次商店刷新免费',
    targetType: 'self'
  },
  {
    id: 'extension_deadline',
    name: '延期申请',
    icon: '⏰',
    rarity: 'uncommon',
    cost: 5,
    effect: { extraPlays: 2 },
    description: '当前回合可多打出 2 张卡',
    targetType: 'self'
  },
  {
    id: 'sabbatical',
    name: '学术休假',
    icon: '🏖️',
    rarity: 'rare',
    cost: 7,
    effect: { skipRound: true, energyGain: 50, fundingGain: 200 },
    description: '跳过当前回合，恢复 50 精力并获得 200 经费',
    targetType: 'self'
  },

  // ==================== 牌组编辑类 ====================
  {
    id: 'delete_card',
    name: '退课申请',
    icon: '🗑️',
    rarity: 'common',
    cost: 2,
    effect: { removeCard: 1 },
    description: '从牌组中移除 1 张卡',
    targetType: 'card'
  },
  {
    id: 'duplicate_card',
    name: '复印文献',
    icon: '📋',
    rarity: 'uncommon',
    cost: 4,
    effect: { copyCard: 1 },
    description: '复制牌组中 1 张卡',
    targetType: 'card'
  },
  {
    id: 'upgrade_card',
    name: '导师批注',
    icon: '✍️',
    rarity: 'common',
    cost: 3,
    effect: { upgradeCard: 1, upgradeAmount: 5 },
    description: '升级 1 张卡，使其基础产出 +5',
    targetType: 'card'
  },
  {
    id: 'super_upgrade',
    name: '大师修改',
    icon: '🖊️',
    rarity: 'rare',
    cost: 7,
    effect: { upgradeCard: 1, upgradeAmount: 12 },
    description: '大幅升级 1 张卡，基础产出 +12',
    targetType: 'card'
  },
  {
    id: 'transform_card',
    name: '跨学科借鉴',
    icon: '🔄',
    rarity: 'uncommon',
    cost: 4,
    effect: { transformType: true },
    description: '将 1 张卡随机转变为另一种类型',
    targetType: 'card'
  },
  {
    id: 'random_skill',
    name: '学术灵感',
    icon: '🎲',
    rarity: 'uncommon',
    cost: 5,
    effect: { gainRandomSkill: 'common' },
    description: '随机获得 1 张普通稀有度技能卡',
    targetType: 'self'
  },
  {
    id: 'rare_skill_token',
    name: '大师指点',
    icon: '🧠',
    rarity: 'rare',
    cost: 8,
    effect: { gainRandomSkill: 'uncommon' },
    description: '随机获得 1 张罕见稀有度技能卡',
    targetType: 'self'
  },
  {
    id: 'free_purchase',
    name: '免费午餐券',
    icon: '🍽️',
    rarity: 'rare',
    cost: 6,
    effect: { nextPurchaseFree: 1 },
    description: '下次商店购买免单(不限价格)',
    targetType: 'self'
  }
]

// ==================== 工具函数 ====================

module.exports.getByRarity = function(rarity) {
  return module.exports.filter(c => c.rarity === rarity)
}

module.exports.getById = function(id) {
  return module.exports.find(c => c.id === id)
}

module.exports.getShopConsumables = function() {
  // 商店中只出现 common 和 uncommon 的机遇卡
  return module.exports.filter(c => c.rarity === 'common' || c.rarity === 'uncommon')
}
