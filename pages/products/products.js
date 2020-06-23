import {
  previewImage
} from '../../utils/previewImage.js'

import setCartCount from '../../common/sdk/setCartCount.js'

const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLoading: true,
    title: '商品详情',
    navBarHeight: app.globalData.navBarHeight,
    screenWidth: app.globalData.sysInfo.screenWidth,
    isIpx: app.globalData.isIpx,
    id: '',
    userInfo: {},
    cartCount: 0,
    indicatorDots: false,
    swiperIndex: 1,
    isShowSku: false,
    // showService: false,
    proDetails: null,
    discounts: null,
    oMarketing: {},
    detailsTab: 1,
    showType: 'addCart',
    oNowSku: null,
    // tags: [{
    //     name: '7天无理由退款',
    //     description: '1H无理由退款1H无理由退款1H无理由退款1H无理由退款1H无理由退款'
    //   },
    //   {
    //     name: '正品保证',
    //     description: '正品保证正品保证正品保证正品保证正品保证'
    //   },
    //   {
    //     name: '假一赔三',
    //     description: '所有商品均为认证供应商提供，公司资质和产品品质已提前进行检验,保证原装正品,用户可放心购买'
    //   }
    // ],
    nDiscountType: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // Web 二维码支持
    const url = decodeURIComponent((options || {}).q || '') || ''

    const _id = url.replace(/^.+\?handle\=/, '') || ''

    this.setData({
      id: options.handle || _id || '',
    })
  },
  init: function() {
    this.getData(err => {
      if (err) {
        wx.showToast({
          title: err,
          icon: 'none'
        })
      }
    })
    this.getDiscount(this.data.id || '')
    // 设置购物车数量
    setCartCount(count => {
      this.setData({
        cartCount: count
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.init()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  scrolltolower: function() {

  },

  // 
  getData(cb) {
    const self = this
    let err = ''

    self.setData({
      isLoading: true
    })

    wx.showLoading({
      title: '加载中..'
    })

    global.yhsd.sdk.product.get(self.data.id, function(data) {
      data = data || {}
      const product = (data.res || {}).product || {}

      self.setData({
        isLoading: false
      })

      wx.hideLoading()

      if (data.res.code === 200) {
        self.setData({
          proDetails: product
        })
      } else {
        err = '信息加载失败，请重开'

        wx.showToast({
          title: '信息加载失败，请重开',
          icon: 'none'
        })
      }

      cb && cb(err, product)
    })
  },

  getDiscount(id) {
    const self = this

    wx.showLoading({
      title: '加载中..'
    })

    global.yhsd.sdk.discount.matchProduct(self.data.id, function(data) {
      wx.hideLoading()
      if (data.res.code === 200) {
        self.setData({
          discounts: data.res.discounts || [],
          oMarketing: data.res.marketing || {}
        })
      } else {
        wx.showToast({
          title: '信息加载失败，请重开',
          icon: 'none'
        })
      }
    })
  },
  
  setDiscountType(evt) {
    this.setData({
      nDiscountType: evt.detail
    })
  },

  fnDiscountEnd() {
    this.getDiscount()
  },

  // swiperChange
  swiperChange: function(e) {
    const self = this
    var index = e.detail.current
    self.setData({
      swiperIndex: index + 1
    })
  },
  // previewImage
  previewImage: function(e) {
    previewImage(e.currentTarget.dataset)
  },

  // showServiceFn
  // showServiceFn: function() {
  //   // this.setData({
  //   //   showService: true
  //   // })
  // },
  // closeService
  // closeService: function() {
  //   this.setData({
  //     showService: false
  //   })
  // },

  fnShowSku: function(e) {
    if (e.currentTarget.dataset.type) {
      const type = e.currentTarget.dataset.type
      this.setData({
        isShowSku: true,
        showType: type
      })
    } else {
      this.setData({
        isShowSku: true
      })
    }
  },

  fnCloseSku (evt) {
    this.setData({
      isShowSku: false
    })
  },

  autoSelect(e) {
    const detail = e.detail || {}

    if ((this.data.oNowSku || {}).id !== detail.id) {
      this.setData({
        oNowSku: detail
      })
    }
  },

  confirmSKU: function(e) {
    const detail = e.detail

    const type = this.data.showType

    if (type === 'addCart') {
      this.addCartFn(detail)
      this.setData({
        oNowSku: detail
      })
    } else if (type === 'buyNow') {
      this.buyNowFn(detail)
      this.setData({
        oNowSku: detail
      })
    } else if (type === 'selectSKU') {
      this.setData({
        oNowSku: detail
      })
    }
  },

  // 立即购买
  buyNowFn: function(detail) {
    const pro = {
      variant_id: detail.id,
      quantity: detail.num
    }

    global.yhsd.sdk.cart.unCheckAll(() => {
      global.yhsd.sdk.cart.removeOne({ variant_id: pro.variant_id || null }, () => {
        global.yhsd.sdk.cart.add({
          variant_id: pro.variant_id,
          quantity: pro.quantity,
          is_check: true
        }, oRes => {
          oRes = oRes.res || {}

          // 加入失败
          if (oRes.message) {
            wx.showToast({
              title: '添加失败，请重试',
              icon: 'none'
            })
            return
          }

          // 更新购物车数量
          setCartCount(count => {
            this.setData({
              cartCount: count
            })
          })

          wx.showToast({
            title: '已加入购物车',
            icon: 'none'
          })

          wx.navigateTo({
            url: '../../pages/checkout/index'
          })
        })
      })
    })
  },

  // 加入购物车
  addCartFn: function(detail) {
    const pro = {
      variant_id: detail.id,
      quantity: detail.num
    }
    global.yhsd.sdk.cart.add(pro, data => {
        // 加入失败
        if (data.res.message) {
          wx.showToast({
            title: data.res.message,
            icon: 'none'
          })
          return
        }

        // 更新购物车数量
        setCartCount(count => {
          this.setData({
            cartCount: count
          })
        })

        // 加入成功放 getData 回调里，因为有加载中提示

        // 加入成功更新库存数据
        this.getData(err => {
          if (err) {
            wx.showToast({
              title: err,
              icon: 'none'
            })
          } else {
            wx.showToast({
              title: '已加入购物车',
              icon: 'none'
            })
          }
        })
      })
  },

  setDiscountHandle(evt) {
    this.setData({
      discountHandle: evt.detail
    })
  },

  // 详情tab
  detailsTabChange: function(e) {
    const index = Number(e.currentTarget.id)
    this.setData({
      detailsTab: index
    })
  },

  // 打电话
  makePhoneCall: function(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.id
    })
  },


  // 转到详情页
  gotoDetails: function(e) {
    const id = e.currentTarget.id
    wx.navigateTo({
      url: `../../pages/products/products?id=${id}`
    })
  },

  // 回到商城
  gotoShop: function() {
    wx.switchTab({
      url: '../index/index',
    })
  },

  // toCart
  toCart: function() {
    wx.switchTab({
      url: '../cart/cart',
    })
  },

})