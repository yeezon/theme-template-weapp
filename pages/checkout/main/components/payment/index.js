
Component({
  properties: {
    hasAddress: {
      type: Boolean,
      value: false
    },
    paymentMethod: {
      type: Object,
      value () {
        return {}
      }
    },
    paymentData: {
      type: Object,
      value () {
        return {
          payment_method_id: null,
          payment_method_type: ''
        }
      }
    }
  },
  data: {
    payMethodId: null,
    payMethodType: '',
    onlineDefId: null,
    offlineDefId: null
  },
  observers: {
    paymentMethod () {
      this.initType()
    }
  },
  lifetimes: {
    attached () {
      const oPaymentData = this.properties.paymentData || {}

      this.setData({
        payMethodId: oPaymentData.payment_method_id || null,
        payMethodType: oPaymentData.payment_method_type || ''
      })
    }
  },
  methods: {
    hasOffline () {
      const oPaymentMethod = this.properties.paymentMethod || {}
      const oMethods = (oPaymentMethod.offline || {}).methods || {}

      return !!(oMethods.cod || []).length
    },
    hasOnline () {
      const oPaymentMethod = this.properties.paymentMethod || {}
      const oMethods = (oPaymentMethod.online || {}).methods || {}
      const banks = oMethods.bank || []
      const thirdpartys = oMethods.thirdparty || []

      return !!(banks.length || thirdpartys.length)
    },
    hasUnavailOffline () {
      const oPaymentMethod = this.properties.paymentMethod || {}

      return !(oPaymentMethod.offline || {}).avail
    },
    hasUnavailOnline () {
      const oPaymentMethod = this.properties.paymentMethod || {}

      return !(oPaymentMethod.online || {}).avail
    },
    initType () {
      // 初始化 ID
      this.initId(() => {
        // 初始化类型
        if (!this.properties.paymentData.payment_method_type) {
          // 初始化 payment_method_type
          if (this.hasOnline() && !this.hasUnavailOnline()) {
            this.setPayMethodType('online')
          } else if (this.hasOffline() && !this.hasUnavailOffline()) {
            this.setPayMethodType('offline')
          }
        }
      })
    },
    initId (cb) {
      const payMethods = this.properties.paymentMethod || {}
      let _onlineDefId = null
      let _offlineDefId = null

      if (Object.keys(payMethods).length) {
        // 初始化在线支付 ID
        if (this.hasOnline() && !this.data.onlineDefId) {
          const _methods = payMethods.online.methods
          if (_methods.thirdparty.length) {
            _onlineDefId = _methods.thirdparty[0].id || null
          } else if (_methods.bank.length) {
            _onlineDefId = _methods.bank[0].id || null
          }
        } else {
          _onlineDefId = this.data.onlineDefId || null
        }

        // 初始化货到付款 ID
        if (this.hasOffline() && !this.data.offlineDefId) {
          const _methods = payMethods.offline.methods
          if (_methods.cod.length) {
            _offlineDefId = _methods.cod[0].id || null
          }
        } else {
          _offlineDefId = this.data.offlineDefId || null
        }
      }

      this.setData({
        onlineDefId: _onlineDefId,
        offlineDefId: _offlineDefId
      }, () => {
        cb && cb()
      })
    },
    // 只能主动，watch payMethodType 只能 change 模式 不能 input 模式
    setPayMethodType (evt) {
      const val = ((typeof evt === 'string') ? evt : evt.detail.value) || ''
      let _payMethodId = null

      if (val === 'online') {
        _payMethodId = this.data.onlineDefId || null
      } else if (val === 'offline') {
        _payMethodId = this.data.offlineDefId || null
      }

      this.setData({
        payMethodType: val,
        payMethodId: _payMethodId
      })

      this.fnChange(val, _payMethodId)
    },
    fnChange (payMethodType, payMethodId) {
      this.triggerEvent('change', {
        payment_method_type: payMethodType,
        payment_method_id: payMethodId
      })
    }
  }
})
