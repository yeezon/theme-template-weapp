// pages/coupon/coupon.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '优惠券',
    coupons: [],
    list: [],
    nShowStatus: 'pending'
  },

  getCoupons(cb) {
    wx.showLoading({
      title: '加载中...'
    })
    global.yhsd.sdk.coupon.get(data => {
      let err = null
      if (data && data.res) {
        if (data.res.code === 200) {
          const _data = this.fnList(data.res.coupons)
          this.setData({
            coupons: _data || [],
            list: _data || []
          })
        } else {
          err = data.res.message || '优惠券数据获取出错'
        }
      } else {
        err = '优惠券数据请求异常'
      }
      cb && cb(err)
    })
  },

  fnTab (e) {
    const status = e.currentTarget.dataset.status
    const coupons = this.data.coupons
    const _list = coupons.filter(item => item.status === status)
    this.setData({
      list: _list,
      nShowStatus: status
    })
  },

  fnList(list) {
    const _list = list
    for (let i = 0; i < _list.length; i++) {
      let _item = _list[i]
      _item = this.fnStatusDesc(_item)
      _item.isAmount = this.isAmount(_item)
      _item.couponDesc = this.getDesc(_item)
      _list[i] = _item
    }
    return _list
  },

  getDesc(item) {
    let _name
    switch (item.utype) {
      case 'amount':
        _name = parseInt(item.discount_amount)
        break
      case 'percentage':
        _name = ((item.discount_percentage || 0) / 10).toFixed(1).replace('.0', '') + ' 折'
        break
      default:
        _name = null
    }
    return _name
  },

  isAmount(item) {
    return item.utype === 'amount'
  },

  fnStatusDesc(item) {
    if (item.status === 'used') {
      item.statusText = '已使用'
    } else if (item.status === 'expired') {
      item.statusText = '已过期'
    } else {
      item.statusText = '有效'
    }
    return item
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCoupons(err => {
      wx.hideLoading()
      if (err) {
        wx.showToast({
          title: err,
          icon: 'none'
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})