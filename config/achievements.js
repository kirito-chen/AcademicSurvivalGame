/**
 * 学术 Roguelike —— 成就系统
 * 20 个成就，分 5 类
 */
module.exports = [
  // ===== 通关类 =====
  {
    id: 'first_clear',
    name: '首次通关',
    description: '完成第一次 Run（无论胜负）',
    icon: '🎯',
    category: 'milestone',
    condition: (runResult) => true
  },
  {
    id: 'graduate_first',
    name: '博士毕业',
    description: '第一次成功通关（通过最终答辩）',
    icon: '🎓',
    category: 'milestone',
    condition: (runResult) => runResult.won === true
  },
  {
    id: 'ante_2_reach',
    name: '初入科研',
    description: '到达第 2 学期',
    icon: '📚',
    category: 'milestone',
    condition: (runResult) => runResult.anteReached >= 2
  },
  {
    id: 'ante_4_reach',
    name: '科研老手',
    description: '到达第 4 学期',
    icon: '🔬',
    category: 'milestone',
    condition: (runResult) => runResult.anteReached >= 4
  },

  // ===== 分数类 =====
  {
    id: 'score_1000',
    name: '高产学者',
    description: '单局总产出达到 1000',
    icon: '📈',
    category: 'score',
    condition: (runResult) => runResult.totalScore >= 1000
  },
  {
    id: 'score_5000',
    name: '学术大佬',
    description: '单局总产出达到 5000',
    icon: '🏆',
    category: 'score',
    condition: (runResult) => runResult.totalScore >= 5000
  },
  {
    id: 'single_200',
    name: '灵感爆发',
    description: '单回合产出达到 200',
    icon: '💡',
    category: 'score',
    condition: (runResult) => runResult.stats && runResult.stats.highestSingleScore >= 200
  },

  // ===== 牌组类 =====
  {
    id: 'big_deck',
    name: '文献囤积者',
    description: '牌组中拥有 25 张以上的卡',
    icon: '📚',
    category: 'deck',
    condition: (runResult) => runResult.stats && runResult.stats.totalCardsPlayed >= 25
  },
  {
    id: 'skill_collector',
    name: '技能收藏家',
    description: '一局中拥有 5 张技能卡',
    icon: '🧠',
    category: 'deck',
    condition: (runResult) => runResult.stats && runResult.stats.skillCount >= 5
  },
  {
    id: 'all_types',
    name: '全能学者',
    description: '一回合中打出全部 5 种类型的卡',
    icon: '🌈',
    category: 'deck',
    condition: (runResult) => runResult.stats && runResult.stats.allTypesPlayed === true
  },

  // ===== 难度类 =====
  {
    id: 'hard_clear',
    name: '挑战者',
    description: '在困难难度或以上通关',
    icon: '⚔️',
    category: 'difficulty',
    condition: (runResult) => runResult.won && runResult.difficulty !== 'normal'
  },
  {
    id: 'nightmare_clear',
    name: '噩梦幸存者',
    description: '在噩梦难度或以上通关',
    icon: '💀',
    category: 'difficulty',
    condition: (runResult) => runResult.won &&
      (runResult.difficulty === 'nightmare' || runResult.difficulty === 'hell')
  },

  // ===== 特殊类 =====
  {
    id: 'low_energy_win',
    name: '蜡烛两头烧',
    description: '通关时精力低于 20',
    icon: '🕯️',
    category: 'special',
    condition: (runResult) => runResult.won && runResult.stats && runResult.stats.finalEnergy < 20
  },
  {
    id: 'rich_academic',
    name: '土豪学者',
    description: '通关时经费超过 5000',
    icon: '💎',
    category: 'special',
    condition: (runResult) => runResult.won && runResult.stats && runResult.stats.finalFunding >= 5000
  },
  {
    id: 'no_skill_win',
    name: '裸考通关',
    description: '不购买任何技能卡通关',
    icon: '🧘',
    category: 'special',
    condition: (runResult) => runResult.won && runResult.stats && runResult.stats.skillCount === 0
  },
  {
    id: 'perfect_run',
    name: '完美 Run',
    description: '一命通关且所有 Boss 一次通过',
    icon: '👑',
    category: 'special',
    condition: (runResult) => runResult.won && runResult.stats && runResult.stats.perfectRun === true
  },

  // ===== 积累类 =====
  {
    id: 'ap_100',
    name: '声名鹊起',
    description: '累计获得 100 AP',
    icon: '⭐',
    category: 'meta',
    condition: (runResult, metaData) => metaData && metaData.totalAP >= 100
  },
  {
    id: 'ap_500',
    name: '学界名人',
    description: '累计获得 500 AP',
    icon: '🌟',
    category: 'meta',
    condition: (runResult, metaData) => metaData && metaData.totalAP >= 500
  },
  {
    id: 'all_disc_unlock',
    name: '全学科制霸',
    description: '解锁所有学科',
    icon: '🔓',
    category: 'meta',
    condition: (runResult, metaData) => metaData &&
      metaData.unlockedDisciplineIds && metaData.unlockedDisciplineIds.length >= 2
  },
  {
    id: 'ten_runs',
    name: '十年老兵',
    description: '完成 10 次 Run',
    icon: '🎖️',
    category: 'meta',
    condition: (runResult, metaData) => metaData && metaData.totalRuns >= 10
  }
]
