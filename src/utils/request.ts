import axios from "axios";

const baseURL = "/api"
const instance = axios.create({withCredentials: true, baseURL})


instance.interceptors.request.use(
    (config) => {
        console.log("正在请求：" + config.url);
        return config;
    },
    (err) => {
        return Promise.reject(err);
    }
)

instance.interceptors.response.use(
    result => {
        if (result.status === 200) {
            return result.data;
        }

        uni.showToast({
            title: '请求成功但服务异常',
            icon: "error"
        }).then()
        return Promise.reject(result.data);
    },
    err => {
        console.log(err)
        uni.showToast({
            title: err.message,
            icon: "error"
        }).then()
        return Promise.reject(err);
    }
)

export default instance;