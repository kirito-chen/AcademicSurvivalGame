/**
 * 小丑牌-学术版 —— 研究方法卡牌库
 *
 * 每张卡 = rank(学术价值等级) + suit(研究领域)
 *
 * rank: 2~10, J(创新点), Q(理论贡献), K(实验验证), A(突破发现)
 * suit: experiment(实验🔬) / writing(写作📝) / analysis(分析📊) / social(社交🤝)
 *
 * rank值映射 chips: 2=2 ... 10=10, J/Q/K=10, A=11
 */

const RANK_VALUES = {
  '2': 2, '3': 3, '4': 4, '5': 5,
  '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
  'J': 10, 'Q': 10, 'K': 10, 'A': 11
}

module.exports = [
  // ==================== 实验 (experiment) - 13张 ====================
  { id: 'exp_2',  name: '试错实验',   icon: '🧪', suit: 'experiment', rank: '2',  energyCost: 3,  tags: ['basic'] },
  { id: 'exp_3',  name: '简单测量',   icon: '📏', suit: 'experiment', rank: '3',  energyCost: 4,  tags: ['basic'] },
  { id: 'exp_4',  name: '条件实验',   icon: '⚗️', suit: 'experiment', rank: '4',  energyCost: 5,  tags: ['basic'] },
  { id: 'exp_5',  name: '对照实验',   icon: '🔬', suit: 'experiment', rank: '5',  energyCost: 6,  tags: ['basic', 'reliable'] },
  { id: 'exp_6',  name: '系统测试',   icon: '🧫', suit: 'experiment', rank: '6',  energyCost: 7,  tags: ['basic'] },
  { id: 'exp_7',  name: '重复验证',   icon: '🔄', suit: 'experiment', rank: '7',  energyCost: 8,  tags: ['reliable'] },
  { id: 'exp_8',  name: '田野调查',   icon: '🌿', suit: 'experiment', rank: '8',  energyCost: 9,  tags: ['field'] },
  { id: 'exp_9',  name: '精密实验',   icon: '🎯', suit: 'experiment', rank: '9',  energyCost: 10, tags: ['quality'] },
  { id: 'exp_10', name: '大型实验',   icon: '🏗️', suit: 'experiment', rank: '10', energyCost: 12, tags: ['high_yield'] },
  { id: 'exp_J',  name: '方法创新',   icon: '💡', suit: 'experiment', rank: 'J',  energyCost: 11, tags: ['innovation'] },
  { id: 'exp_Q',  name: '理论驱动实验', icon: '🧠', suit: 'experiment', rank: 'Q',  energyCost: 12, tags: ['theory'] },
  { id: 'exp_K',  name: '验证性实验', icon: '✅', suit: 'experiment', rank: 'K',  energyCost: 13, tags: ['validation'] },
  { id: 'exp_A',  name: '突破性发现', icon: '🌟', suit: 'experiment', rank: 'A',  energyCost: 15, tags: ['breakthrough'] },

  // ==================== 写作 (writing) - 13张 ====================
  { id: 'wrt_2',  name: '草稿笔记',   icon: '🗒️', suit: 'writing', rank: '2',  energyCost: 3,  tags: ['basic'] },
  { id: 'wrt_3',  name: '段落练习',   icon: '✏️', suit: 'writing', rank: '3',  energyCost: 4,  tags: ['basic'] },
  { id: 'wrt_4',  name: '摘要速写',   icon: '📋', suit: 'writing', rank: '4',  energyCost: 4,  tags: ['basic'] },
  { id: 'wrt_5',  name: '文献综述',   icon: '📚', suit: 'writing', rank: '5',  energyCost: 5,  tags: ['basic', 'setup'] },
  { id: 'wrt_6',  name: '图表制作',   icon: '📊', suit: 'writing', rank: '6',  energyCost: 6,  tags: ['visual'] },
  { id: 'wrt_7',  name: '方法论写作', icon: '📐', suit: 'writing', rank: '7',  energyCost: 7,  tags: ['reliable'] },
  { id: 'wrt_8',  name: 'LaTeX排版',  icon: '💻', suit: 'writing', rank: '8',  energyCost: 8,  tags: ['tech'] },
  { id: 'wrt_9',  name: '精修文稿',   icon: '✨', suit: 'writing', rank: '9',  energyCost: 9,  tags: ['quality'] },
  { id: 'wrt_10', name: '长篇论述',   icon: '📝', suit: 'writing', rank: '10', energyCost: 11, tags: ['high_yield'] },
  { id: 'wrt_J',  name: '创新观点',   icon: '💭', suit: 'writing', rank: 'J',  energyCost: 10, tags: ['innovation'] },
  { id: 'wrt_Q',  name: '理论框架',   icon: '🏛️', suit: 'writing', rank: 'Q',  energyCost: 12, tags: ['theory'] },
  { id: 'wrt_K',  name: '验证报告',   icon: '📄', suit: 'writing', rank: 'K',  energyCost: 11, tags: ['validation'] },
  { id: 'wrt_A',  name: '里程碑论文', icon: '📗', suit: 'writing', rank: 'A',  energyCost: 14, tags: ['breakthrough'] },

  // ==================== 分析 (analysis) - 13张 ====================
  { id: 'anl_2',  name: '数据录入',   icon: '⌨️', suit: 'analysis', rank: '2',  energyCost: 3,  tags: ['basic'] },
  { id: 'anl_3',  name: '简单统计',   icon: '📈', suit: 'analysis', rank: '3',  energyCost: 4,  tags: ['basic'] },
  { id: 'anl_4',  name: '数据清洗',   icon: '🧹', suit: 'analysis', rank: '4',  energyCost: 5,  tags: ['basic'] },
  { id: 'anl_5',  name: '统计检验',   icon: '📉', suit: 'analysis', rank: '5',  energyCost: 6,  tags: ['basic', 'reliable'] },
  { id: 'anl_6',  name: '代码调试',   icon: '🐛', suit: 'analysis', rank: '6',  energyCost: 8,  tags: ['tech'] },
  { id: 'anl_7',  name: '数据可视化', icon: '🎨', suit: 'analysis', rank: '7',  energyCost: 6,  tags: ['visual'] },
  { id: 'anl_8',  name: '模型拟合',   icon: '📐', suit: 'analysis', rank: '8',  energyCost: 9,  tags: ['quality'] },
  { id: 'anl_9',  name: '数据挖掘',   icon: '⛏️', suit: 'analysis', rank: '9',  energyCost: 10, tags: ['high_yield'] },
  { id: 'anl_10', name: '机器学习建模', icon: '🤖', suit: 'analysis', rank: '10', energyCost: 12, tags: ['tech', 'high_yield'] },
  { id: 'anl_J',  name: '新算法设计', icon: '🔮', suit: 'analysis', rank: 'J',  energyCost: 11, tags: ['innovation'] },
  { id: 'anl_Q',  name: '理论推导',   icon: '📝', suit: 'analysis', rank: 'Q',  energyCost: 13, tags: ['theory'] },
  { id: 'anl_K',  name: '结果验证',   icon: '✅', suit: 'analysis', rank: 'K',  energyCost: 10, tags: ['validation'] },
  { id: 'anl_A',  name: '重大发现',   icon: '💎', suit: 'analysis', rank: 'A',  energyCost: 14, tags: ['breakthrough'] },

  // ==================== 社交 (social) - 13张 ====================
  { id: 'soc_2',  name: '日常交流',   icon: '💬', suit: 'social', rank: '2',  energyCost: 2,  tags: ['basic'] },
  { id: 'soc_3',  name: '组会旁听',   icon: '👂', suit: 'social', rank: '3',  energyCost: 3,  tags: ['basic'] },
  { id: 'soc_4',  name: '请教同学',   icon: '🙋', suit: 'social', rank: '4',  energyCost: 4,  tags: ['basic'] },
  { id: 'soc_5',  name: '组会汇报',   icon: '👥', suit: 'social', rank: '5',  energyCost: 5,  tags: ['basic', 'advisor'] },
  { id: 'soc_6',  name: '跨组交流',   icon: '🌐', suit: 'social', rank: '6',  energyCost: 6,  tags: ['collab'] },
  { id: 'soc_7',  name: '学术社交',   icon: '🍷', suit: 'social', rank: '7',  energyCost: 5,  tags: ['shop'] },
  { id: 'soc_8',  name: '导师面谈',   icon: '👨‍🏫', suit: 'social', rank: '8',  energyCost: 6,  tags: ['advisor'] },
  { id: 'soc_9',  name: '合作实验',   icon: '🤝', suit: 'social', rank: '9',  energyCost: 8,  tags: ['collab', 'quality'] },
  { id: 'soc_10', name: '会议演讲',   icon: '🎤', suit: 'social', rank: '10', energyCost: 10, tags: ['powerful'] },
  { id: 'soc_J',  name: '学术提案',   icon: '📋', suit: 'social', rank: 'J',  energyCost: 9,  tags: ['innovation'] },
  { id: 'soc_Q',  name: '学派辩论',   icon: '⚡', suit: 'social', rank: 'Q',  energyCost: 10, tags: ['theory'] },
  { id: 'soc_K',  name: '成果宣讲',   icon: '📢', suit: 'social', rank: 'K',  energyCost: 11, tags: ['validation'] },
  { id: 'soc_A',  name: '国际大会主旨', icon: '🌍', suit: 'social', rank: 'A',  energyCost: 13, tags: ['breakthrough'] }
]

// 工具函数
module.exports.getById = function(id) {
  return module.exports.find(c => c.id === id)
}

module.exports.getBySuit = function(suit) {
  return module.exports.filter(c => c.suit === suit)
}

module.exports.getByRank = function(rank) {
  return module.exports.filter(c => c.rank === rank)
}

module.exports.RANK_VALUES = RANK_VALUES
