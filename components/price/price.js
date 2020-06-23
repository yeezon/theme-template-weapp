// components/price/price.js
Component({
  externalClasses: ['custom-class'],
  /**
   * 组件的属性列表
   */
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

  /**
   * 组件的初始数据
   */
  data: {
    price: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    init: function() {
      let value = this.data.value || 0
        this.setData({
          price: this.formatMoney(value, 2)
        })
      // if (value) {
      // }
    },
    /**
     * @param value 价格（单位分）
     * @param len 保留的小数长度（默认2）
     */
    formatMoney(value, len) {
      // let n = len || 2
      // let s = value / 100
      // n = n > 0 && n <= 20 ? n : 2
      // s = parseFloat((s + '').replace(/[^\d.-]/g, '')).toFixed(n) + ''
      // let l = s.split('.')[0].split('').reverse()
      // let r = s.split('.')[1]
      // let t = ''
      // for (let i = 0; i < l.length; i++) {
      // t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? ',' : '')
      //   t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? '' : '')
      // }
      // return t.split('').reverse().join('') + (Number(r) === 0 ? '' : '.' + r)
      // return parseFloat(s).toFixed(n)
      return parseFloat(Math.abs(value / 100).toFixed(len))
    }
  },
  attached: function() {
    this.init()
  }
})