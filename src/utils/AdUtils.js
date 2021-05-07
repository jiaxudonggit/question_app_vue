/*
* @Time    : 2021/4/13 16:03
* @Author  : JXD
* @FileName: AdUtils.js
* @Software: WebStorm
*/
import store from "@/vuex/store";
import {Request, Utils} from "@/utils/Utils";


export default class AdUtils {

    // 打开激励视频广告
    static openVideoAd(appId, channelId, callback) {
        if (window.nativeObj === undefined) {
            if (store.state.debug && typeof callback === "function") callback('YueYou_999999_61220e7eaa9911ebb6eb00163e100870');
            return false;
        }
        try {
            console.log("打开激励视频广告：=========>")
            let channelId = store.state.channelId; // 渠道
            let channelVersion = store.state.channelVersion; // 渠道初始版本号
            let signStr = store.state.signStr; // 签名串，阅友会用到
            let openTs = Utils.currentTimeMillis(true); // 时间戳

            // 创建广告订单
            this.requestCreateAdOrder(appId, (res) => {
                // 拼接广告订单号
                let outOrderId = `${channelId}_${appId || store.state.commonAdAppId}_${Utils.currentTimeMillis(true)}`; // 广告订单号
                // 如果接口返回了订单号就用接口返回的订单号
                if (res && res.code === 0) outOrderId = res.body.orderId;
                console.log("创建激励视频广告订单成功：=========> " + outOrderId)
                // 创建观看激励视频广告记录
                this.requestCreateAdRecord(outOrderId, 1);
                console.log("创建激励视频广告记录成功：=========>" + outOrderId)
                // 设置广告播放回调
                window.playAdCallback = () => {
                    console.log("激励视频广告回调开始===========>" + outOrderId);
                    if (String(channelId) === "YueYou") {
                        this.loopRequestAdResult(outOrderId, appId, () => {
                            if (typeof callback === "function") callback(outOrderId);
                        });
                    } else {
                        // 先更新订单状态再查询订单
                        this.requestUpdateAdOrder(outOrderId, appId, () => {
                            this.loopRequestAdResult(outOrderId, appId, () => {
                                if (typeof callback === "function") callback(outOrderId);
                            });
                        })
                    }
                }
                // 根据渠道打开广告
                if (String(channelId) === "YueYou") {
                    if (this.getAppVersion() >= channelVersion) window.nativeObj.openGameRewardVideo(store.state.centerAppId, openTs, signStr, outOrderId, "999999", "playAdCallback()");
                } else {
                    if (this.getAppVersion() >= channelVersion) window.nativeObj.openGameRewardVideo(appId, "playAdCallback");
                }
            });

        } catch (e) {
            console.error(e);
            if (store.state.debug && typeof callback === "function") callback(null);
        }
    }

    // 打开banner广告 "portrait", "bottom"
    static openBannerAd(appId, orientation = "portrait", location = "bottom", callback = null) {
        if ((typeof (orientation) == "string" && (orientation === "landscape" || orientation === "portrait")) &&
            (typeof (location) == "string") && (typeof (appId) == "string")) {
            if (window.nativeObj === undefined) {
                if (typeof callback === "function") callback();
                return false;
            }
            let outOrderId = Utils.currentTimeMillis(true); // 广告订单号
            let channelId = store.state.channelId; // 渠道ID
            let channelVersion = store.state.channelVersion; // 渠道初始版本号

            try {
                if (String(channelId) === "YueYou") {
                    if (this.getAppVersion() >= channelVersion) window.nativeObj.showGameBannerAd("", orientation, location);
                } else {
                    if (this.getAppVersion() >= channelVersion) window.nativeObj.showGameBannerAd(orientation, location);
                }

                // 创建打开banner广告记录
                this.requestCreateAdRecord(outOrderId, 3);
            } catch (e) {
                console.error(e);
            }

            if (typeof callback === "function") callback();

        } else {
            alert("Banner广告参数错误！");
        }
    }

    // 关闭banner广告
    static closeBannerAd(callback) {
        if (window.nativeObj === undefined) {
            if (typeof callback === "function") callback();
            return false;
        }
        let channelVersion = store.state.channelVersion; // 渠道初始版本号
        if (this.getAppVersion() >= channelVersion) window.nativeObj.hideGameBannerAd();
        if (typeof callback == "function") callback();
    }

