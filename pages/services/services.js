// pages/services/services.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '售后管理',
    customer: null,
    type: ['全部', '退款', '退货', '换货'],
    date: ['近三个月', '今年内', '一年以上'],
    typeIdx: 0,
    dateIdx: 0,
    list: [],
    searchKey: '',
    query: {
      after_sale_type: '',
      created_later: '',
      created_earlier: '',
      size: 10,
      page: 1
    },
    hasMore: true,
    isLoading: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init()
  },

  init () {
    this.getShop()
    this.getCustomer()
    this.getList()
  },

  loadMore() {
    this.getList(this.data.searchKey !== '', false)

  },

  getList(searchKey = false, clear = false) {
    if (!this.data.hasMore || this.data.isLoading) return
    let query = this.data.query
    if (searchKey) {
      query = {
        search: this.data.searchKey,
        page: this.data.query.page,
        size: this.data.query.size
      } 
    }
    Object.keys(query).forEach(item => {
      !query[item] && delete query[item]
    })
    // wx.showLoading({
    //   title: '加载中...',
    // })
    this.setData({
      isLoading: true
    })
    global.yhsd.sdk.service.get(query, _data => {
      if(_data.res.code === 200) {
        const list = _data.res.trade_after_sales
        list.forEach(item => {
          item.canCancel = false
          item.refunded = false
          item.reject = false
          item.typeText = this.getItemType(item.after_sale_type)
          item.currentStatusText = this.getStatusText(item)
          const items = item.items

          items.forEach(_item => {
            _item.img_url = this.getImg(_item)
          })
        })
        const _query = this.data.query
        _query.page++
        this.setData({
          list: clear ? list : (this.data.list || []).concat(list || []),
          query: _query,
          isLoading: false,
          hasMore: list.length === _query.size
        })
        // wx.hideLoading()
      } else {
        this.setData({
          isLoading: false
        })
        // wx.hideLoading()
        wx.showToast({ title: _data.res.message || '未知错误', icon: 'none', duration: 1000 })
      }
    })
  },
  
  bindKeyInput: function (e) {
    this.setData({
      searchKey: e.detail.value
    })
  },

  // 搜索
  serachFn() {
    const query = this.data.query
    query.page = 1
    this.setData({
      query: query,
      hasMore: true
    })
    this.getList(true, true)
  },

  // 取消申请a
  cancelApply(e) {
    const id = e.currentTarget.dataset.id
    const text = e.currentTarget.dataset.text
    const _this = this
    wx.showModal({
      title: '取消申请',
      content: `确定取消${text}申请？`,
      success(res) {
        if (res.confirm) {
          global.yhsd.sdk.service.cancel({id: id}, ({res}) => {
            if (res.code === 200) {
              wx.showToast({
                title: '操作成功',
                icon: 'success',
                duration: 2000
              })
              const query = _this.data.query
              _this.setData({
                query: query,
                hasMore: true
              })
              _this.getList(false, true)
            }
          })
        } else if (res.cancel) {
          
        }
      }
    })
  },

  afterSaleTypeChange(e) {
    const map = {
      0: '',
      1: '0',
      2: '1',
      3: '2'
    }
    const query = this.data.query
    query.after_sale_type = map[e.detail.value]
    query.page = 1
    this.setData({
      typeIdx: e.detail.value,
      query: query,
      hasMore: true
    })
    this.getList(false, true)
  },

  applyDateChange(e) {
    const map = {
      0: '3',
      1: '12',
      2: '13'
    }
    const num = Number(map[e.detail.value])
    let createdLater = ''
    let createdEarlier = ''
    const query = this.data.query
    
    if (num === 13) {
      createdEarlier = ''
      createdLater = (new Date((new Date()).setMonth((new Date()).getMonth() - num))).getTime()
    } else {
      createdEarlier = (new Date((new Date()).setMonth((new Date()).getMonth() - num))).getTime()
      createdLater = (new Date()).getTime()
    }

    query.created_later = createdLater
    query.created_earlier = createdEarlier
    query.page = 1
    this.setData({
      dateIdx: e.detail.value,
      query: query,
      hasMore: true
    })
    this.getList(false, true)
  },

  // 订单状态
  getStatusText(item) {
    const afterSaleStatus = item.current_status
    let status
    switch (afterSaleStatus) {
      case 0:
      case 10:
      case 20:
        status = '待受理'
        item.canCancel = true
        break
      case 11:
      case 21:
        status = '待买家发货'
        break
      case 24:
        status = '待买家收货'
        break
      case 12:
      case 22:
        status = '待商家收货'
        break
      case 23:
        status = '待商家发货'
        break
      case 1:
      case 13:
        status = '退款中'
        break
      case 2:
      case 14:
        status = '退款完成'
        item.refunded = true
        break
      case 4:
      case 16:
        status = '退款失败'
        break
      case 25:
        status = '换货完成'
        break
      case 27:
        status = '换货关闭'
        break
      case 5:
      case 17:
      case 28:
        status = '超时售后关闭'
        break
      case 3:
      case 15:
      case 26:
        status = '审核不通过'
        item.reject = true
        break
      case 99:
        status = '已取消'
        break

      default:
        break
    }
    return status
  },

  // 售后类型
  getItemType(val) {
    let type
    switch (val) {
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

  getCustomer() {
    global.yhsd.sdk.account.current(({
      res
    }) => {
      if (res.customer) {
        this.setData({
          customer: res.customer,
          social_accounts: res.customer.social_accounts || []
        })
      } else {
        const pages = getCurrentPages()
        const curPage = pages[pages.length - 1]
        curPage.setData({
          showLoginModal: true
        })
      }
    })
  },

  getShop() {
    global.yhsd.sdk.shop.get('shop', ({
      res
    }) => {
      
    })
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