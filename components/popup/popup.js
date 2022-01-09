// components/popup/popup.js
const app = (global.getApp && global.getApp()) || {}

Component({
  externalClasses: ['custom-class', 'content-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      observer(val) {
        let eventName = val ? 'show' : 'hide'
        this.triggerEvent(eventName)
      }
    },
    hideOnBlur: {
      type: Boolean,
      value: true
    },
    position: {
      type: String,
      value: 'bottom'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    handleTouchMove: function (e) {
    },
    handleMaskTap: function (e) {
      if (this.data.hideOnBlur) {
        this.setData({
          show: false
        })
      }
      this.triggerEvent('maskTap')
    }
  }
})
