const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '发现',
    navBarHeight: app.globalData.navBarHeight,
    statusBarHeight: app.globalData.sysInfo.statusBarHeight,
    searchDatas: [], // 搜索关键字数据
    autoFocus: false, // 输入框自动获取焦点
    inputFocus: false, // 输入框焦点
    inputClearShow: false, // 输入框清空按钮
    listStyle: 2,
    showFilter: false,
    oQuery: {
      sort_type: 1
    },
    config: {
      page: 1,
      size: 8
    },
    in_stock: false,
    types: [],
    vendors: [],
    type: '',
    vendor: '',
    filter: {},
    showResault: false,
    products: [],
    total_page: 1,
    proLoading: false,
    loadedAll: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setFilter(options)
    this.search()
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
  scrolltolower: function() {
    if (this.data.showResault) {
      this.productsLoadmore()
    }
  },

  // changeListStyle
  changeListStyle: function() {
    this.setData({
      listStyle: this.data.listStyle === 1 ? 2 : 1
    })
  },

  // 
  toSearch: function () {
    wx.navigateTo({
      url: '../search/search'
    })
  },

  // 筛选 选项
  getFilter: function() {

    this.setData({
      showFilter: true,
      in_stock: this.data.filter && this.data.filter.in_stock !== undefined ? this.data.filter.in_stock : false,
      vendor: this.data.filter && this.data.filter.vendor ? this.data.filter.vendor : '',
      type: this.data.filter && this.data.filter.type ? this.data.filter.type : '',
    })

    // 分类
    global.yhsd.sdk.type.get({size: 9999}, ({res}) => {
      this.setData({
        types: res.types
      })
    })

    // 品牌
    global.yhsd.sdk.vendor.get({size: 9999}, ({res}) => {
      this.setData({
        vendors: res.vendors
      })
    })
  },

  closeFilter: function() {
    this.setData({
      showFilter: false
    })
  },

  // 
  exChange: function() {
    this.setData({
      in_stock: !this.data.in_stock
    })
  },

  // 
  typeChange: function(e) {
    console.log(e)
    const type = e.currentTarget.dataset.type
    this.setData({
      type: type === this.data.type ? '' : type
    })
  },

  // 
  vendorChange: function(e) {
    console.log(e)
    const vendor = e.currentTarget.dataset.vendor
    this.setData({
      vendor: vendor === this.data.vendor ? '' : vendor
    })
  },

  setFilter: function(options) {
    if (options.ex) {
      this.setData({
        in_stock: options.ex
      })
    }
    if (options.ve) {
      this.setData({
        vendor: options.ve
      })
    }
    if (options.ty) {
      this.setData({
        type: options.ty
      })
    }
  },

  clearFilter: function() {
    this.setData({
      in_stock: false,
      vendor: '',
      type: '',
      // filter: {}
    })
  },

  filterComfirn: function() {
    this.setData({
      showFilter: false
    })
    this.search()
  },


  // 搜索
  search: function() {
    // console.log(this.data.config)
    const self = this
    const config = self.data.config
    const _oQuery = self.data.oQuery

    let filter = {}
    if (self.data.in_stock) filter.in_stock = self.data.in_stock
    if (self.data.vendor) filter.vendor = self.data.vendor
    if (self.data.type) filter.type = self.data.type

    self.setData({
      filter: filter
    })

    self.setData({
      proLoading: true
    })

    wx.showLoading({
      title: '加载中...'
    })

    let oConfig = {
      page: config.page || 1,
      size: config.size || 10
    }
    
    switch (_oQuery.sort_type) {
      case 2:
        oConfig.so = 'date_desc'
        break
      case 3:
        oConfig.so = 'sale_desc'
        break
      case 4:
        oConfig.so = 'price_desc'
        break
      case 5:
        oConfig.so = 'price_asc'
        break
      default:
        break
    }

    oConfig = Object.assign({}, oConfig, self.data.filter)

    global.yhsd.sdk.product.get(oConfig, function(data) {
      wx.hideLoading()
      const products = config.page === 1 ? data.res.products || [] : self.data.products.concat(data.res.products || [])
      self.setData({
          proLoading: false,
          showResault: true,
          total_page: data.res.paging.pages,
          products: products,
          loadedAll: self.data.config.page >= self.data.total_page
      })
    })
    
  },

  // 搜索商品加载更多
  productsLoadmore: function() {
    if (this.data.proLoading || this.data.loadedAll) return
    this.setData({
      ['config.page']: ++this.data.config.page
    })
    this.search()
  },

  // 筛选
  filterChange: function(e) {
    let type = Number(e.currentTarget.id)
    const _oQuery = this.data.oQuery
    type === 4 && _oQuery.sort_type === 4 ? type = 5 : type = type
    type === 5 && _oQuery.sort_type === 5 ? type = 4 : type = type
    if (type === _oQuery.sort_type) return
    this.setData({
      ['oQuery.sort_type']: type,
      ['config.page']: 1,
      ['config.size']: 8
    })
    // 获取筛选数据
    this.search()
  }
})