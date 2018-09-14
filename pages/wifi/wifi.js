// pages/wifi/wifi.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wifiName: '未连接,点击重试',
    wifiPwd: ''
  },
  goBle: function () {
    var _this = this
    wx.navigateTo({
      url: '../bluetooth/bluetooth?wifiName=' + _this.data.wifiName + '&wifiPwd=' + _this.data.wifiPwd
    })
  },
  bindKeyInput: function (e) {
    this.setData({
      wifiPwd: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getLocation()
    this.getWifiInfo()
  },

  getWifiInfo: function () {
    var _this = this
    //wifi初始化
    wx.startWifi({
      success: function (res) {
        console.log(res.errMsg)
        wx.getConnectedWifi({
          success: res => {
            _this.setData({
              wifiName: res.wifi.SSID
            })
          },
          fail: res => {
            console.log('获取WiFi信息失败', res)
            _this.setData({
              wifiName: '获取失败,点击重试'
            })
          }
        })
      },
      fail: function (res) {
        console.log('初始化失败', res)
      }
    })
  },

  getLocation: function () {
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        wx.setStorage({
          key: "location",
          data: res.latitude + '-' + res.longitude,
          success: function () {
            console.log("location存储成功")
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})