
const app = (global.getApp && global.getApp()) || {}

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    shopName: ''
  },

  ready() {
    this.setData({
      shopName: app.globalData.shopName
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 获取用户信息
     */
    getuserinfo: function(res) {
      const userInfo = res.detail.userInfo || null
      if (userInfo) {
        this.closeModal()
        this.login(userInfo, () => {
          // this.updateUserInfo(userInfo)
        })
      } else {
        wx.showToast({
          title: '授权失败，请重新授权',
          icon: 'none'
        })
      }

    },
    // 
    closeModal: function() {
      this.setData({
        show: false
      })
    },

    // 登录
    login: function(userInfo, cb) {
      const self = this

      wx.showLoading({
        title: '正在登录...'
      })

      wx.login({
        success: ({code}) => {
          const _appId = (((wx.getAccountInfoSync && wx.getAccountInfoSync()) || {}).miniProgram || {}).appId || ''

          global.yhsd.sdk.weapp.auth({
            appid: _appId,
            siteid: global.yhsd.SITE_ID,
            code: code
          }, (res) => {
            if (res.res.code === 200) {
              const { uid, unionid, token } = res.res

              global.yhsd.sdk.account.socialAuth({
                uid,
                unionid: unionid || '', // 注意有可能是 null，GET 会被当字符串 null
                auth_token: token,
                type: 'weixin',
                social_name: userInfo.nickName,
                avatar_url: userInfo.avatarUrl
              }, (_res) => {
                if (_res.res.code === 200) {
                  wx.hideLoading()
                  // 保存 Token
                  wx.setStorageSync('app_session', {
                    'token': _res.res.token
                  })
                  global.yhsd.SESSION_TOKEN = _res.res.token
                  global.account = _res.res.customer
                  self.pageInit()
                  cb && cb()
                } else {
                  wx.hideLoading()
                  wx.showToast({
                    title: '登录失败',
                    icon: 'none'
                  })
                }
              })
            } else {
              wx.hideLoading()
              wx.showToast({
                title: '登录失败',
                icon: 'none'
              })
            }
          })
        },
        fail: function(res) {

        }
      })
    },
    // 初始化当前页数据
    pageInit: function () {
      const pages = getCurrentPages()
      const curPage = pages[pages.length - 1]
      curPage.init && curPage.init()
    }
  }
})