// pages/orderList/orderList.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    titile: '订单列表',
    navBarHeight: app.globalData.navBarHeight,
    timestamp_diff: wx.getStorageSync('timestamp_diff'),
    orders: [],
    nShowType: 0,
    oStatus: {
      status: null,
      payment_status: null,
      shipment_status: null
    },
    oPaging: {
      items: 0,
      pages: 1,
      size: 6,
      view: 1
    },
    isLoading: false,
    loadedAll: false,
    isHideLoadMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var self = this
    wx.showLoading({
      title: '加载中'
    })
    self.setData({
      isLoading: true,
      nShowType: parseInt(options.status) || 0
    }, function(){
      self.init()
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.init()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  init: function() {
    this.getData(false, err => {
      wx.hideLoading()
      if (err) {
        wx.showToast({
          title: err,
          icon: 'none'
        })
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  loadMore: function(e) {
    // 全部加载完成 不再触发请求
    if (this.data.loadedAll || !this.data.isHideLoadMore || !this.data.orders.length) return
    this.setData({
      isHideLoadMore: false
    }, function(){
      this.getData(true, err => {
        wx.hideLoading()
        if (err) {
          wx.showToast({
            title: err,
            icon: 'none'
          })
        }
      })
    })
  },

  // 获取订单数据
  getData: function(isAdd, cb) {
    wx.showLoading({
      title: '加载中..'
    })
    const self = this
    const _oConfig = {}
    const _oPaging = this.data.oPaging
    const _oStatus = this.checkStatus(this.data.nShowType)
    console.log('this.data.nShowType', this.data.nShowType)
    console.log('_oStatus', _oStatus)
    for (let key in _oStatus) {
      const _val = _oStatus[key]
      if (_val || _val === 0) {
        _oConfig[key] = _val
      }
    }
    if (isAdd) {
      _oConfig.size = _oPaging.size
      _oConfig.page = _oPaging.view + 1
    } else {
      _oConfig.size = 6
      _oConfig.page = 1
    }
    //
    global.yhsd.sdk.order.get(_oConfig, data => {
      this.self = this
      let err = null
      if (data && data.res) {
        if (data.res.code === 200) {
          let _orders = []
          let _paging = {}
          let _loadedAll = data.res.orders.length ? false : true
          if (isAdd) {
            _orders = self.data.orders.concat(data.res.orders)
          } else {
            _orders = data.res.orders
          }
          _paging = data.res.paging
          for (const oOrder of _orders) {
            for (const oShipment of oOrder.shipments) {
              for (const oItem of oShipment.line_items) {
                // oItem["feature_image_src"] = "https://asset.ibanquan.com/image/5a654cbf9bedc42f33000c61/s_180x180.png"
                oItem["feature_image_src"] = self.getImg(oItem.feature_image)
              }
            }
          }
          self.setData({
            orders: _orders,
            oPaging: _paging,
            isLoading: false,
            isHideLoadMore: true,
            loadedAll: _loadedAll
          })
        } else {
          err = data.res.message || '订单数据获取出错'
        }
      } else {
        err = '订单数据请求异常'
      }
      cb && cb(err)
    })
  },
  // 根据状态，组合不同的参数
  checkStatus: function(type){
    const _oStatus = this.data.oStatus
    if (type === 1) {
      _oStatus.status = 0
      _oStatus.payment_status = 0
      _oStatus.shipment_status = null
    } else if (type === 2) {
      _oStatus.status = 0
      _oStatus.payment_status = 2
      _oStatus.shipment_status = null
    } else if (type === 3) {
      _oStatus.status = 4
      _oStatus.payment_status = null
      _oStatus.shipment_status = null
    } else {
      this.nShowType = 0
      _oStatus.status = null
      _oStatus.payment_status = null
      _oStatus.shipment_status = null
    }
    return _oStatus
  },
  // 筛选
  filterChange: function(e) {
    const type = e.currentTarget.dataset.id || 0
    if (type === this.data.nShowType) return
    this.upOrders(type)
  },
  // 刷新
  upOrders: function(type) {
    this.setData({
      isLoading: true,
      nShowType: type || 0,
      orders: []
    }, function () {
      // 获取筛选数据
      this.getData(false, err => {
        wx.hideLoading()
        if (err) {
          wx.showToast({
            title: err,
            icon: 'none'
          })
        }
      })
    })
  },
  /**
   * 获取图片
   */
  getImg (oImg) {
    let url = ''
    if (oImg.image_id) {
      url = this.imgURL(oImg.image_id, '180x180')
    }
    return url
  },
  imgURL (img, size = 'w300h300') {
    // Base64 SVG 像素比例占位图
    if (typeof img === 'object') {
      return global.yhsd.sdk.util.getImageUrl(img.image_id, img.image_name, size, img.image_epoch)
    } else {
      return global.yhsd.sdk.util.getImageUrl(img, 's.png', size)
    }
  },
  /**
   * 查看物流信息
   */
  // getLogisticsInfo: function(e) {
  //   const data = e.currentTarget.dataset
  //   wx.navigateTo({
  //     url: `../logisticsInfo/logisticsInfo?shipment_code=${data.code}&shipment_number=${data.number}&shipment_name=${data.name}`
  //   })
  // },
  // 支付超时 状态改变成订单关闭
  endcount: function(e) {
    // console.log('endcount', e)
    // const index = e.target.id
    const index = e.currentTarget.dataset.index
    // 5 为订单支付过期
    this.setData({
      [`orders[${index}].status`]: 5,
      [`orders[${index}].status_desc`]: "支付过期"
    })
  },
  // 查看订单详情
  toOrderDetails: function(e) {
    const self = this
    const id = e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: `../orderDetails/orderDetails?id=${id}&index=${index}`
    })
  },
  getOrder: function (id) {
    let oOrder = {}
    const _orders = this.data.orders
    if(id){
      for (let item of _orders) {
        if (id === item.order_no) {
          oOrder = item
        }
      }
    }
    return oOrder
  },
  // 再次购买
  buyAgain: function(e) {
    const id = e.currentTarget.dataset.id
    const oOrder = this.getOrder(id)
    if (oOrder.shipments) {
      const items = []
      for (let oShip of oOrder.shipments) {
        for (let item of oShip.line_items) {
          items.push({
            variant_id: item.variant_id,
            quantity: item.quantity
          })
        }
      }
      let _length = items.length
      let nErr = 0
      const _fn = (item, index) => {
        global.yhsd.sdk.cart.add({
          variant_id: item.variant_id,
          quantity: item.quantity,
          is_check: true
        }, data => {
          let err = null
          if (data && data.res) {
            if (data.res.code === 200) {
              // this.$store.dispatch('getCartCount', { isUpdate: true }) // 错误方法，todo 刷新购物车数据
            } else {
              err = data.res.message || '处理失败'
            }
          } else {
            err = '处理请求异常'
          }
          if (err) nErr += 1
          const nNext = index + 1
          if (nNext < _length) {
            _fn(items[nNext], nNext)
          } else {
            if (nErr) {
              wx.showToast({
                title: err,
                icon: 'none'
              })
            }
            wx.switchTab({
              url: `../../pages/cart/cart`
            })
          }
        })
      }
      if (_length > 0) {
        _fn(items[0], 0)
      }
    }
  },
  // 取消订单
  cancelOrder: function(e) {
    const self = this
    const id = e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index
    // 
    wx.showModal({
      title: '取消订单',
      content: '是否取消该订单？',
      showCancel: true,
      cancelText: '我再想想',
      confirmText: '确认取消',
      confirmColor: '#fe384f',
      success: function(res) {
        if (res.confirm) {
          // 
          wx.showLoading({
            title: '正在取消订单...'
          })
          global.yhsd.sdk.order.cancel({
            order_no: id,
            reason: "其他" // 暂时不填写原因，减少不必要的交互
          }, data => {
            wx.hideLoading()
            let err = null
            if (data && data.res) {
              if (data.res.code === 200) {
                self.upOrders()
              } else {
                err = data.res.message || '取消订单失败'
              }
            } else {
              err = '取消订单请求异常'
            }
            if (err) {
              wx.showToast({
                title: err,
                icon: 'none'
              })
            }
          })
        }
      },
      fail: function(res) {
        wx.showToast({
          title: '操作失败，请重试',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  // 
  payOrder: function(e) {
    const id = e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: `../orderDetails/orderDetails?id=${id}&index=${index}`
    })
  },
  // 调起微信支付
  // wxPay: function(pay, index) {
  //   const self = this
  //   wx.requestPayment({
  //     timeStamp: pay.timeStamp,
  //     nonceStr: pay.nonceStr,
  //     package: pay.package,
  //     signType: pay.signType,
  //     paySign: pay.paySign,
  //     success: function(res) {
  //       wx.showToast({
  //         title: '支付成功',
  //         icon: 'none'
  //       })
  //       self.setData({
  //         [`orders[${index}].status`]: 1
  //       })
  //     },
  //     fail: function(err) {
  //       wx.showToast({
  //         title: '支付已取消',
  //         icon: 'none'
  //       })
  //     }
  //   })
  // },
  // 分享订单
  // shareOrder(e) {
  //   const id = e.currentTarget.dataset.id
  //   wx.navigateTo({
  //     url: `../../pages/shareOrder/shareOrder?id=${id}`
  //   })
  // },

  // 确认收货
  confirmReceipt: function(e) {
    const self = this

    // create order info
    const id = e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index
    const order = {
      "order_no": self.data.orders[index].order_no,
      "shipment_id": id + ''
    }

    wx.showModal({
      title: '确认收货',
      content: '是否确认收货，完成该订单？',
      showCancel: true,
      cancelText: '取消',
      confirmText: '确认',
      confirmColor: '#fe384f',
      success: function(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在确认订单...'
          })
          global.yhsd.sdk.order.receive(order, data => {
            wx.hideLoading()
            if (data && data.res) {
              if (data.res.code === 200) {
                self.init()
              } else {
                wx.showToast({
                  title: '确认失败，请重试',
                  icon: 'none'
                })
              }
            } else {
              wx.showToast({
                title: '确认失败，请重试',
                icon: 'none'
              })
            }
          })
        }
      },
      fail: function(res) {
        wx.showToast({
          title: '操作失败，请重试',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  gotoIndex: function() {
    wx.switchTab({
      url: '../index/index'
    })
  },

  toSocialSync() {
    wx.navigateTo({
      url: '../socialSync/socialSync'
    })
  }
})