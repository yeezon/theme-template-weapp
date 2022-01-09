
Component({
  behaviors: ['wx://form-field-group'],
  properties: {
    data: {
      type: Object,
      value() {
        return {}
      }
    }
  },
  data: {
    oConfig: {},
    value: ''
  },
  lifetimes: {
    attached() { },
    ready() {
      this.init()
    },
    moved() { },
    detached() { },
  },
  methods: {
    init() {
      let _oConfig = {}

      try {
        _oConfig = JSON.parse(this.properties.data?.column_config || '{}')
      } catch (err) { }

      if (_oConfig.version === '0.0.1' && _oConfig.values.length > 0) {
        this.setData({
          oConfig: _oConfig
        })
      } else {
        console.log('无数据项 或 数据版本不匹配')
      }
    },
    fnRadioChange(evt) {
      // console.log('fnRadioChange =>', evt.detail.value)

      this.setData({
        value: evt.detail.value || ''
      })
    }
  }
})
