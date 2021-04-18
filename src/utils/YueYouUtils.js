import {Request, Utils} from '@/utils/Utils';
import store from '../vuex/store';

export default class YueYouUtils {

    // 游戏中心登录
    static autoLoginCenter(gameId, callback) {
        if (window.nativeObj === undefined) return;
        // 1. 获取认证码
        this.getCenterAuthCode(String(gameId), (authCode) => {
            // 2. 获取interface_url
            this.getInterfaceUrl(String(gameId), (interfaceUrl) => {
                // 3. 获取token
                this.getAccessToken(String(gameId), authCode, interfaceUrl, (userInfo) => {
                    // 4. init
                    this.initApp(String(gameId), userInfo, callback);
                });
            });
        });
    }

    // 0. 请求签名
    static getSignStr(appId, callback) {
        if (window.nativeObj === undefined) return;
        let openTs = String(Utils.currentTimeMillis(true));
        Request.requestCenter({
            url: "http://gamecenter.ezhigame.com/mall/generate_sign",
            data: {
                app_id: appId,
                body: JSON.stringify({
                    openAppId: appId,
                    openTs: openTs,
                }),
            },
            callback: (res, err) => {
                if (err || res.status !== 0) return alert(err);
                store.commit("setSignStr", res.info.signtrue);
                if (typeof callback === "function") callback(res.info.signtrue, openTs);
            },
        });
    }

    // 1. 获取认证码
    static getCenterAuthCode(appId, callback) {
        if (window.nativeObj === undefined) return;
        this.getSignStr(appId, (sign, openTs) => {
            let channelId = store.state.channelId;
            let codeJson = window.nativeObj.getAuthCodeForOpenapi(appId, openTs, sign);
            let res = JSON.parse(codeJson);
            if (res.code === 0) {
                if (typeof callback === "function") callback(channelId + "_" + res.data);
            }
        })
    }

    // 2. 获得接口地址
    static getInterfaceUrl(appId, callback) {
        if (window.nativeObj === undefined) return;
        Request.request({
            url: "http://gamecenter.ezhigame.com/mall/get_interface_url",
            data: {
                app_id: appId,
            },
            callback: (res, err) => {
                if (err || res.status !== 0) return alert(err);
                if (typeof callback === "function") callback(res.info.interface_url);
            },
        });
    }

    // 3. 请求token
    static getAccessToken(appId, authCode, interfaceUrl, callback) {
        if (window.nativeObj === undefined) return;
        Request.request({
            url: interfaceUrl + "/mall/get_access_token",
            data: {
                app_id: appId,
                authorization_code: authCode,
                ts: Utils.currentTimeMillis(true),
            },
            callback: (res, err) => {
                if (err || res.status !== 0) return alert(err);
                if (typeof callback === "function") callback(res.info);
            },
        });

    }

    // 4. 调用init
    static initApp(appId, userInfo, callback) {
        try {
            // 显示关闭按钮
            if (window.nativeObj !== undefined) window.nativeObj.showExitIcon();
        } catch (e) {
            console.log(e);
        }
        if (typeof callback === "function") callback(userInfo);
    }
}
