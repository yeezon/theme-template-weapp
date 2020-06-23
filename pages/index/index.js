// pages/index/index.js
import setCartCount from '../../common/sdk/setCartCount.js'

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    err: '',
    isLoading: false,
    titile: app.globalData.shopName,
    statusBarHeight: app.globalData.sysInfo.statusBarHeight,
    banners: [],
    collections: [],
    swiperCurrent: 0,
    scrollTop: 0,
    banner_style: 1,
    // showLoginModal: true
    layoutMap: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.getSiteConfig()

    this.getPage()
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
    // 获取购物车数量
    setCartCount()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  // getPage
  getPage() {
    this.setData({
      isLoading: true
    })

    global.yhsd.sdk.page.get({
      handle: 'weapp',
      data_type: 'json',
      display: 'mobi'
    }, ({ res: oRes }) => {
      this.setData({
        isLoading: false
      })

      if (oRes.code === 200) {
        let editJson
        if (oRes.use_mobile_content) {
          editJson = JSON.parse(oRes.page.mobi_edit_json)
  
        } else {
          editJson = JSON.parse(oRes.page.edit_json)
        }
        const oData = editJson.data
        const tagsArr = editJson.layout[0].sub || []
  
        tagsArr.forEach((tag, index) => {
          tag.data = oData[`${tag.attrs['data-cid']}`]
        })
  
        this.setData({
          layoutMap: tagsArr
        })
      } else if (oRes.code === 201) {
        this.setData({
          err: '请到「网站后台」添加小程序使用的「自定义页面」，该页面链接地址需为「/pages/weapp」，基础组件暂时只支持「商品列表」和「图片」。'
        })
      } else {
        this.setData({
          err: '请求异常，请稍后再试'
        })
      }
    })
  },

  // 轮播图切换事件
  swiperChange: function(e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },

  /**
   * 站点配置信息
   */
  getSiteConfig: function() {
    const self = this
    app.api.getSiteConfig()
      .then(res => {
        // console.log(res)
        const collections = res.config.product_collection_setting || []

        self.setData({
          titile: res.name,
          banner_style: res.config.banner_style,
          banners: res.config.banner_setting
        })

        // 店铺名
        app.globalData.shopName = res.name

        self.getSiteCollection(collections)
      })
  },

  /**
   * 商品合辑
   */
  getSiteCollection: function(collections) {
    if (!collections || !collections.length) return
    const self = this
    let collectionsArr = []

    for (let i = 0; i < collections.length; i++) {
      collectionsArr.push(collections[i].id)
    }

    app.api.getSiteCollections({
        ids: collectionsArr.join(',')
      })
      .then(res => {
        if (res.length) {
          res.forEach(proSet => {
            collections.forEach(collection => {
              if (collection.id === proSet.id) {
                collection['proSet'] = proSet
              }
            })
          })
          self.setData({
            collections: collections
          })
        }
      })
    // collections.forEach(item => {
    //   // console.log(self.data.collections)
    //   app.api.getSiteCollection(item)
    //     .then(res => {
    //       // console.log(res)
    //       if (!res.errcode) {
    //         oCollections.push(res)
    //       }
    //       self.setData({
    //         collections: oCollections
    //       })
    //     })
    // })
  },

  // 
  cardCarouselChange: function() {
    this.setData({
      scrollTop: 0
    })
    // wx.pageScrollTo({
    //   scrollTop: 0,
    //   duration: 0
    // })
  },

  lastMove: function() {
    const self = this

    wx.createSelectorQuery().select('#index-products-wrap').boundingClientRect(function(rect) {
      wx.createSelectorQuery().select('#card-carousel').boundingClientRect(function(card) {
        self.setData({
          scrollTop: rect.top - card.top
        })
      }).exec()
    }).exec()
  },

  // 
  toSearch: function() {
    wx.navigateTo({
      url: '../search/search'
    })
  },
  // 
  toPage: function(e) {
    const id = e.currentTarget.id
    const type = e.currentTarget.dataset.type
    if (type === 2) {
      wx.navigateTo({
        url: `../collection/collection?id=${id}`
      })
    } else if (type === 3) {
      wx.navigateTo({
        url: `../products/products?id=${id}`
      })
    }
  },

})