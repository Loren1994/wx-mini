// pages/bluetooth/bluetooth.js

// var WIFI_SERVICE_UUID = "7df2f9d6-0424-48ec-91a4-1e23ef1db1a9"
// var WIFI_CHAR_UUID = "0f65cc81-9d20-414a-bd83-0ceb74302e7b"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scanDevices: [],
    wifiName: '',
    wifiPwd: '',
    sendDataList: [],
    sendNum: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this
    _this.setData({
      wifiName: options.wifiName,
      wifiPwd: options.wifiPwd
    })
    _this.data.wifiPwd = _this.data.wifiPwd == '' ? '@' : _this.data.wifiPwd
    console.log(wx.getSystemInfoSync()['platform'])
    if (wx.getSystemInfoSync()['platform'] != 'android') {
      this.getSendDataForIOS()
    } else {
      this.getSendData()
    }
    //初始化
    wx.openBluetoothAdapter({
      success: function(res) {
        _this.scanBle()
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
    //扫描设备
    wx.startBluetoothDevicesDiscovery({
      services: [],
      success: function(res) {
        //获取扫描到的设备
        // wx.getBluetoothDevices({
        //   success: (res) => {
        //     wx.hideLoading()
        //     wx.showToast({
        //       title: '扫描成功',
        //       icon: 'success',
        //       duration: 2000
        //     })
        //     console.log(res)
        //     var filterList = res.devices.filter((item) => item.name != '未知设备')
        //     console.log(filterList)
        //     _this.setData({
        //       scanDevices: filterList
        //     })
        //   }
        // })
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
  bleClick: function(e) {
    var _this = this
    var devId = e.currentTarget.dataset.devid
    console.log(_this.data.scanDevices)
    wx.stopBluetoothDevicesDiscovery({
      success: function(res) {
        console.log(res)
        wx.showToast({
          title: '连接中',
          icon: 'loading',
          duration: 2000
        })
        console.log('开始连接')
        _this.connectBle(devId)
      }
    })
  },
  connectBle: function(devId) {
    var _this = this
    //点击连接设备
    wx.createBLEConnection({
      deviceId: devId,
      success: function(res) {
        console.log(res)
        var serviceId, charaId
        //获取服务
        wx.getBLEDeviceServices({
          deviceId: devId,
          success: function(res) {
            console.log(res.services)
            serviceId = res.services[0].uuid
            //获取特征值
            wx.getBLEDeviceCharacteristics({
              deviceId: devId,
              serviceId: serviceId,
              success: function(res) {
                console.log('device getBLEDeviceCharacteristics:', res.characteristics)
                charaId = res.characteristics[0].uuid
                _this.listener(devId, serviceId, charaId)
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
  listener: function(devId, serviceId, charaId) {
    var _this = this
    wx.notifyBLECharacteristicValueChange({
      state: true,
      deviceId: devId,
      serviceId: serviceId,
      characteristicId: charaId,
      success: function(res) {
        console.log(res)
      },
      fail(res) {
        console.log(res);
      }
    })
    wx.onBLECharacteristicValueChange(function(res) {
      let data = _this.ab2str(res.value)
      console.log('收到数据', data)
      wx.showToast({
        title: (data == 'connected') ? "联网成功" : "正在联网",
        icon: (data == 'connected') ? 'success' : 'loading',
        duration: 2000
      })
      //关闭连接
      if (data == 'connected') {
        wx.closeBLEConnection({
          deviceId: devId,
          success: function(res) {
            console.log(res)
            wx.navigateBack({
              delta: 1
            })
          }
        })
      }
    })
    //向特征值写入数据
    setTimeout(() => {
      _this.writeData(devId, serviceId, charaId)
    }, 3000)
  },
  writeData: function(devId, serviceId, charaId) {
    console.log("开始写入数据")
    var _this = this
    if (_this.data.sendNum >= _this.data.sendDataList.length) {
      //关闭连接
      // wx.closeBLEConnection({
      //   deviceId: devId,
      //   success: function(res) {
      //     console.log(res)
      //   }
      // })
      wx.hideLoading()
      wx.showToast({
        title: '发送成功',
        icon: 'success',
        duration: 2000
      })
      return
    }
    wx.writeBLECharacteristicValue({
      deviceId: devId,
      serviceId: serviceId,
      characteristicId: charaId,
      value: _this.data.sendDataList[_this.data.sendNum],
      success: function(res) {
        console.log('写入成功', res.errMsg)
        setTimeout(function() {
          _this.data.sendNum++
            console.log(_this.data.sendNum)
          _this.writeData(devId, serviceId, charaId)
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
  getSendData: function() {
    var Base64 = require('../../pages/js-base64/we-base64.js')
    this.setData({
      sendDataList: []
    })
    // var location = wx.getStorageSync('location').split('-')
    var lat = '0.0' //location[0]
    var lon = '0.0' //location[1]
    var sendStr = Base64.encode(this.data.wifiName) + '||' + this.data.wifiPwd + '||' + lon + '||' + lat + '#end'
    console.log('要发送的数据为:', sendStr)
    console.log('要发送的数据长度为:', sendStr.length)
    var sendCount = Math.ceil(sendStr.length / 18)
    console.log('发送的数据包数为:' + sendCount)
    var totalSendData = []
    for (let i = 0; i < sendCount; i++) {
      let temp = ''
      if (i == sendCount - 1) {
        temp = sendStr.substring(sendStr.length % 18 == 0 ? 18 : sendStr.length - sendStr.length % 18)
      } else {
        temp = sendStr.substr(i == 0 ? 0 : i * 18, 18)
      }
      console.log(i + '单包数据为:', temp)
      totalSendData[i] = this.char2buf(temp)
    }
    console.log(totalSendData)
    this.setData({
      sendDataList: totalSendData
    })
  },

  getSendDataForIOS: function() {
    var Base64 = require('../../pages/js-base64/we-base64.js')
    this.setData({
      sendDataList: []
    })
    // var location = wx.getStorageSync('location').split('-')
    var lat = '0.0' // location[0]
    var lon = '0.0' //location[1]
    var sendStr = Base64.encode(this.data.wifiName) + '||' + this.data.wifiPwd + '||' + lon + '||' + lat + '#end'
    console.log('要发送的数据为:', sendStr)
    console.log('要发送的数据长度为:', sendStr.length)
    var totalSendData = []
    totalSendData[0] = this.char2buf(sendStr)
    console.log(totalSendData)
    this.setData({
      sendDataList: totalSendData
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

  /**
   * 生命周期函数--监听页面隐藏
   */
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
    wx.stopBluetoothDevicesDiscovery({
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