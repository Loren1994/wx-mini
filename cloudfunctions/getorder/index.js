// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const orderList = db.collection('orderList')

// 云函数入口函数
exports.main = async (event, context) => {
  return await orderList.where({
    openid: event.openid
  }).orderBy('time','desc').get({
    success: function (res) {
       res.data
    }
  })
}