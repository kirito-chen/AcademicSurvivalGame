/**
 * 学术 Roguelike —— 全局常量配置
 * 所有游戏数值的"唯一真相来源"
 */

// 资源上下限
const RESOURCE_LIMITS = {
  energy:              { min: 0, max: 100 },
  funding:             { min: 0, max: 99999 },
  paperProgress:       { min: 0, max: 100 },
  advisorSatisfaction: { min: 0, max: 100 }
}

// 游戏初始状态（资源初值）
const INITIAL_STATE = {
  energy: 80,
  funding: 8,
  paperProgress: 0,
  advisorSatisfaction: 60
}

// 手牌相关常量
const HAND_CONFIG = {
  defaultHandSize: 8,
  defaultDrawSize: 5,
  maxHandSize: 12,
  minHandSize: 4
}

// 技能槽位
const SKILL_CONFIG = {
  defaultSlots: 5,
  maxSlots: 8,
  minSlots: 2
}

// 出牌次数
const PLAY_CONFIG = {
  defaultMaxPlays: 4,
  minPlays: 2,
  maxPlays: 8
}

// 存档相关
const SAVE_SLOTS = 3
const STORAGE_KEY = 'academic_roguelike_saves'
const META_STORAGE_KEY = 'academic_roguelike_meta'

// 结局类型
const ENDING_TYPES = {
  graduated: 'victory',
  energy_exhausted: 'failure',
  funding_bankrupt: 'failure',
  score_not_met: 'failure',
  boss_failed: 'failure'
}

// 阶段中文映射（Boss 关用）
const PHASE_NAMES = {
  qualifying: '资格考试',
  proposal: '开题答辩',
  pre_defense: '预答辩',
  final_defense: '最终答辩',
  graduated: '已毕业',
  failed: '已退学'
}

module.exports = {
  RESOURCE_LIMITS,
  INITIAL_STATE,
  HAND_CONFIG,
  SKILL_CONFIG,
  PLAY_CONFIG,
  SAVE_SLOTS,
  STORAGE_KEY,
  META_STORAGE_KEY,
  ENDING_TYPES,
  PHASE_NAMES
}
