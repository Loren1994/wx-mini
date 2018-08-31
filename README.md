# 小程序BLE踩坑记录
[前往官方文档](https://developers.weixin.qq.com/miniprogram/dev/api/bluetooth.html)

##### 项目描述

手机小程序通过BLE向android设备发送WIFI名称/密码等信息，设备收到后自动联网。

##### 项目流程

设备首先添加自定义服务UUID和特征UUID。

用户预先连接WiFi、自动获取当前WiFi名称、用户填写当前WiFi密码、

初始化蓝牙、扫描BLE、获取扫描到的设备、点击连接BLE设备、获取该设备的所有服务UUID、

获取目标服务UUID的所有特征值、根据设备ID，特定服务UUID，特定特征值UUID写入数据。

##### 写入数据特殊部分

* IOS：不需要分包发送，发送数据无限制，数据多传送时间削微变长。
* Android：单次最大发送20字节，所以需要分包发送，且需要自己实现。

##### 踩坑记录

* 扫描

扫描成功后，不要立马调用停止扫描，不然在远程调试的时候一切正常，预览或者发布之后显示搜索到的结果列表长度为0。

* 获取扫描结果

该项目扫描场景是已进入页面自动扫描，测试时wx.getBluetoothDevices每次都是一进入时搜不到，点击重新扫描便可以立马搜索到。建议使用wx.onBluetoothDeviceFound获取扫描结果，但需要自行去重和过滤。扫描时间持续比较长，可以在点击连接时先用wx.stopBluetoothDevicesDiscovery停止扫描。

~~~~js
//去重及过滤
wx.onBluetoothDeviceFound(function (obj) {
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
~~~~

* 连接设备

遇到过连接一直操作超时，errCode10003，这里的原因很多，官方的讨论也很多，这里我重启了一次设备就好了，因此可能是设备问题，也可能是连接实例太多导致，最好发送完数据后用wx.closeBLEConnection关闭连接。

* 写数据

写数据是需要用到deviceId，serviceUUID，characteristicUUID，这三个值都必须通过Api获取，我试过不走Api，直接填入serviceUUID，characteristicUUID，结果写入失败。也可能是大小写和分隔符“-”的问题，不过最好是通过Api去拿值。还有，发送的数据需要转为ArrayBuffer格式。

~~~~js
//字符串转ArrayBuffer
char2buf(str) {
  var out = new ArrayBuffer(str.length)
  var u8a = new Uint8Array(out)
  var strs = str.split("")
  for (var i = 0; i < strs.length; i++) {
    u8a[i] = strs[i].charCodeAt()
  }
  return out
}
~~~~

* 分包

整体思路为：

将发送的数据分为多条数据，保存到一个全局数组中，循环发送每一条数据，发送一条后在发送成功的回调中进行下一条数据发送，若其中一条失败，则从头重新开始。这里发送用的递归。特别注意的是，android每次发送后必须延时一段时间再发送下一条数据，不然会写入失败，推荐延时250ms。

一个包数据为20字节，但实际上单次可供发送的只有18字节，所以按照18去分包。

还需要对数据进行分割，这里每种数据使用||分割，使用#end作为结束标识符。设备监测到有此标识符则开始联网。

~~~~javascript
//递归
writeData: function (devId, serviceId, charaId) {
    var _this = this
    if (_this.data.sendNum >= _this.data.sendDataList.length) {
      wx.closeBLEConnection({
        deviceId: devId,
        success: function (res) {
          console.log(res)
        }
      })
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
      success: function (res) {
        console.log('写入成功', res.errMsg)
        setTimeout(function () {
          _this.data.sendNum++
          console.log(_this.data.sendNum)
          _this.writeData(devId, serviceId, charaId)
        }, 250)
      },
      fail: function (res) {
        console.log(res)
        _this.setData({
          sendNum: 0
        })
      }
    })
  }
~~~~



[完整BLE代码](https://github.com/Loren1994/wx-mini/blob/master/pages/bluetooth/bluetooth.js)

> 实际上#end和||分割存在bug，若数据中含有此类字符会导致设备端接收数据错误。此处不再深究。

[项目地址](https://github.com/Loren1994/wx-mini)