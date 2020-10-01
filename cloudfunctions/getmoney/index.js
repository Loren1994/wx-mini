// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const moneyList = db.collection('moneyList')

// 云函数入口函数
exports.main = async (event, context) => {
  return await moneyList.orderBy('identify', 'desc').get({
    success: function (res) {
      res.data
    }
  })
}