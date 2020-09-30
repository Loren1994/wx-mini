// pages/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productList: ['封闭式净值2020', '因客周期净值002', '直销开放T1净值', '开放式净值001'],
    productIndex: 0,
    moneyList: ['20000元', '15000元', '10000元', '5000元'],
    moneyIndex: 0,
    isLoading: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    wx.showLoading({
      title: '正在提交',
    })
    setTimeout(function () {
      wx.hideLoading()
      wx.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 2000
      })
    }, 2000)
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