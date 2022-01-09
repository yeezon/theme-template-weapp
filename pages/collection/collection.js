// pages/collection/collection.js

const app = (global.getApp && global.getApp()) || {}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '商品合辑',
    id: '',
    collection: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.setData({
      id: options.id
    })
    this.getData(options.id)
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

  // 
  getData: function(id) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    app.api.getSiteCollection(id)
      .then(res => {
        wx.hideLoading()
        this.setData({
          collection: res,
          title: res.name
        })
      })
  }
})