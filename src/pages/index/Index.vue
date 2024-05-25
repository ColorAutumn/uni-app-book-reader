<template>
  <BookList :book-list="bookStoreList"/>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import type {BookItemData} from "@/utils/typings";
import BookList from "@/components/self/BookList.vue";
import {useBookShelfStore} from "@/stores/bookShelf";
import {onShow} from "@dcloudio/uni-app";

const bookStoreList = ref<BookItemData[]>([])
const bookShelfStore = new useBookShelfStore()

onShow(async () => {
  bookStoreList.value = await bookShelfStore.getBookList()
  bookStoreList.value.forEach(book => {
    console.log(`加载本地书籍：${book.articlename}`)
  })
})
</script>
