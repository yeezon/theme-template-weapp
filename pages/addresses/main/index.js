
// To-Do List
// tipsShow 地址授权提示相关逻辑去掉

import Area from '../../../utils/area' // 暂时先这样

Component({
  properties: {
    type: {
      type: String,
      value: 'list'
    },
    addressid: { // URL StringQuery 是 id
      type: Number,
      value: null
    }
  },
  data: {
    isLoading: false,
    title: '收货地址',
    addresType: 'list',
    addresses: [],
    nNowAddressId: null,
    // tipsShow: false
  },
  observers: {
    type (val) {
      this.setSetting()
    },
    addressid (val) {
      this.setSetting()
    }
  },
  lifetimes: {
    attached () {
      this.init()
    },
    detached () {
      if (this.data.addresType === 'select') {
        this.setGlobalAddressData()
      }
    }
  },
  pageLifetimes: {
    show () {
      this.init()
    },
    hide () {
      // 导航返回的时候没触发
      // this.setGlobalAddressData()
    }
  },
  methods: {
    init () {
      this.setSetting()
      this.getData()
    },
    setSetting: function () {
      this.setData({
        addresType: this.properties.type || 'list',
        nNowAddressId: parseInt(this.properties.addressid) || null
      })
    },
    setGlobalAddressData () {
      const _addresses = this.data.addresses || []
      const _nNowAddressId = this.data.nNowAddressId || null
      let oAddress = {}

      for (const _oAddress of _addresses) {
        if (_oAddress.id === _nNowAddressId) {
          oAddress = _oAddress

          break
        }
      }

      global.$$setAddressData = oAddress

      // console.log('global.$$setAddressData =>', oAddress)
    },
    getData: function (cb) {
      if (this.data.isLoading) return

      const self = this
      // 
      wx.showLoading({
        title: '加载中...',
        mask: false
      })

      this.setData({
        isLoading: true
      })

      global.yhsd.sdk.address.get(({ res }) => {
        this.setData({
          isLoading: false
        })

        wx.hideLoading()

        if (res.code === 200) {
          let addresses = res.addresses || []
          // 默认地址排到第一位
          let index, item, flag = false;
          for (var i = 0, len = addresses.length; i < len; i++) {
            if (addresses[i].is_default) {
              flag = true
              index = i
              item = addresses[i]
            }
          }
          if (flag) {
            addresses.splice(index, 1)
            addresses.unshift(item)
          }
          // 
          self.setData({
            addresses
          })

          cb && cb()
        } else {
          wx.showToast({
            title: res.message || '获取地址信息错误',
            icon: 'none'
          })

          cb && cb(res.message || '获取地址信息错误')
        }
      })
    },
    // 
    // closeTips: function () {
    //   this.setData({
    //     tipsShow: false
    //   })
    // },
    // 获取微信地址
    getWechatAddress: function () {
      const self = this
      const scope = 'scope.address'
      wx.showLoading({
        title: '正在获取',
        mask: true
      })

      wx.getSetting({
        success(res) {
          if (res.authSetting[scope]) {
            self.fnChooseAddressSuccess()
          } else if (res.authSetting[scope] === undefined) { // 从未授权
            wx.authorize({
              scope: scope,
              success(res) {
                self.fnChooseAddressSuccess()
              },
              fail() {
                wx.showToast({
                  title: '获取失败',
                  icon: 'none',
                  duration: 1500
                })
              }
            })
          } else if (res.authSetting[scope] === false) { // 初次授权拒绝后
            // 给提示？还是整个逻辑去掉？
            // self.setData({
            //   tipsShow: true
            // })
          }
        },
        complete() {
          wx.hideLoading()
        }
      })
    },
    // 获取微信授权回调
    opensettingFn: function (res) {
      const self = this
      const success = res.detail.authSetting['scope.address']
      // 关闭model
      // this.closeTips()
      // 
      if (success) {
        self.getWechatAddress()
      } else {
        wx.showToast({
          title: '获取失败',
          icon: 'none',
          duration: 1500
        })
      }
    },
    // 选择微信地址成功
    fnChooseAddressSuccess: function () {
      const self = this

      wx.chooseAddress({
        success: function (res) {
          self.fnSaveWechatAddress(res)
        },
        fail: function (res) {
          wx.showToast({
            title: '获取失败',
            icon: 'none',
            duration: 1500
          })
        }
      })
    },
    // 选择地址
    checkAddress: function (e, address) {
      const self = this
      const id = e ? e.currentTarget.dataset.id : address.id
      const data = e ? e.currentTarget.dataset.data : address

      // 上个页面不是选择地址 返回不操作
      if (self.data.addresType !== 'select') {
        return
      }

      // 选中地址
      this.setData({
        nNowAddressId: id
      })

      // 下单页设置地址
      // global.$$setAddressData = data || {}

      // 返回上个页面
      setTimeout(() => {
        wx.navigateBack()
      }, 150)
    },
    // 编辑地址
    editAddress: function (e) {
      const type = e.currentTarget.dataset.type || 'new'
      const oData = e.currentTarget.dataset.data || {}

      global.$$editAddressData = oData

      wx.navigateTo({
        url: `/pages/address/index?type=${ type }&id=${ oData.id }`
      })
    },
    // 保存微信地址
    fnSaveWechatAddress: function (oData) {
      const self = this

      let districtCode = ''
      let bakCountyName = ''
      let _detailInfo = oData.detailInfo || ''

      // 微信地址库特别处理
      oData.provinceName = oData.provinceName.replace('市', '')
      oData.provinceName = oData.provinceName.replace('台湾省', '台湾')

      if (oData.cityName === '东莞市') {
        bakCountyName = oData.countyName || ''
        oData.countyName = '东莞市'
      }

      if (oData.cityName === '中山市') {
        bakCountyName = oData.countyName || ''
        oData.countyName = '中山市'
      }

      if (bakCountyName) {
        _detailInfo = `${bakCountyName}${_detailInfo}`
      }
      // End 微信地址库特别处理

      // SaaS 地区数据处理
      Area.findCode([oData.provinceName, oData.cityName, oData.countyName], (code) => {
        districtCode = code || ''
      })

      if (!districtCode) {
        wx.showToast({
          title: '地区信息暂无对应记录，请手动添加',
          icon: 'none',
          duration: 2000
        })

        return
      }

      const oFormData = {
        id: null,
        name: oData.userName,
        mobile: oData.telNumber,
        district_code: districtCode,
        detail: _detailInfo,
        zipcode: oData.postalCode,
        id_card: '',
        is_default: false
      }

      // 新增地址
      global.yhsd.sdk.address.create(oFormData, data => {
        if (data && data.res) {
          if (data.res.code === 200) {
            self.getData(err => {
              if (err) {
                // 默认有提示
              } else {
                wx.showToast({
                  title: '添加成功',
                  icon: 'none',
                  duration: 2000
                })
              }
            })
            // self.checkAddress(null, data)
          } else {
            wx.showToast({
              title: data.res.message || '地址操作不成功，请稍后重试',
              icon: 'none',
              duration: 2000
            })
          }
        } else {
          wx.showToast({
            title: '保存失败，请重试',
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
  }
})
