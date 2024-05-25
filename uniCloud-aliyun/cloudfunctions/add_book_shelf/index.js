'use strict';

const db = uniCloud.database()
const bookShelfDB = db.collection('bookShelf')

exports.main = async (event, context) => {
    const userShelf = await bookShelfDB.where({
        username: event.username
    })

    const count = await userShelf.count()
    console.log(event)
    if (count.total === 0) {
        console.log('用户书架不存在，创建新书架')
        const result = await bookShelfDB.add({
            username: event.username,
            bookShelf: event.bookShelf
        })
        console.log("用户书架不存在，创建新书架" + result)
    } else {
        console.log('用户书架已存在，更新书架')
        const result = await bookShelfDB.where({
            username: event.username
        })
        const updateResult = await result.update({
            bookShelf: event.bookShelf
        })
        console.log('用户书架已存在，更新书架' + updateResult)
    }
    //返回数据给客户端
    return {
        code: 0,
        message: '同步成功'
    }
};
