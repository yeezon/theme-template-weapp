// components/mask/mask.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      observer(val) {
        if (val) {
          this.setData({
            selfShow: true
          })
        } else {
          if (this.data.hideDelay) {
            setTimeout(() => {
              this.setData({
                selfShow: false
              })
            }, this.data.hideDelay)
          } else {
            this.setData({
              selfShow: false
            })
          }
        }
      }
    },
    top: {
      type: Number | String,
      value: 0
    },
    effect: {
      type: String,
      value: 'scale-in'
    },
    hideDelay: {
      type: Number
    },
    hideOnTap: {
      type: Boolean,
      value: false
    },
    blur: {
      type: String
    },
    opacity: {
      type: Number | String,
      value: 0.5
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    selfShow: false,
    isInTimeout: false
  },

  ready() {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleMaskTap() {
      if (this.data.hideOnTap) {
        this.setData({
          show: false
        })
      }
    },
    handleTouchMove: function (e) {
    }
  }
})
