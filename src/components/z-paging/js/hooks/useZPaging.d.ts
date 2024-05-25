// useZPaging.d.ts
// 自定义类型声明
import {Ref} from 'vue';

interface PagingMethods {
    reload: () => Promise<void>;
    updatePageScrollTop: (scrollTop: number) => void;
    doChatRecordLoadMore: () => void;
    pageReachBottom: () => void;
}

interface PagingObject {
    value?: PagingMethods;
}

declare module '@/components/z-paging/js/hooks/useZPaging.js' {
    function useZPaging(paging: Ref<PagingObject>): void;

    export default useZPaging;
}