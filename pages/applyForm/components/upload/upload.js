// pages/orderApply/components/upload/upload.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    size: {
      type: [Number, String],
      value: 3
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgs: [],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    chooseImage() {
      wx.chooseImage({
        success(res) {
          const tempFilePaths = res.tempFilePaths
          wx.uploadFile({
            url: 'https://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
            filePath: tempFilePaths[0],
            // name: 'file',
            // formData: {
            //   'user': 'test'
            // },
            success(res) {
              const data = res.data
              console.log(data)
              //do something
            }
          })
        }
      })
    }
  }
})
