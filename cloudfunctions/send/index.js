// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

//预约成功通知
//预约人 {{thing11.DATA}}
//联系电话 {{phone_number4.DATA}}
//预约信息 {{thing13.DATA}}
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.subscribeMessage.send({
        touser: event.openid,
        page: 'pages/index/index',
        lang: 'zh_CN',
        data: {
          thing11: {
            value: event.name
          },
          phone_number4: {
            value: event.phone
          },
          thing13: {
            value: event.product
          }
        },
        templateId: 'P60tLGE8oXnILMhdn0jbNJWDVhbA6OUYwFYtwjYxkFo', 
        // miniprogramState: 'developer' //TODO remove
      })
    return result
  } catch (err) {
    return err
  }
}