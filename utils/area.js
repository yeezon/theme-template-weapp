import oAreaDataJSON from '../assets/data/area/zh-CN.js'

let oAreaData = {}

function getAreaData (cb) {
  cb && cb(oAreaDataJSON)
  // Address.area().then(({ data }) => {
  //   cb && cb(data)
  // }).catch(oError => {})
}

function initAreaData (cb) {
  if (oAreaData.main) {
    cb && cb()
  } else {
    getAreaData(function (data) {
      oAreaData = data
      cb && cb()
    })
  }
}

function filterAreaData (data, whiteList) {
  if (Array.isArray(whiteList)) {
    const _whiteList = whiteList
    const filteredData = []
    let i, j
    for (i = 0; i < data.length; i++) {
      if (_whiteList.length === 0) {
        break
      }
      for (j = 0; j < _whiteList.length; j++) {
        if (data[i][0] === _whiteList[j]) {
          filteredData.push(data[i])
          _whiteList.splice(j, 1)
          break
        }
      }
    }
    if (filteredData.length === 0) {
      return data
    } else {
      return filteredData
    }
  } else {
    return data
  }
}

function areaFindNext (code, cb) {
  const aFind = []

  for (const aSub of oAreaData.sub) {
    if (aSub[2] === code) {
      aFind.push(aSub)
    }
  }

  cb && cb(aFind)
}

function areaFindPrev (code, cb) {
  const oFind = {}

  for (const aSub of oAreaData.sub) {
    if (aSub[0] === code) {
      oFind.district = aSub
      break
    }
  }

  if (oFind.district) {
    for (const aSub of oAreaData.sub) {
      if (aSub[0] === oFind.district[2]) {
        oFind.city = aSub
        break
      }
    }
  } else {
    // 一个上级都查不到，是省份
    for (const aSub of oAreaData.main) {
      if (aSub[0] === code) {
        oFind.province = aSub
        break
      }
    }

    if (cb) {
      cb(oFind)
      return
    }
  }

  if (!oFind.city) {
    oFind.city = oFind.district
    delete oFind.district
  }

  for (const aSub of oAreaData.main) {
    if (aSub[0] === oFind.city[2]) {
      oFind.province = aSub
      break
    }
  }

  cb && cb(oFind)
}

function areaFindCode (names, cb) {
  const oFind1 = {}
  const oFind2 = {}
  let topCode = ''

  if (names[2]) {
    for (const aSub of oAreaData.sub) {
      if (aSub[1] === names[2]) {
        oFind1[aSub[2]] = aSub[0]
      }
    }
  }

  if (names[1]) {
    for (const aSub of oAreaData.sub) {
      if (aSub[1] === names[1]) {
        if (oFind1[aSub[0]]) {
          oFind2[aSub[2]] = aSub[0]
        }
      }
    }
  }

  if (names[0]) {
    for (const aSub of oAreaData.main) {
      if (aSub[1] === names[0]) {
        topCode = aSub[0]
      }
    }
  }

  cb && cb(oFind1[oFind2[topCode]] || oFind2[topCode] || oFind1[topCode] || '')
}

function findNext (code, cb, whiteList) {
  const args = arguments
  initAreaData(function () {
    if (args.length > 1) {
      areaFindNext(code, function (o) {
        cb(filterAreaData(o, whiteList))
      })
    }
  })
}

function findPrev (code, cb) {
  const args = arguments
  initAreaData(function () {
    if (args.length === 2) {
      areaFindPrev(code, function (o) {
        cb(o)
      })
    }
  })
}

function getData (type, cb, whiteList) {
  initAreaData(function () {
    cb && cb(filterAreaData(oAreaData[type], whiteList))
  })
}

function findCode (names, cb, whiteList) {
  const args = arguments
  initAreaData(function () {
    if (args.length > 1) {
      areaFindCode(names, function (o) {
        cb(filterAreaData(o, whiteList))
      })
    }
  })
}

export default {
  findNext,
  findPrev,
  getData,
  findCode
}
