
import * as yhsd from './vendors/jssdk'
import oConfig from './app_config'

let _globalThis = {}

// 注意部分环境 global !== window，例如小程序；
// globalThis 暂时不用，小程序内 globalThis !== global
try {
  _globalThis = global
} catch (error) {
  _globalThis = window
}

try {
  _globalThis.getApp = _globalThis.getApp || getApp
} catch (error) {}

const app = (_globalThis.getApp && _globalThis.getApp()) || {}

_globalThis.yhsd = yhsd || {}

_globalThis.yhsd.SESSION_TOKEN = ''

_globalThis.yhsd.SITE_DOMAIN = oConfig.SITE_DOMAIN || ''
_globalThis.yhsd.SITE_ALIAS = oConfig.SITE_ALIAS || ''
_globalThis.yhsd.SAAS_DOMAIN = 'youhaosuda.com'
_globalThis.yhsd.SAAS_DOMAIN_FOR_SITE = 'site.youhaosuda.com'

_globalThis.yhsd.LOWCODE_DATA_SOURCE_HANDLE = ''

_globalThis.productImage = '53f649ffe2931e0b91000007/noimage.png'
_globalThis.vendorImage = '578fc93402282e4f18000003/noimage.png'
_globalThis.iconImage = '57acb51702282e3f00000003/noimage.ico'
_globalThis.shareImage = '57acb53a02282e3f00000007/noimage.png'
_globalThis.assetPath = '//asset.ibanquan.com/image/'
_globalThis.postImage = '581a3b0402282e2bcc000003/s.png'
_globalThis.captchaPath = '//captcha.ibanquan.com'

app.globalData = {
  shopName: ''
}

console.log('Run => ENV Init End')

export default _globalThis
