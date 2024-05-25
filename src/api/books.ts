import request from '@/utils/request'
import type {BookItemData} from "@/utils/typings";


export const getBookByCategoryService = (sortId: number, page: number): Promise<BookItemData[]> => {
    return request.get('/json', {params: {sortid: sortId, page: page}})
}

export const getBookByUrlListService = (urlList: string): Promise<string> => {
    return request.get(urlList + "list.html")
}


export const getBookChapterService = (chapterLink: string): Promise<string> => {
    return request.get(chapterLink)
}