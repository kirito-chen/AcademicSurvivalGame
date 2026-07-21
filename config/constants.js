/**
 * 学术生存指南 —— 全局常量配置
 * 所有游戏数值的"唯一真相来源"
 */

// 资源上下限
const RESOURCE_LIMITS = {
  energy:              { min: 0, max: 100 },
  paperProgress:       { min: 0, max: 100 },
  advisorSatisfaction: { min: 0, max: 100 },
  money:               { min: 0, max: 99999 },
  mentalHealth:        { min: 0, max: 100 },
  socialCapital:       { min: 0, max: 100 },
  luck:                { min: 0, max: 100 }
}

// 游戏初始状态
const INITIAL_STATE = {
  energy: 80,
  paperProgress: 0,
  advisorSatisfaction: 60,
  money: 5000,
  mentalHealth: 70,
  socialCapital: 30,
  luck: 50,
  month: 1,
  year: 1,
  phase: 'enrollment'
}

// 每月固定收支
const MONTHLY_DECAY = {
  money: -1000,    // 生活费-3000 + 学校补助+2000 = 净支出-1000
  energy: -5       // 每月基础疲劳累积
}

// 阶段定义与过渡条件（按月计算）
const PHASES = {
  enrollment: {
    name: '入学适应期',
    description: '刚入学的你，对未来充满憧憬（和不安）',
    minMonth: 1,
    maxMonth: 3,
    nextPhase: 'coursework',
    transitionCondition: (state) => state.month >= 3
  },
  coursework: {
    name: '课程学习期',
    description: '选课、上课、赶作业，像本科一样——等等，我不是来搞科研的吗？',
    minMonth: 3,
    maxMonth: 15,
    nextPhase: 'research',
    transitionCondition: (state) => state.month >= 15
  },
  research: {
    name: '科研攻关期',
    description: '实验室就是你的家，数据就是你的命',
    minMonth: 10,
    maxMonth: 30,
    nextPhase: 'writing',
    transitionCondition: (state) => state.paperProgress >= 50 && state.month >= 20
  },
  writing: {
    name: '论文写作期',
    description: '咖啡、眼泪、LaTeX——毕业论文三件套',
    minMonth: 20,
    maxMonth: 45,
    nextPhase: 'defense',
    transitionCondition: (state) => state.paperProgress >= 90 && state.month >= 30
  },
  defense: {
    name: '答辩冲刺期',
    description: '最后关头！修改论文、准备PPT、祈祷评委仁慈',
    minMonth: 30,
    maxMonth: 55,
    nextPhase: 'graduated',
    transitionCondition: (state) => state.paperProgress >= 100
  }
}

// 阶段中文映射
const PHASE_NAMES = {
  enrollment: '入学适应期',
  coursework: '课程学习期',
  research: '科研攻关期',
  writing: '论文写作期',
  defense: '答辩冲刺期',
  graduated: '已毕业',
  expelled: '已退学'
}

// 最长年限（超过则肄业）
const MAX_YEAR = 6

// 时间换算
const MONTHS_PER_YEAR = 12

// 存档槽位数量
const SAVE_SLOTS = 3
const STORAGE_KEY = 'academic_survival_saves'

module.exports = {
  RESOURCE_LIMITS,
  INITIAL_STATE,
  MONTHLY_DECAY,
  PHASES,
  PHASE_NAMES,
  MAX_YEAR,
  MONTHS_PER_YEAR,
  SAVE_SLOTS,
  STORAGE_KEY
}
