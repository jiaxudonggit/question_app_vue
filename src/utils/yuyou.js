import Utils from '@/utils/utils';
import store from '../vuex/store';
import YueYou from '@/api/yueyou';

export default class YueYouLogin {

    // 游戏中心登录
    static autoLoginCenter(callback) {
        if (window.nativeObj === undefined) return;
        const gameId = store.state.centerAppId;
        // 1. 获取认证码
        this.getCenterAuthCode(String(gameId), (authCode) => {
            // 2. 获取interface_url
            YueYou.getInterfaceUrl(String(gameId)).then(data => {
                // 3. 获取token
                YueYou.getAccessToken(String(gameId), authCode, data.info.interface_url).then(data => {
                    if (typeof callback === "function") callback(data.info);
                }).catch(err => {
                    alert(err);
                });
            }).catch(err => {
                alert(err);
            });
        });
    }

    // 获取认证码
    static getCenterAuthCode(appId, callback) {
        let openTs = String(Utils.currentTimeMillis(true));
        YueYou.getSignStr(appId).then(data => {
            store.commit("setSignStr", data.info.signtrue);
            let channelId = store.state.channelId, codeJson = window.nativeObj.getAuthCodeForOpenapi(appId, openTs, data.info.signtrue), res = JSON.parse(codeJson);
            if (res.code === 0) if (typeof callback === "function") callback(channelId + "_" + res.data);
        }).catch(err => {
            alert(err);
        });
    }
}
