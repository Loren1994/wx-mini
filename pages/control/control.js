// pages/control/control.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    devId: "",
    isPush: "0",
    pushText: "开始推流",
    serviceId: "",
    charaId: "",
    isReConnect: true,
    slideValue: 0,
    isInit: true,
    checkBtn: 0,
    ipAddress: '',
    sendIpList: [],
    sendNum: 0,
    bleName: "",
    bleNameList: [],
    bleSendNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this
    _this.setData({
      devId: options.devId,
      bleName: options.bleName
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
  bindIpInput: function(e) {
    this.setData({
      ipAddress: e.detail.value
    })
  },
  bindBleInput: function(e) {
    this.setData({
      bleName: e.detail.value
    })
  },
  listenerSlider: function(e) {
    console.log(e.detail.value);
    this.setData({
      slideValue: e.detail.value
    })
    this.controlBright(e.detail.value)
  },
  connectBle: function(devId) {
    var _this = this
    wx.showToast({
      title: '连接中',
      icon: 'loading',
      duration: 2000
    })
    _this.setData({
      isInit: true
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
      let pushTemp = _this.ab2str(res.value).split("#")[0]
      let brightTemp = _this.ab2str(res.value).split("#")[1]
      _this.setData({
        isPush: pushTemp,
        pushText: pushTemp == "0" ? "开始推流" : "停止推流"
      })
      if (_this.data.isInit) {
        _this.setData({
          isInit: false,
          slideValue: brightTemp,
        })
      }
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
    wx.showToast({
      title: '请稍候',
      icon: 'loading',
      duration: 2000
    })
    var _this = this
    _this.setData({
      checkBtn: 0
    })
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
  controlBright: function(brightValue) {
    console.log('控制亮度')
    var _this = this
    wx.writeBLECharacteristicValue({
      deviceId: _this.data.devId,
      serviceId: _this.data.serviceId,
      characteristicId: _this.data.charaId,
      value: _this.char2buf(`${brightValue}#bright`),
      success: function(res) {
        console.log('写入成功', res)
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },
  bleNameTap: function() {
    console.log('待发送的蓝牙名称', this.data.bleName)
    var Base64 = require('../../pages/js-base64/we-base64.js')
    let sendStr = `${Base64.encode(this.data.bleName)}#bleName`
    let bleDataList = []
    console.log('要发送的数据为:', sendStr)
    console.log('要发送的数据长度为:', sendStr.length)
    let sendCount = Math.ceil(sendStr.length / 18)
    console.log('数据包数量', sendCount)
    if (wx.getSystemInfoSync()['platform'] != 'android' || sendCount == 1) {
      bleDataList[0] = this.char2buf(sendStr)
    } else {
      for (let i = 0; i < sendCount; i++) {
        let temp = ''
        if (i == sendCount - 1) {
          temp = sendStr.substring(sendStr.length % 18 == 0 ? 18 : sendStr.length - sendStr.length % 18)
        } else {
          temp = sendStr.substr(i == 0 ? 0 : i * 18, 18)
        }
        console.log(i + '单包数据为:', temp)
        bleDataList[i] = this.char2buf(temp)
      }
    }
    this.setData({
      bleNameList: bleDataList
    })
    wx.showToast({
      title: '正在发送',
      icon: 'loading',
      duration: 2000
    })
    setTimeout(() => {
      this.writeBleName()
    }, 3000)
  },
  writeBleName: function() {
    var _this = this
    if (_this.data.bleSendNum >= _this.data.bleNameList.length) {
      wx.hideLoading()
      wx.showToast({
        title: '发送成功',
        icon: 'success',
        duration: 2000
      })
      _this.setData({
        bleSendNum: 0
      })
      wx.navigateBack({
        delta: 1
      })
      return
    }
    wx.writeBLECharacteristicValue({
      deviceId: _this.data.devId,
      serviceId: _this.data.serviceId,
      characteristicId: _this.data.charaId,
      value: _this.data.bleNameList[_this.data.bleSendNum],
      success: function(res) {
        console.log('写入成功', res)
        setTimeout(function() {
          _this.data.bleSendNum++
            console.log(_this.data.bleSendNum)
          _this.writeBleName()
        }, 250)
      },
      fail: function(res) {
        console.log(res)
        _this.setData({
          bleSendNum: 0
        })
      }
    })
  },
  sendIp: function() {
    console.log('发送IP地址_分包')
    let ipDataList = []
    let dataTemp = `${this.data.ipAddress}#ip`
    let sendCount = Math.ceil(dataTemp.length / 18)
    console.log('要发送的数据为:', dataTemp)
    console.log('要发送的数据包为:', sendCount)
    if (wx.getSystemInfoSync()['platform'] != 'android' || sendCount == 1) {
      ipDataList[0] = dataTemp
    } else {
      ipDataList[0] = dataTemp.substr(0, 18)
      console.log("第1个包", ipDataList[0])
      ipDataList[1] = dataTemp.substring(dataTemp.length - dataTemp.length % 18)
      console.log("第2个包", ipDataList[1])
    }
    this.setData({
      sendIpList: ipDataList
    })
    wx.showToast({
      title: '正在发送',
      icon: 'loading',
      duration: 2000
    })
    setTimeout(() => {
      this.writeIP()
    }, 3000)
  },
  writeIP: function() {
    var _this = this
    if (_this.data.sendNum >= _this.data.sendIpList.length) {
      wx.hideLoading()
      wx.showToast({
        title: '发送成功',
        icon: 'success',
        duration: 2000
      })
      _this.setData({
        sendNum: 0
      })
      return
    }
    wx.writeBLECharacteristicValue({
      deviceId: _this.data.devId,
      serviceId: _this.data.serviceId,
      characteristicId: _this.data.charaId,
      value: _this.char2buf(_this.data.sendIpList[_this.data.sendNum]),
      success: function(res) {
        console.log('写入成功', res)
        setTimeout(function() {
          _this.data.sendNum++
            console.log(_this.data.sendNum)
          _this.writeIP()
        }, 250)
      },
      fail: function(res) {
        console.log(res)
        _this.setData({
          sendNum: 0
        })
      }
    })
  },
  takePhoto: function() {
    console.log('拍照控制')
    wx.showToast({
      title: '请稍候',
      icon: 'loading',
      duration: 1000
    })
    var _this = this
    _this.setData({
      checkBtn: 1
    })
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