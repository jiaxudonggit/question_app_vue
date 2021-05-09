import store from "@/vuex/store";

// 封装一个工具类
// noinspection JSUnresolvedFunction
export default class Utils {

    /**
     * 处理请求参数函数
     * @param {String} params 参数对象
     */
    static renderParams(params) {
        // 获得token
        const accessToken = Utils.getAccessToken();
        if (accessToken) params = Object.assign(params || {}, {Authorization: accessToken})
        return params;
    }

    /**
     * 获得token函数
     */
    static getAccessToken() {
        let token = window.sessionStorage.getItem("accessToken");
        if (!token || token === "") token = store.state.accessToken;
        return token;
    }

    /**
     * 获取版本号
     */
    static getAppVersion() {
        let appVersion = 330;
        try {
            appVersion = window.nativeObj.getAppVersionId();
        } catch (err) {
            console.log(err);
        }
        console.log(`=======app版本号：${appVersion}========`);
        return appVersion;
    }

    /**
     * 得到毫秒时间戳(传入ture就是秒级别的)
     * @param {Boolean} isSecond 是否为毫秒级
     * */
    static currentTimeMillis(isSecond = false) {
        let timeMills = (new Date()).getTime();
        if (isSecond) return parseInt((timeMills / 1000) + "");
        return timeMills;
    }

    /**
     * 根据参数名获取当前路由的参数值
     * @param {String} name 参数名称
     * */
    static getQueryParams(name) {
        let result = null;
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        let r = window.location.search.substr(1).match(reg);
        if (r) result = unescape(r[2]);
        return result;
    }

    /**
     * 页面滚到顶部
     * */
    static scrollToTop() {
        const element = document.documentElement.scrollTop ? document.documentElement : document.body;
        element.scrollTop = 0;
        document.getElementById('app').scrollTop = 0;
    }

}
