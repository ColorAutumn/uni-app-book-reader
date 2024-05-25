export interface BookItemData {
    url_list: string;
    url_img: string;
    articlename: string;
    author: string;
    intro: string;
}

export interface BookChapterData {
    title: string;
    link: string;
}

export interface Category {
    categoryName: string
    bookList: BookItemData[]
    cachedPage: number
}

export interface CloudResultData {
    code: number,
    message: string
}

export interface UserInfo {
    username: string,
    loginStatus: boolean
}

export interface UserShelf {
    username: string,
    bookList: BookItemData[]
}
