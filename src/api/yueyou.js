/**
 * 阅友游戏中心接口列表
 */

import axios from "@/utils/http";
import baseUrl from "@/api/base";
import qs from "qs";
import Utils from "@/utils/utils";

const YueYou = {

    // 请求签名
    getSignStr(appId, openTs) {
        return axios.post(
            `${baseUrl.YueYou}/mall/generate_sign`,
            qs.stringify({
                app_id: appId,
                body: JSON.stringify({
                    openAppId: appId,
                    openTs: openTs,
                }),
            }));
    },

    // 获得接口地址
    getInterfaceUrl(appId) {
        return axios.post(`${baseUrl.YueYou}/mall/get_interface_url`, qs.stringify({app_id: appId}));
    },

    // 请求token
    getAccessToken(appId, authCode, url) {
        return axios.post(`${url}/mall/get_access_token`, qs.stringify({
            app_id: appId,
            authorization_code: authCode,
            ts: Utils.currentTimeMillis(true),
        }));
    }
}

export default YueYou;
