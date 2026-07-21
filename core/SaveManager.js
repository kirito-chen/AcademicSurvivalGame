/**
 * 学术 Roguelike —— 存档管理器
 * 支持 3 个手动存档槽位 + 自动存档
 */

const { STORAGE_KEY, SAVE_SLOTS } = require('../config/constants')

class SaveManager {

  /**
   * 获取所有存档元信息
   */
  listSaves() {
    try {
      const raw = wx.getStorageSync(STORAGE_KEY)
      if (!raw) return new Array(SAVE_SLOTS).fill(null)

      const data = JSON.parse(raw)
      if (!data.slots || !Array.isArray(data.slots)) {
        return new Array(SAVE_SLOTS).fill(null)
      }

      return data.slots.map(slot => {
        if (!slot) return null
        return {
          slotId: slot.slotId,
          label: slot.label || '未知存档',
          timestamp: slot.timestamp,
          roundNumber: slot.roundNumber || 0,
          discipline: slot.discipline || '',
          difficulty: slot.difficulty || 'normal'
        }
      })
    } catch (e) {
      console.error('读取存档列表失败:', e)
      return new Array(SAVE_SLOTS).fill(null)
    }
  }

  /**
   * 保存 Run 到指定槽位
   * @param {number} slotId - 槽位 0~2
   * @param {object} runData - RunManager 的存档数据
   */
  save(slotId, runData) {
    try {
      if (slotId < 0 || slotId >= SAVE_SLOTS) {
        console.error('无效的存档槽位:', slotId)
        return false
      }

      const meta = this._loadMeta()
      const stateCopy = JSON.parse(JSON.stringify(runData))

      // 生成标签
      const round = (stateCopy.currentRoundIndex || 0) + 1
      const discName = stateCopy.discipline || '未知'
      const label = `${discName} · 第${round}关 · ${stateCopy.difficulty || 'normal'}难度`

      meta.slots[slotId] = {
        slotId,
        label,
        timestamp: Date.now(),
        roundNumber: round,
        discipline: stateCopy.discipline || '',
        difficulty: stateCopy.difficulty || 'normal',
        runData: stateCopy,
        version: '2.0.0'
      }

      wx.setStorageSync(STORAGE_KEY, JSON.stringify(meta))
      return true
    } catch (e) {
      console.error('存档失败:', e)
      return false
    }
  }

  /**
   * 从指定槽位加载存档
   */
  load(slotId) {
    try {
      const meta = this._loadMeta()
      const slot = meta.slots[slotId]
      if (!slot || !slot.runData) return null

      return JSON.parse(JSON.stringify(slot.runData))
    } catch (e) {
      console.error('读档失败:', e)
      return null
    }
  }

  delete(slotId) {
    try {
      const meta = this._loadMeta()
      meta.slots[slotId] = null
      wx.setStorageSync(STORAGE_KEY, JSON.stringify(meta))
      return true
    } catch (e) {
      console.error('删除存档失败:', e)
      return false
    }
  }

  autoSave(runData) {
    return this.save(0, runData)
  }

  getLatestSave() {
    try {
      const meta = this._loadMeta()
      const validSaves = meta.slots.filter(Boolean).sort((a, b) => b.timestamp - a.timestamp)
      if (validSaves.length === 0) return null
      return JSON.parse(JSON.stringify(validSaves[0].runData))
    } catch (e) {
      console.error('获取最近存档失败:', e)
      return null
    }
  }

  hasAnySave() {
    const saves = this.listSaves()
    return saves.some(s => s !== null)
  }

  _loadMeta() {
    try {
      const raw = wx.getStorageSync(STORAGE_KEY)
      if (raw) return JSON.parse(raw)
    } catch (e) {
      console.warn('读取存档元数据失败')
    }
    return { slots: new Array(SAVE_SLOTS).fill(null) }
  }
}

module.exports = SaveManager
