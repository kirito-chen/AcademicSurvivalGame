/**
 * 学术生存指南 —— 存档管理器
 * 支持 3 个手动存档槽位 + 自动存档
 */

const { STORAGE_KEY, SAVE_SLOTS } = require('../config/constants')

class SaveManager {

  /**
   * 获取所有存档元信息（不含完整游戏数据）
   * @returns {Array<{slotId: number, label: string, timestamp: number, day: number, phase: string}|null>}
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
          month: slot.gameState ? slot.gameState.month : 0,
          phase: slot.gameState ? slot.gameState.phase : 'unknown'
        }
      })
    } catch (e) {
      console.error('读取存档列表失败:', e)
      return new Array(SAVE_SLOTS).fill(null)
    }
  }

  /**
   * 保存游戏到指定槽位
   * @param {number} slotId - 槽位 0~2
   * @param {object} gameState - 完整游戏状态
   * @returns {boolean} 是否成功
   */
  save(slotId, gameState) {
    try {
      if (slotId < 0 || slotId >= SAVE_SLOTS) {
        console.error('无效的存档槽位:', slotId)
        return false
      }

      const meta = this._loadMeta()

      // 深拷贝游戏状态，避免引用问题
      const stateCopy = JSON.parse(JSON.stringify(gameState))
      // 清除当前事件（存档时不应该保存正在处理的事件）
      stateCopy.currentEvent = null

      const yearNum = Math.ceil(stateCopy.month / 12)
      const label = `博${yearNum}年级 · 第${stateCopy.month}个月 · ${this._getPhaseName(stateCopy.phase)} · 论文${stateCopy.paperProgress}%`

      meta.slots[slotId] = {
        slotId,
        label,
        timestamp: Date.now(),
        gameState: stateCopy,
        version: '1.0.0'
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
   * @param {number} slotId - 槽位 0~2
   * @returns {object|null} 游戏状态，或 null
   */
  load(slotId) {
    try {
      const meta = this._loadMeta()
      const slot = meta.slots[slotId]
      if (!slot || !slot.gameState) return null

      // 存档版本兼容检查（预留）
      if (slot.version && slot.version !== '1.0.0') {
        // 未来可在此做数据迁移
        console.warn('存档版本不匹配:', slot.version)
      }

      return JSON.parse(JSON.stringify(slot.gameState))
    } catch (e) {
      console.error('读档失败:', e)
      return null
    }
  }

  /**
   * 删除指定槽位的存档
   * @param {number} slotId - 槽位 0~2
   * @returns {boolean} 是否成功
   */
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

  /**
   * 自动存档到槽位 0
   * @param {object} gameState - 完整游戏状态
   */
  autoSave(gameState) {
    return this.save(0, gameState)
  }

  /**
   * 获取最近的一次存档（用于"继续游戏"）
   * @returns {object|null} 游戏状态，或 null
   */
  getLatestSave() {
    try {
      const meta = this._loadMeta()
      const validSaves = meta.slots
        .filter(Boolean)
        .sort((a, b) => b.timestamp - a.timestamp)

      if (validSaves.length === 0) return null
      return JSON.parse(JSON.stringify(validSaves[0].gameState))
    } catch (e) {
      console.error('获取最近存档失败:', e)
      return null
    }
  }

  /**
   * 检查是否存在任何存档
   * @returns {boolean}
   */
  hasAnySave() {
    const saves = this.listSaves()
    return saves.some(s => s !== null)
  }

  // ========== 私有方法 ==========

  _loadMeta() {
    try {
      const raw = wx.getStorageSync(STORAGE_KEY)
      if (raw) {
        return JSON.parse(raw)
      }
    } catch (e) {
      console.warn('读取存档元数据失败，使用空数据')
    }
    return { slots: new Array(SAVE_SLOTS).fill(null) }
  }

  _getPhaseName(phase) {
    const names = {
      enrollment: '入学适应',
      coursework: '上课修学分',
      research: '科研攻关',
      writing: '写论文',
      defense: '答辩冲刺',
      graduated: '已毕业',
      expelled: '已退学'
    }
    return names[phase] || phase
  }
}

module.exports = SaveManager
