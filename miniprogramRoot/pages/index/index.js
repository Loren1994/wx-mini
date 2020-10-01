//index.js
//获取应用实例
const app = getApp()
wx.cloud.init()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo)
            }
          })
        }
      }
    })
  },

  //我要预约
  bindGetUserInfo(e) {
    console.log(e.detail.userInfo)
    wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        console.log('callFunction test result: ', res.result.openid)
        // wx.setStorage({
        //   key: "openid",
        //   data: res.result.openid
        // })
        if (e.detail.userInfo) {
          console.log("进入预约")
          wx.navigateTo({
            url: `../order/order?openid=${res.result.openid}`,
          })
        }
      }
    })
  },
  //预约历史
  bindHistory() {
    wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        console.log('callFunction test result: ', res.result.openid)
        wx.navigateTo({
          url: `../history/history?openid=${res.result.openid}`,
        })
      }
    })
  },
  // 打开权限设置页提示框
  showSettingToast: function (e) {
    wx.showModal({
      title: '提示！',
      confirmText: '去设置',
      showCancel: false,
      content: e,
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../setting/setting',
          })
        }
      }
    })
  }
})