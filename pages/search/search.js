// pages/search/search.js
const app = (global.getApp && global.getApp()) || {}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '搜索',
    navBarHeight: 44,
    searchKey: '', // 搜索关键字
    searchDatas: [], // 搜索关键字数据
    autoFocus: false, // 输入框自动获取焦点
    inputFocus: false, // 输入框焦点
    inputClearShow: false, // 输入框清空按钮
    config: {
      name: '',
      sort_type: 1,
      page: 1,
      per_page: 8
    },
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
    this.history()
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
  /**
   * 绑定输入框 获取值
   */
  searchInput: function(e) {
    this.setData({
      searchKey: e.detail.value,
      inputClearShow: e.detail.value ? true : false
    })
  },
  // 
  history: function() {
    const _searchDatas = wx.getStorageSync('searchDatas') || []
    this.setData({
      searchDatas: _searchDatas
    })
  },
  // 
  unique: function(arr) {
    // 数组去重
    return Array.from(new Set(arr))
  },
  /**
   * 点击搜索事件
   */
  confirmSearch: function() {
    const self = this
    const searchKey = self.data.searchKey
    if (!searchKey) return
    // 本地存储搜索记录
    let searchDatas = wx.getStorageSync('searchDatas') || []
    searchDatas.unshift(searchKey)
    // 去重
    searchDatas = self.unique(searchDatas)
    // 保存5个历史记录
    if (searchDatas.length > 5) {
      searchDatas.length = 5
    }
    wx.setStorageSync('searchDatas', searchDatas)
    // 更新搜索记录数据
    self.setData({
      ['config.name']: searchKey,
      searchDatas: searchDatas
    })
    // 
    self.search()
  },

  // 搜索
  search: function() {
    // console.log(this.data.config)
    const self = this
    const config = self.data.config

    self.setData({
      proLoading: true
    })

    wx.showLoading({
      title: '拼命搜索中...'
    })

    app.api.getProducts(config)
      .then(res => {
        wx.hideLoading()
        const products = config.page === 1 ? res.products || [] : self.data.products.concat(res.products || [])
        self.setData({
          proLoading: false,
          showResault: true,
          total_page: res.total_page,
          products: products,
          loadedAll: this.data.total_page === this.data.config.page
        })
        // console.log(res)
      })
  },

  // 搜索商品加载更多
  productsLoadmore: function() {
    if (this.data.proLoading || this.data.total_page === this.data.config.page) return
    this.setData({
      ['config.page']: ++this.data.config.page
    })
    this.search()
  },

  // 
  searchKeyTap: function(e) {
    const key = e.currentTarget.dataset.key
    this.setData({
      searchKey: key,
      inputFocus: false
    })
    this.resetConfig()
    this.confirmSearch()
  },

  // 重置搜索条件
  resetConfig: function() {
    this.setData({
      config: {
        sort_type: 1,
        page: 1,
        per_page: 8
      }
    })
  },

  // 清除所有搜索记录
  clearAll: function() {
    var self = this
    wx.showModal({
      title: '提示',
      content: '确定清空全部历史记录吗？',
      confirmColor: '#fe384f',
      success: function(res) {
        if (res.confirm) {
          // console.log('用户点击确定')
          try {
            wx.removeStorageSync('searchDatas')
          } catch (e) {
            // Do something when catch error
          }
          // 更新数据
          self.setData({
            searchDatas: []
          })
          // 删除成功提示
          wx.showToast({
            title: '已全部清空',
            icon: 'none',
          })
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },

  // 
  clearInput: function() {
    this.setData({
      searchKey: '',
      inputClearShow: false,
      autoFocus: true
    })
  },

  // 
  inputStatusChange: function(e) {
    // console.log('inputStatusChange', e)
    this.setData({
      inputFocus: e.type === 'focus' ? true : false,
    })
  },

  // 筛选
  filterChange: function(e) {
    let type = Number(e.currentTarget.id)
    type === 4 && this.data.config.sort_type === 4 ? type = 5 : type = type
    type === 5 && this.data.config.sort_type === 5 ? type = 4 : type = type
    if (type === this.data.config.sort_type) return
    this.setData({
      ['config.sort_type']: type,
      ['config.page']: 1,
      ['config.per_page']: 8
    })
    // 获取筛选数据
    this.search()
  }
})