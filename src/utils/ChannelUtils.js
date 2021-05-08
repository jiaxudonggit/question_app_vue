/*
* 渠道工具类
* */

export default class ChannelUtils {
    // 获得用户信息
    static getUserInfo(callback) {
        if (!window.nativeObj) return;
        try {
            let userInfoJson = window.nativeObj.getChannelUserInfo();
            let userInfo = JSON.parse(userInfoJson);
            if (typeof callback === "function") callback(userInfo);
        } catch (e) {
            alert(e);
        }
    }

}
