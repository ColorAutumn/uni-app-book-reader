'use strict';

const db = uniCloud.database()
const userDB = db.collection('bookUser')

exports.main = async (event, context) => {
    const username = event.username
    const password = event.password

    console.log("注册：正在查询用户列表")
    const userList = await userDB.where({
        username: username,
        password: password
    })
    console.log("注册：查询用户列表完成")
    const count = await userList.count()
    console.log("注册：查询用户列表数量为：" + count.total)
    if (count.total === 0) {
        console.log("注册：用户名不存在，开始添加用户")
        await userDB.add({
            username: username,
            password: password
        })
        console.log("注册：添加用户完成")
        return {
            code: 0,
            message: '注册成功'
        }
    } else {
        console.log("注册：用户名已存在")
        return {
            code: 1,
            message: '用户名已存在'
        }
    }
};
