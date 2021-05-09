/**
 * 答题页接口列表
 */
import axios from '@/utils/http';
import qs from 'qs';
import Utils from "@/utils/utils";

export default {

    // 查询广告状态
    getAdResult(params) {
        return axios.post(`/api/ad/get_ad_result`,  qs.stringify(Utils.renderParams(params)));
    },

    // 创建激励视频广告订单
    createAdOrder() {
        return axios.post(`/api/ad/create_ad_order`,  qs.stringify(Utils.renderParams()));
    },

    // 更新激励视频广告订单
    updateAdOrder() {
        return axios.post(`/api/ad/update_ad_order`,  qs.stringify(Utils.renderParams()));
    },

    // 记录用户观看广告
    createAdRecord(params) {
        return axios.post(`/api/ad/create_ad_record`,  qs.stringify(Utils.renderParams(params)));
    },
}