    // 打开插屏广告
    static openScreenAd(appId, orientation = "portrait", callback = null) {
        if ((typeof (orientation) == "string" && (orientation === "landscape" || orientation === "portrait")) && (typeof (appId) == "string")) {
            if (window.nativeObj === undefined) {
                if (typeof callback === "function") callback();
                return false;
            }
            let outOrderId = Utils.currentTimeMillis(true); // 广告订单号
            let channelId = store.state.channelId; // 渠道ID
            let channelVersion = store.state.channelVersion; // 渠道初始版本号

            window.screenAdCallback = function () {
                console.log("插屏广告回调执行：========>")
                if (typeof callback == "function") callback();
            }

            try {
                if (String(channelId) === "YueYou") {
                    if (this.getAppVersion() >= channelVersion) {
                        if (this.getAppVersion() >= 347) {
                            window.nativeObj.showGameInsertScreenAd("", orientation, "screenAdCallback");
                        } else {
                            window.nativeObj.showGameInsertScreenAd("", orientation);
                        }
                    }
                } else {
                    if (this.getAppVersion() >= channelVersion) window.nativeObj.showGameInsertScreenAd(orientation, "showGameInsertScreenAdCallback");
                }

                // 创建打开插屏广告记录
                this.requestCreateAdRecord(outOrderId, 2);

            } catch (e) {
                console.error(e);
            }

        } else {
            alert("插屏广告参数错误！");
        }
    }

    // 关闭插屏广告
    static closeScreenAd(callback) {
        if (window.nativeObj === undefined) {
            if (typeof callback === "function") callback();
            return false;
        }
        let channelVersion = store.state.channelVersion; // 渠道初始版本号
        if (this.getAppVersion() >= channelVersion) window.nativeObj.hideGameInsertScreenAd();
        if (typeof callback == "function") callback();
    }

    // 处理轮询
    static loopRequestAdResult(orderId, appId, callback) {
        let count = 0;
        let func = (orderId, appId) => {
            if (count >= 5) return;
            console.log("广告结果轮询执行：========> 第" + (count + 1) + "次")
            this.requestAdResult(orderId, appId, (res, err) => {
                // 轮询失败 播放未完成
                if ((err || res.code !== 0) || res.body.status !== 1) {
                    count++;
                    setTimeout(() => {
                        func(orderId, appId);
                    }, 300)
                } else {
                    // 轮询成功 播放完成
                    if (res.body.status === 1) if (typeof callback === "function") callback();
                }
            });
        }

        func(orderId, appId);
    }

    // 轮询广告状态
    static requestAdResult(orderId, appId, callback) {
        Request.request({
            url: store.getters.appApiUrl + "/ad/get_ad_result",
            data: {
                order_id: orderId, // 广告订单
                app_id: appId, // 	应用id
            },
            callback: callback,
        });
    }

    // 创建广告订单
    static requestCreateAdOrder(appId, callback) {
        Request.request({
            url: store.getters.appApiUrl + "/ad/create_ad_order",
            data: {
                app_id: appId, // 	应用id
            },
            callback: callback,
        });
    }

    // 更新广告订单
    static requestUpdateAdOrder(orderId, appId, callback) {
        Request.request({
            url: store.getters.appApiUrl + "/ad/update_ad_order",
            data: {
                order_id: orderId, // 广告订单号
                app_id: appId, // 应用id
            },
            callback: callback,
        });
    }

    // 记录用户观看广告
    static requestCreateAdRecord(orderId, adType, callback) {
        Request.request({
            url: store.getters.appApiUrl + "/ad/create_ad_record",
            data: {
                app_id: store.state.appId,
                order_id: orderId,
                ad_type: adType,
            },
            callback: callback,
        });
    }

    // 获取版本
    static getAppVersion() {
        let appVersion = 330;
        if (window.nativeObj !== undefined) {
            try {
                appVersion = window.nativeObj.getAppVersionId();
            } catch (err) {
                console.error(err);
            }
        }
        console.log(`=======app版本号：${appVersion}========`);
        return appVersion;
    }

}
