/**
 * 顶部状态栏组件
 * 聚合显示所有核心资源 + 学科信息 + 资源变化量
 */
Component({
  properties: {
    resources: { type: Object, value: {} },
    month: { type: Number, value: 1 },
    phase: { type: String, value: 'enrollment' },
    discipline: { type: String, value: '' },
    talentName: { type: String, value: '' },
    deltas: { type: Object, value: {} }
  },

  data: {
    phaseName: '',
    disciplineName: '',
    yearNum: 1,
    resourceConfigs: [
      { key: 'energy', label: '精力', icon: '⚡', color: '#00d4ff', maxKey: 'maxEnergy' },
      { key: 'paperProgress', label: '论文', icon: '📝', color: '#ff6b9d', maxKey: 'maxPaper' },
      { key: 'advisorSatisfaction', label: '导师', icon: '👨‍🏫', color: '#c084fc', maxKey: 'maxAdvisor' },
      { key: 'money', label: '存款', icon: '💰', color: '#fbbf24', maxKey: 'maxMoney' }
    ]
  },

  observers: {
    'month'(month) {
      this.setData({ yearNum: Math.ceil(month / 12) })
    },
    'phase'(phase) {
      const names = {
        enrollment: '入学适应期', coursework: '课程学习期',
        research: '科研攻关期', writing: '论文写作期',
        defense: '答辩冲刺期', graduated: '已毕业', expelled: '已退学'
      }
      this.setData({ phaseName: names[phase] || phase })
    },
    'discipline'(disc) {
      const names = {
        cs: '计算机科学', ai: '人工智能', bio: '生物学',
        physics: '物理学', chem: '化学', math: '数学',
        ee: '电子工程', medicine: '医学'
      }
      this.setData({ disciplineName: names[disc] || disc })
    }
  },

  methods: {
    getResourceValue(key) {
      return (this.properties.resources && this.properties.resources[key]) || 0
    },
    getDelta(key) {
      return (this.properties.deltas && this.properties.deltas[key]) || 0
    }
  }
})
