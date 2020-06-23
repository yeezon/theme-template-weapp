// pages/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    title: '个人资料',
    sexOptions: ['保密', '男', '女'],
    sexOptions1: [
      {
        value: 'undefined',
        label: '保密'
      },
      {
        value: 'male',
        label: '男'
      },
      {
        value: 'female',
        label: '女'
      }
    ],
    userInfo: {}
  },

  init() {
    this.getUserInfo(err => {
      wx.hideLoading()
      if (err) {
        wx.showToast({
          title: err,
          icon: 'none'
        })
      }
    })
  },

  getUserInfo(cb) {
    let err = ''
    wx.showLoading({
      title: '加载中...'
    })
    global.yhsd.sdk.account.current(data => {
      if (data.res.code === 200) {
        if(!data.res.customer){
          const pages = getCurrentPages()
          const curPage = pages[pages.length - 1]
          curPage.setData({
            showLoginModal: true
          })
        }
        const _data = data.res.customer
        _data.sex = this.sexLabel(_data)
        this.setData({
          userInfo: _data
        })
      } else {
        err= '获取资料失败'
      }
      cb && cb(err)
    })
  },

  sexLabel(info) {
    let _sex = info.sex
    if (_sex === 'male') {
      _sex = '男'
    } else if (_sex === 'female') {
      _sex = '女'
    } else {
      _sex = '保密'
    }
    return _sex
  },

  bindDateChange(e) {
    const userInfo = this.data.userInfo
    userInfo.birthday = e.detail.value
    const oNotify = {
      birthday: e.detail.value
    }
    wx.showLoading({
      title: '提交修改中...',
    })
    this.fnAccountSave(oNotify, err => {
      wx.hideLoading()
      if (err) {
        wx.showToast({
          title: err,
        })
      }
    })
    this.setData({
      userInfo: userInfo
    })
  },

  bindSexChange(e) {
    const val = this.data.sexOptions[e.detail.value]
    const userInfo = this.data.userInfo
    userInfo.sex = val
    let sex = ''
    switch(val) {
      case '保密':
        sex = 'undefined'
        break
      case '男':
        sex = 'male'
        break
      case '女':
        sex = 'female'
        break
    }
    const oNotify = {
      sex: sex
    }
    wx.showLoading({
      title: '提交修改中...',
    })
    this.fnAccountSave(oNotify, err => {
      wx.hideLoading()
      if (err) {
        wx.showToast({
          title: err,
        })
      }
    })
    this.setData({
      userInfo: userInfo
    })
  },

  fnGoTo(e) {
    const url = e.currentTarget.dataset.url
    const val = e.currentTarget.dataset.val
    const type = e.currentTarget.dataset.query || null
    wx.navigateTo({
      url: `../${url}?type=${type}&&value=${val}`
    })
  },

  changeData(data) {
    if (Object.keys(data).length > 0) {
      const key = Object.keys(data)
      const val = data[key]
      const userInfo = this.data.userInfo
      userInfo[key] = val
      this.setData({
        userInfo: userInfo
      })
    }
  },

  fnAccountSave(oNotify, cb) {
    global.yhsd.sdk.account.save(oNotify, data => {
      let err = null
      if (data && data.res) {
        if (data.res.code === 200) {
          console.log('修改成功')
        } else {
          err = data.res.message || '修改用户数据获取出错'
        }
      } else {
        err = '修改用户数据请求异常'
      }
      cb && cb(err)
    })
  },

  handleAvatarTap() {
    wx.showToast({
      title: '暂不支持上传头像',
      icon: 'none'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init()
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