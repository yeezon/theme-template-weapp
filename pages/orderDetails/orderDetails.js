// pages/orderDetails/orderDetails.js
const YouSDK = require('../../utils/you_sdk.js')

const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    titile: '订单详情',
    navBarHeight: app.globalData.navBarHeight,
    isIpx: app.globalData.isIpx,
    id: null,
    oOrder: {},
    oCoupon: {},
    order_index: -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('options', options)
    this.setData({
      id: options.id,
      order_index: options.index || -1
    })

    this.init()
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  // init 
  init: function() {
    const id = this.data.id
    this.getData(id, err => {
      if (err) {
        this.$toast.info(err)
      }
    })
  },

  getIamgeURL (oImage, size) {
    return global.yhsd.sdk.util.getImageUrl(oImage.image_id || '', oImage.image_name || '', oImage.image_size || size || '', oImage.image_epoch || '')
  },

  /**
   * 获取订单信息
   */
  getData: function(id, cb) {
    const self = this
    wx.showLoading({
      title: '加载中'
    })
    global.yhsd.sdk.order.get(id, data => {
      wx.hideLoading()
      let err = null
      if (data && data.res) {
        if (data.res.code === 200) {
          let oOrder = data.res.order || {}
          for (const oShipment of oOrder.shipments) {
            for (const oItem of oShipment.line_items) {
              oItem["feature_image_src"] = self.getIamgeURL(oItem.feature_image, '70x70') || ''
            }
          }
          self.setData({
            oOrder: oOrder
          })
          self.fnRecordsInit(oOrder)
        } else {
          err = data.res.message || '订单数据获取出错'
        }
      } else {
        err = '订单数据请求异常'
      }
      cb && cb(err)
    })
  },
  fnRecordsInit (oOrder) {
    var self = this
    const _records = oOrder.preferential_records
    let oCoupon = {}
    if (_records && _records.length) {
      for (let oRecord of _records) {
        if (oRecord.type === 'coupon') {
          oCoupon = Object.assign({}, oRecord)
          self.setData({
            oCoupon: oCoupon
          })
        }
      }
    }
  },
  // 支付超时 状态改变成订单关闭
  endcount: function(e) {
    // console.log('endcount', e)
    // const index = e.target.id
    const index = e.currentTarget.dataset.index
    // 5 为订单支付过期
    this.setData({
      [`oOrder.status`]: 5,
      [`oOrder.status_desc`]: "支付过期"
    })
  },
  // 再次购买
  buyAgain: function(e) {
    const self = this
    const oOrder = self.data.oOrder
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
    const id = self.data.oOrder.order_no
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
                self.init()
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
  goPay: function(e) {
    const self = this
    const _orderNo = self.data.oOrder.order_no

    if (_orderNo) {
      wx.login({
        success (oRes) {
          if (oRes.code) {
            const _appId = (((wx.getAccountInfoSync && wx.getAccountInfoSync()) || {}).miniProgram || {}).appId || ''
  
            YouSDK.payment.get({
              app_id: _appId,
              code: oRes.code,
              order_no: _orderNo
            }, function (oErr, data) {
              if (oErr) {
                wx.showToast({
                  title: '获取支付信息失败，请稍后再试',
                  icon: 'none'
                })
              } else {
                const _data = data.object

                wx.requestPayment({
                  timeStamp: _data.timeStamp,
                  nonceStr: _data.nonceStr,
                  package: _data.package,
                  signType: _data.signType,
                  paySign: _data.paySign,
                  success (oRes) {
                    self.init()

                    wx.showToast({
                      title: '支付成功',
                      icon: 'none'
                    })
                  },
                  fail (oRes) {
                    wx.showToast({
                      title: '支付失败，请稍后再试',
                      icon: 'none'
                    })
                  }
                })
              }
            })
          } else {
            self.setData({
              err: '获取用户登录态失败，请重试',
              isPaying: false
            })
            // console.log(oRes.errMsg)
          }
        },
        fail (oRes) {
          self.setData({
            err: '获取用户登录态失败，请重试',
            isPaying: false
          })
          // console.log(oRes.errMsg)
        }
      })

      self.setData({
        err: '',
        isPaying: true
      })
    } else {
      self.setData({
        err: '缺少相关参数，请返回重试'
      })
    }
  },
  // payOrder: function(e) {
  //   const self = this
  //   const id = self.data.order.id
  //   // 
  //   wx.showLoading({
  //     title: '正在支付订单...'
  //   })
  //   app.api.orderPay(id)
  //     .then(res => {
  //       wx.hideLoading()
  //       self.wxPay(res.data)
  //     })
  // },
  // // 调起微信支付
  // wxPay: function(pay) {
  //   const self = this
  //   const pages = getCurrentPages()
  //   const prevPage = pages[pages.length - 2]
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
  //         ['order.status']: 2
  //       })
  //       // 改变订单列表订单状态
  //       if (prevPage) {
  //         prevPage.setData({
  //           [`orders[${self.data.order_index}].status`]: 2
  //         })
  //       }
  //     },
  //     fail: function(err) {
  //       wx.showToast({
  //         title: '支付已取消',
  //         icon: 'none'
  //       })
  //     }
  //   })
  // },
  // 确认收货
  confirmReceipt: function(e) {
    const self = this
    let order = {
      "order_no": self.data.oOrder.order_no,
      "shipment_id": e.currentTarget.dataset.id + ''
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
  /**
   * 查看物流
   * 
   */
  getLogisticsInfo: function(e) {
    const number = e.currentTarget.dataset.number
    const name = e.currentTarget.dataset.name
    let url = encodeURIComponent(e.currentTarget.dataset.url)
    wx.navigateTo({
      url: `../logisticsInfo/logisticsInfo?shipment_url=${url}&shipment_number=${number}&shipment_name=${name}`
    })
  },
  /**
   * 复制订单编号
   */
  copyNumber: function(e) {
    const data = e.currentTarget.dataset.no
    wx.setClipboardData({
      data: data,
      success: function(res) {
        // wx.showToast({
        //   title: '复制成功',
        //   icon: 'none',
        //   duration: 1000,
        //   mask: false
        // })
      }
    })
  }
})