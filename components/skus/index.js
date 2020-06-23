
Component({

  behaviors: [],

  // 属性定义（详情参见下文）
  properties: {
    skuId: {
      type: Number,
      value: null
    },
    skus: {
      type: Array,
      value () {
        return []
      },
      observer () {
        this.initSkuData()
      }
    },
    options: {
      type: Array,
      value () {
        return []
      },
      observer () {
        this.initKeys()
      }
    }
  },

  data: {
    nNowSku: null,
    oSkuMap: {}, // [oSku.id]: [oSku]
    keys: [],
    oSkuMapKeys: {}, // [oSku.id]: [key1, key2, key3]
    cannotChooseList: [], // [key1, key2]
    oIsChoose: {}, // {[oOpt.id]: [oOpt.position]}
    oCannotChooseMap: {}
  },

  computed: { // methods 需要复制这些方法，Computed 仅仅用在模板上，因结果会缓存，在 JS 里不是实时数据
  },

  observers: {
    skuId (nVal) {
      nVal = nVal || null // properties 声明会根据 type 做纠正，Number 会导致 null 变成 0

      if (nVal !== this.data.nNowSku) {
        this.setData({
          nNowSku: nVal
        }, () => {
          this.initSku()
        })
      }
    }
  },

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      // this.upNowSku(_skuId)
      this.data.nNowSku = this.properties.skuId || null

      this.init()
    },
    ready: function () {},
    moved: function () {},
    detached: function () {},
  },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {},
    hide: function () {},
    resize: function () {},
  },

  methods: {
    init () {
      this.initSkuData()
      this.initKeys()
      this.initSku()
    },
    initSkuData () {
      const _oSkuMap = this.data.oSkuMap
      const _oSkuMapKeys = this.data.oSkuMapKeys
      for (const oSku of this.properties.skus) {
        _oSkuMap[oSku.id] = oSku
        const keys = []
        for (const oOpt of oSku.options) {
          keys.push(`${oOpt.option_id}.${oOpt.position}`)
        }
        _oSkuMapKeys[oSku.id] = keys
      }
    },
    initKeys () {
      const _keys = this.data.keys
      for (const oOpt of this.properties.options) {
        (oOpt.values || []).forEach((val, index) => {
          _keys.push(`${oOpt.id}.${index + 1}`)
        })
      }
    },
    initSku () {
      // 只有一个 SKU 时，默认选中
      const _skus = this.properties.skus || []
      if (_skus.length === 1) {
        this.data.nNowSku = (_skus[0] || {}).id || null
        // this.upNowSku((_skus[0] || {}).id || null)
      }

      const oSku = this.data.oSkuMap[this.data.nNowSku] || {}
      for (const oOpt of (oSku.options || [])) {
        this.fnChoose({
          currentTarget: {
            dataset: {
              id: oOpt.option_id,
              rank: oOpt.position
            }
          }
        })
      }
    },
    isChoose (nOptID, nRank) {
      return this.data.oIsChoose[nOptID] === nRank
    },
    canChoose (nOptID, nRank) {
      return !this.data.cannotChooseList.includes(`${nOptID}.${nRank}`)
    },
    fnChoose (evt) {
      const oDataset = evt.currentTarget.dataset || {}
      const nOptID = oDataset.id || null
      const nRank = oDataset.rank || null

      // 处理当前选择
      if (this.canChoose(nOptID, nRank)) {
        if (this.isChoose(nOptID, nRank)) {
          // 暂时不开放取消选择属性
          // delete this.data.oIsChoose[nOptID]
        } else {
          this.data.oIsChoose[nOptID] = nRank
        }
      } else {
        // 赋值给新对象
        this.data.oIsChoose = {
          [nOptID]: nRank
        }

        // 默认随机选中其他属性
        // const nNowKey = `${nOptID}.${nRank}`
        // for (const _nSku in this.data.oSkuMapKeys) {
        //   const _keys = this.data.oSkuMapKeys[_nSku]
        //   if (_keys.includes(nNowKey)) {
        //     for (const _key of _keys) {
        //       const _values = _key.split('.')
        //       const _nOptID = window.parseInt(_values[0]) || null
        //       const _nRank = window.parseInt(_values[1]) || null

        //       this.data.oIsChoose[_nOptID] = _nRank
        //     }
        //     break
        //   }
        // }
      }

      // 处理可选择
      const _oIsChoose = this.data.oIsChoose
      const keySet = new Set()
      for (const _nOptID in _oIsChoose) {
        const keys = this.getCannotChooseListByKey(_nOptID, _oIsChoose[_nOptID])
        for (const key of keys) {
          keySet.add(key)
        }
      }

      // 转换成数组
      this.data.cannotChooseList = [...keySet]
      this.setNowSku()
    },
    getCannotChooseListByKey (nOptID, nRank) {
      const nowKey = `${nOptID}.${nRank}`
      const _oCannotChooseMap = this.data.oCannotChooseMap
      let res = null
      if (nowKey in _oCannotChooseMap) {
        res = _oCannotChooseMap[nowKey] || []
      } else {
        const _oSkuMapKeys = this.data.oSkuMapKeys
        const canKeySet = new Set()

        // 遍历 SKU 对应的 Keys，记录相关包含的 Key
        for (const nSkuID in _oSkuMapKeys) {
          const keys = _oSkuMapKeys[nSkuID]
          if (keys.includes(nowKey)) {
            for (const key of keys) {
              canKeySet.add(key)
            }
          }
        }

        // 选出所有不包含的 Key
        const cannotKeySet = new Set()
        for (const key of this.data.keys) {
          if (!canKeySet.has(key)) {
            // 当前属性所有值都属于可选
            if (key.indexOf(nOptID) < 0) {
              cannotKeySet.add(key)
            }
            // else {
            //   canKeySet.add(key)
            // }
          }
        }

        // 记录并转换成数组返回
        res = (_oCannotChooseMap[nowKey] = [...cannotKeySet])
      }
      return res
    },
    setNowSku () {
      const _oIsChoose = this.data.oIsChoose
      if (Object.keys(_oIsChoose).length === this.properties.options.length) {
        const _oSkuMapKeys = this.data.oSkuMapKeys
        const items = Object.entries(_oIsChoose)
        let nSku = null
        for (const sku in _oSkuMapKeys) {
          let keys = _oSkuMapKeys[sku]
          let nMark = 0
          for (const item of items) {
            if (keys.includes(item.join('.'))) {
              nMark += 1
            }
          }
          if (nMark === items.length) {
            nSku = parseInt(sku)
            break
          }
        }
        // this.data.nNowSku = nSku
        this.upNowSku(nSku)
      } else {
        // this.data.nNowSku = null
        this.upNowSku(null)
      }
    },
    upNowSku (nVal) {
      this.data.nNowSku = nVal
      this.setData(this.data)
      this.fnChange(nVal)
    },
    fnChange (nSku) {
      this.triggerEvent('change', this.data.oSkuMap[nSku] || {})
    }
  }

})