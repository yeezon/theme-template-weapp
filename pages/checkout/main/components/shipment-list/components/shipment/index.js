
Component({

  behaviors: [],

  // 属性定义（详情参见下文）
  properties: {
    shipment: { // 属性名
      type: Object,
      value () {
        return {}
      }
    },
    order: { // 属性名
      type: Number,
      value: null
    }
  },
  
  data: {
    on: false,
    nSetMethodID: null,
    oMethodsMap: {}
  },

  observers: {
    shipment () {
      this.initMethods()
    }
  },

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () { },
    moved: function () { },
    detached: function () { },
  },

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () { }, // 此处attached的声明会被lifetimes字段中的声明覆盖
  ready: function() { },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () { },
    hide: function () { },
    resize: function () { },
  },

  methods: {
    initMethods () {
      // 选择默认配送方式
      if ((this.data.shipment.shipment_methods || []).length) {
        const shipMethods = this.data.shipment.shipment_methods || []
        const _shipmentMethodsDesc = []
        const _shipmentMethodsDescMapID = []
        let nDefMethodID = null

        for (let oShipMethod of shipMethods) {
          // 选择设置的默认配送方式（先进先出原则）
          if (!nDefMethodID && this.fnIsDefMethod(oShipMethod)) {
            nDefMethodID = oShipMethod.id
          }

          this.setData({
            [`oMethodsMap[${oShipMethod.id}]`]: oShipMethod
          })
        }

        // 无指定默认配送方式，默认选第一个
        if (!nDefMethodID) {
          nDefMethodID = shipMethods[0].id
        }

        this.setData({
          nSetMethodID: nDefMethodID,
          shipmentMethodsDesc: _shipmentMethodsDesc,
          shipmentMethodsDescMapID: _shipmentMethodsDescMapID
        })
      }

      // 下个周期才 Change
      this.setData({}, () => {
        this.fnChange()
      })
    },
    fnIsDefMethod (oShipMethod) {
      // 自定义默认配送方式
      // return (oShipMethod.ship_type === 1)  // 顺丰
      return false // 全返回 false，默认选择第一个
    },
    fnOpen () {
      this.setData({
        on: true
      })
    },
    fnClose () {
      this.setData({
        on: false
      })
    },
    fnClick (evt) {
      setTimeout(() => {
        this.fnClose()
      }, 20)
    },
    setMethod (evt) {
      const nID = parseInt(evt.detail.value) || null

      this.setData({
        nSetMethodID: nID
      }, () => {
        this.fnChange()
        this.fnClick()
      })
    },
    getTypeDesc (shipType) {
      let _cont
      switch (shipType) {
        case 0 :
          _cont = '普通快递'
          break
        case 1 :
          _cont = '顺丰速运'
          break
        case 2 :
          _cont = 'EMS'
          break
        case 3 :
          _cont = '平邮/挂号信'
          break
        case 4 :
          _cont = '商家配送'
          break
        case 5 :
          _cont = '自提'
          break
        default:
          _cont = ''
      }
      return _cont
    },
    getShipType () {
      const _oShipMethod = this.data.oMethodsMap[this.data.nSetMethodID] || {}
      return this.getTypeDesc(_oShipMethod.ship_type)
    },
    getAmount () {
      const _oShipMethod = this.data.oMethodsMap[this.data.nSetMethodID] || {}
      return _oShipMethod.amount
    },
    getDiscount () {
      const _oShipMethod = this.data.oMethodsMap[this.data.nSetMethodID] || {}
      return (_oShipMethod.discount || {}).name || ''
    },
    fnChange () {
      const oData = {
        id: this.data.shipment.id || null,
        shipment_method_id: this.data.nSetMethodID,
        amount: this.getAmount()
      }

      this.triggerEvent('change', oData)
    }
  }
})