// pages/products/components/info/presell/components/bar/bar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    info: {
      type: Object,
      value: {}
    },
    price: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    oInfo: {},
    isStarted: false
  },

  observers: {
    info(oVal) {
      console.log('info', oVal)
      this.setData({
        oInfo: oVal
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    fnStart() {
      this.setData({
        isStarted: true
      })
      this.triggerEvent('start')
    },
    fnEnd() {
      this.setData({
        isStarted: false
      })
      this.triggerEvent('end')
    }
  }
})
