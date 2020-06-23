// components/badge/badge.js
Component({
  externalClasses: ['custom-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    value: {
      type: [Number, String],
      value: 0
    },
    max: {
      type: [Number, String],
      value: 100
    },
    type: {
      type: String,
      value: 'number'
    },
    _system_: {
      type: String,
      value: ''
    },
    color: {
      type: String,
      value: '#fff'
    },
    backgroudColor: {
      type: String,
      value: '#ff3950'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  },
  attached: function () {
    let host = this;
    let data = host.data;
    let max = parseInt(data.max, 10);
    let value = parseInt(data.value, 10);

    if (value && max && value > max) {
      host.setData({
        value: max + '+'
      })
    }

    wx.getSystemInfo && wx.getSystemInfo({
      success: function (res) {
        host.setData({
          _system_: !!~res.system.indexOf('Android') ? 'android' : 'ios'
        });
      }
    });
  }
})
