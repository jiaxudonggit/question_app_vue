// noinspection JSUnresolvedVariable

/*
* 调用广告
*/
import store from "@/vuex/store";
import Utils from "@/utils/utils";
import Ad from "@/api/ad";

export default class AdUtils {

    // 打开激励视频广告
    static openVideoAd(appId, callback) {
        console.log("打开激励视频广告=========>")
        if (!window.nativeObj) {
            if (process.env.NODE_ENV === "development" && typeof callback === "function") callback('YueYou_999999_61220e7eaa9911ebb6eb00163e100870');
        } else {
            let channelId = store.state.channelId; // 渠道
            // 创建广告订单
            Ad.createAdOrder({
                app_id: appId, // 	应用id
            }).then(data => {
                let openTs = Utils.currentTimeMillis(true); // 时间戳
                let channelVersion = store.state.channelVersion; // 渠道初始版本号
                let signStr = store.state.signStr; // 签名串，阅友会用到

                // 拼接广告订单号
                let outOrderId = `${channelId}_${appId || store.state.commonAdAppId}_${openTs}`; // 广告订单号

                // 如果接口返回了订单号就用接口返回的订单号
                if (data && data.code === 0) outOrderId = data.body.orderId;
                console.log("创建激励视频广告订单成功=========> " + outOrderId)

                // 创建观看激励视频广告记录
                Ad.createAdRecord({app_id: appId, order_id: outOrderId, ad_type: 1}).then(()=>{
                    console.log("创建激励视频广告记录成功=========>" + outOrderId)
                });

                try {
                    switch (String(channelId)) {

                        case "YueYou": // 阅友
                            // 设置广告播放回调
                            window.playAdCallback = () => {
                                console.log("激励视频广告回调开始===========>" + outOrderId);
                                // 查询订单状态
                                this.loopRequestAdResult(appId, outOrderId, () => {
                                    if (typeof callback === "function") callback(outOrderId);
                                });
                            };
                            if (Utils.getAppVersion() >= channelVersion) window.nativeObj.openGameRewardVideo(store.state.centerAppId, openTs, signStr, outOrderId, "999999", "playAdCallback()");
                            break;

                        case "DeJian":
                        case "QiRead": // 得间，七读
                            // 设置广告播放回调
                            window.playAdCallback = () => {
                                console.log("激励视频广告回调开始===========>" + outOrderId);
                                // 先更新订单状态再查询订单
                                Ad.updateAdOrder({
                                    order_id: outOrderId, // 广告订单号
                                    app_id: appId, // 应用id
                                }).then(()=>{
                                    this.loopRequestAdResult(appId, outOrderId, () => {
                                        if (typeof callback === "function") callback(outOrderId);
                                    });
                                }).catch(()=>{
                                    console.log("更新激励视频广告订单失败=========> ");
                                });
                            };
                            if (Utils.getAppVersion() >= channelVersion) window.nativeObj.openGameRewardVideo(store.state.centerAppId, openTs, signStr, outOrderId, "999999", "playAdCallback()");
                            break
                        default: // 其他渠道
                            window.playAdCallback = (adOrderId) => {
                                console.log("激励视频广告回调开始===========>" + adOrderId);
                                // 先更新订单状态再查询订单
                                Ad.updateAdOrder({
                                    order_id: adOrderId, // 广告订单号
                                    app_id: appId, // 应用id
                                }).then(()=>{
                                    this.loopRequestAdResult(appId, outOrderId, () => {
                                        if (typeof callback === "function") callback(outOrderId);
                                    });
                                }).catch(()=>{
                                    console.log("更新激励视频广告订单失败=========> ");
                                });
                            };
                            window.nativeObj.openRewardVideo(outOrderId, "playAdCallback");
                            break;
                    }

                } catch (e) {
                    console.error(e);
                }
            }).catch(()=>{
                console.log("创建激励视频广告订单失败=========> ");
            });
        }
    }

    // 打开banner广告 "portrait", "bottom"
    static openBannerAd(callback) {
        if (window.nativeObj) {
            let channelId = store.state.channelId; // 渠道ID
            try {
                let channelVersion = store.state.channelVersion; // 渠道初始版本号
                switch (String(channelId)) {
                    case "YueYou":
                    case "DeJian":
                    case "QiRead":
                        if (Utils.getAppVersion() >= channelVersion) window.nativeObj.showGameBannerAd("", "portrait", "bottom");
                        break;
                    default:
                        window.nativeObj.showBannerAd("portrait", "bottom");
                        break;
                }
                // 创建打开banner广告记录
                Ad.createAdRecord({app_id: store.state.appId, order_id: Utils.currentTimeMillis(true), ad_type: 3});
            } catch (e) {
                console.error(e);
            }
        }
        if (typeof callback === "function") callback();
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
    static openScreenAd(callback) {
        if (!window.nativeObj) {
            if (typeof callback === "function") callback();
        } else {
            let channelId = store.state.channelId; // 渠道
            let outOrderId = Utils.currentTimeMillis(true); // 广告订单号
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
                                window.nativeObj.showGameInsertScreenAd("", "portrait", "screenAdCallback");
                            } else {
                                window.nativeObj.showGameInsertScreenAd("", "portrait");
                            }
                        }
                        break;
                    case "DeJian":
                    case "QiRead":
                        if (Utils.getAppVersion() >= channelVersion) window.nativeObj.showGameInsertScreenAd("", "portrait");
                        break;
                    default:
                        window.screenAdCallback = function (adOrderId) {
                            console.log("插屏广告回调执行：========>")
                            if (typeof callback == "function") callback(adOrderId);
                        }
                        window.nativeObj.showInsertScreenAd(outOrderId, "portrait", "screenAdCallback");
                        break;
                }
                // 创建打开插屏广告记录
                Ad.createAdRecord({app_id: store.state.appId, order_id: Utils.currentTimeMillis(true), ad_type: 2});
            } catch (e) {
                console.error(e);
            }
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
    static loopRequestAdResult(appId, orderId, callback) {
        let count = 0;
        let func = (appId, orderId) => {
            if (count >= 5) return;
            console.log("广告结果轮询执行：========> 第" + (count + 1) + "次")
            Ad.getAdResult({
                order_id: orderId, // 广告订单
                app_id: appId, // 应用id
            }).then(data=>{
                // 轮询成功 播放完成
                if (data.body.status === 1) {
                    if (typeof callback === "function") callback();
                } else {
                    count++;
                    func(orderId);
                }
            }).catch(()=>{
                count++;
                func(orderId);
            })
        }
        func(appId, orderId);
    }
}
