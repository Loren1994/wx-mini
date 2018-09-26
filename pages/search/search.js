// pages/control/control.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.scanBle()
  },

  scanBle: function() {
    var _this = this
    _this.setData({
      scanDevices: []
    })
    wx.showToast({
      title: '扫描中',
      icon: 'loading',
      duration: 2000
    })
    //初始化
    wx.openBluetoothAdapter({
      success: function(res) {
        //扫描设备
        wx.startBluetoothDevicesDiscovery({
          services: [],
          success: function(res) {
            wx.onBluetoothDeviceFound(function(obj) {
              // console.dir(obj.devices[0])
              var temp = _this.data.scanDevices
              if (obj.devices[0].name) {
                obj.devices.map(dev => {
                  let pDev = temp.find((it) => {
                    return it.deviceId == dev.deviceId
                  })
                  if (!pDev) {
                    temp.push(dev)
                  }
                })
              }
              _this.setData({
                scanDevices: temp
              })
            })
          },
          fail: (res) => {
            wx.hideLoading()
            wx.showToast({
              title: '扫描失败',
              icon: 'success',
              duration: 2000
            })
            //扫描失败
            console.log(res)
          },
          complete: function(res) {
            //扫描完成
            console.log(res)
          }
        })
      },
      fail: function(res) {
        //初始化失败
        console.log(res);
      },
      complete: function(res) {
        // 初始化完成
      }
    })
  },
  bleClick: function(e) {
    var _this = this
    var devId = e.currentTarget.dataset.devid
    console.log(_this.data.scanDevices)
    wx.stopBluetoothDevicesDiscovery({
      success: function(res) {
        console.log(res)
        wx.navigateTo({
          url: '../control/control?devId=' + devId
        })
      }
    })
  },
  char2buf(str) {
    var out = new ArrayBuffer(str.length)
    var u8a = new Uint8Array(out)
    var strs = str.split("")
    for (var i = 0; i < strs.length; i++) {
      u8a[i] = strs[i].charCodeAt()
    }
    return out
  },
  ab2str: function(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
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

  onHide: function() {
    console.log(">>>onHide")
    wx.stopBluetoothDevicesDiscovery({
      success: function(res) {
        console.log(res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    console.log(">>>onUnload")
    wx.closeBluetoothAdapter({
      success: function(res) {
        console.log(res)
      }
    })
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