/**
 * 游戏日志组件
 * 滚动显示游戏消息历史，最新消息自动滚到底部
 */
Component({
  properties: {
    // 日志数组 [{type, text, day, time}]
    logs: { type: Array, value: [] },
    // 最大显示高度（rpx）
    maxHeight: { type: Number, value: 300 }
  },

  data: {
    scrollTop: 0
  },

  observers: {
    'logs'(newLogs) {
      // 有新日志时自动滚到底部
      if (newLogs && newLogs.length > 0) {
        // 使用一个很大的值确保滚到底部
        setTimeout(() => {
          this.setData({ scrollTop: 99999 })
        }, 100)
      }
    }
  },

  methods: {}
})
