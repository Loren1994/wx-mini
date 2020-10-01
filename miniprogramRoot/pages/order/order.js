// pages/order/order.js

wx.cloud.init()
var util = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productList: [],
    productIndex: 0,
    moneyList: [],
    moneyIndex: 0,
    name: "",
    phone: "",
    userid: "",
  },
  bindNameInput: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindPhoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  getProductList: function () {
    let thiz = this
    wx.cloud.callFunction({
      name: 'getproduct',
      complete(res) {
        console.log(res)
        thiz.setData({
          productList: res.result.data
        })
      }
    })
  },
  getMoneyList() {
    let thiz = this
    wx.cloud.callFunction({
      name: 'getmoney',
      complete(res) {
        console.log(res)
        thiz.setData({
          moneyList: res.result.data
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      userid: options.openid
    })
    this.getProductList()
    this.getMoneyList()
  },

  bindProductChange: function (e) {
    console.log('bindProductChange', e.detail.value)
    this.setData({
      productIndex: e.detail.value
    })
  },
  bindMoneyChange: function (e) {
    console.log('bindMoneyChange', e.detail.value)
    this.setData({
      moneyIndex: e.detail.value
    })
  },
  // 提交
  submit() {
    console.log(this.data.name, this.data.phone, this.data.userid)
    var thiz = this
    if (!this.data.name || !this.data.phone) {
      wx.showModal({
        title: '提示',
        content: '请填写完整信息',
        success(res) {}
      })
      return
    }
    wx.requestSubscribeMessage({
      tmplIds: ['P60tLGE8oXnILMhdn0jbNJWDVhbA6OUYwFYtwjYxkFo'],
      success(res) {
        console.log(res)
        let b = res['P60tLGE8oXnILMhdn0jbNJWDVhbA6OUYwFYtwjYxkFo'] === "accept"
        if (!b) {
          wx.showModal({
            title: '提示',
            content: '请订阅通知消息以便我们更好的通知您',
            success(res) {}
          })
          return
        }
        wx.showLoading({
          title: '正在提交',
        })
        //保存预约
        wx.cloud.callFunction({
          name: 'saveorder',
          data: {
            time: util.formatTime(new Date()),
            openid: thiz.data.userid,
            name: thiz.data.name,
            phone: thiz.data.phone,
            product: thiz.data.productList[thiz.data.productIndex].name,
            productid: thiz.data.productList[thiz.data.productIndex].identify,
            money: thiz.data.moneyList[thiz.data.moneyIndex].money,
            moneyid: thiz.data.moneyList[thiz.data.moneyIndex].identify,
          },
          complete(res) {
            console.log(res)
            //通知成功
            wx.cloud.callFunction({
              name: 'send',
              data: {
                openid: thiz.data.userid,
                name: thiz.data.name,
                phone: thiz.data.phone,
                product: `${thiz.data.productList[thiz.data.productIndex].name}-${thiz.data.moneyList[thiz.data.moneyIndex].money}`,
              },
              complete(res) {
                wx.hideLoading()
                wx.showToast({
                  title: '提交成功',
                  icon: 'success',
                  duration: 2000
                })
                wx.navigateBack({})
              }
            })
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