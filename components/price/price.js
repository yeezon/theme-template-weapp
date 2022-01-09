
Component({
  externalClasses: ['custom-class'],
  properties: {
    symbol: {
      type: String,
      value: '￥'
    },
    value: {
      type: [Number, String],
      value: 0,
      observer(val) {
        this.init()
      }
    },
    type: {
      type: String,
      value: ''
    },
    icon: {
      type: String,
      value: ''
    },
    textColor: {
      type: String,
      value: '#fe384f'
    },
    delColor: {
      type: String,
      value: '#a6a6a6'
    },
    fontSize: {
      type: [Number, String],
      value: 24
    }
  },
  data: {
    price: 0
  },
  methods: {
    init: function () {
      let value = this.data.value || 0

      this.setData({
        price: this.formatMoney(value, 2)
      })
    },
    formatMoney(value, len) {
      return parseFloat(Math.abs(value / 100).toFixed(len))
    }
  },
  attached: function () {
    this.init()
  }
})