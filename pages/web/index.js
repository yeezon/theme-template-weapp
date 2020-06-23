
const oApp = getApp()

Page({
  data: {
    url: '',  // 兼容 Android setData 无效情况，需要先给个 ''
    oShare: {}
  },
  onLoad (oQuery) {
    let _url = oQuery.url || (oApp.configs || {}).host_url || ''

    if (oApp.globalData.toURL) {
      _url = oApp.globalData.toURL
      oApp.globalData.toURL = ''
    } else if (oQuery.q) {
      // 扫 URL 二维码启动小程序支持
      _url = decodeURIComponent(oQuery.q)

      // 自动部署小程序，默认所有域名转成当前设置域名
      if (oApp.configs.is_ext) {
        _url = _url.replace(/^http[s]?:\/\/[^\/\?]+/i, oApp.configs.host_url)
      }
    }

    // 相关修正支持
    if (!(/^https:\/\//i.test(_url))) {
      if (/^http:/i.test(_url)) { // 切换 HTTPS
        _url = _url.replace(/^http:/i, 'https:')
      } else if (/^\/\//i.test(_url)) { // 相对协议修正
        _url = `https:${_url}`
      } else if (/^\/[^\/]/i.test(_url)) { // 相对路径补全
        _url = `${oApp.configs.host_url}${_url}`
      } else { // 无协议支持
        _url = `https://${_url}`
      }
    }

    this.setData({
      url: _url
    })
  },
  onShow () {
    // 兼容程序运行期间，内页返回调用
    if (oApp.globalData.toURL) {
      const _url = oApp.globalData.toURL
      oApp.globalData.toURL = ''

      this.setData({
        url: _url
      })
    }
  },
  onShareAppMessage (oRes) {
    const webViewUrl = oRes.webViewUrl || ''
    const oShare = (this.data || {}).oShare || {}
    const oConfig = {}

    if (oShare.title) {
      oConfig.title = oShare.title
    }
    if (oShare.link || webViewUrl) {
      oConfig.path = `/pages/index/index?web_url=${encodeURIComponent(oShare.link || webViewUrl)}`
    }
    if (oShare.imgUrl) {
      oConfig.imageUrl = oShare.imgUrl
    }

    return oConfig
  },
  fnMsg (evt) {
    const dataList = evt.detail.data || []
    const oData = dataList[dataList.length - 1] || {} // 最后一个信息为最新
    this.setData({
      oShare: oData.share || {}
    })
  }
})
