// components/rich-text/rich-text.js
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    html: {
      type: String,
      value: '',
      observer: function() {
        this.init()
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    nodes: [],
    products: []
  },

  // attached() {
  //   this.init()
  // },

  /**
   * 组件的方法列表
   */
  methods: {
    init: function() {
      let html = this.data.html
      // console.log(html)
      html = html.replace(/[\s]+class=("?)(.[^<>"]*)\1/ig, "")
        .replace(/\<p>/g, '<p class="rt-p">')
        .replace(/\<h2/g, '<h2 class="rt-h2"')
        .replace(/\<img/g, '<img class="rt-img"')
        .replace(/\<em/g, '<em class="rt-em"')
        .replace(/\<br/g, '<br class="rt-br"')
        .replace(/\<!DOCTYPE html>/g, '')
        .replace(/\<html>/g, '')
        .replace(/\<head>/g, '')
        .replace(/\<\/head>/g, '')
        .replace(/\<body>/g, '')
        .replace(/\<\/body>/g, '')
        .replace(/\<\/html>/g, '')
        .replace(/\<div/g, '<div class="rt-div"')

      const htmlArr = html ?
        html.split(/<p class="rt-p"><x-products ids=\"([\w|,]*)\"><\/x-products><\/p>/) : []

      let ids = ''
      let nodes = []
      if (htmlArr.length) {
        for (let i = 0, l = htmlArr.length; i < l; i++) {
          if (i % 2 === 0) {
            // console.log('html')
            nodes.push({
              type: 'html',
              value: htmlArr[i]
            })
          } else {
            // console.log('pro')
            ids += htmlArr[i] + ','
            nodes.push({
              type: 'product',
              value: htmlArr[i].split(',')
            })
            // console.log(htmlArr[i])
          }
        }
      }
      this.setData({
        nodes: nodes
      })
      // console.log(ids)
      if (ids) {
        this.getProducts(ids)
      }
    },
    // 
    getProducts: function(ids) {
      const self = this
      const query = {
        product_ids: ids
      }
      app.api.getProducts(query)
        .then(res => {
          self.setData({
            products: res.data
          })
        })
    },
    // 
    gotoDetails: function(e) {
      const id = e.currentTarget.id
      wx.navigateTo({
        url: `../products/products?id=${id}`
      })
    },
  }
})