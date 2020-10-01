// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const orderList = db.collection('orderList')

// 云函数入口函数
exports.main = async (event, context) => {
  orderList.add({
      data: {
        money: event.money,
        moneyid: event.moneyid,
        time: event.time,
        name: event.name,
        openid: event.openid,
        phone: event.phone,
        product: event.product,
        productid: event.productid,
      }
    })
    .then(res => {
      console.log(res)
    })

  return {
    code: 200
  }
}