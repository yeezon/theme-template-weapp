// pages/user/edit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '修改',
    type: 'name',
    inputValue: '',
    oldVal: '',
    inputInfo: { 
      label: '昵称',
      desc: '请输入内容'
    },
    oRules: {
      notify_email: [{
        validator(val) {
          if (val) {
            return global.yhsd.sdk.util.isEmail(val)
          } else {
            return true
          }
        },
        err: '格式不正确'
      }],
      notify_phone: [{
        validator(val) {
          if (val) {
            return global.yhsd.sdk.util.isMobile(val)
          } else {
            return true
          }
        },
        err: '格式不正确'
      }]
    }
  },

  getInfo(type) {
    let _res = {}
    if (!type) return
    switch (type) {
      case 'name':
        _res.label = '昵称'
        _res.desc = '输入昵称'
        _res.required = true
        break
      case 'notify_email':
        _res.label = '邮箱'
        _res.desc = '输入邮箱'
        _res.required = false
        break
      case 'notify_phone':
        _res.label = '手机号码'
        _res.desc = '输入手机号码'
        _res.required = false
        break
      case 'real_name':
        _res.label = '真实姓名'
        _res.desc = '输入真实姓名'
        _res.required = false
        break
      case 'indentity_card':
        _res.label = '身份证号码'
        _res.desc = '输入身份证号码'
        _res.required = false
        break
    }
    this.setData({
      title: '修改' + _res.label,
      inputInfo: _res
    })
  },
  // 输入
  bindKeyInput(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  // 验证
  validateFn() {
    const oRules = this.data.oRules
    const type = this.data.type
    const val = this.data.inputValue
    const inputInfo = this.data.inputInfo
    let _err = ''
    if (oRules[type]) {
      for (let i = 0; i < oRules[type].length; i++) {
        if (!oRules[type][i].validator(val)) {
          _err = oRules[type][i].err
          break
        }
      }
    }
    if (inputInfo.required && !val.trim()) {
      _err = '不能为空'
    }
    if (_err) {
      wx.showToast({
        title: _err,
      })
      return false
    }
    return true
  },
  // 提交
  fnSubmit() {
    const _type = this.data.type
    const oldVal = this.data.oldVal
    const inputVal = this.data.inputValue
    if (!this.validateFn()) return
    if (inputVal !== oldVal) {
      wx.showLoading({
        title: '提交修改中...',
      })
      const oNotify = {}
      oNotify[_type] = inputVal
      this.fnAccountSave(oNotify, err => {
        wx.hideLoading()
        if (err) {
          wx.showToast({
            title: err,
          })
        }
      })
    }
  },

  fnAccountSave(oNotify, cb) {
    global.yhsd.sdk.account.save(oNotify, data => {
      let err = null
      if (data && data.res) {
        if (data.res.code === 200) {
          const pages = getCurrentPages();
          const prePage = pages[pages.length - 2];
          prePage.changeData(oNotify)
          wx.navigateBack({
            delta: 1
          })
        } else {
          err = data.res.message || '修改用户数据获取出错'
        }
      } else {
        err = '修改用户数据请求异常'
      }
      cb && cb(err)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const type = options.type
    if (!type) {
      wx.showToast({
        title: '未知错误，请重新打开',
      })
      return
    }
    this.setData({
      type: type,
      oldVal: options.value || '',
      inputValue: options.value || ''
    })
    this.getInfo(type)
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