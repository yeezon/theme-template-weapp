// components/quantity/quantity.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value: {
      type: Number,
      value: 1
    },
    max: {
      type: Number,
      value: 999999
    },
    min: {
      type: Number,
      value: 1
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    nVal: 1
  },

  observers: {
    'value': function (newVal, oldVal) {
      this.init()
    }
  },

  attached() {
    this.init()
  },

  /**
   * 组件的方法列表
   */
  methods: {
    init() {
      this.setData({
        nVal: this.data.value
      })
    },
    setNum(val) {
      this.setData({
        nVal: val
      })
      this.triggerEvent('input', val)
    },
    fnChange(e) {
      let _val = parseInt(e.detail.value)
      console.log(_val)
      if (!_val || _val < 1) {
        _val = 1
      }
      this.setNum(_val)
    },
    fnAdd() {
      if (this.data.nVal < this.data.max) {
        this.setNum(this.data.nVal + 1)
      }
    },
    fnMinus() {
      if (this.data.nVal > this.data.min) {
        this.setNum(this.data.nVal - 1)
      }
    }
  }
})
