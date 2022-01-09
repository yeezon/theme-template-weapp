
Component({

  behaviors: [],

  // 属性定义（详情参见下文）
  properties: {
    shipments: { // 属性名
      type: Array,
      value () {
        return []
      }
    }
  },
  
  data: {
    oSet: { // fnChange 的时候根据 Props shipments 顺序转成 Array 传递
      // 111: { ...oShip }
    }
  },

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () { },
    moved: function () { },
    detached: function () { },
  },

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () { }, // 此处attached的声明会被lifetimes字段中的声明覆盖
  ready: function() { },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () { },
    hide: function () { },
    resize: function () { },
  },

  methods: {
    setShip (evt) {
      const oVal = evt.detail || {}
      this.setData({
        [`oSet[${oVal.id}]`]: { ...oVal }
      }, () => {
        this.fnChange()
      })
    },
    fnChange () {
      const _newShipData = []
      const _oSet = this.data.oSet
      const _shipments = this.properties.shipments
      for (let oShip of _shipments) {
        const _item = _oSet[oShip.id]
        if (_item) {
          _newShipData.push({ ..._item })
        }
      }
      
      this.triggerEvent('change', _newShipData)
    }
  }
})