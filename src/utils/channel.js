/*
* 渠道工具类
* */
export default class channel {
    // 获得用户信息
    static getUserInfo(callback) {
        if (window.nativeObj === undefined) return;
        if (typeof callback === "function") callback({});
    }
}
