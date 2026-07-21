/**
 * 学术 Roguelike —— 通用卡牌组件
 *
 * 支持两种卡牌类型:
 *   cardType='research'  - 研究方法卡 (手牌)
 *   cardType='skill'     - 学术技能卡 (技能槽)
 *   cardType='consumable'- 机遇卡 (商店)
 *
 * 属性:
 *   card       - 卡牌数据对象
 *   cardType   - 卡牌类型
 *   selected   - 是否选中 (手牌用)
 *   disabled   - 是否禁用
 *   showDetail - 是否显示详情
 *   compact    - 紧凑模式 (手牌区用)
 */

Component({
  properties: {
    card: {
      type: Object,
      value: null
    },
    cardType: {
      type: String,
      value: 'research'  // research | skill | consumable
    },
    selected: {
      type: Boolean,
      value: false
    },
    disabled: {
      type: Boolean,
      value: false
    },
    showDetail: {
      type: Boolean,
      value: true
    },
    compact: {
      type: Boolean,
      value: false
    }
  },

  data: {
    typeColors: {
      experiment: '#e94560',
      writing: '#f0a500',
      analysis: '#00b4d8',
      social: '#9b59b6',
      teaching: '#2ecc71'
    },
    typeNames: {
      experiment: '实验',
      writing: '写作',
      analysis: '分析',
      social: '社交',
      teaching: '教学'
    },
    rarityColors: {
      common: '#aaa',
      uncommon: '#4ecdc4',
      rare: '#f0a500',
      legendary: '#e94560'
    },
    rarityNames: {
      common: '普通',
      uncommon: '罕见',
      rare: '稀有',
      legendary: '传说'
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
