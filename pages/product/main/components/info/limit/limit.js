
Component({
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
  data: {
    isStart: false,
    oEventSkuMap: {},
    oNowEventInfo: {}
  },
  observers: {
    marketing (oVal) {
      this.initMarketing(oVal)
    },
    sku () {
      this.setNowEventInfo()
    },
    oEventSkuMap () {
      this.setNowEventInfo()
    },
    oNowEventInfo (oVal) {
      this.triggerEvent && this.triggerEvent('discountHandle', oVal.handle || '')
    }
  },
  lifetimes: {
    ready() {
      this.init()
    }
  },
  methods: {
    init() {
      this.initMarketing()
    },
    initMarketing(oVal) {
      oVal = oVal || this.properties.marketing

      const _oEventSkuMap = {}

      for (const oItem of ((oVal || {}).variants || [])) {
        _oEventSkuMap[(oItem || {}).variant_id] = oItem
      }

      this.setData({
        oEventSkuMap: _oEventSkuMap
      })
    },
    setNowEventInfo () {
      const oEventSkuMap = this.data.oEventSkuMap || {}
      const sku = this.properties.sku || {}
      const marketing = this.properties.marketing || {}

      const oEventSku = oEventSkuMap[sku.id || null] || {}
      const oNowEventInfo = (marketing.info || {})[oEventSku.c_id || null] || {}

      this.setData({
        oNowEventInfo
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