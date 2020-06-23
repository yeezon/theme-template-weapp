const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '个人中心',
    isIpx: app.globalData.isIpx,
    unpay_count: 0,
    receive_count: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // app.mta.Page.init()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // this.getOrderCount()
    // 
    // app.analysis(app)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},
  // 
  _checkSession: function(e) {
    this.gotoPage(e)
  },

  onReachBottom: function() {
    
  },

  // 获取订单状态数量
  getOrderCount: function() {
    if (!wx.getStorageSync('app_session').token) {
      this.setData({
        unpay_count: 0,
        receive_count: 0
      })
      return
    }
    app.api.getOrderCount()
      .then(res => {
        console.log(res)
        this.setData({
          unpay_count: res.unpay_count || 0,
          receive_count: res.receive_count || 0
        })
      })
  },
  // 
  gotoPage: function(e) {
    const url = e.currentTarget.dataset.url
    const type = e.currentTarget.dataset.query || null

    wx.navigateTo({
      url: `../${url}/${url}?type=${type}`
    })
  },
  // 订单列表
  toOrders: function(e) {
    // console.log(e)
    const status = e.currentTarget.dataset.id || 0
    wx.navigateTo({
      url: `../orderList/orderList?status=${status}`
    })
  },
})