// pages/contact/contact.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cName: "",
    cPhone: ""
  },
  submitTap: function () {
    wx.addPhoneContact({
      firstName: 'a',
      lastName: 'a',
      mobilePhoneNumber: this.data.cPhone,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var context = wx.createCanvasContext('bezierView1')
    var context2 = wx.createCanvasContext('bezierView2')

    let RADIUS = 100
    let bezier = 0.551915024494
    let offset = RADIUS * bezier
    let loveOffset = RADIUS / 2

    let centerPoint = { x: 100, y: 100 }
    let point0 = { x: centerPoint.x, y: centerPoint.y + RADIUS }
    let point1 = { x: centerPoint.x + offset, y: centerPoint.y + RADIUS }
    let point2 = { x: centerPoint.x + RADIUS, y: centerPoint.y + offset }
    let point3 = { x: centerPoint.x + RADIUS, y: centerPoint.y }
    let point4 = { x: centerPoint.x + RADIUS, y: centerPoint.y - offset }
    let point5 = { x: centerPoint.x + offset, y: centerPoint.y - RADIUS }
    let point6 = { x: centerPoint.x, y: centerPoint.y - RADIUS }
    let point7 = { x: centerPoint.x - offset, y: centerPoint.y - RADIUS }
    let point8 = { x: centerPoint.x - RADIUS, y: centerPoint.y - offset }
    let point9 = { x: centerPoint.x - RADIUS, y: centerPoint.y }
    let point10 = { x: centerPoint.x - RADIUS, y: centerPoint.y + offset }
    let point11 = { x: centerPoint.x - offset, y: centerPoint.y + RADIUS }

    context.setLineWidth(3)
    context.setFillStyle("#cc3333")

    context2.setLineWidth(3)
    context2.setFillStyle("#cc3333")
    //圆形
    context2.moveTo(point6.x, point6.y)
    context2.bezierCurveTo(point5.x, point5.y, point4.x, point4.y, point3.x, point3.y)
    context2.bezierCurveTo(point2.x, point2.y, point1.x, point1.y, point0.x, point0.y)
    context2.bezierCurveTo(point11.x, point11.y, point10.x, point10.y, point9.x, point9.y)
    context2.bezierCurveTo(point8.x, point8.y, point7.x, point7.y, point6.x, point6.y)

    context.moveTo(point6.x, loveOffset)
    context.bezierCurveTo(point5.x, point5.y, point4.x, point4.y, point3.x, point3.y)
    context.bezierCurveTo(2.0 * RADIUS - 2.0 / 21.0 * loveOffset, point2.y, point1.x, 2.0 * RADIUS - 2.0 / 3.0 * loveOffset, point0.x, point0.y)
    context.bezierCurveTo(point11.x, 2.0 * RADIUS - 2.0 / 3.0 * loveOffset, 2.0 / 21.0 * loveOffset, point10.y, point9.x, point9.y)
    context.bezierCurveTo(point8.x, point8.y, point7.x, point7.y, point6.x, loveOffset)

    context.fill()
    context.draw()
    context2.fill()
    context2.draw()
  },

  bezier1Tap: function () {
    wx.showToast({
      title: '心形',
      icon: 'none',
      duration: 2000
    })
  },
  bezier2Tap: function () {
    wx.showToast({
      title: '圆形',
      icon: 'none',
      duration: 2000
    })
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