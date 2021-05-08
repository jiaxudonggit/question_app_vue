/**
 * axios封装
 * 请求拦截、响应拦截、错误统一处理
 */
import axios from 'axios';
import {Toast} from 'vant';
import Utils from "@/utils/utils";

/**
 * 提示函数
 * 禁止点击蒙层、显示一秒后关闭
 * @param {String} msg 显示内容
 */
const tip = (msg) => {
    Toast({
        message: msg,
        duration: 2000,
        forbidClick: true
    });
}

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status) => {
    // 状态码判断
    switch (status) {
        // 404请求不存在
        case 404:
            tip('请求的资源不存在');
            break;
        case 500:
            tip('服务器内部错误');
            break;
        case 502:
            tip('服务器网关错误');
            break;
        default:
            tip('其他错误');
    }
}

// 创建axios实例
const instance = axios.create({timeout: 1000 * 12});
// 设置post请求头
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */
instance.interceptors.request.use(
    config => {
        // 登录流程控制中，根据本地是否存在token判断用户的登录情况
        const accessToken = Utils.getAccessToken();
        if (accessToken) config.headers['Authorization'] = accessToken;
        return config;
    },
    error => Promise.error(error)
)

// 响应拦截器
instance.interceptors.response.use(
    // 请求成功
    response => {
        // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据, 否则的话抛出错误
        if (response.status === 200) {
            if (response.data.code === 0 || response.data.status === 0) {
                return Promise.resolve(response.data);
            } else {
                tip(response.data.msg);
                return Promise.reject(response.data);
            }
        } else {
            return Promise.reject(response.data);
        }
    },
    // 请求失败
    error => {
        const {response} = error;
        if (response) {
            // 请求已发出，但是不在2xx的范围
            errorHandle(response.status);
            return Promise.reject(response);
        } else {
            // 处理断网的情况
            if (!window.navigator.onLine) {
                tip("网络错误，请重试");
            } else {
                return Promise.reject(error);
            }
        }
    });

export default instance;
