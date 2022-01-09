
export default function (cb) {
  // wx.showLoading({
  //   title: '正在登录...'
  // })

  wx && wx.login({
    success: ({ code }) => {
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
            type: 'weixin'
          }, (_res) => {
            if (_res.res.code === 200) {
              // wx.hideLoading()

              // 保存 Token
              wx.setStorageSync('app_session', {
                'token': _res.res.token
              })

              global.yhsd.SESSION_TOKEN = _res.res.token

              // cb && cb('', _res)
            } else {
              // wx.hideLoading()

              wx.showToast({
                title: '登录失败',
                icon: 'none'
              })
            }
          })
        } else {
          // wx.hideLoading()

          wx.showToast({
            title: '登录失败',
            icon: 'none'
          })
        }
      })
    },
    fail (res) {
      // cb && cb(res)
    }
  })
}
