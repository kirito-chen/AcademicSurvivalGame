/**
 * 学术 Roguelike —— 关卡定义
 * 8 个普通关 + 4 个 Boss 关，共 12 关
 *
 * 关卡结构: 每 3 关为一个"学期"(Ante)
 *   学期 1: 关1(普) → 关2(普) → 关3(Boss: 资格考试)
 *   学期 2: 关4(普) → 关5(普) → 关6(Boss: 开题答辩)
 *   学期 3: 关7(普) → 关8(普) → 关9(Boss: 预答辩)
 *   学期 4: 关10(普) → 关11(普) → 关12(Boss: 最终答辩)
 *
 * 每关字段:
 *   id            - 唯一标识
 *   name          - 关卡名称
 *   ante          - 所属学期 (1-4)
 *   isBoss        - 是否为 Boss 关
 *   scoreTarget   - 产出目标值
 *   maxPlays      - 最大出牌次数
 *   handSize      - 手牌数量
 *   drawSize      - 每回合抽牌数
 *   bossEffect    - Boss 专属效果 (仅 Boss 关)
 *   roundIntro    - 关卡开场文本
 */

module.exports = [
  // ==================== 学期 1: 入门 ====================
  {
    id: 'round_1',
    name: '文献调研',
    ante: 1,
    isBoss: false,
    scoreTarget: 30,
    maxPlays: 4,
    handSize: 8,
    drawSize: 5,
    roundIntro: '新学期开始了！先从文献调研入手，了解你的研究方向。'
  },
  {
    id: 'round_2',
    name: '初探实验',
    ante: 1,
    isBoss: false,
    scoreTarget: 50,
    maxPlays: 4,
    handSize: 8,
    drawSize: 5,
    roundIntro: '看了几篇论文，是时候动手做点初步实验了。'
  },
  {
    id: 'round_3_qualifying',
    name: '博士生资格考试',
    ante: 1,
    isBoss: true,
    scoreTarget: 80,
    maxPlays: 4,
    handSize: 8,
    drawSize: 5,
    bossEffect: {
      type: 'type_restriction',
      description: '资格考试委员会：实验类和写作类卡产出 -30%',
      effect: { suit: ['experiment', 'writing'], productionPenalty: 0.3 }
    },
    roundIntro: '⚡ Boss关：博士生资格考试！委员会对你的实验与写作能力格外严苛。'
  },

  // ==================== 学期 2: 积累 ====================
  {
    id: 'round_4',
    name: '数据积累',
    ante: 2,
    isBoss: false,
    scoreTarget: 100,
    maxPlays: 5,
    handSize: 8,
    drawSize: 5,
    roundIntro: '通过了资格考试！现在可以全力投入科研了。'
  },
  {
    id: 'round_5',
    name: '中期汇报',
    ante: 2,
    isBoss: false,
    scoreTarget: 130,
    maxPlays: 5,
    handSize: 8,
    drawSize: 5,
    roundIntro: '导师要求你做一次中期汇报，展示目前的实验进展。'
  },
  {
    id: 'round_6_proposal',
    name: '学位论文开题答辩',
    ante: 2,
    isBoss: true,
    scoreTarget: 170,
    maxPlays: 4,
    handSize: 8,
    drawSize: 5,
    bossEffect: {
      type: 'energy_drain',
      description: '开题答辩压力巨大：每打出一张卡额外消耗 3 点精力',
      effect: { extraEnergyCost: 3 }
    },
    roundIntro: '⚡ Boss关：开题答辩！五位教授围坐一圈，你的每个想法都将被严格审视。'
  },

  // ==================== 学期 3: 突破 ====================
  {
    id: 'round_7',
    name: '核心实验',
    ante: 3,
    isBoss: false,
    scoreTarget: 220,
    maxPlays: 5,
    handSize: 8,
    drawSize: 6,
    roundIntro: '开题成功！现在进入最关键的实验阶段。'
  },
  {
    id: 'round_8',
    name: '论文初稿',
    ante: 3,
    isBoss: false,
    scoreTarget: 280,
    maxPlays: 5,
    handSize: 8,
    drawSize: 6,
    roundIntro: '实验数据差不多了，开始动手写论文初稿吧。'
  },
  {
    id: 'round_9_predefense',
    name: '博士预答辩',
    ante: 3,
    isBoss: true,
    scoreTarget: 360,
    maxPlays: 4,
    handSize: 8,
    drawSize: 6,
    bossEffect: {
      type: 'require_type_count',
      description: '预答辩要求论文结构完整：必须打出至少 2 张写作卡和 2 张实验卡',
      effect: { requiredTypes: { writing: 2, experiment: 2 } }
    },
    roundIntro: '⚡ Boss关：预答辩！评委要求你的研究既有理论深度又有实验支撑。'
  },

  // ==================== 学期 4: 冲刺 ====================
  {
    id: 'round_10',
    name: '修改润色',
    ante: 4,
    isBoss: false,
    scoreTarget: 450,
    maxPlays: 5,
    handSize: 8,
    drawSize: 6,
    roundIntro: '根据预答辩意见修改论文。咖啡是你的好朋友。'
  },
  {
    id: 'round_11',
    name: '盲审等待',
    ante: 4,
    isBoss: false,
    scoreTarget: 550,
    maxPlays: 5,
    handSize: 8,
    drawSize: 6,
    roundIntro: '论文送审了——你不知道审稿人是谁，他们也不知道你是谁。双盲的浪漫。'
  },
  {
    id: 'round_12_defense',
    name: '最终答辩',
    ante: 4,
    isBoss: true,
    scoreTarget: 700,
    maxPlays: 4,
    handSize: 8,
    drawSize: 6,
    bossEffect: {
      type: 'final_defense',
      description: '最终答辩！所有卡精力消耗翻倍，但所有收益 ×1.5',
      effect: { energyCostMultiplier: 2, allProductionMultiplier: 1.5 }
    },
    roundIntro: '⚡ Boss关：最终答辩！你六年来的全部心血，就在这最后的展示中。全力以赴吧！'
  }
]

/**
 * 获取指定学期(ante)的所有关卡
 */
module.exports.getByAnte = function(ante) {
  return module.exports.filter(l => l.ante === ante)
}

/**
 * 根据关卡索引获取
 */
module.exports.getByIndex = function(index) {
  if (index >= 0 && index < module.exports.length) {
    return module.exports[index]
  }
  return null
}

/**
 * 获取总关卡数
 */
module.exports.getTotalRounds = function() {
  return module.exports.length
}
