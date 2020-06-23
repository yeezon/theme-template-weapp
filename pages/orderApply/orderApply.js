// pages/servicesApply/servicesApply.js
const CodeOk = 200
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "售后申请",
    hasCheck: false,
    noSendGoods: true,
    noExchangeGoods: true,
    type: 1,
    // orderno: '2019110423458168339',
    orderno:'',
    orderData: [],
    sProduct: {},
    canAfterSale: [],
    nCheck: 0,
    hasUnCheck: false,
    sProductSum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: options.type,
      orderno: options.orderNo
    })
    this.getData()
  },

  getData() {
    wx.showLoading({
      title: '加载中...',
    })
    global.yhsd.sdk.service.match_trade_items({
      order_no: this.data.orderno,
      type: this.data.type
    },data => {
        if (data.res.code === CodeOk) {
          const shipments = data.res.shipments || []
          let oData = []
          if (shipments.length) {
            shipments.forEach((shipment) => {
              shipment.items.forEach((item) => {
                item.imgUrl = this.getImg(item)
                if (!item.trade_after_sale_id) {
                  oData.push(item)
                }
              })
            })
            this.setData({
              canAfterSale: oData
            })
            wx.hideLoading()
          }
          this.setData({
            orderData: shipments
          })
          this.initPorductData()
        } else {
          wx.hideLoading()
          wx.showToast({
            title: data.res.message || '未知错误',
            icon: 'none',
            duration: 1000
          })
        }
      }
    )
  },

  initPorductData() {
    this.data.orderData.forEach((items, index) => {
      for (const item of items.items) {
        const sProduct = this.data.sProduct
        sProduct[item.id] = item
        this.setData({
          sProduct: sProduct
        })
        if (items.support_this_service) {
          if (item.is_check) {
            let nCheck = this.data.nCheck
            nCheck += 1
            let sProductSum = this.data.sProductSum
            sProductSum += item.item_amount
            this.setData({
              nCheck: nCheck,
              sProductSum: sProductSum
            })
          } else {
            this.setData({
              hasUnCheck: true
            })
          }
        }
      }
    })
  },

  fnCheck(select) {
    const id = select.detail.id
    const sProduct = this.data.sProduct
    sProduct[id].is_check = !sProduct[id].is_check
    this.setData({
      sProduct: sProduct
    })
    this.upCheckLocal()
  },

  fnAllCheck() {
    const orderData = this.data.orderData
    const sProduct = this.data.sProduct
    orderData.forEach((items, index) => {
      items.items.forEach((item, index) => {
        if (!item.trade_after_sale_id) {
          item.is_check = this.data.hasUnCheck
        }
      })
    })
    Object.keys(sProduct).forEach(item => {
      sProduct[item].is_check = this.data.hasUnCheck
    })
    this.setData({
      orderData: orderData,
      sProduct: sProduct
    })
    this.upCheckLocal()
  },

  upCheckLocal() {
    this.setData({
      nCheck: 0,
      hasUnCheck: false,
      sProductSum: 0
    })

    this.data.orderData.forEach((items, index) => {
      for (const item of items.items) {
        if (items.support_this_service) {
          if (!item.trade_after_sale_id) {
            if (item.is_check) {
              let nCheck = this.data.nCheck
              nCheck += 1
              let sProductSum = this.data.sProductSum
              sProductSum += item.item_amount
              this.setData({
                nCheck: nCheck,
                sProductSum: sProductSum
              })
            } else {
              this.setData({
                hasUnCheck: true
              })
            }
          }
          // if (item.is_check) {
          //   this.nCheck += 1
          //   this.sProductSum += item.item_amount
          // } else {
          //   this.hasUnCheck = true
          // }
        }
      }
    })
  },

  FnNext() {
    let selectItem = []
    this.data.orderData.forEach((items, index) => {
      for (const item of items.items) {
        if (items.support_this_service) {
          if (item.is_check && !item.trade_after_sale_id) {
            selectItem.push(item.id)
          }
        }
      }
    })
    global.yhsd.sdk.service.per_save(
      {
        order_no: this.data.orderno,
        type: Number(this.data.type),
        trade_item_ids: selectItem.join(',')
      },
      data => {
        if (data.res.code === CodeOk) {
          wx.navigateTo({
            url: `./applyForm?sale_id=${data.res.id}&orderno=${this.data.orderno}`
          })
        } else {
          wx.showToast({
            title: data.res.message,
            icon: 'none',
            duration: 1000
          })
        }
      }
    )
  },

  /**
* 获取图片
*/
  getImg(oImg) {
    let url = ''
    if (oImg.image_id) {
      url = this.imgURL(oImg.image_id, '180x180')
    }
    return url
  },
  imgURL(img, size = 'w200h200') {
    // Base64 SVG 像素比例占位图
    if (typeof img === 'object') {
      return global.yhsd.sdk.util.getImageUrl(img.image_id, img.image_name, size, img.image_epoch)
    } else {
      return global.yhsd.sdk.util.getImageUrl(img, 's.png', size)
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})