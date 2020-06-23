import Area from '../../utils/area'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value: {
      type: String,
      value: ''
    }
  },

  data: {
    region: [],
    oArea: {
      province: [],
      city: [],
      district: []
    },
    multiIndex: [],
    multiArray: [],
    oMultiArrayMap1: {},
    oMultiArrayMap2: {},
    oMultiArrayMap3: {}
  },

  ready() {
    this.init()
  },

  methods: {
    init () {
      const _code = this.properties.value || ''

      if (_code) {
        Area.findPrev(_code, (data) => {
          const oData = data || {}
          // const _province = oData.province || []
          const _city = oData.city || []
          // const _district = oData.district || []

          // 兼容两级地区
          if (!oData.district) {
            oData.district = _city
          }

          this.setData({
            oArea: oData
          }, () => {
            this.initMultiData(this.data.oArea, () => {
              this.setRegion()
            })
          })
        })
      } else {
        this.setData({
          oArea: {
            province: [],
            city: [],
            district: []
          }
        }, () => {
          this.setRegion(() => {
            this.initMultiData(this.data.oArea)
          })
        })
      }
    },
    fnTap () {
      const _district = this.data.oArea.district || []

      if (!_district[0]) {
        this.setData({
          oArea: {
            province: [],
            city: [],
            district: []
          }
        }, () => {
          this.initMultiData(this.data.oArea)
        })
      }
    },
    initMultiData (oArea, cb) {
      const oAreaData = oArea || {}
      // const _district = oAreaData.district || []

      // console.log(oAreaData)

      const oData = {
        oArea: oAreaData,
        multiIndex: [],
        multiArray: [],
        oMultiArrayMap1: {},
        oMultiArrayMap2: {},
        oMultiArrayMap3: {}
      }

      this.getProvinceList(oData, (_oData) => {
        this.getCityList(_oData, (__oData) => {
          this.getDistrictList(__oData, (___oData) => {
            this.setData(___oData, () => {
              cb && cb()
            })
          })
        })
      })
    },
    setRegion (cb) {
      const oAreaData = this.data.oArea || {}
      const _province = oAreaData.province || []
      const _city = oAreaData.city || []
      const _district = oAreaData.district || []

      this.setData({
        region: [_province[1] || '', _city[1] || '', _district[1] || '']
      }, () => {
        cb && cb()
      })
    },
    getProvinceList (_oData, cb) {
      Area.getData('main', data => {
        data = data || []

        if (data.length > -1) {
          const _list = []

          data.forEach((items, index) => {
            _list.push(items[1])

            _oData.oMultiArrayMap1[index] = items

            if (_oData.oArea.province[0] === items[0]) {
              _oData.multiIndex[0] = index
            }
          })

          // 默认第一个
          if (!_oData.oArea.province[0]) {
            _oData.multiIndex[0] = 0
            _oData.oMultiArrayMap1[0] = data[0]
            _oData.oArea.province = data[0]
          }

          _oData.multiArray[0] = _list

          cb && cb(_oData)
        } else {
          wx.showToast({
            title: '获取地区信息异常，请稍后再试',
            icon: 'none',
            duration: 2000
          })
        }
      })
    },
    getCityList (_oData, cb) {
      const code = _oData.oArea.province[0] || ''

      Area.findNext(code, data => {
        data = data || []
  
        if (data.length > -1) {
          const _list = []

          data.forEach((items, index) => {
            _list.push(items[1])

            _oData.oMultiArrayMap2[index] = items

            if (_oData.oArea.city[0] === items[0]) {
              _oData.multiIndex[1] = index
            }
          })

          // 默认第一个
          if (!_oData.oArea.city[0]) {
            _oData.multiIndex[1] = 0
            _oData.oMultiArrayMap2[0] = data[0]
            _oData.oArea.city = data[0]
          }

          _oData.multiArray[1] = _list

          cb && cb(_oData)
        } else {
          wx.showToast({
            title: '获取地区信息异常，请稍后再试',
            icon: 'none',
            duration: 2000
          })
        }
      })
    },
    getDistrictList (_oData, cb) {
      const code = _oData.oArea.city[0] || ''

      Area.findNext(code, data => {
        data = data || []

        if (data.length > -1) {
          const _list = []

          data.forEach((items, index) => {
            _list.push(items[1])

            _oData.oMultiArrayMap3[index] = items

            if (_oData.oArea.district[0] === items[0]) {
              _oData.multiIndex[2] = index
            }
          })

          // 默认第一个
          if (!_oData.oArea.district[0]) {
            // 兼容两级地区
            if (data.length > 0) {
              _oData.multiIndex[2] = 0
              _oData.oMultiArrayMap3[0] = data[0]
              _oData.oArea.district = data[0]
            } else {
              _oData.multiIndex[2] = _oData.multiIndex[1]
              _oData.oMultiArrayMap3[0] = _oData.oArea.city
              _oData.oArea.district = _oData.oArea.city
            }
          }

          _oData.multiArray[2] = _list

          cb && cb(_oData)
        } else {
          wx.showToast({
            title: '获取地区信息异常，请稍后再试',
            icon: 'none',
            duration: 2000
          })
        }
      })
    },
    bindMultiPickerChange (e) {
      // console.log('picker发送选择改变，携带值为', e.detail.value)

      this.setData({
        multiIndex: e.detail.value
      }, () => {
        this.fnChange()
      })
    },
    bindMultiPickerColumnChange (e) {
      // console.log('修改的列为', e.detail.column, '，值为', e.detail.value)

      const oData = {
        oArea: this.data.oArea || {},
        multiIndex: this.data.multiIndex || [],
        multiArray: this.data.multiArray || [],
        oMultiArrayMap1: this.data.oMultiArrayMap1 || {},
        oMultiArrayMap2: this.data.oMultiArrayMap2 || {},
        oMultiArrayMap3: this.data.oMultiArrayMap3 || {}
      }

      oData.multiIndex[e.detail.column] = e.detail.value;

      switch (e.detail.column) {
        case 0:
          oData.oArea.province = oData.oMultiArrayMap1[e.detail.value] || []
          oData.oArea.city = []
          oData.oArea.district = []

          this.getCityList(oData, (_oData) => {
            this.getDistrictList(_oData, (__oData) => {
              this.setData(__oData)
            })
          })

          break
        case 1:
          oData.oArea.city = oData.oMultiArrayMap2[e.detail.value] || []
          oData.oArea.district = []

          this.getDistrictList(oData, (_oData) => {
            this.setData(_oData)
          })

          break
        case 2:
          oData.oArea.district = oData.oMultiArrayMap3[e.detail.value] || []

          this.setData(oData)

          break
      }
    },
    fnChange () {
      // region: evt.detail.value,
      // ['areaForm.province']: evt.detail.value[0],
      // ['areaForm.city']: evt.detail.value[1],
      // ['areaForm.county']: evt.detail.value[2],
      // ['areaForm.district_code']: evt.detail.code[2]

      const oAreaData = this.data.oArea || {}
      const _province = oAreaData.province || []
      const _city = oAreaData.city || []
      const _district = oAreaData.district || []

      const oData = {
        value: [_province[1], _city[1], _district[1]],
        code: [_province[0], _city[0], _district[0]]
      }

      this.setRegion()

      this.triggerEvent('change', oData)
    }
  }
})
