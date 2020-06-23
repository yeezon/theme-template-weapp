// components/count-down/count-down.js
Component({
  // 外部样式类
  externalClasses: ['ms-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    startDate: {
      type: String,
      value: ''
    },
    endDate: {
      type: String,
      value: ''
    },
    showDay: {
      type: [Boolean, String],
      value: true
    },
    showHour: {
      type: [Boolean, String],
      value: true
    },
    showMin: {
      type: [Boolean, String],
      value: true
    },
    showSec: {
      type: [Boolean, String],
      value: true
    },
    showMs: {
      type: [Boolean, String],
      value: true
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    time: {
      d: 0,
      h: 0,
      m: 0,
      s: 0,
      ms: 0
    }
  },
  // 
  ready() {
    this.initCountdown()
  },

  // 页面销毁时执行
  detached() {
    // 清除一下定时器
    this._timer && clearInterval(this._timer)
  },
  /**
   * 组件的方法列表
   */
  methods: {
    countTime: function(startTime) {
      const self = this
      // self.data.endDate = "Thu May 23 2019 11:05:00 GMT+0800" // 测试倒计时
      const endDate = new Date(self.data.endDate); //设置截止时间
      const endTime = endDate.getTime();

      const nNowTime = Date.now() || 0
      const nStartTime = Date.parse(startTime || '') || 0
      const isStarted = nNowTime >= (nStartTime || 0)

      if (isStarted) {
        self.triggerEvent('start')
      }

      // 计算时间差
      const leftTime = endTime - startTime;
      let d, h, m, s, ms;
      if (leftTime >= 0) {
        d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
        h = Math.floor(leftTime / 1000 / 60 / 60 % 24);
        m = Math.floor(leftTime / 1000 / 60 % 60);
        s = Math.floor(leftTime / 1000 % 60);
        ms = Math.floor(leftTime % 1000 / 100);

        // 小程序不显示 秒 和 毫秒
        m += 1

        self.setData({
          time: {
            d: self.formatZero(d),
            h: self.formatZero(h),
            m: self.formatZero(m),
            s: self.formatZero(s),
            ms: ms
          }
        })
      } else {
        // console.log('已结束')
        clearInterval(self._timer)
        self.triggerEvent('endcount')
        return
      }
      // 

    },
    initCountdown: function() {
      const self = this
      const start = new Date();
      let startTime = start.getTime();
      self._timer = setInterval(() => {
        startTime += 100;
        self.countTime(startTime)
      }, 100);
    },
    formatZero(val) {
      return val < 10 ? `0${val}` : val;
    },
  }
})