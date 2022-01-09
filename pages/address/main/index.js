
Component({
  properties: {
    type: {
      type: String,
      value: 'new'
    },
    addressid: {
      type: Number,
      value: null
    }
  },
  data: {
    title: '编辑地址',
    editType: 'new',
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
    nAddressId: null
  },
  observers: {
    type (val) {
      this.init()
    },
    // addressid (val) { // 后面支持 this.properties.addressid
    //   this.init()
    // }
  },
  methods: {
    init() {
      this.setData({
        editType: this.properties.type || 'new'
      })

      const oData = global.$$editAddressData || {}

      if (Object.keys(oData).length) {
        this.setForm(oData, () => {
          // 清理
          global.$$editAddressData = {}
        })
      } else {
        // 后面支持 this.properties.addressid
      }
    },
    setForm(data, cb) {
      if (data) {
        const address = data || {}

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
        }, () => {
          cb && cb()
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
            global.yhsd.sdk.address.remove({ id: self.data.id }, ({ res }) => {
              wx.hideLoading()
              if (res.code === 200) {
                self.setData({
                  nAddressId: null
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
      // global.$$setAddressId = this.data.nAddressId || null

      setTimeout(() => {
        wx.navigateBack()
      }, 150)
    },
    // 保存地址
    saveArea: function () {
      const self = this
      const formData = self.data.areaForm

      // console.log(formData)

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

      wx.showLoading({
        title: '正在保存...'
      })

      if (self.data.editType === 'new') {
        self.addressCreate(formData)
      } else {
        self.addressUpdate(self.data.id, formData)
      }
    },
    addressCreate: function (formData) {
      global.yhsd.sdk.address.create(formData, ({ res }) => {
        wx.hideLoading()
        if (res.code === 200) {
          this.setData({
            nAddressId: res.address_id || null
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
      global.yhsd.sdk.address.save(formData, ({ res }) => {
        wx.hideLoading()
        if (res.code === 200) {
          this.setData({
            nAddressId: res.address_id || null
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
  }
})
