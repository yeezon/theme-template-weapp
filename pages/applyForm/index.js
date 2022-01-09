// pages/orderApply/applyForm.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '售后申请',
    type: '',
    shipmentStatus: [
      { name: '0', value: '未收到货', checked: true },
      { name: '1', value: '已收到货' }
    ],
    reasonList1: ['不喜欢/不要了', '空包裹', '快递/物流一直未送到', '快递/物流无跟踪记录', '货物破损已拒签'],
    reasonList2: ['我不想要了', '退运费', '颜色/图案/款式与商品描述不符', '功能/效果不符', '质量问题', '少件/漏发', '包装/商品破损', '假冒品牌', '发票问题', '卖家发错货', '其他'],
    reasonList3: ['商品质量问题', '商品错发', '包装破损', '商品漏发少件'],
    reasonIndex: '',
    order_no: '',
    trade_after_sale_id: '',
    info: {},
    reason: '',
    selectedIndex: 0,
    formData: {
      trade_after_sale_id: '',
      type: 0,
      reason: '',
      refund_amount: 0,
      customer_remark: '',
      shipment_status: 0,
      image_ids: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const sale_id = options.sale_id
    const orderno = options.orderno
    const formData = this.data.formData
    formData.trade_after_sale_id = sale_id
    this.setData({
      order_no: orderno,
      trade_after_sale_id: sale_id,
      formData: formData
    })
    this.getInfo()
  },

  fnComfirn() {
    let oData = {
      id: this.data.trade_after_sale_id,
      type: this.data.info.trade_after_sale && this.data.info.trade_after_sale.after_sale_type,
      reason: this.data.formData.reason,
      refund_amount: Number(Number(this.data.formData.refund_amount * 100).toPrecision(14)),
      customer_remark: this.data.formData.customer_remark,
      shipment_status: this.data.formData.shipment_status,
      image_ids: this.data.formData.image_ids
    }
    if (oData.type === 0) {
      if (!oData.reason) {
        wx.showToast({ title: `请选择${this.data.type}原因`, icon: 'none', duration: 1000})
        return
      }
      if (!String(oData.refund_amount)) {
        wx.showToast({ title: `请输入退款金额`, icon: 'none', duration: 1000 })
        return
      }
      if (!/^([1-9]\d{0,9}|0)([.]?|(\.\d{1,2})?)$/.test(oData.refund_amount)) {
        wx.showToast({ title: `请正确输入退款金额`, icon: 'none', duration: 1000 })
        return
      }
      if (oData.refund_amount > this.data.info.trade_after_sale.max_refund_amount) {
        wx.showToast({ title: `退款金额不能超过最大可退金额`, icon: 'none', duration: 1000 })
        return
      }
    }

    if (oData.type === 1) {
      if (!oData.reason) {
        wx.showToast({ title: `请选择${this.data.type}原因`, icon: 'none', duration: 1000 })
        return
      }
      if (!String(oData.refund_amount)) {
        wx.showToast({ title: `请输入退款金额`, icon: 'none', duration: 1000 })
        return
      }
      if (!/^([1-9]\d{0,9}|0)([.]?|(\.\d{1,2})?)$/g.test(oData.refund_amount)) {
        wx.showToast({ title: `请正确输入退款金额`, icon: 'none', duration: 1000 })
        return
      }
      if (oData.refund_amount > this.data.info.trade_after_sale.max_refund_amount) {
        wx.showToast({ title: `退款金额不能超过最大可退金额`, icon: 'none', duration: 1000 })
        return
      }
      if (!oData.customer_remark) {
        wx.showToast({ title: `请填写退货说明`, icon: 'none', duration: 1000 })
        return
      }
      if (!oData.image_ids) {
        wx.showToast({ title: `请上传图片`, icon: 'none', duration: 1000 })
        return
      }
    }

    if (oData.type === 2) {
      if (!oData.reason) {
        wx.showToast({ title: `请选择${this.data.type}原因`, icon: 'none', duration: 1000 })
        return
      }
      if (!oData.customer_remark) {
        wx.showToast({ title: `请填写换货说明`, icon: 'none', duration: 1000 })
        return
      }
      if (!oData.image_ids) {
        wx.showToast({ title: `请上传图片`, icon: 'none', duration: 1000 })
        return
      }
    }
    // url="/pages/servicesDetail/detail?order_no={{item.trade_no}}&sale_id={{item.id}}"
    wx.showLoading({
      title: '提交中...',
      mask: true
    })
    global.yhsd.sdk.service.save(oData, ({ res }) => {
      if (res.code === 200) {
        // this.$router.push(
        //   `/account/services/orders/${this.order_no}/apply_schedule?sale_id=${
        //   this.trade_after_sale_id
        //   }`
        // )
        wx.hideLoading()
        wx.redirectTo({
          url: `/pages/servicesDetail/detail?order_no=${this.data.order_no}&sale_id=${this.data.trade_after_sale_id}`
        })
      } else {
        wx.hideLoading()
        wx.showToast({ title: res.message || '未知错误', icon: 'none', duration: 1000 })
      }
    })
  },


  getInfo() {
    const id = this.data.trade_after_sale_id
    wx.showLoading({
      title: '加载中...',
    })
    global.yhsd.sdk.service.get(id, ({ res }) => {
      // console.log(res)
      if (res.code === 200) {
        const _res = res
        _res.refund_trade_items.forEach(item => {
          item.imgUrl = this.getImg(item)
        })
        this.setData({
          info: _res
        })
        this.getType()
        wx.hideLoading()
      } else {
        wx.hideLoading()
        wx.showToast({
          title: res.message || '未知错误',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },

  getType() {
    const afterSaleType = this.data.info.trade_after_sale && this.data.info.trade_after_sale.after_sale_type
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
    this.setData({
      type: type
    })
  },

  inputFn(e) {
    const formData = this.data.formData
    formData.refund_amount = e.detail.value
    this.setData({
      formData: formData
    })
  },

  textareaFn(e) {
    const formData = this.data.formData
    formData.customer_remark = e.detail.value
    this.setData({
      formData: formData
    })
  },

  fnShipmentStatusChange(val) {
    const formData = this.data.formData
    formData.shipment_status = Number(val.detail.value)
    this.setData({
      formData: formData
    })
  },

  fnReasonChange(evt) {
    const index = evt.detail.value
    const name = evt.currentTarget.dataset.name
    const formData = this.data.formData
    formData.reason = this.data[name][index]
    this.setData({
      formData: formData,
      reasonIndex: index
    }) 
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