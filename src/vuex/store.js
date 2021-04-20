import Vue from 'vue'
import Vuex from 'vuex'
import mutations from "./mutations"
import getters from "./getters"
import {Utils} from "@/utils/Utils";

Vue.use(Vuex)

const state = {
    // 工程配置相关
    debug: true,
    isRunBrowser: true,
    appApiUrl: "http://interest.app.ezhigame.com", // 后端接口地址（正式服）
    testAppApiUrl: "http://interest.test.ezhigame.com", // 后端接口地址(测试服)
    // 基础配置
    appId: Utils.getQueryParams("YzAppId"),
    appTypeId: null,  // 应用类型ID
    appTemplateId: null,  // 应用主题ID
    channelId: Utils.getQueryParams("YzAppId"), // 渠道ID
    channelVersion: 330, // 渠道初始版本号
    // 用户数据
    isLogin: false, // 是否已登陆
    nickname: "",     // 昵称
    headImage: "",      // 头像
    sex: 0,           // 性别
    accessToken: null, // 身份令牌
    // 浏览器调试时用户ID
    debugUserId: 999666,
    // 阅友单独使用的数据
    signStr: null,      // 验签串
    centerAppId: "999999",
    // UI相关
    isAppending: false,
    timer: null,
    availHeight: window.screen.availHeight,
    // 业务数据
    indexData: {
        "app_icon": null,
        "app_type": null,
        "type_id": null,
        "template_id": null,
        "question_number": "6",
        "user_number": "168.14",
        "evaluate": "98.99",
        "is_new": 1,
        "title": "",
        "title_color": "",
        "show_describes": false,
        "describes": "null",
        "describes_color": "",
        "describes_images": [],
        "box_color": "",
        "bg_color": "",
        "bg_images": [],
        "button_image": "",
        "show_recommend_layer": false,
        "show_recommend_list": true,
        "show_more_btn": false,
    },
    playData: {},
    resultData: {},
    recommendData: {
        "total_page": 0,
        "page": 0,
        "recommend_list": [],
    },
}
export default new Vuex.Store({
    state,
    mutations,
    getters,
})
