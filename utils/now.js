const now = function () {
  const timestamp_diff = wx.getStorageSync('timestamp_diff')
  const _now = (new Date()).getTime()
  const _nowDate = new Date(parseInt(_now + timestamp_diff))
  // console.log('Now Date', _nowDate.toISOString())
  return _nowDate.toISOString()
}

module.exports = now
