/**
 * 决策卡片组件
 * 展示单个决策选项的详细信息，含可用状态和预览效果
 */
Component({
  properties: {
    // 决策数据
    decision: { type: Object, value: {} },
    // 是否可用
    available: { type: Boolean, value: true },
    // 不可用原因
    unavailableReason: { type: String, value: '' },
    // 是否展开详情
    expanded: { type: Boolean, value: false }
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
