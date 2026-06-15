/**
 * Google AdSense 配置
 * 1. 在 https://www.google.com/adsense 申请并获取发布商 ID（ca-pub-xxxxxxxx）
 * 2. 在 AdSense 后台创建广告单元，填入下方 slots
 * 3. 将 enabled 设为 true 并提交部署
 */
window.ADS_CONFIG = {
  enabled: true,
  client: 'ca-pub-2045994937692573',
  slots: {
    top: '',
    mid: '',
    bottom: ''
  }
};
