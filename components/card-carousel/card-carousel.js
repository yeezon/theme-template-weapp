// components/card-carousel/card-carousel.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    images: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    curIndex: 0,
    changType: 0,
    windowWidth: wx.getSystemInfoSync().windowWidth,
    wrapHeight: 0,
    startX: 0,
    startY: 0,
    lock: false
  },
  ready() {
    this.fnSetIndex(0)
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // getSystemInfoSync() {
    //   const sysInfo = wx.getSystemInfoSync()
    //   this.setData({
    //     windowWidth: sysInfo.windowWidth
    //   })
    // },
    bindtouchstart(e) {
      this.setData({
        startX: e.touches[0].pageX,
        startY: e.touches[0].pageY,
      })
    },
    catchtouchmove(e) {
      // const endX = e.touches[0].pageX
      const endY = e.touches[0].pageY
      // const diffX = endX - this.data.startX
      const diffY = endY - this.data.startY
      if (diffY > 0) {
        this.setData({
          changType: -1
        })
        return
      } else if (diffY < 0) {
        this.setData({
          changType: +1
        })
        return
      }
    },
    catchtouchend() {
      if (this.data.lock) return
      // console.log(this.data.changType)
      const imagesLength = this.data.images.length || 0
      const curIndex = this.data.curIndex + this.data.changType
      if (curIndex < 0) return
      if (curIndex >= imagesLength){
        this.triggerEvent('lastMove')
        return
      }
      this.fnSetIndex(curIndex)
    },
    fnTap(e) {
      if (this.data.lock) return
      const id = e.currentTarget.id
      const type = e.currentTarget.dataset.type
      const index = e.currentTarget.dataset.index
      const active = e.currentTarget.dataset.active
      this.fnSetIndex(index)
      if (active && id) {
        if (type === 2) {
          wx.navigateTo({
            url: `../collection/collection?id=${id}`
          })
        } else if (type === 3) {
          wx.navigateTo({
            url: `../product/index?handle=${id}`
          })
        }
      } else {
        
      }
    },
    fnSetIndex(index) {
      this.triggerEvent('change')

      this.setData({
        lock: true,
        curIndex: index,
        wrapHeight: (this.data.images.length - index - 1) * 100
      })

      setTimeout(() => {
        this.setData({
          lock: false
        })
      }, 500)
    },
    toPage(type, id) {}
  }
})