import type {BookItemData} from "@/utils/typings";

export const openBook = async (book: BookItemData) => {
    uni.setStorage({
        key: book.url_list,
        data: book,
        success: () => {
            console.log(`缓存《${book.articlename}》基本信息成功，将跳转至详情页`)
            uni.navigateTo({
                url: "/pages/bookInfo/BookInfo?book_id=" + book.url_list.replace("/book/", "").replace("/", ""),
                animationType: "slide-in-right",
                animationDuration: 300,
            })
        },
        fail: () => {
            console.log(`缓存《${book.articlename}》基本信息失败，无法跳转`)
            uni.showToast({
                title: `获取《${book.articlename}》信息失败，无法跳转至详情页，请稍后再试`,
                icon: "error",
            })
        }
    })
}
