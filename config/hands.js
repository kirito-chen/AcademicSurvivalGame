/**
 * 小丑牌-学术版 —— 牌型定义
 */

// rank → chips 映射
const RANK_VALUES = {
  '2': 2, '3': 3, '4': 4, '5': 5,
  '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
  'J': 10, 'Q': 10, 'K': 10, 'A': 11
}
const RANK_ORDER = ['2','3','4','5','6','7','8','9','10','J','Q','K','A']

const SUITS = ['experiment', 'writing', 'analysis', 'social']
const SUIT_NAMES = { experiment: '实验', writing: '写作', analysis: '分析', social: '社交' }
const SUIT_ICONS = { experiment: '🔬', writing: '📝', analysis: '📊', social: '🤝' }

// 牌型定义（等级从高到低）
const HAND_TYPES = [
  {
    id: 'royal_flush', name: 'Nature/Science级成果', icon: '👑',
    baseChips: 100, baseMult: 8, minCards: 5,
    detect: (cards) => {
      if (cards.length < 5) return false
      const suit = cards[0].suit
      if (!cards.every(c => c.suit === suit)) return false
      const needed = ['A','K','Q','J','10']
      return needed.every(r => cards.some(c => c.rank === r))
    },
    getScoringCards: (cards) => cards  // 全部5张计分
  },
  {
    id: 'four_kind', name: '顶会级工作', icon: '🏆',
    baseChips: 60, baseMult: 7, minCards: 4,
    detect: (cards) => cards.length >= 4 && hasSameRank(cards, 4),
    getScoringCards: (cards) => getBestRankGroup(cards, 4)  // 只取4张同rank
  },
  {
    id: 'full_house', name: '理论+算法+实验', icon: '🔬',
    baseChips: 40, baseMult: 4, minCards: 5,
    detect: (cards) => {
      if (cards.length < 5) return false
      const c = Object.values(rankGroups(cards))
      return c.includes(3) && c.includes(2)
    },
    getScoringCards: (cards) => cards  // 全部5张计分
  },
  {
    id: 'flush', name: '同领域系统优化', icon: '🎯',
    baseChips: 35, baseMult: 4, minCards: 5,
    detect: (cards) => cards.length >= 5 && cards.every(c => c.suit === cards[0].suit),
    getScoringCards: (cards) => cards  // 全部5张计分
  },
  {
    id: 'straight', name: '完整方法链', icon: '🔗',
    baseChips: 30, baseMult: 4, minCards: 5,
    detect: (cards) => {
      if (cards.length < 5) return false
      const idx = cards.map(c => RANK_ORDER.indexOf(c.rank)).sort((a,b) => a-b)
      for (let i = 0; i < idx.length - 1; i++) { if (idx[i+1] - idx[i] !== 1) return false }
      return true
    },
    getScoringCards: (cards) => cards  // 全部5张计分
  },
  {
    id: 'two_pair', name: '两个创新点', icon: '✨',
    baseChips: 20, baseMult: 2, minCards: 4,
    detect: (cards) => {
      if (cards.length < 4) return false
      const pairs = Object.values(rankGroups(cards)).filter(c => c >= 2)
      return pairs.length >= 2
    },
    getScoringCards: (cards) => getBestRankGroups(cards, [2, 2])  // 取2+2配对的4张
  },
  {
    id: 'pair', name: '单点改进', icon: '📌',
    baseChips: 10, baseMult: 2, minCards: 2,
    detect: (cards) => cards.length >= 2 && hasSameRank(cards, 2),
    getScoringCards: (cards) => getBestRankGroup(cards, 2)  // 只取配对2张
  },
  {
    id: 'high_card', name: '高牌', icon: '📄',
    baseChips: 0, baseMult: 1, minCards: 1,
    detect: (cards) => cards.length >= 1,
    getScoringCards: (cards) => {
      // 只取最高rank的1张
      const sorted = [...cards].sort((a,b) => (RANK_VALUES[b.rank]||0) - (RANK_VALUES[a.rank]||0))
      return [sorted[0]]
    }
  }
]

// --- 辅助 ---
function rankGroups(cards) {
  const g = {}
  for (const c of cards) g[c.rank] = (g[c.rank] || 0) + 1
  return g
}
function hasSameRank(cards, n) {
  return Object.values(rankGroups(cards)).some(c => c >= n)
}
function getBestRankGroup(cards, n) {
  const groups = rankGroups(cards)
  let bestRank = null
  for (const [rank, count] of Object.entries(groups)) {
    if (count >= n) {
      if (!bestRank || (RANK_VALUES[rank]||0) > (RANK_VALUES[bestRank]||0)) bestRank = rank
    }
  }
  return bestRank ? cards.filter(c => c.rank === bestRank).slice(0, n) : cards
}
function getBestRankGroups(cards, counts) {
  // 取多组：如 [2,2] for two pair, 取最高的两个配对
  let remaining = [...cards]
  const result = []
  for (const n of counts) {
    const group = getBestRankGroup(remaining, n)
    result.push(...group)
    remaining = remaining.filter(c => !group.includes(c))
  }
  return result.length >= counts.reduce((a,b)=>a+b,0) ? result : cards
}

// --- 主函数 ---
function detectHand(cards) {
  if (!cards || cards.length === 0) return null
  for (const hand of HAND_TYPES) {
    if (cards.length >= hand.minCards && hand.detect(cards)) {
      const scoringCards = hand.getScoringCards(cards)
      const chipsFromRanks = scoringCards.reduce((s, c) => s + (RANK_VALUES[c.rank] || 0), 0)
      return { handType: hand, scoringCards, chipsFromRanks }
    }
  }
  const highCard = HAND_TYPES[HAND_TYPES.length - 1]
  const sc = highCard.getScoringCards(cards)
  return { handType: highCard, scoringCards: sc, chipsFromRanks: sc.reduce((s,c) => s + (RANK_VALUES[c.rank]||0), 0) }
}

function previewBestHand(handCards) { return null }

module.exports = { RANK_VALUES, SUITS, SUIT_NAMES, SUIT_ICONS, HAND_TYPES, detectHand, previewBestHand }
