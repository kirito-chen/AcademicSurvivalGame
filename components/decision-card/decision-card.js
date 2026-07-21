/**
 * 决策卡片组件
 * 展示单个决策选项的详细信息，含可用状态和效果预览
 */
Component({
  properties: {
    decision: { type: Object, value: {} },
    available: { type: Boolean, value: true },
    unavailableReason: { type: String, value: '' },
    expanded: { type: Boolean, value: false }
  },

  data: {
    effectSummary: ''
  },

  observers: {
    'decision'(d) {
      if (!d || !d.baseEffects) return
      // 中文标签 + 关键效果摘要
      const labelMap = { energy: '精力', paperProgress: '论文', advisorSatisfaction: '导师', money: '存款' }
      const parts = []
      for (const [key, val] of Object.entries(d.baseEffects)) {
        if (!labelMap[key]) continue
        if (val === 0) continue
        if (Array.isArray(val)) {
          parts.push(`${labelMap[key]}${val[0] >= 0 ? '+' : ''}${val[0]}~${val[1] >= 0 ? '+' : ''}${val[1]}`)
        } else {
          parts.push(`${labelMap[key]}${val > 0 ? '+' : ''}${val}`)
        }
      }
      this.setData({ effectSummary: parts.slice(0, 3).join(' ') })
    }
  },

  methods: {
    onTap() {
      if (!this.properties.available) return
      this.triggerEvent('select', { decisionId: this.properties.decision.id })
    },

    onLongPress() {
      // 长按切换展开详情
      this.setData({ expanded: !this.properties.expanded })
      this.triggerEvent('expand', {
        decisionId: this.properties.decision.id,
        expanded: !this.properties.expanded
      })
    }
  }
})
