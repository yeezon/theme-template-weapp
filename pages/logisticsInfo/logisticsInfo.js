const app = (global.getApp && global.getApp()) || {}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '物流信息',
    navBarHeight: 44,
    info: null,
    shipmentName: '',
    shipmentUrl: '',
    shipmentNum: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('options', options)
    const number = options.shipment_number
    const name = options.shipment_name
    let url = decodeURIComponent(options.shipment_url)
    this.setData({
      shipmentName: name,
      shipmentUrl: url,
      shipmentNum: number
    })
    this.getData(url, number)
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

  // get
  getData: function(shipment_url, shipment_number) {
    const self = this
    // 
    console.log('shipment_url', shipment_url)
    console.log('shipment_number', shipment_number)
    wx.showLoading({
      title: '加载中...'
    })
  },

  /**
   * 复制物流单号
   */
  copyNumber: function(e) {
    const data = e.currentTarget.dataset.no
    wx.setClipboardData({
      data: data,
      success: function(res) {
        wx.showToast({
          title: '复制成功',
          icon: 'none',
          duration: 1000,
          mask: false
        })
      }
    })
  }
})