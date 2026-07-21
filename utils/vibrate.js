/**
 * 学术生存指南 —— 震动反馈工具
 * 封装微信小程序的震动 API，增强游戏交互感
 */

/**
 * 短震动（按钮点击反馈）
 * 约 15ms
 */
function shortVibrate() {
  try {
    wx.vibrateShort({
      type: 'light',
      success: () => {},
      fail: () => {}  // 静默失败（部分机型不支持）
    })
  } catch (e) {
    // 忽略异常
  }
}

/**
 * 中等震动（重要操作反馈）
 * 约 30ms
 */
function mediumVibrate() {
  try {
    wx.vibrateShort({
      type: 'medium',
      success: () => {},
      fail: () => {}
    })
  } catch (e) {}
}

/**
 * 长震动（事件触发/游戏结束）
 * 约 400ms
 */
function longVibrate() {
  try {
    wx.vibrateLong({
      success: () => {},
      fail: () => {}
    })
  } catch (e) {}
}

/**
 * 双震动（重大事件：毕业、退学等）
 * 两次短震间隔 100ms
 */
function doubleVibrate() {
  shortVibrate()
  setTimeout(() => {
    shortVibrate()
  }, 120)
}

module.exports = {
  shortVibrate,
  mediumVibrate,
  longVibrate,
  doubleVibrate
}
