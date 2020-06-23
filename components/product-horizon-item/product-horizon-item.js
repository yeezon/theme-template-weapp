// components/product-horizon-item/product-horizon-item.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    product: {
      type: Object,
      value: {}
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
    onTap: function(e) {
      const id = e.currentTarget.id
      wx.navigateTo({
        url: `../products/products?handle=${id}`
      })
    }
  }
})