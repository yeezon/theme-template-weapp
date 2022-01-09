import _debounce from "../../../../utils/debounce"
import Request from "../../../../common/api/request"

import { SMS_TIME_INTERVAL, TIPS, CODE_START_TIME } from "./static"

Component({
  properties: {},
  data: {
    tel: '',
    code: '',
    rts: 0, // ResidualTimeStamp[剩余时间],
    canIGetCode: true,
    captchaPath: '',
    globalCaptchaPath: global.captchaPath || '//captcha.ibanquan.com',
    captchaId: 0,
    isShowCaptchaModal: false,
    telTip: '',
    codeTip: ''
  },
  methods: {
    validateInput: _debounce(function (type, value) {
      let tip = ''
      const regExp = {
        TEL: /^1(3|4|5|6|7|8|9)\d{9}$/, // 手机号格式
        LEN: /^\d{4}$/ // 4位数验证码
      }

      switch (type) {
        case 'tel':
          tip = regExp.TEL.test(value) ? '' : TIPS.TEL_REG
          break
        case 'code':
          tip = regExp.LEN.test(value) ? '' : TIPS.CODE_REG
          break
      }

      this.setData({
        [`${type}Tip`]: tip
      }) 
    }, 100),

    handleInputChange(e) {
      const inputType = e.target.dataset.type
      const inputValue = e.detail.value

      this.setData({
        [inputType]: inputValue
      }, () => {
        this.validateInput(inputType, inputValue)
      })
    },

    handleGetCode() {
      const { canIGetCode } = this.data
      if (!canIGetCode) return

      if (!this.data.tel) {
        this.setData({ telTip: TIPS.TEL_NOT_NULL })
        return
      } else {
        this._getCode()
      }
    },

    handleSubmitTap() {
      const {
        tel: account,
        code: verify_code
      } = this.data
      const data = { account, verify_code }

      if (!account) {
        this.setData({ telTip: TIPS.TEL_NOT_NULL })
        return
      } else if (!verify_code) {
        this.setData({ codeTip: TIPS.CODE_NOT_NULL })
        return
      } else {
        // vcodeLogin
        global.yhsd.sdk.account.socialSync(data, ({ res: newRes }) => {
          const { code, message } = newRes

          if (code === 200) {
            wx.showToast({
              title: '绑定成功',
              icon: 'success',
              success: () => {
                wx.switchTab({ url: '/pages/account/index' })
              }
            })
          } else if (code === 201) {
            wx.showToast({
              title: message,
              icon: 'none'
            })
          } else {
            // 其他状态码错误
            wx.showToast({
              title: `${code}: ${message}`,
              icon: 'none'
            })
          }
        })
      }
    },

    handleRegetCaptcha() {
      this._getGraphValidateCode()
    },

    handleCountDown() {
      wx.setStorageSync(CODE_START_TIME, Date.now())
      this._countDown()
    },

    handleCloseModal() {
      this.setData({ isShowCaptchaModal: false })
    },

    // SELF METHOD CALL
    _init() {
      const codeStartTime = wx.getStorageSync(CODE_START_TIME)
      const curTime = Date.now()
      const diffTime = Math.ceil((curTime - codeStartTime) / 1000)
      const newTotalTime = SMS_TIME_INTERVAL - diffTime

      if (codeStartTime) {
        this.setData({ rts: newTotalTime })
        this._countDown()
      } else {
        this.setData({ rts: SMS_TIME_INTERVAL })
      }
    },
    
    _setCanIGetCode(is) {
      this.setData({ canIGetCode: is })
    },

    // GET SMS CODE
    _getCode() {
      const { tel: mobile } = this.data

      global.yhsd.sdk.account.sendMobileValidateSms({ mobile }, ({ res: newRes }) => {
        const { code, message } = newRes
        if (code === 200) {
          wx.showToast({
            title: '获取验证码成功',
            icon: 'success'
          })
          wx.setStorageSync(CODE_START_TIME, Date.now())
          this._countDown()
        } else if (code === 214) {
          this._getGraphValidateCode()
        } else {
          wx.showToast({
            title: message
          })
        }
      })
    },

    _getGraphValidateCode() {
      const now = Date.now()
      const method = 'GET'
      const header = {}
      const url = `https://captcha.ibanquan.com/?callback=jsonp15&rnd=${now}`

      wx.showLoading({ title: '获取图形验证码...', mask: true })
      try {
        new Request().request({ method, header, url }).then(res => {
          wx.hideLoading()
          const data = JSON.parse(this._parseJsonpRes(res))
  
          if (data) {
            this.setData({
              isShowCaptchaModal: true,
              captchaPath: data.path || '',
              captchaId: data.id || 0
            })
          } else {
            wx.showToast({
              title: '获取图形验证码失败',
              icon: 'none'
            })
          }
        })
      } catch (error) {
        console.log('=> error', error)
      }
    },

    _parseJsonpRes(res) {
      let result = undefined
      const filterRegExp = /\s|\n/g // 过滤空格和换行符
      const getDataRegExp = /\((.*)\)/g // 取callback中的参数

      res = res.replace(filterRegExp, '')
      result = getDataRegExp.exec(res)
      
      return JSON.parse(JSON.stringify(result[1]))
    },

    _countDown() {
      let { rts } = this.data

      this._setCanIGetCode(false) // 开始计时，显示倒计时60s
      this._timer = setInterval(() => {
        rts = rts - 1
        if (rts >= 0) {
          this.setData({ rts })
        } else {
          clearTimeout(this._timer)
          this.setData({ rts: SMS_TIME_INTERVAL })
          wx.removeStorageSync(CODE_START_TIME)
          this._setCanIGetCode(true) // 恢复正常显示
          this._timer = null
        }
      }, 1000)
    },

    onGetPhoneNumber (evt) {
      const self = this
      const oData = evt.detail || {}

      if (oData.encryptedData && oData.iv) {
        wx.login({
          success: ({code}) => {
            global.yhsd.sdk.weapp.phoneNumber({
              code: code || '',
              encrypt_data: oData.encryptedData || '',
              iv: oData.iv || ''
            }, oRes => {
              const _oRes = oRes.res || {}
  
              if (_oRes.code === 200) {
                const _oData = _oRes.data || {}
  
                const _phoneNumber = _oData.phoneNumber || ''
  
                self.setData({
                  tel: _phoneNumber
                }, () => {
                  self.validateInput('tel', self.data.tel)
                })
              } else {
                wx.showToast({
                  title: '获取手机号失败，请稍后再试',
                  icon: 'none'
                })
              }
            })
          },
          fail: function(res) {
            wx.showToast({
              title: '获取手机号失败，请稍后再试',
              icon: 'none'
            })
          }
        })
      }
    }

  },

  lifetimes: {
    attached() {
      this._init()
    }
  }
})
