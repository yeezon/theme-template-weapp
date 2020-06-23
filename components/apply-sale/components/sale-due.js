// components/apply-sale/components/sale-due.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShowDue: {
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
    FnCloseDue() {
      this.triggerEvent('close')
    }
  }
})
