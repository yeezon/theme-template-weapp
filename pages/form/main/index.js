
Component({
  properties: {
    handle: {
      type: String,
      value: ''
    }
  },
  data: {
    title: '表单',
    isLoading: false,
    errorTip: '',
    oForm: {},
    formColumns: [],
    formErrors: [],
    isSuccess: false
  },
  lifetimes: {
    attached() { },
    ready() {
      this.getForm()
    },
    moved() { },
    detached() { },
  },
  methods: {
    getForm() {
      const oSDK = global?.yhsd?.sdk || {}

      const config = this.properties.handle || ''

      if (config) {
        this.setData({
          isLoading: true,
          errorTip: ''
        })

        oSDK.form?.get(config, data => {
          this.setData({
            isLoading: false
          })

          if (data.res.code === 200) {
            this.setData({
              oForm: data.res?.site_form || {},
              formColumns: data.res?.site_form_columns || {}
            })
          } else {
            this.setData({
              oForm: {},
              formColumns: [],
              errorTip: '请求异常，请稍后再试'
            })
          }
        })
      } else {
        this.setData({
          errorTip: '缺少表单标识'
        })
      }
    },
    fnSubmit(evt) {
      console.log('fnSubmit =>', evt.detail.value)

      const oSDK = global?.yhsd?.sdk || {}

      const oSendData = {}
      const errors = []

      var oSetData = evt.detail.value || {}

        // 以 site_form_columns 数据项为准
        ; (this.data.formColumns || []).forEach(function (oColumn) {
          if (oColumn.column_type === 'checkbox') {
            var _values = []
            var _val = ''

            var _key = ''
            for (_key in oSetData) {
              if (_key.indexOf(oColumn.id) > -1) {
                _val = oSetData[_key] || ''

                if (_val) {
                  _values.push(_val)
                }
              }
            }

            if (oColumn.column_required && !(_values.length > 0)) {
              errors.push('请填写：' + oColumn.column_name)
            }

            oSendData[oColumn.id] = _values
          } else {
            _val = oSetData[oColumn.id] || ''

            if (oColumn.column_required && !_val) {
              errors.push('请填写：' + oColumn.column_name)
            }

            oSendData[oColumn.id] = _val
          }
        })

      if (errors.length > 0) {
        this.setData({
          formErrors: errors || []
        })
      } else {
        this.setData({
          formErrors: []
        })

        // checkbox 数组值转换成 String
        var _sendKey = ''
        for (_sendKey in oSendData) {
          if (Array.isArray(oSendData[_sendKey])) {
            // oSendData[_sendKey] = JSON.stringify(oSendData[_sendKey])
            oSendData[_sendKey] = (oSendData[_sendKey] || []).join()
          }
        }

        if ((this.data.oForm || {}).status === 0) {
          this.setData({
            formErrors: ['表单为发布状态时才能提交数据']
          })
        } else {
          oSDK.form?.submit({
            handle: this.properties.handle || '',
            data: oSendData
          }, data => {
            if (data.res.code === 200) {
              this.setData({
                isSuccess: true
              })
            } else {
              this.setData({
                formErrors: ['操作失败，请稍后再试']
              })
            }
          })
        }
      }
    }
  }
})