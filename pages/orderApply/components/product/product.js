// pages/orderApply/components/product.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: {}
    },
    isSupport: {
      type: Boolean,
      value: false
    },
    isCheck: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    fnCheck() {
      this.triggerEvent('check', {
        id: this.data.item.id
      })
    }
  }
})
