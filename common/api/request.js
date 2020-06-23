
class Request {
  constructor () {
    // this.$header = {}
  }

  responseResolve (oRes) {
    return oRes || {}
  }

  responseReject (oError) {
    const oRes = oError.response || {}
    let oErr = oError

    switch (oRes.status) {
      case 400: // 业务错误
        oErr = new Error(oRes.data || '业务错误，请联系开发人员')
        break
      case 401: // 权限错误
        oErr = new Error('请重新登录')
        // 统一处理
        break
      default:
        break
    }

    return oErr // Error 对象
  }

  request ({ method, header, url, data }) {
    return new Promise((resolve, reject) => {
      wx.request({
        method: method,
        header: header,
        url: url,
        data: data,
        success: (oRes => {
          if (oRes.statusCode === 200) {
            resolve(this.responseResolve((oRes || {}).data || {}))
          } else {
            console.log((oRes || {}).errMsg || '小程序请求失败，请重试/重开')

            reject(this.responseReject(new Error('小程序请求失败，请重试/重开')))
          }
        }),
        fail: (oRes => {
          console.log((oRes || {}).errMsg || '小程序请求失败，请重试/重开')

          reject(this.responseReject(new Error('小程序请求失败，请重试/重开')))
        })
      })
    })
  }
}

export default Request
