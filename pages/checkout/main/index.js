
Component({
  data: {
    title: '创建订单',
    err: '',
    isLoading: true,
    isPaying: false,
    isSucceed: false, // 免得登录下单用
    isCreating: false,
    orderNo: '',
    oAccount: {},
    oCart: {},
    addresses: [],
    oAddressData: {}, // 用户选择
    oPaymentMethod: {},
    oPaymentData: {}, // 用户选择
    shipments: [],
    shipmentsData: [], // 用户选择
    oShipmentSkuMap: {},
    remarksData: '', // 用户输入
    oCouponData: {}, // 用户选择
    oDiscount: {},
    oDiscountSkuMap: {},
    nGivePoint: 0, // 可获得积分
    oSum: {
      Calc: global.yhsd.sdk.util.orderCalculator(),
      oRes: {
        item_amount: null, // 商品总金额
        shipment_amount: null, // 运费总金额
        final_amount: null // 实付金额，null 做可否提交状态判断
      },
      fix_amount: null, // 修改后实付金额
      others: { // key 排序相对稳定，内容可以无需 index
        // [key]: {
        //   name: '礼盒',
        //   amount: null  // null 为不显示此项
        // }
      }
    },
    oMetas: {}
  },
  observers: {
    oAddressData (oVal) {
      let _val = null

      if (JSON.stringify(oVal) !== '{}') {
        if (this.isSignin()) {
          _val = oVal.id
        } else {
          _val = oVal.district_code
        }
      }

      this.getPayments(_val, (err, payType) => {
        if (err) {
          wx.showToast({
            title: err,
            icon: 'none'
          })
        }
      })
    },
    oPaymentData (oVal) {
      if (Object.keys(oVal).length) {
        this.getShipments((err, shipments) => {
          if (err) {
            this.goCart(err + '，将自动返回购物车')
          } else {
            this.setGivePoint(shipments) // 设置可获得积分
            this.setProSum(shipments) // 设置商品总价
          }
        })
      } else {
        this.setData({
          shipments: []
        })
      }
    },
    oDiscount () {
      if ((this.data.shipments || []).length) {
        this.initDiscountSkuMap() // 依赖 shipments 数据，有可能这时还没 shipments 数据
      }
    },
    shipments (shipments) {
      this.initShipmentSkuMap(() => {
        this.initDiscountSkuMap() // 依赖 shipments 数据，有可能这时还没 shipments 数据
      })
    }
  },
  lifetimes: {
    attached () {
      this.init()
    },
    ready () {},
    moved () {},
    detached () {},
  },
  pageLifetimes: {
    show() {
      const oSetAddressData = global.$$setAddressData || {}

      if (Object.keys(oSetAddressData).length) {
        this.setAddress(oSetAddressData, () => {
          // 清理
          global.$$setAddressData = {}
        })
      }
    }
  },
  methods: {
    isSignin () {
      return !!this.data.oAccount.id
    },
    hasPay () {
      return this.data.oSum.fix_amount && this.data.oPaymentData.payment_method_type === 'online'
    },
    hasAddress () {
      return !!Object.keys(this.data.oAddressData).length
    },
    init () {
      this.setData({
        isLoading: true
      })

      this.getAccount(err => {
        if (err) {
          this.goSignin(err)
        } else {
          if (this.data.oAccount.id) {
            this.getAddresses(() => {
              this.initAddress(() => {
                // 进入界面，无地址先弹出添加地址
                if (!this.hasAddress()) {
                  wx.navigateTo({
                    url: `/pages/addresses/index?type=select`
                  })
                }
              })

              this.setData({
                isLoading: false
              })
            })

            this.setAccountSum()
          } else {
            if (!this.hasAddress()) {
              wx.navigateTo({
                url: `/pages/addresses/index?type=select`
              })
            }

            this.setData({
              isLoading: false
            })
          }
        }
      })
      this.getDiscount(err => {
        if (!err) {
          this.setDiscountSum()
        }
      })
      this.getCart(err => {
        if (err) {
          this.goCart(err)
        } else {
          this.fnCheckPro(err => {
            if (err) {
              // 在购物车做修正
              this.goCart('商品异常，稍后请重新提交结算')
            }
          })
        }
      })
    },
    goTo (path, isUp = false) {
      if (isUp) {
        wx.navigateTo({
          url: path
        })
        // global.location.href = path
      } else {
        wx.navigateTo({
          url: path
        })
      }
    },
    goSignin (err) {
      if (err) {
        this.$toast.info(err, null, () => {
          this.goTo('/pages/index/index', true)
        })
      } else {
        this.goTo('/pages/index/index', true)
      }
    },
    goCart (err) {
      if (err) {
        wx.showToast({
          title: err,
          icon: 'none',
          duration: 3000
        })

        setTimeout(() => {
          wx.switchTab({
            url: '/pages/cart/index'
          })
        }, 3000);
      } else {
        wx.switchTab({
          url: '/pages/cart/index'
        })
      }
    },
    goOrder () {
      // 使新页面不能返回到当前页面
      wx.redirectTo({
        url: `/pages/order/index?id=${this.data.orderNo || ''}`
      })
    },
    getAccount (cb) {
      global.yhsd.sdk.account.current(data => {
        let err = null

        if (data && data.res) {
          if (data.res.code === 200) {
            this.setData({
              oAccount: data.res.customer || {}
            }, () => {
              cb && cb(err)
            })
          } else {
            err = data.res.message || '用户数据获取出错'
            cb && cb(err)
          }
        } else {
          err = '用户数据请求异常'
          cb && cb(err)
        }
      })
    },
    getCart (cb) {
      global.yhsd.sdk.cart.get(data => {
        let err = null
        if (data && data.res) {
          if (data.res.code === 200) {
            this.data.oCart = data.res.cart || {}
          } else {
            err = data.res.message || '购物车数据获取出错'
          }
        } else {
          err = '购物车数据请求异常'
        }
        cb && cb(err)
      })
    },
    getAddresses (cb) {
      global.yhsd.sdk.address.get(data => {
        let err = null
        if (data && data.res) {
          if (data.res.code === 200) {
            const _addresses = data.res.addresses || []
            const _oData = {
              addresses: _addresses
            }
            if (_addresses.length <= 0) {
              _oData.oAddressData = {}
            }
            this.setData(_oData, () => {
              cb && cb(err)
            })
          } else {
            err = data.res.message || '地址数据获取出错'
            cb && cb(err)
          }
        } else {
          err = '地址数据请求异常'
          cb && cb(err)
        }
      })
    },
    getPayments (val, cb) {
      const param = {}
      if (val) {
        if (this.isSignin()) {
          param.address_id = val
        } else {
          param.district_code = val
        }
      }

      // 免登录下单，不使用离线购物车的数据
      // param.items = [{"variant_id":17,"quantity":1},{"variant_id":992,"quantity":2}]

      global.yhsd.sdk.payment_method.get(param, data => {
        let err = null
        if (data && data.res) {
          if (data.res.code === 200) {
            this.setData({
              oPaymentMethod: data.res.payment_method || {},
              oPaymentData: {} // 每次获取到新数据都必须要重新选择支付方式
            })
          } else {
            err = data.res.message || '支付方式数据获取出错'
          }
        } else {
          err = '支付方式数据请求异常'
        }
        cb && cb(err)
      })
    },
    getShipments (cb) {
      const oAdd = this.data.oAddressData
      const payType = this.data.oPaymentData.payment_method_type
      if (Object.keys(oAdd).length && payType) {
        const param = {
          payment_method_type: payType
        }
        if (this.isSignin()) {
          param.address_id = oAdd.id
        } else {
          param.district_code = oAdd.district_code
        }
        global.yhsd.sdk.cart.withinShipments(param, data => {
          let err = null
          let _shipments = []
          if (data && data.res) {
            if (data.res.code === 200) {
              _shipments = data.res.shipments || []
              if (_shipments.length) {
                this.setData({
                  shipments: _shipments
                })
              } else {
                err = '购物车数据为空'
              }
            } else {
              err = data.res.message || '购物车数据获取出错'
            }
          } else {
            err = '购物车数据请求异常'
          }
          cb && cb(err, _shipments)
        })
      }
    },
    getDiscount (cb) {
      global.yhsd.sdk.discount.matchCart(data => {
        let err = null
        if (data && data.res) {
          if (data.res.code === 200) {
            this.setData({
              oDiscount: data.res || {}
            }, () => {
              cb && cb(err)
            })
          } else {
            err = data.res.message || '优惠数据获取出错'
            cb && cb(err)
          }
        } else {
          err = '优惠数据请求异常'
          cb && cb(err)
        }
      })
    },
    initAddress (cb) {
      const _addresses = this.data.addresses
      let _oAddress = null
      if (_addresses.length > 0) {
        for (let item of _addresses) {
          if (item.is_default) {
            _oAddress = item
            break
          }
        }
        if (!_oAddress) {
          _oAddress = _addresses[0]
        }
      }
      this.setData({
        oAddressData: _oAddress || {}
      }, () => {
        cb && cb()
      })
    },
    initShipmentSkuMap (cb) {
      const _oShipmentSkuMap = {}

      this.initCheckCustoms()

      for (const oShipment of this.data.shipments) {
        for (const oItem of oShipment.carts) {
          _oShipmentSkuMap[oItem.variant_id] = oItem

          this.fnCheckCustoms(oItem.name)
        }
      }

      this.data.oShipmentSkuMap = _oShipmentSkuMap

      cb && cb()
    },
    initDiscountSkuMap () {
      // 依赖 shipments 数据，有可能这时还没 shipments 数据

      const oDis = this.data.oDiscount || {}
      const oMarketing = oDis.marketing || {}
      const _oShipmentSkuMap = this.data.oShipmentSkuMap || {}
      const _oDiscountSkuMap = {}

      for (const oItem of (oMarketing.variants || [])) {
        const _oItem = JSON.parse(JSON.stringify(oItem || {})) // 深拷贝

        // 新数据
        _oItem.quantity = (_oShipmentSkuMap[oItem.variant_id] || {}).quantity || 0
        // 优化修复
        if (_oItem.origin_price === null) {
          _oItem.origin_price = _oItem.event_price
        }

        _oDiscountSkuMap[oItem.variant_id] = _oItem
      }

      this.data.oDiscountSkuMap = _oDiscountSkuMap

      this.fnMarketingToDiscounts(() => {
        this.setDiscountSum()
      })
    },
    initCheckCustoms () {
      global.$$isCheckIDCard = false
    },
    fnCheckCustoms (val) {
      global.$$isCheckIDCard = (global.$$isCheckIDCard || /(直邮|保税)/ig.test(val))
    },
    fnMarketingToDiscounts (cb) {
      // 新活动支持
      const oDis = this.data.oDiscount || {}
      const oMarketing = oDis.marketing || {}
      const _oDiscountSkuMap = this.data.oDiscountSkuMap || {}
      const _oInfos = {}

      for (const _nSkuID in _oDiscountSkuMap) {
        const oItem = _oDiscountSkuMap[_nSkuID] || {}

        // 拼团商品直接购买，当正常商品跳过不处理
        if (oItem.c_id === 3 && !this.grouponNo) {
          continue // 跳过当次循环，循环继续
        }

        if (oItem.available) {
          let _oInfo = _oInfos[oItem.c_id] || {}
          const oMarketingInfo = (oMarketing.info || {})[oItem.c_id] || {}

          // 秒杀 1，限时 2，团购 3
          if (/^[123]$/.test(oItem.c_id)) {
            // 没有内容先创建对象
            if (!_oInfo.id) {
              _oInfo = {
                id: oMarketingInfo.id,
                name: oMarketingInfo.title || '活动',
                discount_amount: 0,
                match_item_amount: 0,
                range_products: [],
                range_variants: []
              }

              _oInfos[oItem.c_id] = _oInfo
            }

            _oInfo.discount_amount += ((oItem.origin_price - oItem.event_price) * oItem.quantity)
            _oInfo.match_item_amount += (oItem.origin_price * oItem.quantity)
            _oInfo.range_products.push(oItem.product_id)
            _oInfo.range_variants.push(oItem.variant_id)

            // 去重
            _oInfo.range_products = [...new Set(_oInfo.range_products)]
            _oInfo.range_variants = [...new Set(_oInfo.range_variants)]
          }
        }
      }

      // 去重
      const _oDiscountMap = {}

      for (const _oInfo of (oDis.discounts || [])) {
        if (_oInfo.id) {
          _oDiscountMap[_oInfo.id] = _oInfo
        }
      }

      for (const _infoKey in _oInfos) {
        const _oInfo = _oInfos[_infoKey] || {}
        if (_oInfo.id) {
          _oDiscountMap[_oInfo.id] = _oInfo
        }
      }

      const _discounts = []
      for (const _infoKey in _oDiscountMap) {
        _discounts.push(_oDiscountMap[_infoKey] || {})
      }

      this.setData({
        'oDiscount.discounts': _discounts
      }, () => {
        cb && cb()
      })
    },
    // 小程序地址选择页使用
    setAddress (data, cb) {
      this.setData({
        oAddressData: data || {}
      }, () => {
        cb && cb()
      })
    },
    // setAddressById (id) {
    //   this.data.oAddressData = {}
    //   if (id || id === 0) {
    //     for (let oAddressData of this.addresses) {
    //       if (oAddressData.id === id) {
    //         this.data.oAddressData = oAddressData
    //         break
    //       }
    //     }
    //   } else if (id === null) {
    //     this.data.oAddressData = this.addresses[0] || {}
    //   }
    // },
    setGivePoint (shipments) {
      let nRes = 0
      const shipList = shipments || []
      if (this.data.oDiscount.reward_point_enabled) {
        for (let oShip of shipList) {
          for (let oItem of (oShip.carts || [])) {
            nRes += oItem.point
          }
        }
      }
      this.setData({
        nGivePoint: nRes || 0
      })
    },
    fnCheckPro (cb) {
      let err = null
      const items = this.data.oCart.items || []
      let nAvailable = 0

      for (let oItem of items) {
        if (!oItem.available && oItem.is_check) {
          err = '存在无效但被勾选的商品'
          break
        }

        if (!oItem.available) {
          nAvailable += 1
        }
      }

      if (!err && (items.length === nAvailable)) {
        err = '购物车无有效商品'
      }

      cb && cb(err)
    },
    fnPayChange (evt) {
      this.setData({
        oPaymentData: evt.detail || {}
      })
    },
    fnShipmentsChange (evt) {
      const _shipmentsData = evt.detail || []
      this.setData({
        shipmentsData: _shipmentsData
      }, () => {
        this.setShipSum()
      })
    },
    fnCouponChange (oCoupon) {
      this.setData({
        oCouponData: oCoupon
      }, () => {
        this.setCouponSum()
      })
    },
    fnPointChange (nPoint) {
      this.setPointSum(parseInt(nPoint) || 0)
    },
    setRemarkData (evt) {
      this.setData({
        remarksData: (evt.detail || '')
      })
    },
    upCalc (oItems) {
      const _oSum = this.data.oSum
      if (_oSum.Calc) {
        _oSum.Calc.update({ ...oItems })
      }
      this.setSum(_oSum)
    },
    setAccountSum () {
      const oUser = this.data.oAccount
      const oLevel = oUser.customer_level
      this.upCalc({
        level_discount: oLevel.discount || 100, // 100%，无打折
        reward_point_total: oUser.point || 0
      })
    },
    setProSum (shipments) {
      let _sum = 0
      for (let oShip of shipments) {
        for (let oPro of oShip.carts) {
          _sum += oPro.line_price
        }
      }
      this.upCalc({
        item_amount: _sum
      })
    },
    setShipSum () {
      let _sum = 0
      for (let oShip of this.data.shipmentsData) {
        _sum += oShip.amount
      }
      this.upCalc({
        shipment_amount: _sum
      })
    },
    setDiscountSum () {
      const oDis = this.data.oDiscount
      if (Object.keys(oDis).length) {
        let _sum = 0
        const oSet = {}
        for (let oItem of oDis.discounts) {
          if (oItem.discount_amount) {
            _sum += oItem.discount_amount
          }
        }
        if (_sum) {
          oSet.discount_amount = _sum
        }
        if (oDis.reward_point_enabled) {
          oSet.reward_point_exchange_ratio = oDis.reward_point_exchange_ratio || 0
          oSet.reward_point_limit = oDis.reward_point_limit || 0
        }
        this.upCalc({ ...oSet })
      }
    },
    setCouponSum () {
      // 满折未支持，需要分类计算
      if (this.data.oCouponData) {
        this.upCalc({
          coupon_discount_amount: this.data.oCouponData.discount_amount || 0
        })
      }
    },
    setPointSum (nPoint) {
      if (nPoint || nPoint === 0) {
        this.upCalc({
          reward_point_use: nPoint
        })
      }
    },
    getOthersSum (oSum) {
      const _oSum = oSum || {}
      let res = 0
      for (let key in _oSum.others) {
        const _amount = _oSum.others[key].amount
        if (_amount || _amount === 0) {
          res += _amount
        }
      }
      return res
    },
    setSumOthers (key, item, cont) {
      const oSumOthers = this.data.oSum.others
      if (!(key in oSumOthers)) {
        // $set 关联新数据
        // this.$set(oSumOthers, key, {})
        oSumOthers[key] = {}
      }
      // oSumOthers[key][item] = cont
      this.data.oSum.others[key][item] = cont

      this.setSum()
    },
    setSum (oSum) {
      const _oSum = oSum || {}
      // console.log(_oSum.Calc.help())  // 查看 Order Calculator Key 及其对应含义

      if (_oSum.Calc) {
        _oSum.Calc.get(res => {
          // console.log(res)
          const _oRes = { ...res }
          this.setData({
            'oSum.oRes': _oRes,
            'oSum.fix_amount': _oRes.final_amount + this.getOthersSum(_oSum) // 实付金额
          })
        })
      }
    },
    fnPreAd (oOrder) {
      let res = true
      const oAddress = this.data.oAddressData
      if (oAddress.id || oAddress.id === 0) {
        oOrder.address_id = oAddress.id
      } else if (oAddress.district_code || oAddress.district_code === 0) {
        // 免登录下单参数
        oOrder.district_code = oAddress.district_code
        oOrder.name = oAddress.name
        oOrder.mobile = oAddress.mobile
        oOrder.detail = oAddress.detail
      } else {
        wx.showToast({
          title: '缺少收货地址，无法提交订单',
          icon: 'none'
        })
        res = false
      }
      return res
    },
    fnPreIDCard (oOrder) {
      let res = true
      const oAddress = this.data.oAddressData || {}

      if (global.$$isCheckIDCard && !oAddress.id_card) {
        res = false
        wx.showToast({
          title: '收货地址缺少身份证，请先补全',
          icon: 'none'
        })
      }

      return res
    },
    fnPrePay (oOrder) {
      let res = true
      const oPay = this.data.oPaymentData
      if (oPay.payment_method_id || oPay.payment_method_id === 0) {
        oOrder.payment_method_id = oPay.payment_method_id
      } else {
        wx.showToast({
          title: '缺少支付方式，无法提交订单',
          icon: 'none'
        })
        res = false
      }
      return res
    },
    fnPreShip (oOrder) {
      let res = true
      const shipData = this.data.shipmentsData
      if (shipData.length) {
        oOrder.shipments = JSON.stringify(shipData) || '[]'
      } else {
        wx.showToast({
          title: '缺少配送方式，无法提交订单',
          icon: 'none'
        })
        res = false
      }
      return res
    },
    fnPreRemark (oOrder) {
      let res = true
      const remark = this.data.remarksData
      if (remark) {
        oOrder.remark = remark
      }
      return res
    },
    fnPreCoupon (oOrder) {
      let res = true
      const oCoupon = this.data.oCouponData
      if (oCoupon.code) {
        oOrder.coupon_code = oCoupon.code
      }
      return res
    },
    fnPrePoint (oOrder) {
      let res = true
      const _oRes = this.data.oSum.oRes
      if (this.data.oDiscount.reward_point_enabled && _oRes.reward_point_use) {
        oOrder.reward_point = _oRes.reward_point_use
      }
      return res
    },
    fnPreMetas (oOrder) {
      let res = true
      const _oMetas = this.data.oMetas
      const oMetasDef = {
        name: 'order_attributes',
        description: '订单信息',
        fields: {}
      }
      if (Object.keys(_oMetas).length) {
        oMetasDef.fields = _oMetas
        try {
          oOrder.meta_fields = JSON.stringify(oMetasDef)
        } catch (err) {
          // console.log(err)
          wx.showToast({
            title: '处理自定义数据出错',
            icon: 'none'
          })
          res = false
        }
      }
      return res
    },
    fnPreList (oOrder) {
      // 收货地址
      if (!this.fnPreAd(oOrder)) return false

      // 身份证
      // if (!this.fnPreIDCard(oOrder)) return false

      // 支付方式
      if (!this.fnPrePay(oOrder)) return false

      // 配送方式
      if (!this.fnPreShip(oOrder)) return false

      // 留言
      if (!this.fnPreRemark(oOrder)) return false

      // 优惠券
      if (!this.fnPreCoupon(oOrder)) return false

      // 积分抵现
      if (!this.fnPrePoint(oOrder)) return false

      // Metas
      if (!this.fnPreMetas(oOrder)) return false

      return true
    },
    fnCreateOrder (oOrder, cb) {
      if (this.data.isCreating) return

      wx.showLoading({
        title: '正在提交订单...'
      })

      this.setData({
        isCreating: true
      }, () => {
        global.yhsd.sdk.order.create(oOrder, data => {
          wx.hideLoading()

          let err = null
          if (data && data.res) {
            if (data.res.code === 200) {
              // 创建正常不解开 isCreating，防止多次下单
              cb && cb(null, data.res)
            } else {
              err = data.res.message || '提交订单出错'
            }
          } else {
            err = '提交订单请求异常'
          }
          if (err) {
            this.setData({
              isCreating: false
            }, () => {
              cb && cb(err)
            })
          }
        })
      })
    },
    fnCreateOrderAfter (err, data) {
      if (err) {
        wx.showToast({
          title: err,
          icon: 'none',
          duration: 3000
        })
      } else {
        this.setData({
          orderNo: data.order_no || ''
        }, () => {
          // 免登陆下单支持
          if (this.isSignin()) {
            if (this.hasPay()) {
              this.goPay()
            } else {
              this.goOrder()
            }
          } else {
            this.setData({
              isSucceed: true
            })
          }
        })
      }
    },
    fnSubmit () {
      // 防止下单成功后多次触发
      if (this.data.orderNo) return

      // 防止数据不是最新
      this.setData({}, () => {
        if (this.data.isLoading) return

        const _oOrder = {}

        if (!this.fnPreList(_oOrder)) return

        // 调试用代码
        // this.$toast.off()
        // console.log(_oOrder)
        // this.orderNo = '111111'
        // // this.isSucceed = true
        // if (this.hasPay()) {
        //   this.isPay = true
        // }
        // End - 调试用代码

        // console.log(_oOrder)

        this.fnCreateOrder(_oOrder, (err, data) => {
          this.fnCreateOrderAfter(err, data)
        })
      })
    },
    goPay () {
      const self = this
      const _orderNo = self.data.orderNo
  
      if (_orderNo) {
        wx.login({
          success (oRes) {
            if (oRes.code) {
              global.yhsd.sdk.weapp.payment({
                code: oRes.code,
                order_no: _orderNo
              }, data => {
                let err = null
                const oRes = (data || {}).res || {}

                if (oRes.code === 200 && oRes.object) {
                  const _data = oRes.object

                  wx.requestPayment({
                    timeStamp: _data.timeStamp,
                    nonceStr: _data.nonceStr,
                    package: _data.package,
                    signType: _data.signType,
                    paySign: _data.paySign,
                    success (oRes) {
                      wx.showToast({
                        title: '支付成功',
                        icon: 'none',
                        duration: 2000
                      })

                      self.goOrder()
                    },
                    fail (oRes) {
                      wx.showToast({
                        title: '支付失败，请稍后再试',
                        icon: 'none',
                        duration: 2000
                      })

                      self.goOrder()
                    }
                  })
                } else {
                  err = '获取支付信息失败，请稍后再试'
                }

                if (err) {
                  wx.showToast({
                    title: err,
                    icon: 'none',
                    duration: 2000
                  })

                  self.goOrder()
                }
              })
            } else {
              self.setData({
                err: '获取用户登录态失败，请重试',
                isPaying: false
              })
              // console.log(oRes.errMsg)
            }
          },
          fail (oRes) {
            self.setData({
              err: '获取用户登录态失败，请重试',
              isPaying: false
            })
            // console.log(oRes.errMsg)
          }
        })
  
        self.setData({
          err: '',
          isPaying: true
        })
      } else {
        self.setData({
          err: '缺少相关参数，请返回重试'
        })
      }
    }
  }
})
