
Component({
  properties: {},
  data: {
    title: '个人中心',
    unpay_count: 0,
    receive_count: 0
  },
  lifetimes: {
    attached() {
      // this.getOrderCount()
    }
  },
  methods: {
    onCheckSession(evt) {
      this.goPage(evt)
    },
    // getOrderCount() {
    //   this.setData({
    //     unpay_count: 0,
    //     receive_count: 0
    //   })
    // },
    goPage(evt) {
      // console.log(evt)

      const url = evt.currentTarget.dataset.url
      const type = evt.currentTarget.dataset.query || null

      wx.navigateTo({
        url: `${url}?type=${type}`
      })
    },
    goOrders(evt) {
      // console.log(evt)

      const status = evt.currentTarget.dataset.id || 0

      wx.navigateTo({
        url: `/pages/orders/index?status=${status}`
      })
    }
  }
})
