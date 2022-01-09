
import {
  previewImage
} from '../../../utils/previewImage.js'

import setCartCount from '../../../common/sdk/setCartCount.js'

// const app = (global.getApp && global.getApp()) || {}

Component({
  properties: {
    handle: {
      type: String,
      value: ''
    }
  },
  data: {
    isLoading: true,
    title: '商品详情',
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
    nDiscountType: null
  },
  observers: {
    handle (val) {
      if (val) {
        this.init()
      }
    }
  },
  methods: {
    init () {
      this.getData(err => {
        if (err) {
          wx.showToast({
            title: err,
            icon: 'none'
          })
        }
      })

      this.getDiscount()

      // 设置购物车数量
      setCartCount(count => {
        this.setData({
          cartCount: count
        })
      })
    },
    getData(cb) {
      const self = this

      let err = ''
  
      this.setData({
        isLoading: true
      })
  
      wx.showLoading({
        title: '加载中..'
      })
  
      global.yhsd.sdk.product.get(this.properties.handle, function (data) {
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
    getDiscount() {
      const self = this
  
      wx.showLoading({
        title: '加载中..'
      })
  
      global.yhsd.sdk.discount.matchProduct(this.properties.handle, function (data) {
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
    swiperChange: function (e) {
      const self = this
      var index = e.detail.current
      self.setData({
        swiperIndex: index + 1
      })
    },
    // previewImage
    previewImage: function (e) {
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
  
    fnShowSku: function (e) {
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
  
    fnCloseSku(evt) {
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
  
    confirmSKU: function (e) {
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
    buyNowFn: function (detail) {
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
              url: '/pages/checkout/index'
            })
          })
        })
      })
    },
  
    // 加入购物车
    addCartFn: function (detail) {
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
    detailsTabChange: function (e) {
      const index = Number(e.currentTarget.id)
      this.setData({
        detailsTab: index
      })
    },
  
    // 打电话
    makePhoneCall: function (e) {
      wx.makePhoneCall({
        phoneNumber: e.currentTarget.id
      })
    },
  
  
    // 转到详情页
    gotoDetails: function (e) {
      const id = e.currentTarget.id
      wx.navigateTo({
        url: `/pages/product/index?handle=${id}`
      })
    },
  
    // 回到商城
    gotoShop () {
      // wx.redirectTo({
      wx.switchTab({
        url: '/pages/index/index',
      })
    },
  
    // toCart
    toCart () {
      // wx.redirectTo({
      wx.switchTab({
        url: '/pages/cart/index',
      })
    }  
  }
})
