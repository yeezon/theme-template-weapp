
Page({

  data: {
    // isLoading: false,
    err: '',
    handle: '',
    oDiscount: {},
    oMarketing: {},
    products: [],
    oPaging: {
      items: 0,
      pages: 1,
      size: 20,
      view: 1
    },
    listStyle: 2,
    handle: '',
    loadedAll: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRouteParam(options)
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
    this.init()
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

  },

  // init
  init() {
    this.getData()
  },

  getData() {
    // d000006 d000005 d000007 d000004
    const _this = this
    const handle = this.data.handle || 'm000003'

    wx.showLoading({
      title: '加载中...',
      success() {
        // _this.setData({ isLoading: true })
      }
    })

    global.yhsd.sdk.discount.get(handle, ({ res: oRes }) => {

      wx.hideLoading({
        success() {
          // _this.setData({ isLoading: false })
        }
      })
      // src='https:{{product.feature_image.src}}'
      if (oRes.code === 200) {
        const _oData = ((oRes || {}).msg || {}).results || {}
        const products = _oData.products || []
        products.forEach(item => {
          item.feature_image = {
            src: item.src
          }
        })
        this.setData({
          nDiscountType: _oData.c_id || null,
          oDiscount: _oData.discount || {},
          oMarketing: _oData.info || {},
          products: products,
          oPaging: _oData.paging || {
            items: _oData.total_count || 0,
            pages: _oData.total_page || 1,
            size: 20,
            view: 1
          },
          loadedAll: true
        })
      } else {
        const err = this.err = '加载数据失败..'
        wx.showToast({
          title: err,
          icon: 'none'
        })
      }
    })
  },

  getRouteParam(opt) {
    this.setData({ handle: opt.handle })
  },

  // handleScrollBottom() {
  //   console.log("=> handleScrollBottom~")
  // }
})