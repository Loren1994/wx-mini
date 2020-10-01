// pages/loren/loren.js
Page({
  /**
   * 页面的初始数据
   */
  data: {

  },
  scanTap: function() {
    wx.scanCode({
      success: (res) => {
        console.log(res.result)
        let result = res.result
        wx.showModal({
          title: '结果',
          content: res.result,
          success: function(res) {
            wx.setClipboardData({
              data: result,
              success: function(res) {}
            })
          }
        })
      }
    })
  },
  callHimTap: function() {
    wx.makePhoneCall({
      phoneNumber: ''
    })
  },
  callHerTap: function() {
    wx.makePhoneCall({
      phoneNumber: '10010'
    })
  },
  phoneTap: function() {
    wx.getSystemInfo({
      success: function(res) {
        wx.showModal({
          title: '手机信息',
          content: "品牌:" + res.model +
            "屏幕密度:" + res.pixelRatio +
            "屏幕尺寸:" + res.windowWidth + " x " + res.windowHeight +
            "语言:" + res.language +
            "微信版本号:" + res.version,
          success: function(res) {}
        })
      }
    })
  },
  locationTap: function() {
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          scale: 28
        })
      }
    })
  },
  vibrateTap: function() {
    wx.vibrateShort({
      complete: {}
    })
  },
  newContactTap: function() {
    wx.addPhoneContact({})
  },
  bezierTap: function() {
    wx.navigateTo({
      url: '../contact/contact'
    })
  },
  bleTap: function() {
    wx.navigateTo({
      url: '../wifi/wifi'
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})