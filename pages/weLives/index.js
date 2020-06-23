
Page({
  data: {
    title: '直播',
    isLoading: false,
    items: []
  },
  getItems (cb) {
    this.setData({
      isLoading: false,
      items: [
        {
          "name": "直播房间名",
          "roomid": 1,
          "cover_img": "http:\/\/mmbiz.qpic.cn\/mmbiz_jpg\/Rl1RuuhdstSfZa8EEljedAYcbtX3Ejpdl2et1tPAQ37bdicnxoVialDLCKKDcPBy8Iic0kCiaiaalXg3EbpNKoicrweQ\/0?wx_fmt=jpeg",
          "live_satus": 101,
          "start_time": 1568128900,
          "end_time": 1568131200,
          "anchor_name": "李四",
          "anchor_img": "http:\/\/mmbiz.qpic.cn\/mmbiz_jpg\/Rl1RuuhdstSfZa8EEljedAYcbtX3Ejpdlp0sf9YTorOzUbGF9Eib6ic54k9fX0xreAIt35HCeiakO04yCwymoKTjw\/0?wx_fmt=jpeg",
          "goods": [
            {
              "cover_img": "http://mmbiz.qpic.cn/mmbiz_png/FVribAGdErI2PmyST9ZM0JLbNM48I7TH2FlrwYOlnYqGaej8qKubG1EvK0QIkkwqvicrYTzVtjKmSZSeY5ianc3mw/0?wx_fmt=png",
              "url": "pages/index/index.html",
              "price": 1100,
              "name": "fdgfgf"
            }
          ]
        },
        {
          "name": "直播房间名2",
          "roomid": 1,
          "cover_img": "http:\/\/mmbiz.qpic.cn\/mmbiz_jpg\/Rl1RuuhdstSfZa8EEljedAYcbtX3Ejpdl2et1tPAQ37bdicnxoVialDLCKKDcPBy8Iic0kCiaiaalXg3EbpNKoicrweQ\/0?wx_fmt=jpeg",
          "live_satus": 101,
          "start_time": 1568128900,
          "end_time": 1568131200,
          "anchor_name": "李四",
          "anchor_img": "http:\/\/mmbiz.qpic.cn\/mmbiz_jpg\/Rl1RuuhdstSfZa8EEljedAYcbtX3Ejpdlp0sf9YTorOzUbGF9Eib6ic54k9fX0xreAIt35HCeiakO04yCwymoKTjw\/0?wx_fmt=jpeg",
          "goods": [
            {
              "cover_img": "http://mmbiz.qpic.cn/mmbiz_png/FVribAGdErI2PmyST9ZM0JLbNM48I7TH2FlrwYOlnYqGaej8qKubG1EvK0QIkkwqvicrYTzVtjKmSZSeY5ianc3mw/0?wx_fmt=png",
              "url": "pages/index/index.html",
              "price": 1100,
              "name": "fdgfgf"
            }
          ]
        },
        {
          "name": "直播房间名3",
          "roomid": 1,
          "cover_img": "http:\/\/mmbiz.qpic.cn\/mmbiz_jpg\/Rl1RuuhdstSfZa8EEljedAYcbtX3Ejpdl2et1tPAQ37bdicnxoVialDLCKKDcPBy8Iic0kCiaiaalXg3EbpNKoicrweQ\/0?wx_fmt=jpeg",
          "live_satus": 101,
          "start_time": 1568128900,
          "end_time": 1568131200,
          "anchor_name": "李四",
          "anchor_img": "http:\/\/mmbiz.qpic.cn\/mmbiz_jpg\/Rl1RuuhdstSfZa8EEljedAYcbtX3Ejpdlp0sf9YTorOzUbGF9Eib6ic54k9fX0xreAIt35HCeiakO04yCwymoKTjw\/0?wx_fmt=jpeg",
          "goods": [
            {
              "cover_img": "http://mmbiz.qpic.cn/mmbiz_png/FVribAGdErI2PmyST9ZM0JLbNM48I7TH2FlrwYOlnYqGaej8qKubG1EvK0QIkkwqvicrYTzVtjKmSZSeY5ianc3mw/0?wx_fmt=png",
              "url": "pages/index/index.html",
              "price": 1100,
              "name": "fdgfgf"
            }
          ]
        }
      ]
    })

    // global.yhsd.sdk.weapp.liveInfo(data => {
    //   let err = null

    //   if (data && data.res) {
    //     if (data.res.code === 200) {
    //       this.setData({
    //         items: (data.res.liveInfo || {}).room_info || [],
    //       })
    //     } else {
    //       err = data.res.message || '数据获取出错，请稍后再试'
    //     }
    //   } else {
    //     err = '数据请求异常，请稍后再试'
    //   }

    //   this.setData({
    //     isLoading: false
    //   })

    //   cb && cb(err)
    // })
  },

  onLoad (options) {
    this.setData({
      isLoading: true
    })

    this.getItems()
  },

  onShow () {
    this.getItems()
  }
})