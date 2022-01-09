
// const app = (global.getApp && global.getApp()) || {}

Component({
  properties: {
    query: {
      type: Object,
      value() {
        return {}
      }
    }
  },
  data: {
    title: '发现',
    navBarHeight: 44,
    searchDatas: [], // 搜索关键字数据
    autoFocus: false, // 输入框自动获取焦点
    inputFocus: false, // 输入框焦点
    inputClearShow: false, // 输入框清空按钮
    listStyle: 2,
    showFilter: false,
    oQuery: {
      sort_type: 1
    },
    config: {
      page: 1,
      size: 8
    },
    in_stock: false,
    types: [],
    vendors: [],
    type: '',
    vendor: '',
    filter: {},
    showResault: false,
    products: [],
    total_page: 1,
    proLoading: false,
    loadedAll: false
  },
  lifetimes: {
    attached: function () {
      this.setFilter(this.properties.query || {})
      this.search()
    },
    ready: function () {},
    moved: function () {},
    detached: function () {},
  },
  pageLifetimes: {
    show: function () {},
    hide: function () {},
    resize: function () {},
  },
  methods: {
    /**
     * 页面上拉触底事件的处理函数
     */
    scrolltolower: function() {
      if (this.data.showResault) {
        this.productsLoadmore()
      }
    },

    // changeListStyle
    changeListStyle: function() {
      this.setData({
        listStyle: this.data.listStyle === 1 ? 2 : 1
      })
    },

    // 
    toSearch: function () {
      wx.navigateTo({
        url: '../search/search'
      })
    },

    // 筛选 选项
    getFilter: function() {

      this.setData({
        showFilter: true,
        in_stock: this.data.filter && this.data.filter.in_stock !== undefined ? this.data.filter.in_stock : false,
        vendor: this.data.filter && this.data.filter.vendor ? this.data.filter.vendor : '',
        type: this.data.filter && this.data.filter.type ? this.data.filter.type : '',
      })

      // 分类
      global.yhsd.sdk.type.get({size: 9999}, ({res}) => {
        this.setData({
          types: res.types
        })
      })

      // 品牌
      global.yhsd.sdk.vendor.get({size: 9999}, ({res}) => {
        this.setData({
          vendors: res.vendors
        })
      })
    },

    closeFilter: function() {
      this.setData({
        showFilter: false
      })
    },

    // 
    exChange: function() {
      this.setData({
        in_stock: !this.data.in_stock
      })
    },

    // 
    typeChange: function(e) {
      console.log(e)
      const type = e.currentTarget.dataset.type
      this.setData({
        type: type === this.data.type ? '' : type
      })
    },

    // 
    vendorChange: function(e) {
      console.log(e)
      const vendor = e.currentTarget.dataset.vendor
      this.setData({
        vendor: vendor === this.data.vendor ? '' : vendor
      })
    },

    setFilter: function(query) {
      if (query.ex) {
        this.setData({
          in_stock: query.ex
        })
      }
      if (query.ve) {
        this.setData({
          vendor: query.ve
        })
      }
      if (query.ty) {
        this.setData({
          type: query.ty
        })
      }
    },

    clearFilter: function() {
      this.setData({
        in_stock: false,
        vendor: '',
        type: '',
        // filter: {}
      })
    },

    filterComfirn: function() {
      this.setData({
        showFilter: false,
        ['config.page']: 1 // 重置
      })

      this.search()
    },

    // 搜索
    search: function() {
      // console.log(this.data.config)
      const self = this
      const config = self.data.config
      const _oQuery = self.data.oQuery

      let filter = {}
      if (self.data.in_stock) filter.in_stock = self.data.in_stock
      if (self.data.vendor) filter.vendor = self.data.vendor
      if (self.data.type) filter.type = self.data.type

      self.setData({
        filter: filter
      })

      self.setData({
        proLoading: true
      })

      wx.showLoading({
        title: '加载中...'
      })

      let oConfig = {
        page: config.page || 1,
        size: config.size || 10
      }
      
      switch (_oQuery.sort_type) {
        case 2:
          oConfig.so = 'date_desc'
          break
        case 3:
          oConfig.so = 'sale_desc'
          break
        case 4:
          oConfig.so = 'price_desc'
          break
        case 5:
          oConfig.so = 'price_asc'
          break
        default:
          break
      }

      oConfig = Object.assign({}, oConfig, self.data.filter)

      global.yhsd.sdk.product.get(oConfig, function(data) {
        wx.hideLoading()

        const nTotalPage = data.res.paging.pages || 1
        const nNowPage = config.page || 1

        const products = nNowPage === 1 ? (data.res.products || []) : self.data.products.concat(data.res.products || [])

        self.setData({
            proLoading: false,
            showResault: true,
            total_page: nTotalPage,
            products,
            loadedAll: nNowPage >= nTotalPage
        })
      })
      
    },

    // 搜索商品加载更多
    productsLoadmore: function() {
      if (this.data.proLoading || this.data.loadedAll) return

      this.setData({
        ['config.page']: ++this.data.config.page
      })

      this.search()
    },

    // 筛选
    filterChange: function(e) {
      let type = Number(e.currentTarget.id)
      const _oQuery = this.data.oQuery
      type === 4 && _oQuery.sort_type === 4 ? type = 5 : type = type
      type === 5 && _oQuery.sort_type === 5 ? type = 4 : type = type
      if (type === _oQuery.sort_type) return
      this.setData({
        ['oQuery.sort_type']: type,
        ['config.page']: 1,
        ['config.size']: 8
      })
      // 获取筛选数据
      this.search()
    }
  }
})