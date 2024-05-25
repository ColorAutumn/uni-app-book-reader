import {defineConfig} from "vite";
import uni from "@dcloudio/vite-plugin-uni";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [uni()],
    server: {
        proxy: {
            '/api': {//获取路径中包含了/api的请求
                target: 'https://c7b0df87625823112.bi24.cc/',//后台服务所在的源
                changeOrigin: true,//修改源
                rewrite: (path) => path.replace(/^\/api/, '')///api替换为''
            }
        }
    }
});
