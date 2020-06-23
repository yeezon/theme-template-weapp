// pages/changePassword/changePassword.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '修改账号密码',
    password_old: '',
    password: '',
    password_again: ''
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

  bindKeyInput(e) {
    const type = e.currentTarget.dataset.type
    this.setData({
      [`${type}`]: e.detail.value
    })
  },

  fnSubmit() {
    const oParam = {}
    oParam.password_old = this.data.password_old || ''
    oParam.password = this.data.password || ''
    oParam.password_again = this.data.password_again || ''

    if (!oParam.password_old || oParam.password_old.length < 6) {
      wx.showToast({
        title: '当前密码不少于6位',
        icon: 'none'
      })
      return
    }
    if (!oParam.password || oParam.password.length < 6) {
      wx.showToast({
        title: '修改密码不少于6位',
        icon: 'none'
      })
      return
    }
    if (!oParam.password_again || oParam.password !== oParam.password_again) {
      wx.showToast({
        title: '修改密码与确认密码不一致',
        icon: 'none'
      })
      return
    }

    console.log(oParam)

    wx.showLoading({
      title: '处理中...'
    })
    global.yhsd.sdk.account.changePassword(oParam, ({
      res
    }) => {
      wx.hideLoading()
      if(res.code === 200) {
        wx.reLaunch({
          url: '/pages/security/security',
          success: () => {
            let timer = setTimeout(() => {
              clearTimeout(timer)
              timer = null
              wx.showToast({
                title: '密码修改成功',
                duration: 3000
              })
            }, 200)
          }
        })
      } else {
        wx.showToast({
          title: res.message || '处理出错',
          icon: 'none'
        })
      }
    })
  },

  fnResetAfter() {
    wx.setStorageSync('app_session', {
      'token': ''
    })
    global.yhsd.SESSION_TOKEN = ''
  }

})