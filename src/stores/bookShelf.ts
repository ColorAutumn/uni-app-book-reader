import type {BookItemData} from "@/utils/typings";

export class useBookShelfStore {

    isExitShelf = async (bookUrlList: string): Promise<boolean> => {
        const bookList = await this.getBookList()
        return bookList.some((book) => {
            if (book.url_list === bookUrlList) {
                return true
            }
        })
    }

    getBook = async (bookUrlList: string): Promise<BookItemData | undefined> => {
        const bookList = await this.getBookList()
        return bookList.find((book) => {
            if (book.url_list === bookUrlList) {
                return book
            }
        })

    }
    getBookList = async (): Promise<BookItemData[]> => {
        const bookList: BookItemData[] = []
        uni.getStorage({
            key: "bookShelf",
            success: (res) => {
                const tempBookList: BookItemData[] = res.data
                bookList.push(...tempBookList)
            },
            fail: () => {
            }
        })
        return bookList
    }

    addBook = async (book: BookItemData) => {
        const book_list = await this.getBookList()
        book_list.push(book)
        let result = false
        uni.setStorage({
            key: "bookShelf",
            data: book_list,
            success: () => {
                console.log(`存储《${book.articlename}》成功`)
                result = true
            },
            fail: () => {
                console.log(`存储《${book.articlename}》失败`)
            }
        })
        return result
    }
    removeBook = async (bookUrlList: string) => {
        const book_list = await this.getBookList()
        const index = book_list.findIndex((book) => book.url_list === bookUrlList)
        if (index !== -1) {
            book_list.splice(index, 1)
            uni.setStorage({
                key: "bookShelf",
                data: book_list,
                success: () => {
                    console.log(`删除《${bookUrlList}》成功`)
                },
                fail: () => {
                    console.log(`删除《${bookUrlList}》失败`)
                }
            })
        }
    }
};