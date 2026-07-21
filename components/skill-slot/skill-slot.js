/**
 * 学术 Roguelike —— 技能槽位组件
 *
 * 显示已装备的技能卡，空槽位显示为虚线框
 */

Component({
  properties: {
    skill: {
      type: Object,
      value: null  // null 表示空槽位
    },
    index: {
      type: Number,
      value: 0
    },
    maxSlots: {
      type: Number,
      value: 5
    }
  },

  data: {
    rarityColors: {
      common: '#aaa',
      uncommon: '#4ecdc4',
      rare: '#f0a500',
      legendary: '#e94560'
    }
  },

  methods: {
    onTap() {
      if (this.properties.skill) {
        this.triggerEvent('tap', {
          skill: this.properties.skill,
          index: this.properties.index
        })
      }
    }
  }
})
