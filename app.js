/**
 * 学术生存指南 —— 微信小程序入口文件
 * 扮演一名博士生，在导师Push、论文Deadline、实验失败等
 * 多重压力下"生存"并最终毕业。
 */

App({
  onLaunch() {
    // 获取系统信息，用于后续适配
    const systemInfo = wx.getSystemInfoSync()
    this.globalData.systemInfo = systemInfo
    this.globalData.statusBarHeight = systemInfo.statusBarHeight

    // 检查是否有存档
    try {
      const saves = wx.getStorageSync('academic_survival_saves')
      if (saves && saves.length > 0) {
        const latest = saves.filter(Boolean).sort((a, b) => b.timestamp - a.timestamp)[0]
        if (latest) {
          this.globalData.hasSave = true
          this.globalData.latestSaveLabel = latest.label
        }
      }
    } catch (e) {
      console.warn('读取存档失败:', e)
    }
  },

  globalData: {
    systemInfo: null,
    statusBarHeight: 20,
    hasSave: false,
    latestSaveLabel: '',
    // 当前游戏实例引用
    gameEngine: null
  }
})
