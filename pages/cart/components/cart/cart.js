// components/cart/cart.js

const computedBehavior = require('miniprogram-computed')

const app = getApp()

Component({

  behaviors: [computedBehavior],

  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    canActivated: false,
    navBarHeight: app.globalData.navBarHeight,
    err: '',
    nLock: 0,
    nLockUpdate: 0,
    nItemsSum: 0,
    nDisSum: 0,
    nDisSumHide: 0,
    items: [],
    discounts: [],
    oMarketing: {},
    skuList: [],
    oSkuMap: {},
    oProDisMap: {},
    oEventSkuMap: {},
    nCheck: 0,
    hasCommon: false, // 正常无营销活动商品
    hasUnCheck: false,
    hasErrItem: false,
    hasCommonDis: false
  },

  watch: {
    items () {
      this.initData()
    },
    discounts () {
      this.initData()
    }
  },

  attached() {
    // this.init()
  },

  pageLifetimes: {
    show: function () {
      // 页面被展示
      this.init()
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    init() {
      this.setData({
        err: '',
        nLock: 0,
        nLock: this.data.nLock + 1
      })
      this.getCart(err => {
        this.setData({
          nLock: this.data.nLock - 1
        })
        if (err) {
          // this.err = err
          wx.showToast({
            title: err,
            icon: 'none'
          })
        }
      })
      this.nLock += 1
      this.getDis(err => {
        this.nLock -= 1
        if (err) {
          // this.err = err
          wx.showToast({
            title: err,
            icon: 'none'
          })
        }
      })
    },
    update() {
      this.setData({
        err: '',
        nLockUpdate: 1
      })
      this.getCart(err => {
        this.setData({
          nLockUpdate: this.data.nLockUpdate - 1
        })
        if (err) {
          // this.err = err
          wx.showToast({
            title: err,
            icon: 'none'
          })
        }
      })
      this.setData({
        nLockUpdate: this.data.nLockUpdate + 1
      })
      this.getDis(err => {
        this.setData({
          nLockUpdate: this.data.nLockUpdate - 1
        })
        if (err) {
          // this.err = err
          wx.showToast({
            title: err,
            icon: 'none'
          })
        }
      })
    },
    initData() {
      this.initItems(() => {
        this.initDiscounts(() => {
          this.initMarketing()
        })
      })
    },
    initItems(cb) {
      const _skuList = []
      const fixSkus = []
      const _oSkuMap = {}
      this.setData({
        nItemsSum: 0,
        nCheck: 0,
        hasCommon: false,
        hasUnCheck: false,
        hasErrItem: false
      })
      for (const oItem of this.data.items) {
        _skuList.push(oItem.variant_id)
        if (oItem.available) {
          if (oItem.is_check) {
            this.setData({
              nItemsSum: this.data.nItemsSum + oItem.line_price,
              nCheck: this.data.nCheck + 1
            })
          } else {
            this.setData({
              hasUnCheck: true
            })
          }
        } else {
          this.setData({
            hasErrItem: true
          })

          if (oItem.is_check) {
            fixSkus.push(oItem.variant_id)
          }
        }
        _oSkuMap[oItem.variant_id] = oItem
      }

      this.setData({
        skuList: _skuList,
        oSkuMap: _oSkuMap
      }, () => {
        this.fnFixCheck(fixSkus)
        cb && cb()
      })
    },
    initDiscounts(cb) {
      this.setData({
        hasCommonDis: false
      })

      // oProDisMap
      const _oProDisMap = {}
      let _nDisSum = 0
      for (const dis of this.data.discounts) {
        if (dis.range_type === 'partial') {
          for (const id of dis.range_products) {
            _oProDisMap[id] = dis.id
          }
        } else {
          this.setData({
            hasCommonDis: true
          })
        }
        _nDisSum += (dis.discount_amount || 0)
      }

      this.setData({
        nDisSum: _nDisSum,
        oProDisMap: _oProDisMap
      }, () => {
        cb && cb()
      })

    },
    initMarketing(cb) {
      // oEventSkuMap
      const _oEventSkuMap = {}
      let _nDisSumHide = 0

      for (const oItem of ((this.data.oMarketing || {}).variants || [])) {
        // 新活动才需要映射
        if (oItem.c_id !== 4) {
          _oEventSkuMap[oItem.variant_id] = oItem
          _nDisSumHide += ((oItem.origin_price - oItem.event_price) * oItem.available_quantity) || 0
        }
      }

      this.setData({
        nDisSumHide: _nDisSumHide,
        oEventSkuMap: _oEventSkuMap
      }, () => {
        this.fnCheckCommon(cb)
      })      
    },
    fnCheckDis(nSku) {
      // 旧活动基于商品 ID，新活动基于 SKU ID
      // 需要剔除未选 SKU
      // 新活动（c_id !== 4）才会在 oEventSkuMap 里

      const _oSku = this.data.oSkuMap[nSku] || {}
      const _nProID = _oSku.product_id || null
      const _isEventSku = (nSku in this.data.oEventSkuMap)

      return (_nProID in this.data.oProDisMap) && !_isEventSku && _oSku.is_check
    },
    fnCheckCommon(cb) {
      const _oSkuMap = this.data.oSkuMap || {}
      const _skuList = this.data.skuList || []
      let _hasCommon = false

      for (const nSku of _skuList) {
        if (_oSkuMap[nSku] && _oSkuMap[nSku].available && !this.fnCheckDis(nSku)) {
          _hasCommon = true
          break
        }
      }

      this.setData({
        hasCommon: _hasCommon
      }, () => {
        cb && cb()
      })
    },
    getCart(cb) {
      // 避免落地此页导致多余请求
      // this.$store.dispatch('setCartChecked', {
      //   isChecked: true
      // })

      global.yhsd.sdk.cart.get(data => {
        let err = null
        if (data && data.res) {
          if (data.res.code === 200) {
            this.setData({
              items: data.res.cart.items || []
            })
          } else {
            err = data.res.message || '购物车数据获取出错'
          }
        } else {
          err = '购物车数据请求异常'
        }
        cb && cb(err)
      })
    },
    getDis(cb) {
      global.yhsd.sdk.discount.matchCart(data => {
        let err = null
        if (data && data.res) {
          if (data.res.code === 200) {
            this.setData({
              oMarketing: data.res.marketing || {}, // 须放在 discounts 赋值前面，避免 initData 数据不准确
              discounts: data.res.discounts || []
            })
          } else {
            err = data.res.message || '活动数据获取出错'
          }
        } else {
          err = '活动数据请求异常'
        }
        cb && cb(err)
      })
    },
    getDisTypeDesc(type) {
      let desc = '活动'
      if (type === 'amount_off') {
        desc = '满减'
      } else if (type === 'percent_off') {
        desc = '满折'
      } else if (type === 'coupon') {
        desc = '满赠券'
      }
      return desc
    },
    fnDisDesc(e) { 
      const oDis = e.currentTarget.dataset.odis
      let desc = ''
      const type = oDis.discount_type
      const details = oDis.details

      const fnAmount = (val) => {
        return Math.abs(val / 100).toFixed(2)
      }
      const fnPercent = (val) => {
        return (val / 10)
      }

      if (type === 'amount_off') {
        for (const oActive of details) {
          desc += `<br>${(oActive.type_id === 1 ? '每满' : '满')} ￥${fnAmount(oActive.active_amount)} 减 ￥${fnAmount(oActive.discount_amount)}`
        }
      } else if (type === 'percent_off') {
        for (const oActive of details) {
          if (oActive.type_id === 1) {
            desc += `<br>满 ${oActive.active_amount} 件 打 ${fnPercent(oActive.discount_percent)} 折`
          } else {
            desc += `<br>满 ￥${fnAmount(oActive.active_amount)} 打 ${fnPercent(oActive.discount_percent)} 折`
          }
        }
      } else if (type === 'coupon') {
        for (const oActive of details) {
          desc += `<br>满 ￥${fnAmount(oActive.active_amount)} 赠「${oActive.coupon_group_name}」优惠券`
        }
      }

      wx.showModal({
        title: oDis.name,
        content: desc.replace('<br>', ''),
      })

      // this.$alert
      // this.$confirm({
      //   title: oDis.name,
      //   msg: desc.replace('<br>', '')
      // }).catch(oError => {})
    },
    fnFixCheck(fixSkus) {
      // 纠正购物车（无效但被勾选了）
      const _length = (fixSkus || []).length || 0

      // 暂时不用 fnRun，防止 unCheckOne API 报错导致死循环

      // const fnRun = (_index) => {
      //   const nSku = fixSkus[_index]

      //   this.setCheck({
      //     variant_id: nSku,
      //     is_check: false
      //   }, err => {
      //     if (err) {
      //       wx.showToast({
      //         title: err,
      //         icon: 'none'
      //       })
      //     }

      //     if (_index < 1) {
      //       this.update()
      //     } else {
      //       fnRun(_index - 1)
      //     }
      //   })
      // }

      if (_length > 0) {
        // fnRun(_length - 1)

        // 直接全部取消，让客户重新选择
        global.yhsd.sdk.cart.unCheckAll(data => {
          if (/^(200|212)$/.test(data.res.code)) {
            this.update()
          } else {
            wx.showToast({
              title: '修正失败，请稍后再访问',
              icon: 'none'
            })
          }
        })
      }
    },
    fnAllCheck() {
      if (this.data.hasUnCheck) {
        global.yhsd.sdk.cart.checkAll(data => {
          if (data.res.code === 200 || data.res.code === 212) {
            this.update()
          } else {
            wx.showToast({
              title: '全选失败',
              icon: 'none'
            })
          }
        })
      } else {
        global.yhsd.sdk.cart.unCheckAll(data => {
          if (/^(200|212)$/.test(data.res.code)) {
            this.update()
          } else {
            wx.showToast({
              title: '全不选失败',
              icon: 'none'
            })
          }
        })
      }
    },
    fnDelCheck() {
      const self = this
      wx.showModal({
        title: '删除商品',
        content: '确定要删除所选商品吗？',
        success(res) {
          if (res.confirm) {
            const delSkuList = []
            for (const oItem of self.data.items) {
              if (oItem.available && oItem.is_check) {
                delSkuList.push(oItem.variant_id)
              }
            }
            if (delSkuList.length) {
              let nIndex = delSkuList.length - 1
              const _fn = (nSku) => {
                global.yhsd.sdk.cart.removeOne({
                  variant_id: nSku
                }, data => {
                  if (nIndex > 0) {
                    nIndex -= 1
                    _fn(delSkuList[nIndex])
                  } else {
                    self.update()
                  }
                })
              }
              _fn(delSkuList[nIndex])
            }
          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        }
      })
    },
    fnClear() {
      const self = this
      wx.showModal({
        title: '删除商品',
        content: '确定要清除无效商品吗？',
        success(res) {
          if (res.confirm) {
            const delSkuList = []
            for (const oItem of self.data.items) {
              if (!oItem.available) {
                delSkuList.push(oItem.variant_id)
              }
            }
            if (delSkuList.length) {
              let nIndex = delSkuList.length - 1
              const _fn = (nSku) => {
                global.yhsd.sdk.cart.removeOne({
                  variant_id: nSku
                }, data => {
                  if (nIndex > 0) {
                    nIndex -= 1
                    _fn(delSkuList[nIndex])
                  } else {
                    this.update()
                  }
                })
              }
              _fn(delSkuList[nIndex])
            }
          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        }
      })
    },
    setCheck(oItem, cb) {
      const fn = data => {
        let err = null
        if (data && data.res) {
          if (data.res.code !== 200 && data.res.code !== 212) {
            err = data.res.message || '选择商品出错'
          }
        } else {
          err = '选择商品请求异常'
        }
        cb && cb(err)
      }
      const _oItem = {
        variant_id: oItem.variant_id
      }
      if (oItem.is_check) {
        global.yhsd.sdk.cart.checkOne(_oItem, fn)
      } else {
        global.yhsd.sdk.cart.unCheckOne(_oItem, fn)
      }
    },
    fnCheck(oItem) {
      this.setCheck(oItem.detail, err => {
        if (err) {
          wx.showToast({
            title: err,
            icon: 'none'
          })
        }
        this.update()
      })
    },
    setQuantity(oItem, cb) {
      global.yhsd.sdk.cart.quantity(oItem, data => {
        let err = null
        if (data && data.res) {
          if (data.res.code !== 200 && data.res.code !== 212) {
            err = data.res.message || '设置商品数量出错'
          }
        } else {
          err = '设置商品数量请求异常'
        }
        cb && cb(err)
      })
    },
    fnQuantity(oItem) {
      this.setQuantity(oItem.detail, err => {
        if (err) {
          wx.showToast({
            title: err,
            icon: 'none'
          })
        }
        this.update()
      })
    },
    delItem(nSku, cb) {
      global.yhsd.sdk.cart.removeOne({
        variant_id: nSku
      }, data => {
        let err = null
        if (data && data.res) {
          if (data.res.code !== 200 && data.res.code !== 212) {
            err = data.res.message || '删除商品出错'
          }
        } else {
          err = '删除商品请求异常'
        }
        cb && cb(err)
      })
    },
    fnDelItem(val) {
      const self = this
      wx.showModal({
        title: '删除商品',
        content: '确定要删除该商品吗？',
        success(res) {
          if (res.confirm) {
            self.delItem(val.detail, err => {
              if (err) {
                wx.showToast({
                  title: err,
                })
              }
              self.update()
            })
          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        }
      })
      // this.$confirm({
      //   title: '删除商品',
      //   msg: '确定要删除该商品吗？'
      // }).then(() => {
      //   this.delItem(nSku, err => {
      //     if (err) {
      //       this.$toast.info(err)
      //     }
      //     this.update()
      //   })
      // }).catch(() => {
      //   // window.console.log('DelItem')
      // })
    },
    fnItemChange(oItem, oItemOld) {
      console.log(oItem)
      // 无需修改数量
      // variant_id, quantity
      if (oItem.variant_id !== oItemOld.variant_id) {
        global.yhsd.sdk.cart.add({
          variant_id: oItem.variant_id,
          quantity: oItem.quantity || 1,
          is_check: true
        }, data => {
          if (data.res.code === 200 || data.res.code === 212) {
            global.yhsd.sdk.cart.removeOne({
              variant_id: oItemOld.variant_id
            }, data => {
              if (data.res.code === 200 || data.res.code === 212) {
                this.update()
              } else {
                // 删除失败提示没什么必要
              }
            })
          } else {
            this.$toast.info('修改商品属性失败，请重试')
          }
        })
      }
    },
    fnSubmit() {
      // 不支持免登陆下单，提交前判断是否登录
      if (this.data.nCheck) {
        wx.navigateTo({
          url: '../../pages/checkout/index'
        })
        // this.$router.push('/account/create_order')
        // if (this.isSigned) {
        //   this.$router.push('/account/create_order')
        // } else {
        //   window.AuthPopup.on('login')
        // }
      } else {
        wx.showToast({
          title: '请先选择商品',
          icon: 'none'
        })
      }
    },
    fnGoBuy() {
      wx.switchTab({
        url: '../../pages/discovery/discovery',
      })
    }

  }
})