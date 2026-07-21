/**
 * 小丑牌-学术版 —— 学科初始牌组
 * 8 个学科，每个学科 52 张标准牌组（4 suit × 13 rank）
 * 不同学科的 suit 分布略有侧重
 */

module.exports = [
  {
    id: 'cs',
    name: '计算机科学',
    icon: '💻',
    description: '代码即真理，擅长数据分析与方法创新',
    // 偏重 analysis，标准分布
    suitWeights: { experiment: 12, writing: 11, analysis: 17, social: 12 },
    deckSize: 52
  },
  {
    id: 'biology',
    name: '生物学',
    icon: '🧬',
    description: '实验驱动研究，田野与实验室并重',
    suitWeights: { experiment: 18, writing: 10, analysis: 12, social: 12 },
    deckSize: 52
  },
  {
    id: 'math',
    name: '数学',
    icon: '📐',
    description: '理论推导为王，辅以严谨的分析',
    suitWeights: { experiment: 9, writing: 14, analysis: 17, social: 12 },
    deckSize: 52
  },
  {
    id: 'physics',
    name: '物理学',
    icon: '⚛️',
    description: '理论与实验并重，高价值卡偏多',
    suitWeights: { experiment: 15, writing: 12, analysis: 13, social: 12 },
    deckSize: 52
  },
  {
    id: 'chemistry',
    name: '化学',
    icon: '🧪',
    description: '实验为王，大量的实验验证与重复',
    suitWeights: { experiment: 19, writing: 9, analysis: 12, social: 12 },
    deckSize: 52
  },
  {
    id: 'ee',
    name: '电子工程',
    icon: '🔌',
    description: '硬件+软件，分析类与实验类均衡',
    suitWeights: { experiment: 14, writing: 10, analysis: 16, social: 12 },
    deckSize: 52
  },
  {
    id: 'medicine',
    name: '医学',
    icon: '🩺',
    description: '临床为本，实验与社交并重',
    suitWeights: { experiment: 15, writing: 11, analysis: 12, social: 14 },
    deckSize: 52
  },
  {
    id: 'ai',
    name: '人工智能',
    icon: '🤖',
    description: '算法即一切，极高比例的数据分析卡',
    suitWeights: { experiment: 10, writing: 10, analysis: 20, social: 12 },
    deckSize: 52
  }
]

module.exports.getById = function(id) {
  return module.exports.find(d => d.id === id)
}
