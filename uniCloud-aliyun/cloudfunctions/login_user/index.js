'use strict';

const db = uniCloud.database()
const userDB = db.collection('bookUser')

exports.main = async (event, context) => {
    const username = event.username
    const password = event.password

    console.log("登录：正在查询用户信息")
    const userList = await userDB.where({
        username: username,
        password: password
    })
    const userCount = await userList.count()
    console.log("登录：查询用户信息完成")
    if (userCount.total > 0) {
        console.log("登录：用户存在，可以登录")
        return {
            code: 0,
            message: '登录成功'
        }
    } else {
        console.log("登录：用户不存在，登录失败")
        return {
            code: 1,
            message: '登录失败，请检查用户名或密码是否正确'
        }
    }
};
