// components/product-set/product-set.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    productSet: {
      type: Object,
      value: {}
    },
    ids: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    products: []
  },

  ready() {
    this.getProducts()
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getProducts() {
      console.log(this.data.ids)
      const idsArr = this.data.ids
      global.yhsd.sdk.product.get({ ids: idsArr.join(',')}, ({res}) => {
        console.log(res)
        if(res.code === 200) {
          this.setData({
            products: res.products
          })
        }
      })
    },
    toPage() {
      wx.navigateTo({
        url: `../collection/collection?id=${this.data.productSet.id}`
      })
    }
  }
})
