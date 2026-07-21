/**
 * 资源进度条组件
 * 显示单个资源（精力、论文进度等）的当前值和进度条
 */
Component({
  properties: {
    // 资源名称
    label: { type: String, value: '' },
    // 资源图标
    icon: { type: String, value: '' },
    // 当前值
    value: { type: Number, value: 0 },
    // 最大值
    max: { type: Number, value: 100 },
    // 进度条颜色（CSS 变量名）
    barColor: { type: String, value: '#00d4ff' },
    // 是否显示百分比
    showPercent: { type: Boolean, value: true },
    // 是否显示数值
    showNumber: { type: Boolean, value: true },
    // 尺寸：'normal' | 'small'
    size: { type: String, value: 'normal' },
    // 最近变化量（正数为绿色，负数为红色）
    recentDelta: { type: Number, value: 0 }
  },

  computed: {},

  data: {
    percent: 0,
    statusClass: ''
  },

  observers: {
    'value, max'(value, max) {
      const percent = max > 0 ? Math.round((value / max) * 100) : 0
      let statusClass = ''
      if (percent <= 20) statusClass = 'danger'
      else if (percent <= 40) statusClass = 'warning'
      else if (percent >= 80) statusClass = 'good'

      this.setData({ percent, statusClass })
    }
  },

  methods: {}
})
