// pages/socialSync/socialSync.js
Page({
  data: {
    title: '绑定普通账号',
    account: '',
    password: '',
    LOGIN_TYPE: 'normal', // nomarl tel
    BTN_TYPE_TITLE: '手机号码绑定'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.handleTypeChange()
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
    oParam.account = this.data.account || ''
    oParam.password = this.data.password || ''

    console.log(oParam)


    if (!oParam.account) {
      wx.showToast({
        title: '请输入账号',
        icon: 'none'
      })
      return
    }

    if (!oParam.password) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      })
      return
    }

    wx.showLoading({
      title: '绑定中...'
    })
    global.yhsd.sdk.account.socialSync(oParam, ({
      res
    }) => {
      if(res.code === 200) {
        wx.switchTab({
          url: '/pages/mine/mine',
          success: () => {
            wx.showToast({
              title: '账号绑定成功'
            })
          }
        })
      } else {
        wx.showToast({
          title: res.message || '操作失败',
          icon: 'none'
        })
      }
    })

  },

  handleTypeChange() {
    const { LOGIN_TYPE } = this.data
    const type = LOGIN_TYPE === 'normal' ? 'tel' : 'normal'
    const BTN_TYPE_TITLE = '切换至' + ( type === 'normal' ? '手机号码绑定' : '普通账号绑定' )
    const title =  type === 'normal' ? '绑定普通账号' : '绑定手机号码'

    this.setData({
      LOGIN_TYPE: type,
      BTN_TYPE_TITLE,
      title
     })
  }
})