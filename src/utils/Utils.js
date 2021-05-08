import axios from "axios";
import qs from 'qs';
import debounce from "lodash.debounce";
import store from "@/vuex/store";

// 封装一个工具类
const Utils = class Utils {

    // 获取版本号
    static getAppVersion() {
        let appVersion = 330;
        if (window.nativeObj) {
            try {
                appVersion = window.nativeObj.getAppVersionId();
            } catch (err) {
                console.error(err);
            }
        }
        console.log(`=======app版本号：${appVersion}========`);
        return appVersion;
    }

    // 得到毫秒时间戳(传入ture就是秒级别的)
    static currentTimeMillis(isSecond = false) {
        let timeMills = (new Date()).getTime();
        if (isSecond) return parseInt((timeMills / 1000) + "");
        return timeMills;
    }

    // 根据参数名获取当前路由的参数值
    static getQueryParams(name) {
        let result = null;
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        let r = window.location.search.substr(1).match(reg);
        if (r) result = unescape(r[2]);
        return result;
    }

    // 页面滚到顶部
    static scrollToTop() {
        var element = document.documentElement.scrollTop ? document.documentElement : document.body;
        element.scrollTop = 0;
        document.getElementById('app').scrollTop = 0;
    }

    static debounce(callback = null, wait = 800) {
        return debounce(function () {
            if (typeof callback === "function") callback();
        }, wait, {
            'leading': true,
            'trailing': false
        });
    }

    static checkPhone(phone){
        return /^1[3-9]\d{9}$/.test(phone)
    }

}

// 封装一个支持过期时间的localstorage类
class EasyStorage {
    static setItem(params) {
        try {
            let obj = {
                name: '',
                value: '',
                expires: 24 * 60 * 60 * 1000, // 24小时
                startTime: new Date().getTime() //记录何时将值存入缓存，毫秒级
            };
            let options = {};
            //将obj和传进来的params合并
            Object.assign(options, obj, params);
            if (options.expires) {
                //如果options.expires设置了的话
                //以options.name为key，options为值放进去
                localStorage.removeItem(options.name);
                localStorage.setItem(options.name, JSON.stringify(options));
            } else {
                //如果options.expires没有设置，就判断一下value的类型
                //如果value是对象或者数组对象的类型，就先用JSON.stringify转一下，再存进去
                if (Object.prototype.toString.call(options.value) === '[object Object]' ||
                    Object.prototype.toString.call(options.value) === '[object Array]') {
                    options.value = JSON.stringify(options.value);
                }
                localStorage.removeItem(options.name);
                localStorage.setItem(options.name, options.value);
            }
        } catch (e) {
            console.error("localStorage setItem error");
        }
    }

    static getItem(name) {
        try {
            let item = window.localStorage.getItem(name);
            // 如果没有则 直接返回null
            if (!item) return null;
            //先将拿到的试着进行json转为对象的形式
            try {
                item = JSON.parse(item);
            } catch (error) {
                //如果不行就不是json的字符串，就直接返回
                return item;
            }
            //如果有startTime的值，说明设置了失效时间
            if (item.startTime) {
                let date = new Date().getTime();
                //何时将值取出减去刚存入的时间，与item.expires比较，如果大于就是过期了，如果小于或等于就还没过期
                if (date - item.startTime > item.expires) {
                    //缓存过期，清除缓存，返回false
                    window.localStorage.removeItem(name);
                    return null;
                } else {
                    //缓存未过期，返回值
                    return item.value;
                }
            } else {
                //如果没有设置失效时间，直接返回值
                return item.value;
            }
        } catch (e) {
            return null;
        }
    }

    static removeItem(name) {
        try {
            window.localStorage.removeItem(name);
        } catch (e) {
            console.error("localStorage removeItem error");
        }
    }

    static removeItems(keyArray) {
        try {
            for (let i = 0; i < keyArray.length; i++) {
                window.localStorage.removeItem(keyArray[i]);
            }
        } catch (e) {
            console.error("localStorage removeItems error: " + e);
        }

    }

    static clear() {
        try {
            window.localStorage.clear();
        } catch (e) {
            console.error("localStorage clear error: " + e);
        }
    }

}

// 封装一个request请求类
class Request {

    static getAccessToken() {
        // 有token就加上token
        return window.sessionStorage.getItem("accessToken") || store.state.accessToken;
    }

    //post请求
    static request(option) {
        // 有token就加上token
        const accessToken = this.getAccessToken();
        axios({
            method: option.method || 'post',
            url: option.url || "",
            data: qs.stringify(accessToken ? Object.assign(option.data || {}, {Authorization: accessToken}) : option.data || {}),
        }).then((res) => {
            if (res.status === 200) {
                // 网络请求成功
                if (res.data.code === 0) {
                    if (typeof option.callback === "function") option.callback(res.data, null);
                } else {
                    if (typeof option.callback === "function") option.callback(res.data, res.data.msg);
                }
            } else {
                // 网络请求失败
                if (typeof option.callback === "function") option.callback(null, "网络不稳定，请稍后");
            }
        }).catch((err) => {
            if (typeof option.callback === "function") option.callback(null, "网络不稳定，请稍后 " + err);
        });
    }

    static requestCenter(option) {
        axios({
            method: option.method || 'post',
            url: option.url || "",
            data: qs.stringify(option.data || {}),
        }).then((res) => {
            if (res.status === 200) {
                // 网络请求成功
                if (res.data.status === 0) {
                    if (typeof option.callback === "function") option.callback(res.data, null);
                } else {
                    if (typeof option.callback === "function") option.callback(res.data, res.data.error);
                }
            } else {
                // 网络请求失败
                if (typeof option.callback === "function") option.callback(null, "网络不稳定，请稍后");
            }
        }).catch((err) => {
            if (typeof option.callback === "function") option.callback(null, "网络不稳定，请稍后 " + err);
        });
    }
}

export {
    Utils,
    EasyStorage,
    Request
}
