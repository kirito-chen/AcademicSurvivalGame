/**
 * 像素风按钮组件
 * 提供统一的像素风格按钮，支持不同尺寸和颜色
 */
Component({
  properties: {
    // 按钮文本
    text: { type: String, value: '' },
    // 按钮尺寸：'normal' | 'small' | 'large'
    size: { type: String, value: 'normal' },
    // 颜色主题：'primary' | 'danger' | 'success' | 'warning'
    theme: { type: String, value: 'primary' },
    // 是否禁用
    disabled: { type: Boolean, value: false },
    // 是否显示为块级（100%宽度）
    block: { type: Boolean, value: false },
    // 额外的类名
    customClass: { type: String, value: '' }
  },

  methods: {
    onTap() {
      if (this.properties.disabled) return

      // 触发震动反馈
      try {
        wx.vibrateShort({ type: 'light' })
      } catch (e) {}

      // 向父组件冒泡事件
      this.triggerEvent('tap')
    }
  }
})
