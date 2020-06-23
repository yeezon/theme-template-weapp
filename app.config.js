
const oExtConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {}

const oNewConfig = oExtConfig.config || {
  "site_name": "友好速搭",
  "site_id": "",
  "site_host": "demo.youhaovip.com",
  "site_alias": "demo",
  "saas_site_host": "site.youhaosuda.com",
  "saas_api": "youhaosuda.com/api"
}

const oNewSetting = oExtConfig.setting || {}

const oConfig = {
  is_ext: !!oExtConfig.config,
  you_api_url: `https://${oNewConfig.saas_api}`,
  api_url: `https://${oNewConfig.saas_site_host}`,
  alias: oNewConfig.site_alias,
  host: oNewConfig.site_host,
  host_url: `https://${oNewConfig.site_host}`,
  shop: {
    site_id: oNewConfig.site_id || '',
    name: oNewConfig.site_name || ''
  }
}

module.exports = oConfig
