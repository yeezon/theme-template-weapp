// pages/createOrder/createOrder.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '提交订单',
    name: 'createOrder',
    navBarHeight: app.globalData.navBarHeight,
    isIpx: app.globalData.isIpx,
    address: null,
    variants: null,
    orderVariants: {},
    amount: 0,
    postage: 0,
    memo: {},
    createOrderLoading: false,
    order_id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      variants: JSON.parse(options.variants)
    })
    console.log(options)
    this.init()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },
  // init
  init: function() {
    this.getAddress()
    this.checkout()
  },
  // 获取地址列表
  getAddress: function() {
    const self = this
    // 
    app.api.getAddress()
      .then(data => {
        let address = data
        if (!address.length) {
          self.setData({
            address: null
          })
          return
        }
        // 默认地址排到第一位
        let index, item, flag = false;
        for (var i = 0, len = address.length; i < len; i++) {
          if (address[i].is_default) {
            flag = true
            index = i
            item = address[i]
          }
        }
        if (flag) {
          address.splice(index, 1)
          address.unshift(item)
        }
        self.setAddress(address[0])
      })
  },
  // 设置订单地址
  setAddress: function(address) {
    const self = this
    // 
    self.setData({
      address: address
    })
  },
  // 结算
  checkout: function() {
    const variants = this.data.variants
    let amount = 0
    let postage = 0
    let orderVariants = {}
    variants.forEach(variant => {
      variant.skus.forEach(sku => {
        orderVariants[sku.variant_id] = sku.quantity
        amount += sku.price * sku.quantity + sku.postage
        postage += sku.postage
      })
    })

    this.setData({
      orderVariants: orderVariants,
      amount: amount,
      postage: parseFloat(Math.abs(postage / 100).toFixed(2))
    })
  },
  // 
  gotoAddress: function() {
    // if (!wx.getStorageSync('app_session')) {
    //   this.setData({
    //     showLoginModal: true
    //   })
    //   return
    // }
    const id = this.data.address ? this.data.address.id : ''
    wx.navigateTo({
      url: `../address/address?type=select&id=${id}`
    })
  },
  // 备注
  remarkInput: function(e) {
    const id = e.currentTarget.id
    this.setData({
      [`memo.${id}`]: e.detail.value
    })
  },
  // 提交订单
  createOrder: function(e) {
    const self = this
    if (!self.data.address || !self.data.address.id) {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none'
      })
      return
    }
    // 判断地址是否符合发货范围
    if (/香港|澳门|台湾/g.test(self.data.address.province)) {
      wx.showModal({
        title: '提示',
        content: '香港、澳门、台湾及海外地区暂不提供发货服务。',
        showCancel: false,
        confirmText: '知道了',
        confirmColor: '#FB544E'
      })
      return
    }

    const formId = e.detail.formId
    const postData = {
      variants: self.data.orderVariants,
      address_id: self.data.address.id,
      memo: self.data.memo,
      formid: e.detail.formId || ''
    }
    console.log(postData)
    console.log(formId)
    // return
    // for (let key in postData) {
    //   if (!postData[key]) {
    //     delete postData[key]
    //   }
    // }
    // createOrderLoading
    self.setData({
      createOrderLoading: true
    })
    wx.showLoading({
      title: '正在提交订单',
      mask: true
    })
    // 
    app.api.createOrder(postData)
      .then(res => {
        const id = res.id
        self.orderPay(id)
        self.setData({
          createOrderLoading: false,
          order_id: id
        })
      })
      .catch(err => {
        wx.hideLoading()
        self.setData({
          createOrderLoading: false
        })
        if (err.statusCode === 400) {
          wx.showToast({
            title: (err.data || {}).err_msg || '业务错误',
            icon: 'none'
          })
        }
      })
  },
  // 支付订单
  orderPay: function(id) {
    const self = this
    app.api.orderPay(id)
      .then(res => {
        console.log(res)
        wx.hideLoading()
        self.wxPay(res.data, id)
      })
      .catch(err => {
        console.log(err)
        wx.hideLoading()
        self.setData({
          createOrderLoading: false
        })
        wx.showToast({
          title: '支付失败',
          icon: 'none'
        })
        setTimeout(() => {
          wx.redirectTo({
            url: `../orderDetails/orderDetails?id=${id}`
          })
        }, 1500)
      })
  },
  // 调起微信支付
  wxPay: function(pay, id) {
    wx.requestPayment({
      timeStamp: pay.timeStamp,
      nonceStr: pay.nonceStr,
      package: pay.package,
      signType: pay.signType,
      paySign: pay.paySign,
      success: function(res) {
        wx.showToast({
          title: '支付成功',
          icon: 'none'
        })
        setTimeout(() => {
          wx.redirectTo({
            url: `../orderDetails/orderDetails?id=${id}`
          })
        }, 1500)
      },
      fail: function(err) {
        wx.showToast({
          title: '支付已取消',
          icon: 'none'
        })
        setTimeout(() => {
          wx.redirectTo({
            url: `../orderDetails/orderDetails?id=${id}`
          })
        }, 1500)
      }
    })
  }
})