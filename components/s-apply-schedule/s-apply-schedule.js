// pages/services/components/s-apply-schedule.wxml.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: Number,
      value() {
        return 1
      }
    },
    status: {
      type: Number,
      value() {
        return 0
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    typeArr: []
  },

  observers: {
    status() {
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
      const type = this.data.type
      const status = this.data.status
      console.log(type)
      console.log(status)
      let typeArr = []
      switch (type) {
        case 0:
          typeArr = [
            {
              title: '提交申请',
              done: this.fnIncludes(status, [0, 1, 2, 3, 4, 5, 99])
            },
            {
              title: '商家处理',
              done: this.fnIncludes(status, [1, 2, 3])
            },
            {
              title: '退款完毕',
              done: this.fnIncludes(status, [2])
            }
          ]
          break
        case 1:
          typeArr = [
            {
              title: '提交申请',
              done: this.fnIncludes(status, [10, 11, 12, 13, 14, 15, 16, 17, 99])
            },
            {
              title: '商家处理',
              done: this.fnIncludes(status, [11, 12, 13, 14, 15])
            },
            {
              title: '买家退货',
              done: this.fnIncludes(status, [12, 13, 14])
            },
            {
              title: '退款完毕',
              done: this.fnIncludes(status, [14])
            }
          ]
          break
        case 2:
         typeArr = [
            {
              title: '提交申请',
              done: this.fnIncludes(status, [20, 21, 22, 23, 24, 25, 26, 27, 28, 99])
            },
            {
              title: '商家处理',
              done: this.fnIncludes(status, [21, 22, 23, 24, 25, 26, 27])
            },
            {
              title: '买家退货',
              done: this.fnIncludes(status, [22, 23, 24, 25, 27])
            },
            {
              title: '商家发货',
              done: this.fnIncludes(status, [24, 25])
            },
            {
              title: '买家收货',
              done: this.fnIncludes(status, [25])
            }
          ]
          break

        default:
          break
      }

      this.setData({
        typeArr: typeArr
      })
      console.log(typeArr)
    },
    fnIncludes(status, statusArr) {
      return statusArr.includes(status)
    }
  }
})
