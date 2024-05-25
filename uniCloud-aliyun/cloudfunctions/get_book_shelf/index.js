'use strict';
const db = uniCloud.database()
const shelfDB = db.collection('bookShelf')
exports.main = async (event, context) => {
    const username = event.username

    const result = await shelfDB.where({
        username: username
    }).get()

    if (result.data.length === 0)
        return {
            code: 0,
            message: '书架暂无此人信息，请先同步备份一次',
            data: []
        }
    else {
		console.log(result)
        return {
            code: 0,
            message: '获取书架信息成功',
            data: result.data[0].bookShelf
        }
    }
};
