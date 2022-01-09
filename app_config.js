
const oExtConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {}

const oNewConfig = oExtConfig.config || {
  "SITE_DOMAIN": "weapp-demo.wodavip.com", // 必填
  "SITE_ALIAS": "" // 选填 - 填写后会使用 site.youhaosuda.com 模式
}

// const oNewSetting = oExtConfig.setting || {}

export default {
  ...oNewConfig
}
