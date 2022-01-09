
Component({
  properties: {},
  data: {
    isLoading: false,
    title: '个人信息',
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
  lifetimes: {
    attached () {
      this.init()
    }
  },
  pageLifetimes: {
    show () {
      this.init()
    }
  },
  methods: {
    init() {
      this.getUserInfo(err => {
        if (err) {
          wx.showToast({
            title: err,
            icon: 'none'
          })
        }
      })
    },

    getUserInfo(cb) {
      if (this.data.isLoading) return

      let err = ''

      wx.showLoading({
        title: '加载中...'
      })

      this.setData({
        isLoading: true
      })

      global.yhsd.sdk.account.current(data => {
        this.setData({
          isLoading: false
        })

        wx.hideLoading()

        if (data.res.code === 200) {
          const oCustomer = data.res.customer

          oCustomer.sex = this.sexLabel(oCustomer)

          this.setData({
            userInfo: oCustomer
          })
        } else {
          err = '获取资料失败'
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

      this.fnAccountSave(oNotify, err => {
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

      switch (val) {
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

      this.fnAccountSave(oNotify, err => {
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
      const key = e.currentTarget.dataset.key || ''
      const value = e.currentTarget.dataset.value || ''

      wx.navigateTo({
        url: `/pages/personalEdit/index?key=${key}&&value=${value}`
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
      wx.showLoading({
        title: '提交修改中...',
      })

      global.yhsd.sdk.account.save(oNotify, data => {
        wx.hideLoading()

        const oRes = (data || {}).res || {}
        let err = ''

        if (oRes.code === 200) {
          wx.showToast({
            title: '修改成功',
            icon: 'none'
          })
        } else {
          err = oRes.message || '修改用户数据获取出错'
        }

        cb && cb(err)
      })
    },

    handleAvatarTap() {
      wx.showToast({
        title: '暂不支持上传头像',
        icon: 'none'
      })
    }
  }
})