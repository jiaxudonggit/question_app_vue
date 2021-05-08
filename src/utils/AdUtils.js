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

        } else {

            console.log("打开激励视频广告：=========>")

            // 创建广告订单
            this.requestCreateAdOrder(appId, (res) => {
                let channelId = store.state.channelId; // 渠道
                let openTs = Utils.currentTimeMillis(true); // 时间戳
                let channelVersion = store.state.channelVersion; // 渠道初始版本号
                let signStr = store.state.signStr; // 签名串，阅友会用到

                // 拼接广告订单号
                let outOrderId = `${channelId}_${appId || store.state.commonAdAppId}_${openTs}`; // 广告订单号

                // 如果接口返回了订单号就用接口返回的订单号
                if (res && res.code === 0) outOrderId = res.body.orderId;
                console.log("创建激励视频广告订单成功：=========> " + outOrderId)

                // 创建观看激励视频广告记录
                this.requestCreateAdRecord(outOrderId, 1);
                console.log("创建激励视频广告记录成功：=========>" + outOrderId)

                try {

                    switch (String(channelId)) {

                        case "YueYou": // 阅友
                            // 设置广告播放回调
                            window.playAdCallback = () => {
                                console.log("激励视频广告回调开始===========>" + outOrderId);
                                // 查询订单状态
                                this.loopRequestAdResult(outOrderId, appId, () => {
                                    if (typeof callback === "function") callback(outOrderId);
                                });
                            }
                            if (Utils.getAppVersion() >= channelVersion) window.nativeObj.openGameRewardVideo(store.state.centerAppId, openTs, signStr, outOrderId, "999999", "playAdCallback()");
                            break;

                        case "DeJian":
                        case "QiRead": // 得间，七读
                            // 设置广告播放回调
                            window.playAdCallback = () => {
                                console.log("激励视频广告回调开始===========>" + outOrderId);
                                // 先更新订单状态再查询订单
                                this.requestUpdateAdOrder(outOrderId, appId, () => {
                                    this.loopRequestAdResult(outOrderId, appId, () => {
                                        if (typeof callback === "function") callback(outOrderId);
                                    });
                                })
                            }
                            if (Utils.getAppVersion() >= channelVersion) window.nativeObj.openGameRewardVideo(store.state.centerAppId, openTs, signStr, outOrderId, "999999", "playAdCallback()");
                            break
                        default: // 其他渠道
                            // 设置广告播放回调
                            window.playAdCallback = (adOrderId) => {
                                console.log("激励视频广告回调开始===========>" + adOrderId);
                                // 先更新订单状态再查询订单
                                this.requestUpdateAdOrder(adOrderId, appId, () => {
                                    this.loopRequestAdResult(adOrderId, appId, () => {
                                        if (typeof callback === "function") callback(adOrderId);
                                    });
                                })
                            }
                            window.nativeObj.openRewardVideo(outOrderId, "playAdCallback");
                            break;

                    }

                } catch (e) {
                    console.error(e);
                }

            });

        }

    }

    // 打开banner广告 "portrait", "bottom"
    static openBannerAd(appId, orientation = "portrait", location = "bottom", callback = null) {
        if ((typeof (orientation) == "string" && (orientation === "landscape" || orientation === "portrait")) &&
            (typeof (location) == "string") && (typeof (appId) == "string")) {

            if (window.nativeObj) {

                let outOrderId = Utils.currentTimeMillis(true); // 广告订单号
                let channelId = store.state.channelId; // 渠道ID

                try {

                    let channelVersion = store.state.channelVersion; // 渠道初始版本号

                    switch (String(channelId)) {
                        case "YueYou":
                        case "DeJian":
                        case "QiRead":
                            if (Utils.getAppVersion() >= channelVersion) window.nativeObj.showGameBannerAd("", orientation, location);
                            break;
                        default:
                            window.nativeObj.showBannerAd(orientation, location);
                            break;
                    }

                    // 创建打开banner广告记录
                    this.requestCreateAdRecord(outOrderId, 3);

                } catch (e) {
                    console.error(e);
                }

            }

            if (typeof callback === "function") callback();

        } else {
            alert("Banner广告参数错误！");
        }
    }

    // 关闭banner广告
    static closeBannerAd(callback) {

        if (window.nativeObj) {

            let channelId = store.state.channelId; // 渠道ID

            try {
                switch (String(channelId)) {
                    case "YueYou":
                    case "DeJian":
                    case "QiRead":
                        window.nativeObj.hideGameBannerAd();
                        break;
                    default:
                        window.nativeObj.hideBannerAd();
                        break;
                }
            } catch (e) {
                console.error(e);
            }

        }

        if (typeof callback == "function") callback();

    }

    // 打开插屏广告
    static openScreenAd(appId, orientation = "portrait", callback = null) {
        if ((typeof (orientation) == "string" && (orientation === "landscape" || orientation === "portrait")) && (typeof (appId) == "string")) {

            if (!window.nativeObj) {

                if (typeof callback === "function") callback();

            } else {

                let outOrderId = Utils.currentTimeMillis(true); // 广告订单号
                let channelId = store.state.channelId; // 渠道ID
                let channelVersion = store.state.channelVersion; // 渠道初始版本号

                try {
                    switch (String(channelId)) {
                        case "YueYou":
                            if (Utils.getAppVersion() >= channelVersion) {
                                if (this.getAppVersion() >= 347) {
                                    window.screenAdCallback = function () {
                                        console.log("插屏广告回调执行：========>")
                                        if (typeof callback == "function") callback();
                                    }
                                    window.nativeObj.showGameInsertScreenAd("", orientation, "screenAdCallback");
                                } else {
                                    window.nativeObj.showGameInsertScreenAd("", orientation);
                                }
                            }
                            break;
                        case "DeJian":
                        case "QiRead":
                            if (Utils.getAppVersion() >= channelVersion) window.nativeObj.showGameInsertScreenAd("", orientation);
                            break;
                        default:
                            window.screenAdCallback = function (adOrderId) {
                                console.log("插屏广告回调执行：========>")
                                if (typeof callback == "function") callback(adOrderId);
                            }
                            window.nativeObj.showInsertScreenAd(outOrderId, orientation, "screenAdCallback");
                            break;
                    }

                    // 创建打开插屏广告记录
                    this.requestCreateAdRecord(outOrderId, 2);

                } catch (e) {
                    console.error(e);
                }

            }

        } else {
            alert("插屏广告参数错误！");
        }
    }

    // 关闭插屏广告
    static closeScreenAd(callback) {

        if (window.nativeObj) {
            let channelId = store.state.channelId; // 渠道ID
            try {
                switch (String(channelId)) {
                    case "YueYou":
                    case "DeJian":
                    case "QiRead":
                        window.nativeObj.hideGameInsertScreenAd();
                        break;
                    default:
                        window.nativeObj.hideInsertScreenAd();
                        break;
                }
            } catch (e) {
                console.error(e);
            }
        }

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

}
