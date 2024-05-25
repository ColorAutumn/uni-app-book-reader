<template>
  <BookList :book-list="bookStoreList"/>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import type {BookItemData, UserInfo} from "@/utils/typings";
import BookList from "@/components/self/BookList.vue";
import {useBookShelfStore} from "@/stores/bookShelf";
import {onShow} from "@dcloudio/uni-app";

const bookStoreList = ref<BookItemData[]>([])
const bookShelfStore = new useBookShelfStore()
const userInfo = ref<UserInfo>({
  loginStatus: false,
  username: "",
})
onShow(async () => {
  bookStoreList.value = await bookShelfStore.getBookList()
  bookStoreList.value.forEach(book => {
    console.log(`加载本地书籍：${book.articlename}`)
  })
  uni.getStorage({
    key: "userInfo",
    success: (res) => {
      // 已经登录，同步数据
      userInfo.value = JSON.parse(res.data)
      if (userInfo.value.loginStatus) {
        console.log("已登录，开始同步数据")
        uniCloud.callFunction({
          name: "get_book_shelf",
          data: userInfo.value,
          success: async (res) => {
            const cloudResult = res.result.data
            console.log("云端书架：" + cloudResult)
            const mergedSet = deduplicateBooks(bookStoreList.value, cloudResult)

            console.log("数据整合完成：" + mergedSet)

            const uploadResult = await uniCloud.callFunction({
              name: "add_book_shelf",
              data: {username: userInfo.value.username, bookShelf: mergedSet}
            })
            console.log("上传云端数据" + uploadResult)

            await bookShelfStore.setBookShelf(mergedSet)
            bookStoreList.value = mergedSet
            console.log("同步完成")
          }
        })
      }
    }
  })
})

const deduplicateBooks = (list1: BookItemData[], list2: BookItemData[]): BookItemData[] => {
  // 创建一个临时对象来存储唯一的 url_list
  const urlMap: { [key: string]: BookItemData } = {};

  // 遍历第一个列表，并存储到临时对象中
  list1.forEach(item => {
    urlMap[item.url_list] = item;
  });

  // 遍历第二个列表，并存储到临时对象中
  list2.forEach(item => {
    urlMap[item.url_list] = item;
  });

  // 从临时对象中获取所有值，形成去重后的数组
  return Object.values(urlMap);
}

const isBookEqual = (book1: BookItemData, book2: BookItemData): boolean => {
  return book1.url_list === book2.url_list;
}

</script>
