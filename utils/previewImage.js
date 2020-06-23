const previewImage = (dataset) => {
  const current = 'https:' + dataset.current
  let urlsArr = []
  if (dataset.urls.length) {
    const urls = dataset.urls
    for (let i = 0; i < urls.length; i++) {
      urlsArr.push('https:' + urls[i].src)
    }
  } else {
    urlsArr.push(urlsArr)
  }
  
  wx.previewImage({
    current: current,
    urls: urlsArr,
    success: function(res) {},
    fail: function(res) {},
    complete: function(res) {},
  })
}

module.exports = {
  previewImage: previewImage
}