
// 设置购物车数量

const seCartCount = function(cb) {
  global.yhsd.sdk.cart.get(({res}) => {
    if(res.code === 200){
      if (res.cart.item_count){
        wx.setTabBarBadge({
          index: 2,
          text: res.cart.item_count + '',
        })
      } else {
        wx.removeTabBarBadge({
          index: 2
        })
      }
    }
    cb && cb(res.cart.item_count)
  })
}

export default seCartCount
