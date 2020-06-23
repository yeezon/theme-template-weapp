// components/apply-sale/components/apply-due.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShowApply: {
      type: Boolean,
      value: false
    },
    orderNo: {
      type: String,
      value: ''
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
    selectItem: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    FnClose() {
      this.triggerEvent('close')
    },
    FnSelect(e) {
      const type = e.currentTarget.dataset.type
      this.setData({
        selectItem: Number(type)
      })
    },
    FnToLink() {
      if (this.data.selectItem === '') {
        wx.showToast({
          title: '请选择售后类型',
          icon: 'none',
          duration: 1000
        })
        return
      }
      wx.navigateTo({
        url: `/pages/orderApply/orderApply?orderNo=${this.data.orderNo}&type=${this.data.selectItem}`
      })
      this.triggerEvent('close')
    }
  }
})
