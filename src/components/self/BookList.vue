<template>
  <view>
    <view class="book" v-for="(book,index) in props.bookList" :key="index" @click="openBook(book)">
      <view class="book-cover-container">
        <image class="book-cover" :src="book.url_img"/>
      </view>
      <view class="book-info">
        <view class="book-name">
          <text>{{ book.articlename }}</text>
        </view>
        <view v-if="props.isShowOtherInfo">
          <text class="book-other">作者：{{ book.author }}</text>
        </view>
        <view v-if="props.isShowOtherInfo">
          <text class="book-other">简介：{{ book.intro }}{{ book.intro.length >= 30 ? "…" : "" }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import {openBook} from "@/utils/pageUtil";
import type {BookItemData} from "@/utils/typings";

const props = defineProps({
  bookList: {
    type: Object as () => BookItemData[],
    required: true
  },
  isShowOtherInfo: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped lang="scss">
$border-radius: 8rpx;
$box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
$cover-width: 180rpx;
$cover-height: 250rpx;
$info-font-size: 10rpx;
$name-font-size: 40rpx;

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

  &-name {
    font-size: $name-font-size;
    font-weight: bold;
    margin-bottom: 5rpx;
  }

  &-info {
    flex: 1;
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