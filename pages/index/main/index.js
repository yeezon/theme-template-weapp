
// const app = (global.getApp && global.getApp()) || {}

Component({
  properties: {
    handle: {
      type: String,
      value: ''
    }
  },
  data: {
    err: '',
    isLoading: false,
    title: '',
    layoutMap: [],
  },
  lifetimes: {
    ready() {
      this.getPage()
    }
  },
  methods: {
    getPage() {
      const handle = this.properties.handle || 'weapp'

      if (handle) {
        this.setData({
          isLoading: true
        })
  
        global.yhsd.sdk.page.get({
          handle,
          data_type: 'json',
          display: 'mobi'
        }, ({ res: oRes }) => {
          this.setData({
            isLoading: false
          })
  
          if (oRes.code === 200) {
            const oPage = oRes.page || {}
  
            if (oPage.version === 2) {
              let oEditJSON = {}
  
              if (oPage.use_mobile_content) {
                oEditJSON = JSON.parse(oPage.mobi_edit_json)
              } else {
                oEditJSON = JSON.parse(oPage.edit_json)
              }
  
              const oCompData = oEditJSON.data || {}
              const compTags = oEditJSON.layout[0].sub || []
  
              for (const oTag of compTags) {
                oTag.data = oCompData[`${oTag.attrs['data-cid']}`]
              }
  
              this.setData({
                layoutMap: compTags
              })
            } else {
              this.setData({
                err: '暂不支持该版本的自定义页面'
              })
            }
          } else if (oRes.code === 201) {
            this.setData({
              err: `请到「网站后台」添加小程序使用的「自定义页面」，该页面链接地址需为「/pages/${ handle }」，基础组件暂时只支持「商品列表」和「图片」。`
            })
          } else {
            this.setData({
              err: '请求异常，请稍后再试'
            })
          }
        })
      } else {
        this.setData({
          err: '请到「网站后台」添加小程序使用的「自定义页面」，该页面链接地址需为「/pages/weapp」，基础组件暂时只支持「商品列表」和「图片」。'
        })
      }
    },
    toPage(evt) {
      const url = evt.currentTarget.dataset.url || ''

      switch (true) {
        case /\/products\/([^\/\?]+)/i.test(url): {
          const handle = (url.match(/\/products\/([^\/\?]+)/i) || [])[1] || ''

          wx.navigateTo({
            url: `/pages/product/index?handle=${handle}`
          })

          break;
        }
        default: {
          break;
        }
      }
    }
  }
})
