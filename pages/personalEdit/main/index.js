
Component({
  properties: {
    key: {
      type: String,
      value: ''
    },
    value: {
      type: String,
      value: ''
    }
  },
  data: {
    title: '修改',
    type: '',
    inputValue: '',
    oldVal: '',
    inputInfo: {
      label: '昵称',
      desc: '请输入内容'
    },
    oRules: {
      notify_email: [{
        validator(val) {
          if (val) {
            return global.yhsd.sdk.util.isEmail(val)
          } else {
            return true
          }
        },
        err: '格式不正确'
      }],
      notify_phone: [{
        validator(val) {
          if (val) {
            return global.yhsd.sdk.util.isMobile(val)
          } else {
            return true
          }
        },
        err: '格式不正确'
      }]
    }
  },
  lifetimes: {
    ready() {
      const key = this.properties.key || ''
      const value = this.properties.value || ''

      if (key) {
        this.setData({
          type: key,
          oldVal: value,
          inputValue: value
        })
  
        this.getInfo(key)
      } else {
        wx.showToast({
          title: '未知错误，请重新打开',
        })
      }
    }
  },
  methods: {
    getInfo(type) {
      let _res = {}
      if (!type) return
      switch (type) {
        case 'name':
          _res.label = '昵称'
          _res.desc = '输入昵称'
          _res.required = true
          break
        case 'notify_email':
          _res.label = '邮箱'
          _res.desc = '输入邮箱'
          _res.required = false
          break
        case 'notify_phone':
          _res.label = '手机号码'
          _res.desc = '输入手机号码'
          _res.required = false
          break
        case 'real_name':
          _res.label = '真实姓名'
          _res.desc = '输入真实姓名'
          _res.required = false
          break
        case 'indentity_card':
          _res.label = '身份证号码'
          _res.desc = '输入身份证号码'
          _res.required = false
          break
      }
      this.setData({
        title: '修改' + _res.label,
        inputInfo: _res
      })
    },
    // 输入
    bindKeyInput(e) {
      this.setData({
        inputValue: e.detail.value
      })
    },
    // 验证
    validateFn() {
      const oRules = this.data.oRules
      const type = this.data.type
      const val = this.data.inputValue
      const inputInfo = this.data.inputInfo
      let _err = ''
      if (oRules[type]) {
        for (let i = 0; i < oRules[type].length; i++) {
          if (!oRules[type][i].validator(val)) {
            _err = oRules[type][i].err
            break
          }
        }
      }
      if (inputInfo.required && !val.trim()) {
        _err = '不能为空'
      }
      if (_err) {
        wx.showToast({
          title: _err,
        })
        return false
      }
      return true
    },
    // 提交
    fnSubmit() {
      const _type = this.data.type
      const oldVal = this.data.oldVal
      const inputVal = this.data.inputValue

      if (!this.validateFn()) {
        return
      }

      if (inputVal !== oldVal) {
        const oNotify = {}

        oNotify[_type] = inputVal

        this.fnAccountSave(oNotify, err => {
          if (err) {
            wx.showToast({
              title: err
            })
          }
        })
      }
    },

    fnAccountSave(oNotify, cb) {
      wx.showLoading({
        title: '提交修改中...',
      })

      global.yhsd.sdk.account.save(oNotify, data => {
        wx.hideLoading()

        const oRes = (data || {}).res || {}
        let err = null

        if (oRes.code === 200) {
          wx.showToast({
            title: '修改成功',
            icon: 'none'
          })

          wx.navigateBack()
        } else {
          err = oRes.message || '修改用户数据获取出错'
        }

        cb && cb(err)
      })
    }
  }
})
