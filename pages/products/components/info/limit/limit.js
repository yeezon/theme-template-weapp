// pages/products/components/Limit/limit.js

const computedBehavior = require('miniprogram-computed')

Component({

  behaviors: [computedBehavior],

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
    marketing: {
      type: Object,
      value() {
        return {}
      }
    },
    sku: {
      type: Object,
      value() {
        return {}
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    isStart: false,
    oEventSkuMap: {},
    tips: ''
  },

  observers: {
    marketing(oVal) {
      this.initMarketing(oVal)
    }
  },

  watch: {
    oNowEventInfo (oVal) {
      this.triggerEvent && this.triggerEvent('discountHandle', oVal.handle || '')
    }
  },

  ready() {
    this.init()
  },

  computed: {
    oNowEventInfo(data) {
      const _oEventSku = data.oEventSkuMap[(data.sku || {}).id] || {}
      const _oNowEventInfo = ((data.marketing || {}).info || {})[_oEventSku.c_id || null] || {}
      // this.triggerEvent && this.triggerEvent('discountHandle', _oNowEventInfo.handle || '')
      // this.triggerEvent('discountHandle', _oNowEventInfo.handle || '')
      return _oNowEventInfo
    },
    nEventPrice(data) {
      const _oEventSku = data.oEventSkuMap[(data.sku || {}).id] || {}

      return (_oEventSku || {}).event_price || null
    },
    isCredit(data) {
      return ((data.marketing || {}).store || {}).credit_enabled || false
    },
    isReward(data) {
      return ((data.marketing || {}).store || {}).reward_point_enabled || false
    },
    tips(data) {
      const _oEventSku = data.oEventSkuMap[(data.sku || {}).id] || {}
      const nPoint = _oEventSku.point || 0
      const nCredit = _oEventSku.credit || 0

      const _isReward = data.isReward && nPoint
      const _isCredit = data.isCredit && nCredit

      let tips = ''

      if (_isReward && _isCredit) {
        tips = `购买得 ${nPoint} 积分及 ${nCredit} 经验值`
      } else if (_isReward) {
        tips = `购买得 ${nPoint} 积分`
      } else if (_isCredit) {
        tips = `购买得 ${nCredit} 经验值`
      }

      console.log(tips)

      return tips
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    init() {
      this.initMarketing()
    },
    initMarketing(oVal = this.data.marketing) {
      const _oEventSkuMap = {}

      for (const oItem of ((oVal || {}).variants || [])) {
        _oEventSkuMap[(oItem || {}).variant_id] = oItem
      }
      this.setData({
        oEventSkuMap: _oEventSkuMap
      })
    },
    fnStart() {
      this.setData({
        isStart: true
      })
      this.triggerEvent('start')
    },
    fnEnd() {
      this.setData({
        isStart: false
      })
      this.triggerEvent('end')
    }
  }
})