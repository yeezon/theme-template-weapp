// components/skus-popup/skus-popup.js
const app = getApp()

import {
  previewImage
} from '../../utils/previewImage.js'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    showType: {
      type: String,
      value: null
    },
    sku: {
      type: Number,
      value: null
    },
    proDetails: {
      type: Object,
      value: {}
    },
    num: {
      type: Number,
      value: 1
    },
    checkIpx: {
      type: Boolean,
      value: true
    },
    marketing: {
      type: Object,
      value: {}
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    options: [],
    variants: [],
    sold_out: false,
    oNowSku: {},
    isIpx: app.globalData.isIpx,
    oEventSkuMap: {},
    oNowEventSku: {},
    oNowEventInfo: {},
    nNowSkuID: null,
    nPrice: null
  },

  observers: {
    show(val) {
      if (val) {
        this.setData({
          nNowSkuID: this.properties.sku ? parseInt(this.properties.sku) : null
        }, () => {
          this.initSku()
        })
      }
    },
    proDetails(val) {
      if (!val) return

      this.setData({
        nNowSkuID: this.properties.sku ? parseInt(this.properties.sku) : null
      }, () => {
        this.initSku()
      })
    },
    marketing(oVal) {
      const _oEventSkuMap = {}

      let nNowSkuID = this.properties.sku ? parseInt(this.properties.sku) : null

      for (const oItem of ((oVal || {}).variants || [])) {
        _oEventSkuMap[oItem.variant_id] = oItem

        // 默认选中特价活动 SKU ID
        if (!nNowSkuID && (oItem.c_id === 1 || oItem.c_id === 2 || oItem.c_id === 3 || oItem.c_id === 10)) {
          nNowSkuID = oItem.variant_id || null
        }
      }

      this.setData({
        oEventSkuMap: _oEventSkuMap,
        nNowSkuID: nNowSkuID
      }, () => {
        this.setEventSku()

        this.initSku()
      })
    }
  },

  attached: function() {
    // this.initSku()
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 初始化 SKU 所需数据结构
    initSku() {
      const oPro = this.properties.proDetails || {}
      const options = oPro.options || []
      const variants = oPro.variants || []

      // 单 SKU 默认选中
      if (variants.length === 1) {
        // 模拟 evt
        this.skuChange({
          detail: {
            ...variants[0]
          }
        })

        this.triggerEvent('autoSelect', this.data.oNowSku)
      }

      this.setData({
        variants: variants,
        options: options
      }, () => {
        // 默认选中活动SKU
        if (this.data.nNowSkuID) {
          let _sku = {}
          variants.forEach((sku) => {
            if (sku.id === this.data.nNowSkuID) {
              _sku = sku
            }
          })

          this.skuChange({
            detail: {
              ..._sku
            }
          })

          this.triggerEvent('autoSelect', this.data.oNowSku)
        } else {
          this.setData({
            oNowSku: {}
          })
        }
      })
    },

    skuChange: function(evt) {
      const _oNowSku = evt.detail || {}
      let isSoldOut = false

      if (_oNowSku.stock === 0) {
        isSoldOut = true
      }

      // SKU 切换需要重置数量
      this.setData({
        num: isSoldOut ? 0 : (this.data.num || 1),
        oNowSku: _oNowSku,
        sold_out: isSoldOut
      })

      this.setEventSku()
      this.setPrice()
    },

    setEventSku() {
      this.setData({
        oNowEventSku: this.data.oNowSku ? this.data.oEventSkuMap[this.data.oNowSku.id] || null : null
      })
    },

    fnCloseSku: function() {
      this.triggerEvent('close')
    },

    previewImage: function(e) {
      previewImage(e.currentTarget.dataset)
    },

    numChange: function(e) {
      this.setData({
        num: e.detail
      })
    },

    setPrice () {
      const _oNowEventSku = this.data.oNowEventSku || {}
      let _nPrice = this.data.oNowSku.price

      if (!/^(4|5|13)$/.test(_oNowEventSku.c_id)) {
        const _oNowEventInfo = this.getNowEventInfo() || {}
        const nNowTime = (new Date()).getTime()
        const nStartAt = (new Date(_oNowEventInfo.start_at)).getTime()
        const nEndAt = (new Date(_oNowEventInfo.end_at)).getTime() || null

        if ((nNowTime >= nStartAt) && ((nNowTime <= nEndAt) || (nEndAt === null))) {
          _nPrice = _oNowEventSku.event_price
        }
      }

      this.setData({
        nPrice: _nPrice
      })
    },

    getNowEventInfo () {
      const _oNowEventSku = this.data.oNowEventSku || {}
      const _oNowEventInfo = ((this.properties.marketing || {}).info || {})[_oNowEventSku.c_id || null] || {}

      return _oNowEventInfo
    },

    // 
    confirm: function() {
      const sku = this.data.oNowSku || {}

      if (sku.id) {
        sku['num'] = this.data.num || null
        this.triggerEvent('confirm', sku)
        this.fnCloseSku()
      } else {
        wx.showToast({
          title: '请完整选择商规格',
          icon: 'none'
        })
      }
    }
  }
})