// components/apply-sale/apply-sale.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    order: {
      type: Object,
      value: {}
    },
    isVirtual: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isDue: false,
    isShowDue: false,
    isShowApply: false
  },

  attached() {
    this.setData({
      isDue: this.data.order.service_expired
    })
  },


  /**
   * 组件的方法列表
   */
  methods: {
    FnChangeDue() {
      this.setData({
        isShowDue: false
      })
    },
    FnApply() {
      if (this.data.isDue) {
        this.setData({
          isShowDue: true
        })
      } else {
        this.setData({
          isShowApply: true
        })
      }
      
    },
    FnChangeApply() {
      this.setData({
        isShowApply: false
      })
    }
  }
})
