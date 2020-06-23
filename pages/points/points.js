// pages/points/points.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '积分',
    year: "",
    oPoints: {
      reward_point_total: 0,
      last_year_point: 0
    },
    nShowType: 0,
    details: [],
    noticeShow: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.init()
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

  },
  
  /**
   * 自定义
   */
  init: function() {
    this.getYear()
    this.getData(err => {
      wx.hideLoading()
      if (err) {
        wx.showToast({
          title: err,
          icon: 'none'
        })
      }
      this.noticeShow(this.data.nShowType)
    })
  },
  getData(cb) {
    const self = this
    wx.showLoading({
      title: '加载中..'
    })
    global.yhsd.sdk.account.rewardPointDetails({},data => {
      let err = null
      if (data && data.res) {
        if (data.res.code === 200) {
          const _details = data.res.reward_point_details
          const _total = data.res.reward_point_total
          const _point = data.res.last_year_point
          this.setData({
            details: _details || [],
            oPoints: {
              reward_point_total: _total,
              last_year_point: _point
            }
          })
        } else {
          err = data.res.message || '积分数据获取出错'
        }
      } else {
        err = '积分数据请求异常'
      }
      cb && cb(err)
    })
  },
  getYear() {
    const _year = (new Date).getFullYear()
    this.setData({
      year: _year
    })
  },
  tabChange(event) {
    this.setData({
      nShowType: event.currentTarget.dataset.id
    })
    this.noticeShow(event.currentTarget.dataset.id)
  },
  noticeShow(id) {
    const _details = this.data.details || []
    let _res = false
    if (id === 0) {
      if (_details.length) {
        _res = true
      }
    } else {
      for (const oItem of _details) {
        if (id === 1) {
          _res = oItem.point >= 0
        } else if (id === 2) {
          _res = oItem.point < 0
        }
        if(_res) {
          break
        }
      }
    }
    this.setData({
      noticeShow: !_res
    })
  },
  gotoPage: function(e) {
    const url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: `../../pages/${url}/${url}`
    })
  }
})