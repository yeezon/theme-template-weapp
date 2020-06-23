Component({
  data: {
    selfShow: false,
    captchaValue: ''
  },

  properties: {
    show: {
      type: Boolean,
      observer(val) {
        this.setData({ selfShow: val })
      }
    },
    captchaUrl: {
      type: String,
      observer(val) {
        if (val) {
          this.setData({ captchaUrl: val })
        }
      }
    },
    captchaId: {
      type: String,
      observer(val) {
        if (val) {
          this.setData({ captchaId: val })
        }
      }
    },
    mobile: {
      type: Number,
      observer(val) {
        if (val) {
          this.setData({ mobile: val })
        }
      }
    }
  },

  methods: {
    handleInputChange(e) {
      this.setData({ captchaValue: e.detail.value })
    },

    handleConfirmTap() {
      const {
        mobile,
        captchaId: captcha_id,
        captchaValue: captcha_value
      } = this.data
      const data = { mobile, captcha_id, captcha_value }

      global.yhsd.sdk.account.sendMobileValidateSms(data, ({ res: newRes }) => {
        const _this = this
        const { code, message } = newRes
        
        if (code === 200) {
          wx.showToast({
            title: '获取验证码成功',
            icon: 'success',
            success() {
              _this.setData({ selfShow: false })
            }
          })
          this.triggerEvent('countdown')
        } else if (code === 201) {
          wx.showToast({
            title: message,
            icon: 'none',
            success: () => {
              this.triggerEvent('regetcaptcha')
              this.setData({ captchaValue: '' })
            }
          })
        } else {
          wx.showToast({
            title: message,
            icon: 'none'
          })
        }
      })
    },

    handleCloseTap() {
      this.triggerEvent('closemodal')
    },
    
    handleRegetCaptcha() {
      this.triggerEvent('regetcaptcha')
    }
  }

  // observers: {
  //   show(value) {
  //   }
  // }
})