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
                    console.log("游戏中心登录返回：" + JSON.stringify(data2));
                    if (typeof callback === "function") callback({
                        openid: data2.info.userid,
                        nickname: data2.info.nickname,
                        headimg: data2.info.headimg,
                        sex: data2.info.sex,
                    });
                }).catch(err2 => {
                    if (typeof err2 === "object") {
                        alert(JSON.stringify(err2));
                    } else {
                        alert(err2);
                    }
                });
            }).catch(err => {
                if (typeof err === "object") {
                    alert(JSON.stringify(err));
                } else {
                    alert(err);
                }
            });
        });
    }

    // 获取认证码
    static getCenterAuthCode(appId, callback) {
        if (!window.nativeObj) return;
        let openTs = String(Utils.currentTimeMillis(true));
        let channelId = store.state.channelId, authCode="";
        YueYou.getSignStr(channelId, appId, openTs).then(data => {
            store.commit("setSignStr", data.info.signtrue);
            try{
                if (channelId === "YueYou"){
                    let codeJson = window.nativeObj.getAuthCodeForOpenapi(appId, openTs, data.info.signtrue), res = JSON.parse(codeJson);
                    console.log("游戏中心返回的认证码：" + codeJson);
                    if (res.code === 0) authCode = channelId + "_" + res.data;
                } else {
                    let code = window.nativeObj.getAuthCodeForOpenapi(appId, openTs, data.info.signtrue);
                    console.log("游戏中心返回的认证码：" + code);
                    if (code) authCode = channelId + "_" + code;
                }
            } catch (e) {
                if (typeof e === "object") {
                    alert(JSON.stringify(e));
                } else {
                    alert(e);
                }
            }
            console.log("拼接后的认证码：" + authCode);
            if (typeof callback === "function") callback(authCode);
        }).catch(err => {
            if (typeof err === "object") {
                alert(JSON.stringify(err));
            } else {
                alert(err);
            }
        });
    }
}
