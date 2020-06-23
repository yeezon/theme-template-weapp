// pages/security/security.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '安全设置',
    customer: null,
    social_accounts: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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

  init () {
    this.getShop()
    this.getCustomer()
  },

  getCustomer() {
    global.yhsd.sdk.account.current(({
      res
    }) => {
      console.log('=> security', res)
      if (res.customer) {
        this.setData({
          customer: res.customer,
          social_accounts: res.customer.social_accounts || []
        })
      } else {
        const pages = getCurrentPages()
        const curPage = pages[pages.length - 1]
        curPage.setData({
          showLoginModal: true
        })
      }
    })
  },

  getShop() {
    global.yhsd.sdk.shop.get('shop', ({
      res
    }) => {
      console.log(res)
    })
  },

  changePassword() {
    wx.navigateTo({
      url: '../changePassword/changePassword',
    })
  },

  bindAccount() {
    wx.navigateTo({
      url: '../socialSync/socialSync',
    })
  }
})