
Component({
  data: {
    title: '会员等级',
    levels: [],
    levelsMap: [],
    myLevel: '',
    totalCredit: ''
  },
  lifetimes: {
    ready () {
      this.getLevels(err => {
        if (err) {
          wx.showToast({
            title: err,
            icon: 'none'
          })
        } else {
          let _mark = -1
          const data = this.data.levelsMap
          for (let i = 0; i < this.data.levels.length; i++) {
            if ((i % 4) === 0) {
              _mark += 1
            }
            if (!Array.isArray(this.data.levelsMap[_mark])) {
              data[_mark] = []
            }
            data[_mark].push(this.data.levels[i])
          }
          this.setData({
            levelsMap: data,
          })
        }
      })

      this.getVipInfo(err => {
        if (err) {
          wx.showToast({
            title: err,
            icon: 'none'
          })
        }
      })
    }
  },
  methods: {
    getLevels(cb) {
      global.yhsd.sdk.shop.get('customer_level', data => {
        let err = null
        if (data && data.res) {
          if (data.res.code === 200) {
            this.setData({
              levels: data.res.customer_level || [],
            })
          } else {
            err = data.res.message || '网站用户全等级数据获取出错'
          }
        } else {
          err = '网站用户全等级数据请求异常'
        }
        cb && cb(err)
      })
    },
    getVipInfo(cb) {
      global.yhsd.sdk.account.current(data => {
        if (data.res.code === 200) {
          const _data = data.res.customer
          if (_data) {
            this.setData({
              myLevel: _data.customer_level,
              totalCredit: _data.total_credit
            })
          }
        } else {
          err = '获取用户资料失败'
        }
        cb && cb(err)
      })
    },
    isHighest() {
      const _levels = this.data.levels
      const _lastLevel = _levels[_levels.length - 1]
      if (_lastLevel) {
        return _lastLevel.id === this.oLevel.id
      } else {
        return false
      }
    },
  }
})