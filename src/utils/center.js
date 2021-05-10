import Utils from '@/utils/utils';
import store from '../vuex/store';
import YueYou from '@/api/center';

export default class CenterLogin {

    // 游戏中心登录
    static autoLoginCenter(callback) {
        if (!window.nativeObj) return;
        const gameId = store.getters.centerAppId;
        // 1. 获取认证码
        this.getCenterAuthCode(String(gameId), (authCode) => {
            // 2. 获取interface_url
            YueYou.getInterfaceUrl(String(gameId)).then(data => {
                // 3. 获取token
                YueYou.getAccessToken(String(gameId), authCode, data.info.interface_url).then(data2 => {
                    if (typeof callback === "function") callback({
                        openid: data2.info.userid,
                        nickname: data2.info.nickname,
                        headimg: data2.info.headimg,
                        sex: data2.info.sex,
                    });
                }).catch(err2 => {
                    if (typeof err2 === "string") alert(err2);
                    if (typeof err2 === "object") alert(JSON.stringify(err2));
                });
            }).catch(err => {
                if (typeof err === "string") alert(err);
                if (typeof err === "object") alert(JSON.stringify(err));
            });
        });
    }

    // 获取认证码
    static getCenterAuthCode(appId, callback) {
        if (!window.nativeObj) return;
        let openTs = String(Utils.currentTimeMillis(true));
        YueYou.getSignStr(appId).then(data => {
            store.commit("setSignStr", data.info.signtrue);
            let channelId = store.state.channelId, codeJson = window.nativeObj.getAuthCodeForOpenapi(appId, openTs, data.info.signtrue), res = JSON.parse(codeJson);
            if (res.code === 0) if (typeof callback === "function") callback(channelId + "_" + res.data);
        }).catch(err => {
            if (typeof err === "string") alert(err);
            if (typeof err === "object") alert(JSON.stringify(err));
        });
    }
}
