// pages/products/components/info/info.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    proDetails: {
      type: Object,
      value() {
        return {}
      }
    },
    oNowSku: {
      type: Object,
      value() {
        return {}
      }
    },
    oMarketing: {
      type: Object,
      value() {
        return {}
      }
    },
    discounts: {
      type: Array,
      value() {
        return []
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    sku: null,
    oEventSkuMap: {},
    nDiscountType: null,
    isDiscountStarted: false
  },

  observers: {
    oNowSku(oVal) {
      if (oVal && this.data.sku && oVal.id !== this.data.sku.id){
        this.setData({
          isDiscountStarted: false
        })
      }

      this.marketing(oVal, this.data.oMarketing)
      this.setData({
        sku: oVal
      })
    },
    oMarketing(oVal) {
      this.marketing(this.data.oNowSku, oVal)

    }
  },

  attached() {
    this.setData({
      isDiscountStarted: false
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    discountType(oNowSku, oEventSkuMap) {
      const nDiscountType = ((oEventSkuMap || {})[(oNowSku || {}).id] || {}).c_id || null
      this.setData({
        nDiscountType: nDiscountType
      })
      this.triggerEvent('setDiscountType', nDiscountType)
    },
    marketing(oNowSku, oMarketing) {
      const _oEventSkuMap = {}
      let nNowSkuID = oNowSku ? parseInt(oNowSku.id) : null // 路由指定 SKU

      for (const oItem of ((oMarketing || {}).variants || [])) {
        _oEventSkuMap[oItem.variant_id] = oItem

        // 默认选中特价活动 SKU ID
        if (!nNowSkuID && (oItem.c_id === 1 || oItem.c_id === 2 || oItem.c_id === 3 || oItem.c_id === 10)) {
          nNowSkuID = oItem.variant_id || null
        }
      }

      this.setData({
        oEventSkuMap: _oEventSkuMap
      })

      this.discountType(oNowSku, _oEventSkuMap)

    },
    fnDiscountStart() {
      const arr = [1,2,10]
      if (!arr.includes(this.data.nDiscountType)) return
      this.setData({
        isDiscountStarted: true
      })
    },
    fnDiscountEnd() {
      const _this = this
      wx.showModal({
        title: '活动提示',
        content: '活动已结束',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            _this.setData({
              isDiscountStarted: false
            })
            // 重新获取最新活动状态
            _this.triggerEvent('discountEnd')
          }
        }
      })
     
    },
    setDiscountHandle(evt) {
      this.triggerEvent('discountHandle', evt.detail)
    },
  }
})