// pages/discounts/components/limit.js
import timestampToTime from "../../../../utils/timestampToTime.js"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    marketing: {
      type: Object,
      value: {}
    }
  },


  /**
   * 组件的初始数据
   */
  data: {
    endTime: '',
    nowTime: '',
    endTimeFrom: '',
    endTimeTo: '',
    timeType: 'entirety',
    isMob: false,
    now: false,
    start: '',
    end: '',
  },

  observers: {
    marketing() {
      this.update()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    update() {
      this.initMarketing()

      if (this.data.endTime < this.data.nowTime) {
        this.fnEnd()
      }
    },
    initMarketing() {
      const _oMarketing = this.data.marketing || {}
      
      this.setData({
        nowTime: new Date().getTime(),
        endTime: new Date(_oMarketing.end_at).getTime(),
        start: timestampToTime(new Date(_oMarketing.start_at).getTime()),
        end: timestampToTime(new Date(_oMarketing.end_at).getTime())
      })
      if (new Date(_oMarketing.start_at).getTime() - this.data.nowTime > 0) {
        this.setData({
          now: true
        })
      }
    },
    fnStart() {
      this.setData({
        now: false
      })
    },
    fnEnd() {
      // this.triggerEvent('end')
    }
  }
})
