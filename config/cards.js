/**
 * 学术 Roguelike —— 研究方法卡牌库
 * 30 张基础研究方法卡，分为 5 种类型
 *
 * 类型: experiment(实验) / writing(写作) / analysis(数据分析) / social(社交) / teaching(教学)
 *
 * 每张卡字段:
 *   id             - 唯一标识
 *   name           - 中文名称
 *   icon           - emoji 图标
 *   type           - 卡牌类型
 *   baseProduction - 基础学术产出 (chips)
 *   energyCost     - 精力消耗
 *   tags           - 标签数组 (用于技能卡匹配)
 *   effects        - 特殊效果数组 (可选)
 *   rarity         - 稀有度: basic / uncommon / rare
 *   upgradeLevel   - 已升级次数 (初始0)
 *   maxUpgrade     - 最大升级次数
 */

module.exports = [
  // ==================== 实验类 (8张) ====================
  {
    id: 'controlled_experiment',
    name: '对照实验',
    icon: '🔬',
    type: 'experiment',
    baseProduction: 15,
    energyCost: 8,
    tags: ['basic', 'reliable'],
    rarity: 'basic',
    effects: [],
    upgradeLevel: 0,
    maxUpgrade: 3
  },
  {
    id: 'pilot_study',
    name: '预实验',
    icon: '🧪',
    type: 'experiment',
    baseProduction: 8,
    energyCost: 4,
    tags: ['basic', 'cheap'],
    rarity: 'basic',
    effects: [],
    upgradeLevel: 0,
    maxUpgrade: 3
  },
  {
    id: 'lab_rush',
    name: '疯狂实验',
    icon: '⚗️',
    type: 'experiment',
    baseProduction: 22,
    energyCost: 15,
    tags: ['risky', 'high_yield'],
    rarity: 'uncommon',
    effects: [
      { type: 'random_bonus', range: [-5, 10], desc: '随机产出修正：-5 ~ +10' }
    ],
    upgradeLevel: 0,
    maxUpgrade: 3
  },
  {
    id: 'field_study',
    name: '田野调查',
    icon: '🌿',
    type: 'experiment',
    baseProduction: 12,
    energyCost: 10,
    tags: ['field', 'combo'],
    rarity: 'basic',
    effects: [
      { type: 'type_combo', bonusType: 'social', bonus: 5, desc: '本回合若打出社交卡，此卡 +5 产出' }
    ],
    upgradeLevel: 0,
    maxUpgrade: 3
  },
  {
    id: 'replication_study',
    name: '重复验证',
    icon: '🔄',
    type: 'experiment',
    baseProduction: 14,
    energyCost: 7,
    tags: ['reliable', 'chain'],
    rarity: 'basic',
    effects: [
      { type: 'chain_bonus', count: 2, bonus: 8, desc: '连续打出 2 张实验卡时，+8 产出' }
    ],
    upgradeLevel: 0,
    maxUpgrade: 3
  },
  {
    id: 'collaboration_exp',
    name: '合作实验',
    icon: '🤝',
    type: 'experiment',
    baseProduction: 18,
    energyCost: 10,
    tags: ['collab', 'social_hybrid'],
    rarity: 'uncommon',
    effects: [
      { type: 'self_buff', buffType: 'social', buffAmount: 5, desc: '本回合社交卡 +5 产出' }
    ],
    upgradeLevel: 0,
    maxUpgrade: 3
  },
  {
    id: 'equipment_rental',
    name: '借用设备',
    icon: '🔧',
    type: 'experiment',
    baseProduction: 18,
    energyCost: 12,
    tags: ['expensive', 'high_yield'],
    rarity: 'uncommon',
    effects: [
      { type: 'cost_funding', amount: 50, desc: '消耗 50 经费' }
    ],
    upgradeLevel: 0,
    maxUpgrade: 3
  },
  {
    id: 'serendipity',
    name: '意外发现',
    icon: '💡',
    type: 'experiment',
    baseProduction: 10,
    energyCost: 6,
    tags: ['random', 'fun'],
    rarity: 'uncommon',
    effects: [
      { type: 'random_draw', count: 1, desc: '随机抽 1 张牌' }
    ],
    upgradeLevel: 0,
    maxUpgrade: 3
  },

  // ==================== 写作类 (8张) ====================
  {
    id: 'draft_writing',
    name: '草稿撰写',
    icon: '📝',
    type: 'writing',
    baseProduction: 12,
    energyCost: 6,
    tags: ['basic', 'reliable'],
    rarity: 'basic',
    effects: [],
    upgradeLevel: 0,
    maxUpgrade: 3
  },
  {
    id: 'literature_review',
    name: '文献综述',
    icon: '📚',
    type: 'writing',
    baseProduction: 10,
    energyCost: 5,
    tags: ['basic', 'setup'],
    rarity: 'basic',
    effects: [
      { type: 'next_card_bonus', bonusType: 'writing', bonus: 5, desc: '下一张写作卡 +5 产出' }
    ],
    upgradeLevel: 0,
    maxUpgrade: 3
  },
  {
    id: 'polished_manuscript',
    name: '精修文稿',
    icon: '✨',
    type: 'writing',
    baseProduction: 18,
    energyCost: 10,
    tags: ['quality', 'high_yield'],
    rarity: 'uncommon',
    effects: [],
    upgradeLevel: 0,
    maxUpgrade: 3
  },
  {
    id: 'abstract_writing',
    name: '摘要速写',
    icon: '📋',
    type: 'writing',
    baseProduction: 6,
    energyCost: 3,
    tags: ['cheap', 'draw'],
    rarity: 'basic',
    effects: [
      { type: 'draw_cards', count: 1, desc: '抽 1 张牌' }
    ],
    upgradeLevel: 0,
    maxUpgrade: 3
  },
  {
    id: 'latex_formatting',
    name: 'LaTeX 排版',
    icon: '💻',
    type: 'writing',
    baseProduction: 8,
    energyCost: 8,
    tags: ['tech', 'mult'],
    rarity: 'uncommon',
    effects: [
      { type: 'add_mult', amount: 3, desc: '本回合 +3 倍率' }
    ],
    upgradeLevel: 0,
    maxUpgrade: 3
  },
  {
    id: 'figure_making',
    name: '图表制作',
    icon: '📊',
    type: 'writing',
    baseProduction: 14,
    energyCost: 7,
    tags: ['visual', 'reliable'],
    rarity: 'basic',
    effects: [],
    upgradeLevel: 0,
    maxUpgrade: 3
  },
  {
    id: 'rebuttal_letter',
    name: '回复审稿意见',
    icon: '✉️',
    type: 'writing',
    baseProduction: 20,
    energyCost: 12,
    tags: ['late_game', 'powerful'],
    rarity: 'rare',
    effects: [
      { type: 'require_previous', cardType: 'experiment', desc: '需要本回合已打出实验卡' }
    ],
    upgradeLevel: 0,
    maxUpgrade: 3
  },
  {
    id: 'grant_writing',
    name: '基金申请书',
    icon: '🎯',
    type: 'writing',
    baseProduction: 16,
    energyCost: 14,
    tags: ['funding', 'expensive'],
    rarity: 'uncommon',
    effects: [
      { type: 'gain_funding', amount: 200, desc: '获得 200 经费' }
    ],
    upgradeLevel: 0,
    maxUpgrade: 3
  },

  // ==================== 数据分析类 (6张) ====================
  {
    id: 'statistical_test',
    name: '统计检验',
    icon: '📈',
    type: 'analysis',
    baseProduction: 13,
    energyCost: 7,
    tags: ['basic', 'reliable'],
    rarity: 'basic',
    effects: [],
    upgradeLevel: 0,
    maxUpgrade: 3
  },
  {
    id: 'data_mining',
    name: '数据挖掘',
    icon: '⛏️',
    type: 'analysis',
    baseProduction: 17,
    energyCost: 9,
    tags: ['high_yield', 'random'],
    rarity: 'uncommon',
    effects: [
      { type: 'random_bonus', range: [0, 10], desc: '随机额外产出 0~10' }
    ],
    upgradeLevel: 0,
    maxUpgrade: 3
  },
  {
    id: 'code_debugging',
    name: '代码调试',
    icon: '🐛',
    type: 'analysis',
    baseProduction: 8,
    energyCost: 12,
    tags: ['setup', 'tech'],
    rarity: 'basic',
    effects: [
      { type: 'next_card_bonus', bonusType: 'analysis', bonus: 10, desc: '下一张数据分析卡 +10 产出' }
    ],
    upgradeLevel: 0,
    maxUpgrade: 3
  },
  {
    id: 'visualization',
    name: '数据可视化',
    icon: '🎨',
    type: 'analysis',
    baseProduction: 11,
    energyCost: 5,
    tags: ['mult', 'cheap'],
    rarity: 'uncommon',
    effects: [
      { type: 'add_mult', amount: 2, desc: '本回合 +2 倍率' }
    ],
    upgradeLevel: 0,
    maxUpgrade: 3
  },
  {
    id: 'meta_analysis',
    name: '元分析',
    icon: '🔍',
    type: 'analysis',
    baseProduction: 22,
    energyCost: 14,
    tags: ['powerful', 'late_game'],
    rarity: 'rare',
    effects: [
      { type: 'bonus_per_card_type', bonusPerType: 3, desc: '牌组中每种类型 +3 产出' }
    ],
    upgradeLevel: 0,
    maxUpgrade: 3
  },
  {
    id: 'machine_learning',
    name: '机器学习建模',
    icon: '🤖',
    type: 'analysis',
    baseProduction: 19,
    energyCost: 11,
    tags: ['tech', 'high_yield'],
    rarity: 'uncommon',
    effects: [
      { type: 'random_bonus', range: [-3, 15], desc: '随机产出修正：-3 ~ +15' }
    ],
    upgradeLevel: 0,
    maxUpgrade: 3
  },

  // ==================== 社交类 (5张) ====================
  {
    id: 'group_meeting',
    name: '组会汇报',
    icon: '👥',
    type: 'social',
    baseProduction: 9,
    energyCost: 5,
    tags: ['basic', 'advisor'],
    rarity: 'basic',
    effects: [
      { type: 'advisor_gain', amount: 5, desc: '导师满意度 +5' }
    ],
    upgradeLevel: 0,
    maxUpgrade: 3
  },
  {
    id: 'conference_talk',
    name: '会议演讲',
    icon: '🎤',
    type: 'social',
    baseProduction: 15,
    energyCost: 10,
    tags: ['powerful', 'setup'],
    rarity: 'uncommon',
    effects: [
      { type: 'next_card_bonus', bonusType: 'any', bonus: 8, desc: '下一张任意卡 +8 产出' }
    ],
    upgradeLevel: 0,
    maxUpgrade: 3
  },
  {
    id: 'advisor_meeting',
    name: '导师面谈',
    icon: '👨‍🏫',
    type: 'social',
    baseProduction: 5,
    energyCost: 3,
    tags: ['advisor', 'cheap'],
    rarity: 'basic',
    effects: [
      { type: 'advisor_mult', amount: 2, desc: '本回合导师满意度收益翻倍' }
    ],
    upgradeLevel: 0,
    maxUpgrade: 3
  },
  {
    id: 'cross_group_collab',
    name: '跨组合作',
    icon: '🌐',
    type: 'social',
    baseProduction: 12,
    energyCost: 8,
    tags: ['collab', 'random'],
    rarity: 'uncommon',
    effects: [
      { type: 'random_card', rarity: 'basic', desc: '获得 1 张随机基础卡加入牌组' }
    ],
    upgradeLevel: 0,
    maxUpgrade: 3
  },
  {
    id: 'academic_networking',
    name: '学术社交',
    icon: '🍷',
    type: 'social',
    baseProduction: 7,
    energyCost: 4,
    tags: ['shop', 'economy'],
    rarity: 'uncommon',
    effects: [
      { type: 'shop_discount', amount: 0.2, desc: '下次商店消费 8 折' }
    ],
    upgradeLevel: 0,
    maxUpgrade: 3
  },

  // ==================== 教学类 (3张) ====================
  {
    id: 'ta_session',
    name: '助教答疑',
    icon: '📖',
    type: 'teaching',
    baseProduction: 8,
    energyCost: 6,
    tags: ['recovery', 'basic'],
    rarity: 'basic',
    effects: [
      { type: 'energy_restore', amount: 5, desc: '恢复 5 点精力' }
    ],
    upgradeLevel: 0,
    maxUpgrade: 3
  },
  {
    id: 'guest_lecture',
    name: '客座讲座',
    icon: '🏛️',
    type: 'teaching',
    baseProduction: 14,
    energyCost: 10,
    tags: ['funding', 'uncommon'],
    rarity: 'uncommon',
    effects: [
      { type: 'gain_funding', amount: 100, desc: '获得 100 经费' }
    ],
    upgradeLevel: 0,
    maxUpgrade: 3
  },
  {
    id: 'mentoring',
    name: '辅导学弟学妹',
    icon: '🧑‍🎓',
    type: 'teaching',
    baseProduction: 6,
    energyCost: 4,
    tags: ['hand_size', 'support'],
    rarity: 'uncommon',
    effects: [
      { type: 'hand_size_bonus', amount: 1, desc: '本回合手牌上限 +1' }
    ],
    upgradeLevel: 0,
    maxUpgrade: 3
  }
]

/**
 * 按稀有度获取卡牌池
 */
module.exports.getByRarity = function(rarity) {
  return module.exports.filter(c => c.rarity === rarity)
}

/**
 * 按类型获取卡牌池
 */
module.exports.getByType = function(type) {
  return module.exports.filter(c => c.type === type)
}

/**
 * 按标签筛选
 */
module.exports.getByTag = function(tag) {
  return module.exports.filter(c => c.tags && c.tags.includes(tag))
}

/**
 * 获取基础卡牌（用于初始牌组）
 */
module.exports.getBasicCards = function() {
  return module.exports.filter(c => c.rarity === 'basic')
}
