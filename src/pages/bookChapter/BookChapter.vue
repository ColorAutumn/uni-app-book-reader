<template>
  <view id="reader">
    <view class="page" @click="changeChapter(prevChapter,false)"></view>
    <view id="chapter-content">
    </view>
    <view class="page" @click="changeChapter(nextChapter)"></view>
  </view>
</template>

<script setup lang="ts">
import {onLoad} from "@dcloudio/uni-app";
import {getBookChapterService} from "@/api/books";

let bookId = ""
onLoad((params) => {
  if (params?.book_id && params?.chapter_id) {
    bookId = params.book_id
    getBookChapter(params.book_id, params.chapter_id)
  }
})

let prevChapter: string = "";
let nextChapter: string = "";

const getPrevOrNextChapter = (pb: HTMLElement): string => {
  const pbA = pb.attributes.getNamedItem("href")
  return pbA ? (pbA.textContent ? pbA.textContent : "") : ""
}

const getBookChapter = async (bookId: string, chapterId: string) => {
  let result = await getBookChapterService(`/book/${bookId}/${chapterId}.html`);
  result.replace("<\!DOCTYPE html>", "")

  const parser = new DOMParser();
  const doc = parser.parseFromString(result, 'text/html');
  const chapterNode = doc.getElementById("chaptercontent");
  const title = doc.querySelector("span");

  if (title) {
    const titleText = title.textContent;
    console.log(`加载章节《${titleText}》完成`)
    await uni.setNavigationBarTitle({
      title: titleText ? titleText : ""
    })
  }

  const pbPrev = doc.getElementById("pb_prev")
  const pbNext = doc.getElementById("pb_next")

  if (pbPrev) {
    prevChapter = getPrevOrNextChapter(pbPrev)
  }
  if (pbNext) {
    nextChapter = getPrevOrNextChapter(pbNext)
  }

  const chapterDocument = document.getElementById("chapter-content");
  if (chapterDocument && chapterNode) {
    chapterDocument.childNodes.forEach(node => {
      chapterDocument.removeChild(node);
    })
    chapterDocument.append(chapterNode);
  }
}

const changeChapter = (tempChapterLink: string, nextPage: boolean = true) => {
  if (tempChapterLink.endsWith("/") || tempChapterLink === "") {
    uni.showToast({
      title: `没有${nextPage ? "下" : "上"}一章了`,
      icon: "none"
    })
  } else {
    const chapterId = tempChapterLink.replace(`/book/${bookId}/`, "").replace(".html", "")
    getBookChapter(bookId, chapterId)
  }
}
</script>


<style scoped lang="scss">
#chapter-content {
  padding: 40rpx 50rpx;
}

#reader {
  display: flex;
  justify-content: space-between;
}

.page {
  width: 50%;
  position: relative;
  cursor: pointer;
}
</style>
