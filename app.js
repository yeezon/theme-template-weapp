
import './vendors/jssdk.js'

// 简易 Polyfill
// 放后面，前面可能有 Polyfill 过的库
// import './libs/polyfill.js'

const oConfig = require('./app.config.js')

global.yhsd = global.yhsd || {}
global.yhsd.YOU_API_URL = oConfig.you_api_url
global.yhsd.API_URL = oConfig.api_url
global.yhsd.SITE_ALIAS = oConfig.alias
global.yhsd.SITE_ID = oConfig.shop.site_id
global.yhsd.SESSION_TOKEN = ''

global.productImage = '53f649ffe2931e0b91000007/noimage.png';
global.vendorImage = '578fc93402282e4f18000003/noimage.png';
global.iconImage = '57acb51702282e3f00000003/noimage.ico';
global.shareImage = '57acb53a02282e3f00000007/noimage.png';
global.assetPath = '//asset.ibanquan.com/image/';
global.postImage = '581a3b0402282e2bcc000003/s.png';
global.captchaPath = '//captcha.ibanquan.com';

global.account = {}

App({
  configs: { ...oConfig },
  globalData: {
    shopName: '友店铺',
    isLogin: false,
    sysInfo: {},
    userInfo: {
      oUser: {}, // 用户信息
      isSync: false, // 是否同步服务器最新的数据
      isAuth: false // 是否有授权
    },
    navBarHeight: 0,
    isIpx: false
  },
  onLaunch(options = {}) {
    // 数据统计
    // analysis(this, options)

    // 同步 放 异步 后面
    this.getSystemInfo() // 获取设备信息

    // 获取 Token
    global.yhsd.SESSION_TOKEN = (wx.getStorageSync('app_session') || {}).token || '';

    global.yhsd.sdk.request.interceptors.response.use(function (response, next) {
      // 未登录 弹出登录窗口
      if (response.data.code === 212){
        const pages = getCurrentPages()
        const curPage = pages[pages.length - 1]
        curPage.setData({
          showLoginModal: true
        })
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
  },
  // 获取设备信息
  getSystemInfo() {
    try {
      const sysInfo = wx.getSystemInfoSync()
      // console.log(sysInfo)
      this.globalData.sysInfo = sysInfo
      this.globalData.navBarHeight = sysInfo.statusBarHeight + 44
      const model = sysInfo.model.substring(0, sysInfo.model.indexOf("X")) + "X"
      // iphone xs 、xs max 暂时先判断statusBarHeight
      if (model === 'iPhone X' || sysInfo.statusBarHeight === 44) {
        this.globalData.isIpx = true
      }
    } catch (oErr) {
      // console.log(oErr)
    }
  }
})
