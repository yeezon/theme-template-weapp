
// 设置购物车数量

const seCartCount = function (cb) {
  global.yhsd.sdk.cart.get(({ res }) => {
    if (res.code === 200) {
      if (res.cart.item_count) {
        // 换成全局变量，相关页面 onShow 获取
        wx.setTabBarBadge({
          index: 2,
          text: res.cart.item_count + '',
          fail(err) {
            console.log(err)
          }
        })
      } else {
        // 换成全局变量，相关页面 onShow 获取
        wx.removeTabBarBadge({
          index: 2,
          fail(err) {
            console.log(err)
          }
        })
      }
    }
    cb && cb(res.cart.item_count)
  })
}

export default seCartCount
