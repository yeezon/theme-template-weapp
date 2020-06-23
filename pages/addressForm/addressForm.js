// pages/adressForm/adressForm.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '编辑地址',
    navBarHeight: app.globalData.navBarHeight,
    isIpx: app.globalData.isIpx,
    editType: 'new',
    addressType: '',
    region: ['所在地区（省、市、区）'],
    id: '',
    areaForm: {
      district_code: '',
      name: '',
      mobile: '',
      detail: '',
      zipcode: '',
      id_card: '',
      is_default: false
    },
    addressData: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 
    this.checkType(options.type, options.addressType)
    this.setForm(options.data)
    // app.mta.Page.init()
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
    // 
    // app.analysis(app)
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

  // 当前是新增还是编辑
  checkType: function (type, addressType) {
    this.setData({
      editType: type,
      addressType: addressType
    })
  },
  // 
  setForm: function (data) {
    if (data) {
      const address = JSON.parse(data)
      this.setData({
        id: address.id,
        areaForm: {
          id: address.id,
          district_code: address.district_code,
          name: address.name,
          mobile: address.mobile,
          detail: address.detail,
          zipcode: address.zipcode,
          id_card: address.id_card,
          is_default: address.is_default
        },
        region: [address.location_full_titles.split(',')[0], address.location_full_titles.split(',')[1], address.location_full_titles.split(',')[2]]
      })
    }
  },

  // 处理输入
  onInput(e) {
    let type = e.target.dataset.type;
    let value = e.detail.value;
    this.setData({
      ['areaForm.' + type]: value
    })
  },

  // areaDefaultChange
  areaDefaultChange: function (e) {
    this.setData({
      ['areaForm.is_default']: this.data.areaForm.is_default ? false : true
    })
  },
  // 
  areaChange: function (evt) {
    this.setData({
      region: evt.detail.value,
      ['areaForm.province']: evt.detail.value[0],
      ['areaForm.city']: evt.detail.value[1],
      ['areaForm.county']: evt.detail.value[2],
      ['areaForm.district_code']: evt.detail.code[2]
    })
  },
  // 删除地址
  deleteAddress: function () {
    const self = this

    wx.showModal({
      title: '提示',
      content: '是否删除该地址信息？',
      showCancel: true,
      confirmColor: '#fe384f',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在删除...'
          })
          // 删除操作
          global.yhsd.sdk.address.remove({id: self.data.id}, ({res}) => {
            wx.hideLoading()
            if (res.code === 200) {
              self.setData({
                addressData: null
              })
              self.refreshAddressList()
            } else {
              wx.showToast({
                title: res.message || '删除失败，请重试',
                icon: 'none',
                duration: 2000
              })
            }
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '操作失败，请重试',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  // 更新地址列表信息
  refreshAddressList() {
    const pages = getCurrentPages()
    const prevPage = pages[pages.length - 2]
    const createOrderPage = pages[pages.length - 3]

    const editType = this.data.editType
    const addressType = this.data.addressType
    // 地址列表获取新数据
    prevPage.getData()
    // 
    createOrderPage.setData({
      address: this.data.addressData
    })
    setTimeout(() => {
      wx.navigateBack({
        // delta: editType === 'new' && addressType === 'select' ? 2 : 1
        delta: 1
      })
    }, 600)
  },
  // 保存地址
  saveArea: function () {
    const self = this
    const formData = self.data.areaForm

    console.log(formData)
    if (!formData.name) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      })
      return
    }
    if (!formData.mobile) {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none'
      })
      return
    }
    // 处理iPhone复制手机号码 隐藏字符
    formData.mobile = formData.mobile.replace(/[^\d]/g, '')
    if (!/^1\d{10}$/.test(formData.mobile)) {
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none'
      })
      return
    }
    if (self.data.region.length === 1) {
      wx.showToast({
        title: '请选择所在地区',
        icon: 'none'
      })
      return
    }
    if (!formData.detail) {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none'
      })
      return
    }
    // 
    wx.showLoading({
      title: '正在保存...'
    })
    // 
    
    // 
    const _request = self.data.editType === 'new'
      ? self.addressCreate(formData) : self.addressUpdate(self.data.id, formData)
  },
  addressCreate: function (formData) {
    global.yhsd.sdk.address.create(formData, ({res}) => {
      wx.hideLoading()
      if(res.code === 200) {
        this.setData({
          addressData: res.address_id
        })
        this.refreshAddressList()
      } else {
        wx.showToast({
          title: res.message || '保存地址信息失败',
          icon: 'none'
        })
      }
    })
  },
  addressUpdate: function (id, formData) {
    formData.id = id
    global.yhsd.sdk.address.save(formData, ({res}) => {
      wx.hideLoading()
      if(res.code === 200) {
        this.setData({
          addressData: res.address_id
        })
        this.refreshAddressList()
      } else {
        wx.showToast({
          title: res.message || '更新地址信息失败',
          icon: 'none'
        })
      }
    })
  }
})