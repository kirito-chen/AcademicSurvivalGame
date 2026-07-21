/**
 * 学术 Roguelike —— 存档管理页
 */

const SaveManager = require('../../core/SaveManager')
const { SAVE_SLOTS } = require('../../config/constants')

Page({
  data: {
    slots: [],
    currentSlot: -1,
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

  _refreshList() {
    const saves = this.saveManager.listSaves()
    this.setData({ slots: saves })
  },

  onSlotTap(e) {
    const slotId = e.currentTarget.dataset.slotId
    const slot = this.data.slots[slotId]

    if (slot) {
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
      this._saveToSlot(slotId)
    }
  },

  _loadSlot(slotId) {
    wx.showModal({
      title: '读取存档',
      content: '确定要读取此存档吗？当前 Run 进度将丢失。',
      success: (res) => {
        if (!res.confirm) return

        const app = getApp()
        const engine = app.globalData.gameEngine
        if (engine && engine.loadRun) {
          const loaded = engine.loadRun(slotId)
          if (loaded) {
            app.globalData.gameEngine = engine
            wx.redirectTo({ url: '/pages/game/game' })
          } else {
            wx.showToast({ title: '存档损坏，无法读取', icon: 'error' })
          }
        } else {
          wx.showToast({ title: '没有游戏引擎实例', icon: 'error' })
        }
      }
    })
  },

  _saveToSlot(slotId) {
    const app = getApp()
    const engine = app.globalData.gameEngine

    if (!engine || !engine.saveRun) {
      wx.showToast({ title: '没有正在进行的 Run', icon: 'error' })
      return
    }

    const success = engine.saveRun(slotId)
    if (success) {
      wx.showToast({ title: `已保存到槽位 ${slotId + 1}`, icon: 'success' })
      this._refreshList()
    } else {
      wx.showToast({ title: '保存失败', icon: 'error' })
    }
  },

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

  onBack() {
    wx.navigateBack()
  }
})
