
import './env_init'
import signin from './lib/signin'

// 简易 Polyfill
// 放后面，前面可能有 Polyfill 过的库
// import './libs/polyfill.js'

App({
  globalData: {
    shopName: ''
  },
  onLaunch(options = {}) {
    // 数据统计
    // analysis(this, options)

    // 获取 Token
    // 先这样
    global.yhsd.SESSION_TOKEN = (wx.getStorageSync('app_session') || {}).token || ''

    // 登录
    signin()

    global.yhsd.sdk.request.interceptors.response.use(function (response, next) {
      response = response || {}
      const oData = response.data || {}

      // 未登录 弹出登录窗口
      if (oData.code === 212){
        // 提示登录 & signin()
      }

      next && next(response)
    })
  },
  onShow(options = {}) {
    // login(this)
    // Share 相关一般只能放 onShow，因为可能之前已经 onLaunch 过再开其他人的分享

    // 检查和强制更新
    this.checkVer()
  },
  // 检查和强制更新
  checkVer() {
    const upManager = wx.getUpdateManager()

    upManager.onUpdateReady(() => {
      wx.showModal({
        title: '更新提示',
        content: '新版本已准备好，是否切换？',
        confirmText: '切换',
        cancelText: '下次',
        success: function(oRes) {
          if (oRes.confirm) {
            upManager.applyUpdate()
          }
        }
      })
    })
  }
})
