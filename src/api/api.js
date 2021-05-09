/**
 * 接口列表模块管理
 */
import axios from "@/utils/http";
import qs from "qs";
import Utils from "@/utils/utils";
import YueYou from "@/api/center";
import redPacket from "@/api/red_packet";
import Ad from "@/api/ad";


const request = {
    // 获得应用渠道状态
    getAppStatus(params) {
        return axios.post(`/api/test_app/get_app_status`, qs.stringify(params));
    },

    // 用户登录
    userLogin(params) {
        return axios.post(`/api/login/user_login`, qs.stringify(params));
    },

    // 记录用户进入应用
    createAccessRecord(params) {
        return axios.post(`/api/test_app/create_access_record`, qs.stringify(Utils.renderParams(params)));
    },

    // 获得首页数据
    getIndexData(params) {
        return axios.post(`/api/test_app/get_index_data`,  qs.stringify(Utils.renderParams(params)));
    },

    // 获得推荐弹窗数据
    getPopupData(params) {
        return axios.post(`/api/test_app/get_popup_data`,  qs.stringify(Utils.renderParams(params)));
    },

    // 获得答题页数据
    getPlayData(params) {
        return axios.post(`/api/test_app/get_play_data`,  qs.stringify(Utils.renderParams(params)));
    },

    // 获得弹幕数据
    getBarrageData() {
        return axios.post(`/api/test_app/get_barrage_data`,  qs.stringify(Utils.renderParams()));
    },

    // 获得结果页数据
    getResultData(params) {
        return axios.post(`/api/test_app/get_result_data`,  qs.stringify(Utils.renderParams(params)));
    },

    // 创建用户查看结果记录
    createResultRecord(params) {
        return axios.post(`/api/test_app/create_result_record`,  qs.stringify(Utils.renderParams(params)));
    },

    // 创建用户答题记录
    createAnswerRecord(params) {
        return axios.post(`/api/test_app/create_question_record`,  qs.stringify(Utils.renderParams(params)));
    },

    // 获得测一测推荐配置
    getRecommendData(params) {
        return axios.post(`/api/test_app/get_recommend_data`,  qs.stringify(Utils.renderParams(params)));
    },

    // 获得测一测推荐配置 瀑布流加载
    getRecommendDataLoad(params) {
        return axios.post(`/api/test_app/get_recommend_data_load`,  qs.stringify(Utils.renderParams(params)));
    },

    // 记录用户点击推荐应用
    createRecommendRecord(params) {
        return axios.post(`/api/test_app/create_recommend_record`,  qs.stringify(Utils.renderParams(params)));
    },

    // 获得商店页数据
    getHomeData() {
        return axios.post(`/api/test_app/get_home_data`,  qs.stringify(Utils.renderParams()));
    },

    // 获得[大家爱玩]应用列表
    getLikeData(params) {
        return axios.post(`/api/test_app/get_app_with_like`,  qs.stringify(Utils.renderParams(params)));
    },

    // 获得[热门应用]列表
    getHotAppList() {
        return axios.post(`/api/test_app/get_hot_app`,  qs.stringify(Utils.renderParams()));
    },

    // 获得分类列表
    getTypeList() {
        return axios.post(`/api/test_app/get_type_list`,  qs.stringify(Utils.renderParams()));
    },

    // 获得更多应用列表
    getMoreData(params) {
        return axios.post(`/api/test_app/get_app_with_more`,  qs.stringify(Utils.renderParams(params)));
    },

    // 获得分类下的应用列表
    getTypeAppData(params) {
        return axios.post(`/api/test_app/get_app_with_type`,  qs.stringify(Utils.renderParams(params)));
    },

    // 搜索应用
    searchAppByName(params) {
        return axios.post(`/api/test_app/search_app_with_name`,  qs.stringify(Utils.renderParams(params)));
    },

    // 获得搜索页面分类下的应用列表
    getSearchTypeAppData(params){
        // type_id为0时获取全部
        if (params.type_id === 0){
            return axios.post(`/api/test_app/get_app_with_more`,  qs.stringify(Utils.renderParams(params)));
        }else {
            return axios.post(`/api/test_app/get_app_with_type`,  qs.stringify(Utils.renderParams(params)));
        }
    },

}


export default {
    request,
    YueYou,
    redPacket,
    Ad,
};
