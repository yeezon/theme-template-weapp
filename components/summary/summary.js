// components/summary/summary.js
// const app = getApp()
// const pixelRatio = app.globalData.sysInfo.pixelRatio

Component({
  /**
   * 组件的属性列表
   */
  options: {
    multipleSlots: true
  },
  properties: {
    height: {
      type: Number,
      value: 0
    },
    state: {
      type: String,
      value: 'summary',
      observer(val) {
        this.data.selfState = val
        this.setData({
          buttonImageObj: this.buttonImageObjFunc(),
          detailsObj: this.detailsObjFunc()
        })
      }
    },
    animate: {
      type: Boolean,
      value: true
    },
    showArrow: {
      type: Boolean,
      value: true
    },
    itemLen: {
      type: Number,
      value: 0
    },
    maxHeight: {
      type: Number,
      value: 195
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    selfState: 'summary',
    buttonImageObj: {},
    detailsObj: {}
  },

  ready() {
    if (this.data.itemLen <= 6) {
      this.setData({
        showArrow: false
      })
    }
    // 
    wx.createSelectorQuery().in(this).select('.details').boundingClientRect((res) => {
      console.log('----', res)
      this.data.selfState = this.properties.state
      this.setData({
        buttonImageObj: this.buttonImageObjFunc(),
        detailsObj: this.detailsObjFunc()
      })
    }).exec()



  },

  /**
   * 组件的方法列表
   */
  methods: {
    buttonImageObjFunc() {
      let style = {}
      if (this.data.selfState === 'summary') {
        style.transform = 'rotate(90deg)'
      } else {
        style.transform = 'rotate(270deg)'
      }
      if (this.data.animate) {
        style.transition = `all .4s`
      }
      return style
    },
    detailsObjFunc() {
      let style = {}
      style.transition = `height .4s`
      if (this.data.selfState === 'summary') {
        // style.height = this.data.detailHeight / 2
        style.maxHeight = this.data.maxHeight
      } else {
        // style.height = this.data.detailHeight
        style.maxHeight = 'none'
      }
      return style
    },
    touchStartHandler() {
      if (this.data.selfState === 'summary') {
        this.setData({
          selfState: 'details'
        })
      } else {
        this.setData({
          selfState: 'summary'
        })
      }
      this.setData({
        buttonImageObj: this.buttonImageObjFunc(),
        detailsObj: this.detailsObjFunc()
      })
    },
    touchMoveHandler() {

    },
    touchEndHandler() {

    }
  }
})
