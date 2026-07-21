/**
 * 学术 Roguelike —— 学术技能卡库 (Joker 类)
 * 50 张被动技能卡，提供持续效果
 *
 * 每张技能卡字段:
 *   id          - 唯一标识
 *   name        - 中文名称
 *   icon        - emoji 图标
 *   rarity      - 稀有度: common / uncommon / rare / legendary
 *   cost        - 商店购买价格
 *   trigger     - 触发时机: onPlay / onScore / onHand / onRound / onShop / permanent
 *   condition   - 触发条件: { type, count, minEnergy, ... } 或 null(始终触发)
 *   effect      - 效果对象
 *   description - 中文效果描述
 *
 * 效果类型:
 *   chipsBonus        - 额外产出(+chips)
 *   multBonus         - 额外倍率(+mult)
 *   multMultiply      - 倍率翻倍(×mult)
 *   energyRestore     - 恢复精力
 *   energyReduce      - 减少消耗
 *   drawBonus         - 额外抽牌
 *   handSizeBonus     - 手牌上限
 *   playBonus         - 额外打出次数
 *   fundingGain       - 获得经费
 *   shopDiscount      - 商店折扣
 *   upgradeBonus      - 升级加成
 *   randomCard        - 获得随机卡
 */

module.exports = [
  // ==================== 普通 (Common) - 20张 ====================
  {
    id: 'coffee_addict',
    name: '咖啡因依赖',
    icon: '☕',
    rarity: 'common',
    cost: 3,
    trigger: 'onPlay',
    condition: { suit: 'experiment' },
    effect: { energyRestore: 3 },
    description: '每打出一张实验卡，恢复 3 点精力'
  },
  {
    id: 'night_owl',
    name: '夜猫子',
    icon: '🦉',
    rarity: 'common',
    cost: 4,
    trigger: 'permanent',
    condition: null,
    effect: { handSizeBonus: 1, roundEnergyLoss: 5 },
    description: '手牌上限 +1，每回合开始时精力 -5'
  },
  {
    id: 'early_bird',
    name: '早鸟',
    icon: '🌅',
    rarity: 'common',
    cost: 3,
    trigger: 'onRound',
    condition: null,
    effect: { energyRestore: 10 },
    description: '每回合开始时恢复 10 点精力'
  },
  {
    id: 'speed_reader',
    name: '速读大师',
    icon: '📖',
    rarity: 'common',
    cost: 4,
    trigger: 'onScore',
    condition: { suit: 'writing' },
    effect: { multBonus: 2 },
    description: '结算时，每张写作卡 +2 倍率'
  },
  {
    id: 'lab_routine',
    name: '实验室日常',
    icon: '🧫',
    rarity: 'common',
    cost: 3,
    trigger: 'onPlay',
    condition: { suit: 'experiment' },
    effect: { chipsBonus: 5 },
    description: '每打出一张实验卡，+5 产出'
  },
  {
    id: 'note_taker',
    name: '笔记达人',
    icon: '🗒️',
    rarity: 'common',
    cost: 4,
    trigger: 'onHand',
    condition: { firstCardOnly: true },
    effect: { energyFree: true },
    description: '每回合打出的第一张卡不消耗精力'
  },
  {
    id: 'proof_reader',
    name: '校对员之眼',
    icon: '👁️',
    rarity: 'common',
    cost: 3,
    trigger: 'onScore',
    condition: { suit: 'writing' },
    effect: { chipsBonus: 5 },
    description: '结算时，每张写作卡 +5 产出'
  },
  {
    id: 'data_hoarder',
    name: '数据囤积者',
    icon: '💾',
    rarity: 'common',
    cost: 4,
    trigger: 'permanent',
    condition: null,
    effect: { handSizeBonus: 1 },
    description: '手牌上限 +1'
  },
  {
    id: 'social_media_academic',
    name: '学术网红',
    icon: '📱',
    rarity: 'common',
    cost: 3,
    trigger: 'onPlay',
    condition: { suit: 'social' },
    effect: { multBonus: 3 },
    description: '每打出一张社交卡，+3 倍率'
  },
  {
    id: 'teaching_fellow',
    name: '助教补贴',
    icon: '💰',
    rarity: 'common',
    cost: 3,
    trigger: 'onRound',
    condition: null,
    effect: { fundingGain: 50 },
    description: '每回合开始获得 50 经费'
  },
  {
    id: 'reference_manager',
    name: 'EndNote 达人',
    icon: '📑',
    rarity: 'common',
    cost: 4,
    trigger: 'onHand',
    condition: null,
    effect: { redrawCount: 1 },
    description: '每回合可以重抽 1 张手牌'
  },
  {
    id: 'latex_wizard',
    name: 'LaTeX 巫师',
    icon: '🧙',
    rarity: 'common',
    cost: 3,
    trigger: 'onPlay',
    condition: { suit: 'writing' },
    effect: { energyReduce: 2 },
    description: '写作卡精力消耗 -2'
  },
  {
    id: 'experiment_log',
    name: '实验记录狂',
    icon: '📓',
    rarity: 'common',
    cost: 3,
    trigger: 'onPlay',
    condition: { suit: 'experiment', chance: 0.5 },
    effect: { chipsBonus: 8 },
    description: '打出实验卡时 50% 概率 +8 产出'
  },
  {
    id: 'lab_cleaner',
    name: '实验室清道夫',
    icon: '🧹',
    rarity: 'common',
    cost: 3,
    trigger: 'onRound',
    condition: { maxEnergy: 30 },
    effect: { energyRestore: 10 },
    description: '回合开始时若精力 < 30，恢复 10 点精力'
  },
  {
    id: 'seminar_junkie',
    name: '讲座狂魔',
    icon: '🎪',
    rarity: 'common',
    cost: 4,
    trigger: 'onPlay',
    condition: { suit: 'social' },
    effect: { drawCount: 1 },
    description: '每打出一张社交卡，抽 1 张牌'
  },
  {
    id: 'code_monkey',
    name: '代码猴子',
    icon: '🐒',
    rarity: 'common',
    cost: 3,
    trigger: 'onPlay',
    condition: { suit: 'analysis' },
    effect: { chipsBonus: 6 },
    description: '每打出一张数据分析卡，+6 产出'
  },
  {
    id: 'grant_seeker',
    name: '基金猎手',
    icon: '🎯',
    rarity: 'common',
    cost: 4,
    trigger: 'onShop',
    condition: { firstPurchaseOnly: true },
    effect: { shopDiscount: 0.25 },
    description: '每次商店第一笔消费打 75 折'
  },
  {
    id: 'peer_reviewer',
    name: '同行评审员',
    icon: '✅',
    rarity: 'common',
    cost: 3,
    trigger: 'onScore',
    condition: null,
    effect: { multBonusPerType: 1 },
    description: '结算时，本回合打出的每种类型 +1 倍率'
  },
  {
    id: 'citation_tracker',
    name: '引用追踪器',
    icon: '🔗',
    rarity: 'common',
    cost: 4,
    trigger: 'onScore',
    condition: { suit: 'writing' },
    effect: { multPerCard: 1 },
    description: '结算时，手牌中每张写作卡 +1 倍率'
  },
  {
    id: 'emergency_snack',
    name: '应急零食柜',
    icon: '🍫',
    rarity: 'common',
    cost: 3,
    trigger: 'onPlay',
    condition: { minEnergy: 0, maxEnergy: 10 },
    effect: { energyFreeAll: true },
    description: '精力不足 10 时，所有卡牌不消耗精力'
  },

  // ==================== 罕见 (Uncommon) - 15张 ====================
  {
    id: 'deep_focus',
    name: '深度专注',
    icon: '🧘',
    rarity: 'uncommon',
    cost: 6,
    trigger: 'onHand',
    condition: { firstNPlays: 3 },
    effect: { chipsBonus: 10 },
    description: '每回合前 3 张打出的卡 +10 产出'
  },
  {
    id: 'collaborators_network',
    name: '合作网络',
    icon: '🕸️',
    rarity: 'uncommon',
    cost: 7,
    trigger: 'onScore',
    condition: { minTypes: 3 },
    effect: { chipsBonus: 20 },
    description: '本回合打出 3+ 种类型卡时，+20 产出'
  },
  {
    id: 'preprint_rush',
    name: '预印本冲刺',
    icon: '🚀',
    rarity: 'uncommon',
    cost: 6,
    trigger: 'onScore',
    condition: null,
    effect: { multPerCard: 0.5 },
    description: '结算时每张打出的卡 +0.5 倍率(向上取整)'
  },
  {
    id: 'research_assistant',
    name: '研究助理',
    icon: '🧑‍🔬',
    rarity: 'uncommon',
    cost: 7,
    trigger: 'permanent',
    condition: null,
    effect: { playBonus: 1 },
    description: '每回合可多打出 1 张卡'
  },
  {
    id: 'grant_funded_lab',
    name: '经费充裕实验室',
    icon: '🏦',
    rarity: 'uncommon',
    cost: 6,
    trigger: 'onShop',
    condition: null,
    effect: { shopExtraSlot: 1 },
    description: '商店多 1 个商品位'
  },
  {
    id: 'plagiarism_checker',
    name: '查重软件',
    icon: '🔎',
    rarity: 'uncommon',
    cost: 6,
    trigger: 'onScore',
    condition: { suit: 'writing', minEnergy: 50 },
    effect: { chipMultiply: 2 },
    description: '精力 > 50 时，写作卡产出翻倍'
  },
  {
    id: 'open_access',
    name: '开放获取',
    icon: '🔓',
    rarity: 'uncommon',
    cost: 6,
    trigger: 'onScore',
    condition: { minFunding: 1000 },
    effect: { multBonus: 8 },
    description: '经费 > 1000 时，+8 倍率'
  },
  {
    id: 'interdisciplinary',
    name: '跨学科研究',
    icon: '🔀',
    rarity: 'uncommon',
    cost: 7,
    trigger: 'onScore',
    condition: { minTypes: 2 },
    effect: { chipsBonus: 15 },
    description: '打出 2+ 种类型卡时，+15 产出'
  },
  {
    id: 'tenured_coach',
    name: '终身教授指导',
    icon: '🎓',
    rarity: 'uncommon',
    cost: 8,
    trigger: 'onScore',
    condition: { chance: 0.1 },
    effect: { allChipMultiply: 2 },
    description: '10% 概率本回合所有卡产出翻倍'
  },
  {
    id: 'lab_manager',
    name: '实验室主管',
    icon: '👔',
    rarity: 'uncommon',
    cost: 6,
    trigger: 'onHand',
    condition: { suit: 'experiment' },
    effect: { handChipsBonus: 5 },
    description: '手牌中每张实验卡 +5 产出'
  },
  {
    id: 'summer_school',
    name: '暑期学校',
    icon: '☀️',
    rarity: 'uncommon',
    cost: 6,
    trigger: 'onShop',
    condition: null,
    effect: { upgradeDiscount: 1 },
    description: '升级卡牌费用 -1 经费'
  },
  {
    id: 'poster_presentation',
    name: '海报展示',
    icon: '🖼️',
    rarity: 'uncommon',
    cost: 5,
    trigger: 'onPlay',
    condition: { suit: 'social' },
    effect: { multBonus: 4 },
    description: '打出社交卡时 +4 倍率'
  },
  {
    id: 'thesis_template',
    name: '论文模板',
    icon: '📐',
    rarity: 'uncommon',
    cost: 6,
    trigger: 'onScore',
    condition: { suit: 'writing' },
    effect: { chipsBonusPerCard: 8 },
    description: '结算时每张写作卡额外 +8 产出'
  },
  {
    id: 'journal_editor',
    name: '期刊编委',
    icon: '📰',
    rarity: 'uncommon',
    cost: 7,
    trigger: 'onScore',
    condition: { minScore: 50 },
    effect: { chipsBonus: 15 },
    description: '本回合产出 > 50 时，额外 +15'
  },
  {
    id: 'visiting_scholar',
    name: '访问学者',
    icon: '✈️',
    rarity: 'uncommon',
    cost: 6,
    trigger: 'onRound',
    condition: null,
    effect: { randomTypeBonus: 12 },
    description: '每回合随机一种类型卡 +12 产出'
  },

  // ==================== 稀有 (Rare) - 10张 ====================
  {
    id: 'nobel_mentor',
    name: '诺奖级导师',
    icon: '🏅',
    rarity: 'rare',
    cost: 9,
    trigger: 'onScore',
    condition: { suit: 'experiment', minCount: 1 },
    effect: { multMultiply: 2 },
    description: '本回合打出任何实验卡，最终倍率 ×2'
  },
  {
    id: 'nature_publication',
    name: 'Nature 通讯作者',
    icon: '📗',
    rarity: 'rare',
    cost: 10,
    trigger: 'onScore',
    condition: { suit: 'writing' },
    effect: { chipMultiply: 3 },
    description: '写作卡产出 ×3'
  },
  {
    id: 'genius_grant',
    name: '天才基金',
    icon: '💎',
    rarity: 'rare',
    cost: 9,
    trigger: 'onScore',
    condition: null,
    effect: { fundingPerScore: 0.5 },
    description: '本回合获得产出值 50% 的经费'
  },
  {
    id: 'tenure_tracked',
    name: '终身教职快车道',
    icon: '🛤️',
    rarity: 'rare',
    cost: 10,
    trigger: 'permanent',
    condition: null,
    effect: { playBonus: 2, handSizeBonus: 1 },
    description: '每回合可多打出 2 张卡，手牌上限 +1'
  },
  {
    id: 'scientific_breakthrough',
    name: '重大突破',
    icon: '💥',
    rarity: 'rare',
    cost: 9,
    trigger: 'onPlay',
    condition: { suit: 'experiment', chance: 0.15 },
    effect: { chipMultiply: 5 },
    description: '打出实验卡时 15% 概率产出 ×5'
  },
  {
    id: 'data_goldmine',
    name: '数据金矿',
    icon: '⛏️',
    rarity: 'rare',
    cost: 10,
    trigger: 'onScore',
    condition: { suit: 'analysis' },
    effect: { countAsBoth: ['experiment', 'writing'] },
    description: '数据分析卡同时视为实验+写作卡结算'
  },
  {
    id: 'keynote_speaker',
    name: '主旨演讲者',
    icon: '🎙️',
    rarity: 'rare',
    cost: 9,
    trigger: 'onPlay',
    condition: { suit: 'social' },
    effect: { allCardsChipsBonus: 25 },
    description: '打出社交卡时，本回合所有卡 +25 产出'
  },
  {
    id: 'replication_crisis',
    name: '可重复性危机',
    icon: '⚠️',
    rarity: 'rare',
    cost: 8,
    trigger: 'onScore',
    condition: { suit: 'experiment', minCount: 1 },
    effect: { chipMultiply: 1.5 },
    description: '打出实验卡，总产出 ×1.5'
  },
  {
    id: 'h_index_boost',
    name: 'H 指数加成',
    icon: '📶',
    rarity: 'rare',
    cost: 9,
    trigger: 'permanent',
    condition: null,
    effect: { multPerDeckSize: 0.2 },
    description: '牌组每有 5 张牌，+1 倍率 (向下取整)'
  },
  {
    id: 'research_empire',
    name: '研究帝国',
    icon: '🏰',
    rarity: 'rare',
    cost: 8,
    trigger: 'onScore',
    condition: null,
    effect: { multPerSkill: 1 },
    description: '每拥有 1 张技能卡，+1 倍率'
  },

  // ==================== 传说 (Legendary) - 5张 ====================
  {
    id: 'fields_medal',
    name: '菲尔兹奖光环',
    icon: '🏆',
    rarity: 'legendary',
    cost: 12,
    trigger: 'permanent',
    condition: null,
    effect: { multMultiply: 3, energyCostMultiplier: 1.5 },
    description: '倍率 ×3，所有卡精力消耗 ×1.5'
  },
  {
    id: 'nobel_prize',
    name: '诺贝尔奖加成',
    icon: '👑',
    rarity: 'legendary',
    cost: 14,
    trigger: 'onScore',
    condition: { exactPlayCount: 5 },
    effect: { multMultiply: 5 },
    description: '恰好打出 5 张卡时，倍率 ×5'
  },
  {
    id: 'perpetual_motion',
    name: '永动机论文',
    icon: '♾️',
    rarity: 'legendary',
    cost: 12,
    trigger: 'permanent',
    condition: null,
    effect: { energyFreeAll: true, roundFundingLoss: 50 },
    description: '所有卡不消耗精力，每回合经费 -50'
  },
  {
    id: 'academic_legend',
    name: '学界传奇',
    icon: '🌟',
    rarity: 'legendary',
    cost: 15,
    trigger: 'permanent',
    condition: null,
    effect: { allCardsChipsBonus: 20 },
    description: '所有卡基础产出 +20'
  },
  {
    id: 'singularity',
    name: '学术奇点',
    icon: '🕳️',
    rarity: 'legendary',
    cost: 15,
    trigger: 'onScore',
    condition: { chance: 0.05 },
    effect: { multMultiply: 10 },
    description: '5% 概率触发，倍率 ×10'
  }
]

// ==================== 工具函数 ====================

module.exports.getByRarity = function(rarity) {
  return module.exports.filter(s => s.rarity === rarity)
}

module.exports.getById = function(id) {
  return module.exports.find(s => s.id === id)
}

/**
 * 按稀有度加权随机抽取
 * 概率: common 55%, uncommon 30%, rare 12%, legendary 3%
 */
module.exports.randomByRarity = function() {
  const roll = Math.random()
  let rarity
  if (roll < 0.55) rarity = 'common'
  else if (roll < 0.85) rarity = 'uncommon'
  else if (roll < 0.97) rarity = 'rare'
  else rarity = 'legendary'

  const pool = module.exports.getByRarity(rarity)
  return pool[Math.floor(Math.random() * pool.length)]
}
