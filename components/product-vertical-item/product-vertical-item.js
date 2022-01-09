// components/product-vertical-item/product-vertical-item.js
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
    nEventPrice: null,
    priceTag: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTap: function(e) {
      const id = e.currentTarget.id
      wx.navigateTo({
        url: `../product/index?handle=${id}`
      })
    },
    getDiscount: function () {
      if (!this.data.product.handle) return
      global.yhsd.sdk.discount.matchProduct(this.data.product.handle, (oRes) => {
        // console.log(oRes)
        oRes = oRes.res || {}

        if (oRes.code === 200) {
          var nDisType = null
          var nEventPrice = null

          var _eventSkus = (oRes.marketing || {}).variants || []
          var _discounts = oRes.discounts || []

          for (var i = 0; i < _eventSkus.length; ++i) {
            var oEventSku = _eventSkus[i] || {}
            // 1 秒杀，2 限时，3 拼团，10 预售
            nDisType = oEventSku.c_id
            if (/^(1|2|3|10)$/ig.test(nDisType)) {
              nEventPrice = oEventSku.event_price || null
              break
            }
          }

          var priceTag = ''
          if (nDisType === 1) {
            priceTag = '秒杀'
          } else if (nDisType === 2) {
            priceTag = '限时'
          } else if (nDisType === 3) {
            priceTag = '拼团'
          } else {
            // 旧活动
            for (var _i = 0; _i < _discounts.length; ++_i) {
              var _oDis = _discounts[_i] || {}

              if (_oDis.discount_type === 'amount_off') {
                priceTag = '满减'
                break
              } else if (_oDis.discount_type === 'percent_off') {
                priceTag = '满折'
                break
              }
            }
          }

          if (priceTag) {
            if (nEventPrice || nEventPrice === 0) {
              this.nEventPrice = nEventPrice
            }
            this.priceTag = priceTag
            this.setData({
              priceTag: priceTag
            })
          }
        }
      })
    }
  }
})