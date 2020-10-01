// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const productList = db.collection('productList')

// 云函数入口函数
exports.main = async (event, context) => {
  return await productList.get({
    success: function (res) {
       res.data
    }
  })
}