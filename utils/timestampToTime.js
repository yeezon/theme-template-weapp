const timestampToTime =  function(data) {
  var date = new Date(data)// 如果date为13位不需要乘1000
  var Y = date.getFullYear() + '年'
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月'
  var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + '日'
  var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
  var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
  var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
  return Y + M + D + h + m + s
}

export default timestampToTime
