
const computedBehavior = require('miniprogram-computed')

Component({

  behaviors: [computedBehavior],

  // 属性定义（详情参见下文）
  properties: {
    hasAddress: {
      type: Boolean,
      value: false
    },
    paymentMethods: {
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

  computed: { // methods 需要复制这些方法，Computed 仅仅用在模板上，因结果会缓存，在 JS 里不是实时数据
    hasOnline (data) {
      const _paymentMethods = data.paymentMethods || {}
      const _online = _paymentMethods.online || {}

      if (Object.keys(_paymentMethods).length && (((_online.methods || {}).bank || []).length || ((_online.methods || {}).thirdparty || []).length)) {
        return true
      } else {
        return false
      }
    },
    hasOffline (data) {
      const _paymentMethods = data.paymentMethods || {}
      const _offline = _paymentMethods.offline || {}

      if (Object.keys(_paymentMethods).length && ((_offline.methods || {}).cod || []).length) {
        return true
      } else {
        return false
      }
    },
    hasUnavailOnline (data) {
      const _paymentMethods = data.paymentMethods || {}
      const _online = _paymentMethods.online || {}

      return !_online.avail
    },
    hasUnavailOffline (data) {
      const _paymentMethods = data.paymentMethods || {}
      const _offline = _paymentMethods.offline || {}

      return !_offline.avail
    }
  },

  observers: {
    paymentMethods () {
      this.initType()
    }
  },

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      this.setData({
        payMethodId: this.properties.paymentData.payment_method_id || null,
        payMethodType: this.properties.paymentData.payment_method_type || ''
      })
    },
    ready: function () {},
    moved: function () {},
    detached: function () {},
  },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {},
    hide: function () {},
    resize: function () {},
  },

  methods: {
    hasOnline () {
      const _paymentMethods = this.properties.paymentMethods || {}
      const _online = _paymentMethods.online || {}

      if (Object.keys(_paymentMethods).length && (((_online.methods || {}).bank || []).length || ((_online.methods || {}).thirdparty || []).length)) {
        return true
      } else {
        return false
      }
    },
    hasOffline () {
      const _paymentMethods = this.properties.paymentMethods || {}
      const _offline = _paymentMethods.offline || {}

      if (Object.keys(_paymentMethods).length && ((_offline.methods || {}).cod || []).length) {
        return true
      } else {
        return false
      }
    },
    hasUnavailOnline () {
      const _paymentMethods = this.properties.paymentMethods || {}
      const _online = _paymentMethods.online || {}

      return !_online.avail
    },
    hasUnavailOffline () {
      const _paymentMethods = this.properties.paymentMethods || {}
      const _offline = _paymentMethods.offline || {}

      return !_offline.avail
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
      const payMethods = this.properties.paymentMethods || {}
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