// components/nav-bar/nav-bar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String
    },
    navigateBack: {
      type: [Boolean, String],
      value: false
    },
    backgroundColor: {
      type: String,
      value: '#fff'
    }
  },

  options: {
    multipleSlots: true
  },

  /**
   * 组件的初始数据
   */
  data: {
    safeAreaTop: wx.getSystemInfoSync()?.safeArea?.top || 0
  },

  ready() {

  },

  /**
   * 组件的方法列表
   */
  methods: { 
    back: function() {
      const pages = getCurrentPages()

      if (pages.length === 1) {
        wx.switchTab({
          url: '../index/index'
        })
      } else {
        wx.navigateBack({
          delta: 1
        })
      }
    }
  }
})