/**
 * 随机事件模态框组件
 * 展示随机事件的内容和选项，玩家选择后通知父组件
 */
Component({
  properties: {
    // 事件对象（null 表示不展示）
    event: { type: Object, value: null },
    // 游戏状态（用于检查选项前置条件）
    resources: { type: Object, value: {} },
    // 是否可见
    visible: { type: Boolean, value: false }
  },

  observers: {
    'event, resources'(newEvent, resources) {
      if (newEvent && newEvent.options) {
        // 中文标签映射
        const labelMap = {
          energy: '精力', paperProgress: '论文进度',
          advisorSatisfaction: '导师满意度', money: '存款',
          mentalHealth: '心理健康', socialCapital: '社交资本',
          luck: '运气'
        }
        // 预计算每个选项的可用状态和中文效果标签
        const optionsWithState = newEvent.options.map(opt => {
          let available = true
          let requirementHint = ''
          if (opt.requirements) {
            for (const [key, minValue] of Object.entries(opt.requirements)) {
              if ((resources[key] || 0) < minValue) {
                available = false
                requirementHint = `需要${labelMap[key] || key}≥${minValue}`
                break
              }
            }
          }
          // 将效果对象转为中文标签数组 [{label:'精力', value:-30}, ...]
          const effectLabels = []
          if (opt.effects) {
            for (const [key, val] of Object.entries(opt.effects)) {
              if (val !== 0) {
                effectLabels.push({ label: labelMap[key] || key, value: val })
              }
            }
          }
          return { ...opt, _available: available, _requirementHint: requirementHint, _effectLabels: effectLabels }
        })
        this.setData({ optionsWithState, visible: true, eventTypeLabel: this._getTypeLabel(newEvent.type) })
      } else {
        this.setData({ optionsWithState: [], selectedOption: null })
      }
    },
    'visible'(val) {
      if (!val) {
        this.setData({ selectedOption: null })
      }
    }
  },

  data: {
    selectedOption: null,
    optionsWithState: []  // 预计算可用状态的选项列表
  },

  methods: {
    _getTypeLabel(type) {
      const map = { positive: '🎉 好事', negative: '⚠️ 坏事', neutral: '📋 中性', milestone: '📍 里程碑' }
      return map[type] || '事件'
    },
    /**
     * 选择一个选项
     */
    selectOption(e) {
      const optionId = e.currentTarget.dataset.optionId
      const option = this.data.optionsWithState.find(o => o.id === optionId)
      if (!option || !option._available) return

      this.setData({ selectedOption: optionId })

      // 震动反馈
      try {
        wx.vibrateShort({ type: 'medium' })
      } catch (e) {}

      // 延迟一会再通知父组件，让动画生效
      setTimeout(() => {
        this.triggerEvent('resolve', { optionId })
        this.setData({ visible: false, selectedOption: null, optionsWithState: [] })
      }, 300)
    }
  }
})
