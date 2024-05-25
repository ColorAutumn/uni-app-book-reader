<template>
  <view class="book">
    <view class="book-cover-container">
      <image class="book-cover" :src="book.url_img"/>
    </view>
    <view class="book-info">
      <view class="book-name">
        <text>{{ book.articlename }}</text>
      </view>
      <view>
        <text class="book-other">作者：{{ book.author }}</text>
      </view>
      <view>
        <text class="book-other">简介：{{ book.intro }}</text>
      </view>
    </view>
  </view>

  <view style="display: flex">
    <button type="primary" plain="true" :hover-stay-time="100" @click="startToRead">开始阅读</button>
    <button type="primary" plain="true" :hover-stay-time="100" @click="addOrRemoveWithShelf">{{
        isExitShelf ? '移出书架' : '加入书架'
      }}
    </button>
  </view>

  <uni-list>
    <uni-list-item
        v-for="(bookChapter, index) in bookChapterList"
        :key="index"
        ellipsis="1"
        :title="bookChapter.title"
        clickable
        @click="onClickChapter(bookChapter.link)"/>
  </uni-list>
</template>
<script setup lang="ts">
import {onLoad} from "@dcloudio/uni-app";
import {getBookByUrlListService} from "@/api/books";
import {ref} from "vue";
import type {BookChapterData, BookItemData, UserInfo} from "@/utils/typings";
import {useBookShelfStore} from "@/stores/bookShelf";

const book = ref<BookItemData>({
  articlename: "",
  author: "",
  url_list: "",
  url_img: "",
  intro: ""
})
const bookChapterList = ref<BookChapterData[]>([])
let bookId = ''
const isExitShelf = ref(false)
onLoad(async (params) => {
  bookId = params?.book_id
  uni.getStorage({
    key: `/book/${bookId}/`,
    success: async (res) => {
      book.value = res.data
      isExitShelf.value = await bookShelfStore.isExitShelf(`/book/${bookId}/`)
    }
  })
  await getBookChapterList(book.value.url_list)
})
const getBookChapterList = async (bookUrl: string) => {
  await uni.showToast({
    title: "正在请求章节列表",
    icon: "loading",
    duration: 1000
  })
  let result = await getBookByUrlListService(bookUrl);
  result.replace("<\!DOCTYPE html>", "")

  const parser = new DOMParser();
  const doc = parser.parseFromString(result, 'text/html');
  // 通过DOM操作获取所需内容
  const rootNodes = doc.querySelector(".book_last");
  if (rootNodes) {
    const nodes = rootNodes.querySelectorAll("dl dd");
    bookChapterList.value = []
    for (let i = 1; i < nodes.length; i++) {
      const node = nodes[i];
      const anchor = node.querySelector('a');
      if (anchor) {
        const bookChapter: BookChapterData = {
          title: anchor.text,
          link: anchor.href.substring(anchor.href.indexOf("/book"))
        }
        bookChapterList.value.push(bookChapter)
      }
    }
  }
  console.log("已请求到章节条数：" + bookChapterList.value.length)
}

const onClickChapter = (chapterLink: string) => {
  const chapterId = chapterLink.replace(book.value.url_list, "").replace(".html", "")
  uni.navigateTo({
    url: `/pages/bookChapter/BookChapter?book_id=${bookId}&chapter_id=${chapterId}`,
  })
}

const bookShelfStore = new useBookShelfStore()
const addOrRemoveWithShelf = async () => {
  isExitShelf.value = isExitShelf.value = await bookShelfStore.isExitShelf(`/book/${bookId}/`)
  if (isExitShelf.value) {
    // 移出
    await bookShelfStore.removeBook(`/book/${bookId}/`)
    // 获取本地登录信息
    const result: UserInfo = JSON.parse((await uni.getStorage({key: 'userInfo',})).data)
    console.log(result)

    if (result.loginStatus) {
      await uniCloud.callFunction({
        name: "add_book_shelf",
        data: {
          username: result.username,
          bookShelf: await bookShelfStore.getBookList()
        },
        success: (res) => {
          console.log("云端删除成功" + res)
        },
        fail: (err) => {
          console.log(err)
        }
      })
    }
    // uni.getStorage({
    //   key: 'userInfo',
    //   success: async (res) => {
    //     const loginInfo: UserInfo = JSON.parse(res.data)
    //     if (loginInfo.loginStatus) {
    //       await uniCloud.callFunction({
    //         name: "add_book_shelf",
    //         data: {
    //           username: loginInfo.username,
    //           bookShelf: await bookShelfStore.getBookList()
    //         },
    //         success: (res) => {
    //           console.log("云端删除成功" + res)
    //         },
    //         fail: (err) => {
    //           console.log(err)
    //         }
    //       })
    //     }
    //   }
    // })

  } else {
    // 加入
    await bookShelfStore.addBook(book.value)
  }
  await uni.showToast({
    title: isExitShelf.value ? "移出书架成功" : "加入书架成功",
    icon: "success",
    duration: 1000
  })
  isExitShelf.value = isExitShelf.value = await bookShelfStore.isExitShelf(`/book/${bookId}/`)
}
const startToRead = () => {
  uni.navigateTo({
    url: `/pages/bookChapter/BookChapter?book_id=${bookId}&chapter_id=1`,
  })
}
</script>

<style scoped lang="scss">
$border-radius: 8rpx;
$box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
$cover-width: 180rpx;
$cover-height: 250rpx;
$info-font-size: 10rpx;
$name-font-size: 40rpx;
button:nth-child(2) {
  background-color: rgb(66, 185, 131);
  color: white;
  border-color: #4cd964;

}

.book {
  display: flex;
  align-items: center;
  margin-bottom: 15rpx;
  padding: 10rpx;
  background-color: #ffffff;
  border-radius: $border-radius;
  box-shadow: $box-shadow;

  &-cover-container {
    margin-right: 25rpx;
  }

  &-cover {
    width: $cover-width;
    height: $cover-height;
    border-radius: 10rpx;
    margin-left: 10rpx;
  }

  &-info {
    flex: 1;
  }

  &-name {
    font-size: $name-font-size;
    font-weight: bold;
    margin-bottom: 5rpx;
  }

  &-author,
  &-intro {
    font-size: $info-font-size;
    color: grey;
  }

  &-author {
    margin-bottom: 5rpx;
  }

  &-intro {
    line-height: 1.5;
    height: 3em;
    overflow: hidden;
  }
}
</style>