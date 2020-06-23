// components/cart-item/cart-item.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isCheck: {
      type: Boolean,
      value: false
    },
    discount: {
      type: Object,
      value: {}
    },
    item: {
      type: Object,
      value: {},
      observer: function(n, o) {
        this.init()
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    oItem: {},
    hasCheck: false,
  },

  ready() {
    // this.init()
  },

  /**
   * 组件的方法列表
   */
  methods: {
    init(){
      this.setData({
        oItem: this.data.item,
        hasCheck: this.data.item.is_check
      })
    },
    fnCheck(hasCheck) {
      this.setData({
        hasCheck: !this.data.hasCheck
      })
      this.triggerEvent('check', {
        variant_id: this.data.item.variant_id,
        is_check: this.data.hasCheck
      })
      // this.$emit('check', {
      //   variant_id: this.item.variant_id,
      //   is_check: this.hasCheck
      // })
    },
    fnNumChange(val) {
      this.triggerEvent('quantity', {
        variant_id: this.data.item.variant_id,
        quantity: val.detail
      })
    },
    fnDel() {
      this.triggerEvent('del', this.data.item.variant_id)
    },
  }
})
