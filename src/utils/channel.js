/*
* 渠道工具类
* */
export default class Channel {
    // 获得用户信息
    static getUserInfo(callback) {
        if (!window.nativeObj) return;
        try {
            let userInfoJson = window.nativeObj.getChannelUserInfo();
            let userInfo = JSON.parse(userInfoJson);
            if (typeof callback === "function") callback(userInfo);
        } catch (err) {
            if (typeof err === "string") alert(err);
            if (typeof err === "object") alert(JSON.stringify(err));
        }
    }
}
