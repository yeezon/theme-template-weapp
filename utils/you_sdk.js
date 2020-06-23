
const oConfig = require('../app.config.js')

const YOU_API_URL = oConfig.you_api_url || ''
const API_URL = oConfig.api_url || ''
const SITE_ALIAS = oConfig.alias || ''
const SITE_ID = oConfig.shop.site_id || ''

const APP_ID = (((wx.getAccountInfoSync && wx.getAccountInfoSync()) || {}).miniProgram || {}).appId || ''


// 登录
const Login = {
  get (oParams, cb) {
    const url = YOU_API_URL + '/applet/authorize'

    wx.request({
      url: url,
      header: {
        alias: SITE_ALIAS
      },
      data: {
        siteid: SITE_ID,
        appid: oParams.app_id || '',
        code: oParams.code || ''
      },
      complete (oRes) {
        // oRes.data 有可能是非对象
        let oData = oRes.data

        if (oRes.statusCode === 200 && (typeof oData) === 'object' && oData.code === 200) {
          cb(null, oData)
        } else {
          cb({
            httpCode: oRes.statusCode,
            errCode: oData.errcode || oData.code || '',
            errMsg: oData.errmsg || oData.message || '',
            data: oData.data || ''
          })
        }
      }
    })
  }
}

// 支付
const Payment = {
  get (oParams, cb) {
    const url = API_URL + '/payment/applet_go_pay'

    wx.request({
      url: url,
      header: {
        alias: SITE_ALIAS
      },
      data: {
        siteid: SITE_ID,
        appid: oParams.app_id || '',
        code: oParams.code || '',
        order_no: oParams.order_no || ''
        // payment_method_id: null
      },
      complete (oRes) {
        // oRes.data 有可能是非对象
        let oData = oRes.data

        if (oRes.statusCode === 200 && (typeof oData) === 'object' && oData.code === 200) {
          cb(null, oData)
        } else {
          cb({
            httpCode: oRes.statusCode,
            errCode: oData.errcode || oData.code || '',
            errMsg: oData.errmsg || oData.message || '',
            data: oData.data || ''
          })
        }
      }
    })
  }
}

// 获取手机号
const PhoneNumber = {
  get (oParams, cb) {
    const url = YOU_API_URL + '/applet/decrypt'

    wx.request({
      url: url,
      header: {
        alias: SITE_ALIAS
      },
      data: {
        siteid: SITE_ID,
        appid: APP_ID,
        code: oParams.code || '',
        encrypt_data: oParams.encrypt_data || '',
        iv: oParams.iv || '',
      },
      complete (oRes) {
        // oRes.data 有可能是非对象
        let oData = oRes.data

        if (oRes.statusCode === 200 && (typeof oData) === 'object' && oData.code === 200) {
          cb(null, oData)
        } else {
          cb({
            httpCode: oRes.statusCode,
            errCode: oData.errcode || oData.code || '',
            errMsg: oData.errmsg || oData.message || '',
            data: oData.data || ''
          })
        }
      }
    })
  }
}

module.exports = {
  payment: Payment,
  login: Login,
  phoneNumber: PhoneNumber
}
