// pages/control/control.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    devId: "",
    isPush: "0",
    pushText: "推流",
    serviceId: "",
    charaId: "",
    isReConnect: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this
    _this.setData({
      devId: options.devId
    })
    //初始化
    wx.openBluetoothAdapter({
      success: function(res) {
        wx.onBLEConnectionStateChange(function(res) {
          console.log('onBLEConnectionStateChanges', res)
          //断开重连
          if (_this.data.isReConnect && !res.connected) {
            _this.connectBle(res.deviceId)
          }
        })
        _this.connectBle(_this.data.devId)
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
  connectBle: function(devId) {
    var _this = this
    wx.showToast({
      title: '连接中',
      icon: 'loading',
      duration: 2000
    })
    //点击连接设备
    wx.createBLEConnection({
      deviceId: devId,
      success: function(res) {
        console.log(res)
        wx.showToast({
          title: '连接成功',
          icon: 'success',
          duration: 2000
        })
        //获取服务
        wx.getBLEDeviceServices({
          deviceId: devId,
          success: function(res) {
            console.log('getBLEDeviceServices', res)
            _this.setData({
              serviceId: res.services[0].uuid
            })
            //获取特征值
            wx.getBLEDeviceCharacteristics({
              deviceId: devId,
              serviceId: _this.data.serviceId,
              success: function(res) {
                console.log('device getBLEDeviceCharacteristics:', res)
                _this.setData({
                  charaId: res.characteristics[0].uuid
                })
                _this.listener()
              }
            })
          }
        })
      },
      fail: res => {
        //连接失败
        console.log(res)
      }
    })
  },
  listener: function() {
    var _this = this
    wx.notifyBLECharacteristicValueChange({
      state: true,
      deviceId: _this.data.devId,
      serviceId: _this.data.serviceId,
      characteristicId: _this.data.charaId,
      success: function(res) {
        console.log(res)
      },
      fail(res) {
        console.log(res);
      }
    })
    wx.onBLECharacteristicValueChange(function(res) {
      console.log('收到数据', _this.ab2str(res.value))
      _this.setData({
        isPush: _this.ab2str(res.value),
      })
      _this.setData({
        pushText: _this.data.isPush == "0" ? "推流" : "停止"
      })
      if (_this.data.isPush == "1") {
        wx.showToast({
          title: "开始推流",
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  pushTap: function() {
    console.log('推流控制')
    var _this = this
    wx.writeBLECharacteristicValue({
      deviceId: _this.data.devId,
      serviceId: _this.data.serviceId,
      characteristicId: _this.data.charaId,
      value: _this.char2buf(`${_this.data.isPush}#push`),
      success: function(res) {
        console.log('写入成功', res)
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },
  takePhoto: function() {
    console.log('拍照控制')
    var _this = this
    wx.writeBLECharacteristicValue({
      deviceId: _this.data.devId,
      serviceId: _this.data.serviceId,
      characteristicId: _this.data.charaId,
      value: _this.char2buf("1#photo"),
      success: function(res) {
        console.log('写入成功', res)
      },
      fail: function(res) {
        console.log(res)
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
    this.setData({
      isReConnect: false
    })
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