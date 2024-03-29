// components/scroll-view/scroll-view.js
const app = (global.getApp && global.getApp()) || {}

Component({
  /**
   * 组件的属性列表
   */
  /**
   * cutHeight: 需要减少的高度
   * marginTop: 增加距离顶部高度
   */
  properties: {
    cutHeight: {
      type: [String, Number],
      value: 0
    },
    marginTop: {
      type: [String, Number],
      value: 0
    },
    scrollTop: {
      type: [String, Number],
      value: 0
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
    bindscrolltolower: function () {
      this.triggerEvent('scrolltolower')
    },
    onScroll: function (e) {
      this.triggerEvent('scroll', e.detail)
    },
    bindtouchmove: function (res) {
      // console.log(res)
    }
  }
})