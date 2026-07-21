/**
 * 学术生存指南 —— 存档管理页
 * 显示3个存档槽位，支持保存、读取、删除
 */

const SaveManager = require('../../core/SaveManager')
const GameEngine = require('../../core/GameEngine')
const { PHASE_NAMES, SAVE_SLOTS } = require('../../config/constants')

Page({
  data: {
    slots: [],       // 3个槽位的元信息
    currentSlot: -1, // 当前操作的槽位
    showActions: false
  },

  saveManager: null,

  onLoad() {
    this.saveManager = new SaveManager()
    this._refreshList()
  },

  onShow() {
    this._refreshList()
  },

  /**
   * 刷新存档列表
   */
  _refreshList() {
    const saves = this.saveManager.listSaves()
    this.setData({ slots: saves })
  },

  /**
   * 点击槽位：显示操作菜单
   */
  onSlotTap(e) {
    const slotId = e.currentTarget.dataset.slotId
    const slot = this.data.slots[slotId]

    if (slot) {
      // 有存档：显示操作选项
      wx.showActionSheet({
        itemList: ['读取此存档', '覆盖保存', '删除存档'],
        success: (res) => {
          switch (res.tapIndex) {
            case 0: this._loadSlot(slotId); break
            case 1: this._saveToSlot(slotId); break
            case 2: this._deleteSlot(slotId); break
          }
        }
      })
    } else {
      // 空槽位：保存
      this._saveToSlot(slotId)
    }
  },

  /**
   * 从槽位加载存档
   */
  _loadSlot(slotId) {
    wx.showModal({
      title: '读取存档',
      content: '确定要读取此存档吗？当前游戏进度将丢失。',
      success: (res) => {
        if (!res.confirm) return

        const savedState = this.saveManager.load(slotId)
        if (!savedState) {
          wx.showToast({ title: '存档损坏，无法读取', icon: 'error' })
          return
        }

        // 启动游戏并加载存档
        const app = getApp()
        const engine = new GameEngine()
        engine.loadGame(savedState)
        app.globalData.gameEngine = engine
        app.globalData.isNewGame = false

        wx.redirectTo({ url: '/pages/game/game' })
      }
    })
  },

  /**
   * 保存到指定槽位
   */
  _saveToSlot(slotId) {
    const app = getApp()
    const engine = app.globalData.gameEngine

    if (!engine || !engine.state) {
      wx.showToast({ title: '没有正在进行的游戏', icon: 'error' })
      return
    }

    const success = this.saveManager.save(slotId, engine.state)
    if (success) {
      wx.showToast({ title: `已保存到槽位 ${slotId + 1}`, icon: 'success' })
      this._refreshList()
    } else {
      wx.showToast({ title: '保存失败', icon: 'error' })
    }
  },

  /**
   * 删除存档
   */
  _deleteSlot(slotId) {
    wx.showModal({
      title: '删除存档',
      content: `确定要删除存档槽位 ${slotId + 1} 吗？此操作不可撤销！`,
      confirmColor: '#e94560',
      success: (res) => {
        if (!res.confirm) return

        const success = this.saveManager.delete(slotId)
        if (success) {
          wx.showToast({ title: '存档已删除', icon: 'success' })
          this._refreshList()
        } else {
          wx.showToast({ title: '删除失败', icon: 'error' })
        }
      }
    })
  },

  /**
   * 返回首页
   */
  onBack() {
    wx.navigateBack()
  }
})
