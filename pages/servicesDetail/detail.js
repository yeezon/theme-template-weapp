// pages/servicesDetail/detail.js
import shipments from '../../utils/shipments.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'售后进度',
    trade_after_sale_id: '',
    order_no: '',
    info: {},
    shipments,
    shipment: '',
    shipmentNo: '',
    shipmentIdx: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      order_no: options.order_no,
      trade_after_sale_id: options.sale_id
    })
    this.getInfo()
  },
  
  getInfo() {
    const id = this.data.trade_after_sale_id
    wx.showLoading({
      title: '加载中...',
    })
    global.yhsd.sdk.service.get(id, ({ res }) => {
      if (res.code === 200) {
        const info = res
        info.typeText = this.getTypeText(info)
        info.refund_trade_items.forEach(item => {
          item.imgUrl = this.getImg(item)
        })
        this.setData({
          info: info
        })
        wx.hideLoading()
      } else {
        wx.showToast({
          title: res.message || '未知错误',
          icon: 'none',
          duration: 1000
        })
        wx.hideLoading()
      }
    })
  },

  fnShipmentChange(val) {
    const index = val.detail.value
    this.setData({
      shipmentIdx: index,
      shipment: this.data.shipments[index]
    })
  },

  bindShipmentNoInput(e) {
    this.setData({
      shipmentNo: e.detail.value
    })
  },

  // 更新物流信息
  fnUpdateShip() {
    const shipment = this.data.shipment
    const shipmentNo = this.data.shipmentNo
    if (!shipment) {
      wx.showToast({
        title: '请选择快递公司',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if (!shipmentNo) {
      wx.showToast({
        title: '请输入快递单号',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if (!/\w+/.test(shipmentNo)) {
      wx.showToast({
        title: '请输入正确的快递单号',
        icon: 'none',
        duration: 1000
      })
      return
    }
    const oData = {
      id: Number(this.data.trade_after_sale_id),
      customer_shipment: shipment,
      customer_shipment_no: shipmentNo
    }

    global.yhsd.sdk.service.update(oData, ({ res }) => {
      if (res.code === 200) {
        this.getInfo()
      } else {
        wx.showToast({
          title: res.message || '未知错误',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },

  // 取消申请
  fnCancelApply() {
    const _this = this
    wx.showModal({
      title: '取消申请',
      content: `确定取消${this.data.info.typeText}申请？`,
      success(res) {
        if (res.confirm) {
          global.yhsd.sdk.service.cancel({ id: _this.data.trade_after_sale_id }, ({ res }) => {
            if (res.code === 200) {
              const info = _this.data.info
              info.trade_after_sale.current_status = res.data.status
              _this.setData({
                info: info
              })
              wx.showToast({
                title: '取消成功',
                icon: 'success',
                duration: 2000
              })
              _this.getInfo()
            }
          })
        } else if (res.cancel) {
         
        }
      }
    })
  },

  // 确认收货
  fnConfirmShip() {
    const _this = this
    wx.showModal({
      title: '确认收货',
      content: `确认是否收到商品？`,
      success(res) {
        if (res.confirm) {
          global.yhsd.sdk.service.update({ id: _this.data.trade_after_sale_id, action: 'recive' }, ({ res }) => {
            if (res.code === 200) {
              const info = _this.data.info
              info.trade_after_sale.current_status = res.data.status
              _this.setData({
                info: info
              })
              _this.getInfo()
            }
          })
        } else if (res.cancel) {

        }
      }
    })
  },

  getTypeText(data) {
    const afterSaleType = data.trade_after_sale && data.trade_after_sale.after_sale_type
    let type
    switch (afterSaleType) {
      case 0:
        type = '退款'
        break
      case 1:
        type = '退货退款'
        break
      case 2:
        type = '换货'
        break

      default:
        type = '退款'
        break
    }
    return type
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