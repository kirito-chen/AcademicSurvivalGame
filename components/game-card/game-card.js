/**
 * 小丑牌-学术版 —— 通用卡牌组件
 */

Component({
  properties: {
    card: { type: Object, value: null },
    cardType: { type: String, value: 'research' },
    selected: { type: Boolean, value: false },
    disabled: { type: Boolean, value: false },
    showDetail: { type: Boolean, value: true },
    compact: { type: Boolean, value: false }
  },

  data: {
    suitColors: {
      experiment: '#e94560',
      writing: '#f0a500',
      analysis: '#00b4d8',
      social: '#9b59b6'
    },
    suitSymbols: {
      experiment: '♠',
      writing: '♥',
      analysis: '♦',
      social: '♣'
    },
    suitNames: {
      experiment: '实验',
      writing: '写作',
      analysis: '分析',
      social: '社交'
    },
    rarityColors: {
      common: '#aaa',
      uncommon: '#4ecdc4',
      rare: '#f0a500',
      legendary: '#e94560'
    },
    rarityNames: {
      common: '普通', uncommon: '罕见', rare: '稀有', legendary: '传说'
    }
  },

  methods: {
    onTap() {
      if (this.properties.disabled) return
      this.triggerEvent('tap', { card: this.properties.card })
    },
    onLongPress() {
      this.triggerEvent('longpress', { card: this.properties.card })
    }
  }
})
