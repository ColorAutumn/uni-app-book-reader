<template>
  <view>
    <z-paging ref="paging" v-model="showBookList" @query="queryList(true)" :refresher-enabled="false"
              use-page-scroll>
      <template #top>
        <z-tabs :list="categoryList" name-key="categoryName" @change="categoryChange"/>
      </template>
      <BookList :book-list="showBookList" :is-show-other-info="true"/>
    </z-paging>
  </view>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import useZPaging from "@/components/z-paging/js/hooks/useZPaging.js"
import {getBookByCategoryService} from "@/api/books";
import type {BookItemData, Category} from "@/utils/typings";
import BookList from "@/components/self/BookList.vue";
// 必须导入需要用到的页面生命周期（即使在当前页面上没有直接使用到）
// import {onPageScroll, onReachBottom} from '@dcloudio/uni-app';


const paging = ref();
const categoryIndex = ref(0);
const categoryList = ref<Category[]>([
  {categoryName: '玄幻', bookList: [], cachedPage: 0},
  {categoryName: '武侠', bookList: [], cachedPage: 0},
  {categoryName: '都市', bookList: [], cachedPage: 0},
  {categoryName: '历史', bookList: [], cachedPage: 0},
  {categoryName: '网游', bookList: [], cachedPage: 0},
  {categoryName: '科幻', bookList: [], cachedPage: 0},
  {categoryName: '女生', bookList: [], cachedPage: 0},
]);

const showBookList = ref<BookItemData[]>([]);
// 类似mixins，如果是页面滚动务必要写这一行，并传入当前ref绑定的paging，注意此处是paging，而非paging.value
useZPaging(paging);

const categoryChange = (index: number) => {
  categoryIndex.value = index;
  const category = categoryList.value[index];
  if (category.bookList.length === 0) {
    console.log(`当前分类：${category.categoryName} 未缓存数据，将调用reload获取`)
    paging.value.reload();
  } else {
    console.log(`当前分类：${category.categoryName} 已缓存数据，将直接调用complete方法`)
    paging.value.complete(category.bookList)
  }
}

const queryList = async (loadMore: boolean = false) => {
  if (loadMore) {
    categoryList.value[categoryIndex.value].cachedPage++
  } else {
    categoryList.value[categoryIndex.value].cachedPage = 1;
  }
  const category = categoryList.value[categoryIndex.value];
  console.log(`正在请求：${category.categoryName} 分类，第：${category.cachedPage} 页`)
  const result = await getBookByCategoryService(categoryIndex.value + 1, category.cachedPage);
  categoryList.value[categoryIndex.value].bookList.push(...result);
  console.log("请求完成")
  paging.value.complete(result)
  console.log("追加数据完成")
}
</script>

<style scoped lang="scss">
</style>