Component({

  behaviors: [],

  // 属性定义（详情参见下文）
  properties: {
    address: { // 属性名
      type: Object,
      value () {
        return {}
      }
    },
    amount: { // 属性名
      type: Number,
      value: null
    },
    point: {
      type: Number,
      value: null
    }
  },
  
  data: {},

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {},
    moved: function () {},
    detached: function () {},
  },

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () {}, // 此处attached的声明会被lifetimes字段中的声明覆盖
  ready: function() {},

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {},
    hide: function () {},
    resize: function () {},
  },

  methods: {
    fnSubmit () {
      this.triggerEvent('submit')
    }
  }
})