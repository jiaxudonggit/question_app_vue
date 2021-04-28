import Vue from 'vue'
import Vuex from 'vuex'
import mutations from "./mutations"
import getters from "./getters"
import { MESSAGE_TYPE } from 'vue-baberrage'
import {Utils} from "@/utils/Utils";

Vue.use(Vuex)

const state = {
    // 工程配置相关
    debug: true,
    isRunBrowser: window.nativeObj === undefined,
    appApiUrl: "http://interest.ezhigame.com", // 后端接口地址（正式服）
    testAppApiUrl: "http://interest.test.ezhigame.com", // 后端接口地址(测试服)
    // 基础配置
    appId: null,
    appTypeId: null,  // 应用类型ID
    appTemplateId: null,  // 应用主题ID
    channelId: Utils.getQueryParams("YzChannelId"), // 渠道ID
    channelVersion: 330, // 渠道初始版本号
    resultId: null, // 答题结果ID
    fraction: 0, // 答题结果分数
    adCount: 0, // 播放激励视频广告次数
    IndexPageName: ["index", "home"], // 显示关闭按钮的页面名称
    // 用户数据
    isLogin: false, // 是否已登陆
    isRecordAccess: false, // 是否已记录访问
    nickname: "",     // 昵称
    headImage: "",      // 头像
    sex: 0,           // 性别
    accessToken: null, // 身份令牌
    isNewAccount: true, // 是否是新用户
    // 浏览器调试时用户ID
    debugUserId: "0123456789",
    // 阅友单独使用的数据
    signStr: "bi6tUL8Tf31I+DHx9KRJkVP1M7S0jqQ9vTnUjDARxI6APhslppch7qofwgz8ikdJ2xzY4t8dsH2mhto4s1bHk7+X196BWZ+Iut7dby1dqECTMK17xOAOOb8ABT1AmHuaSIMIrsWicJ43f4TNzC+WF4jTUksL9FiqLYstgS0auAY=", // 验签串
    centerAppId: "700085",
    // UI相关
    isAppending: false,
    isGameBack: false,
    isShowResultPopup: false,
    timer: null,
    availHeight: window.screen.availHeight,
    loadingTime: 300,
    // 倒计时按钮
    isShowCloseBtn: false, // 是否显示倒计时按钮
    isCloseBtn: false, // 是否删除倒计时按钮dom
    countdownTimer: 120, // 倒计时退出时间,单位：秒  3分钟
    countdownSwitch: false, // 倒计时状态
    // webview关闭按钮
    isShowExitBtn: false, // 是否显示webview退出悬浮按钮
    // 业务数据
    homeData: {
        banner_list: [
            {
                app_id: 234,
                app_banner: require("@/assets/images/home/234_banner.png"),
            },
            {
                app_id: 222,
                app_banner: require("@/assets/images/home/222_banner.png"),
            },

        ],
        type_list: [
            {
                type_title: "推荐排行",
                type_icon: require("@/assets/images/home/type_10001.png"),
                type_id: 10001,
            },
            {
                type_title: "推荐排行",
                type_icon: require("@/assets/images/home/type_10002.png"),
                type_id: 10002,
            },
            {
                type_title: "推荐排行",
                type_icon: require("@/assets/images/home/type_10003.png"),
                type_id: 10003,
            },
            {
                type_title: "推荐排行",
                type_icon: require("@/assets/images/home/type_10004.png"),
                type_id: 10004,
            },
        ],
        module_list: [
            {

                module_title: "左右脑",
                app_id: 234,
                app_name: "左右脑哪个更灵活",
                app_icon: "http://interest.test.ezhigame.com/resources/icon/118.png",
                btn_text: "测试",
                bg_color: "linear-gradient(#f1c666, #fc9c04)",
            },
            {

                module_title: "左右脑",
                app_id: 234,
                app_name: "左右脑哪个更灵活",
                app_icon: "http://interest.test.ezhigame.com/resources/icon/875.jpg",
                btn_text: "测试",
                bg_color: "linear-gradient(#ff8900, #fb5d03)",
            },
            {

                module_title: "左右脑",
                app_id: 234,
                app_name: "左右脑哪个更灵活",
                app_icon: "http://interest.test.ezhigame.com/resources/icon/835.png",
                btn_text: "测试",
                bg_color: "linear-gradient(#01cfff, #157dfc)",
            },
        ],
        like_list: [
            {
                app_id: 234,
                app_name: "看表情猜成语大挑战",
                app_desc: "看表情猜成语大挑战看表情猜成语大挑战看表情猜成语大挑战看表情猜成语大挑战",
                app_banner: require("@/assets/images/home/1.jpg"),
            },
            {
                app_id: 234,
                app_name: "看表情猜成语大挑战",
                app_desc: "看表情猜成语大挑战看表情猜成语大挑战看表情猜成语大挑战看表情猜成语大挑战",
                app_banner: require("@/assets/images/home/2.jpg"),
            },
            {
                app_id: 234,
                app_name: "看表情猜成语大挑战",
                app_desc: "看表情猜成语大挑战看表情猜成语大挑战看表情猜成语大挑战看表情猜成语大挑战",
                app_banner: require("@/assets/images/home/3.jpg"),
            },
            {
                app_id: 234,
                app_name: "看表情猜成语大挑战",
                app_desc: "看表情猜成语大挑战看表情猜成语大挑战看表情猜成语大挑战看表情猜成语大挑战",
                app_banner: require("@/assets/images/home/4.jpg"),
            },
        ],
    },
    indexData: {
        "app_id": null,
        "app_icon": null,
        "app_type": null,
        "type_id": null,
        "template_id": null,
        "question_number": "6",
        "user_number": "168.14",
        "evaluate": "98.99",
        "is_new": 1,
        "title": "",
        "title_color": "#ffffff",
        "show_describes": false,
        "describes": "null",
        "describes_color": "#328fd2",
        "describes_images": [],
        "box_color": "#eaf1ff",
        "bg_color": "#4758fb",
        "bg_images": [],
        "button_image": "",
        "show_recommend_layer": false,
        "show_recommend_list": false,
        "show_more_btn": false,
    },
    playData: {
        "app_id": null,
        "app_icon": null,
        "app_type": null,
        "type_id": null,
        "template_id": null,
        "title": "",
        "title_color": "#ffffff",
        "title_image": "",
        "process_bg_color": "#74ebff",
        "process_color": "#668cff",
        "bg_color": "#4758fb",
        "show_barrage": true,
        "question_list": [],
    },
    resultData: {
        "app_id": null,
        "app_icon": null,
        "app_type": null,
        "type_id": null,
        "template_id": null,
        "bg_color": "#4758fb",
        "button_image": "",
        "show_recommend_list": false,
        "result_id": null,
        "title": "",
        "describes": "",
        "analysis": "",
        "min_fraction": 5,
        "max_fraction": 10,
        "bg_images": [],
    },
    recommendData: {
        "total_page": 0,
        "page": 0,
        "recommend_list": [],
    },
    barrageData: {
        "barrage_number": 200,  // 弹幕数量
        "barrage_loop": true,  // 是否循环显示弹幕
        "barrage_time": 3,  // 弹幕速度
        "barrage_style": "barrage-item-custom",  // 弹幕额外样式
        "barrage_type": MESSAGE_TYPE.NORMAL,  // 弹幕方向
        "lanes_count": 3,  // 弹幕航道数量
        "throttle_gap": 3000,  // 弹幕之间的节流时间
        "avatar_list": [],
        "msg_list": [],
        "barrageList": [],
    },
    popupData: {
        "recommend_list": [],
    },
}
export default new Vuex.Store({
    state,
    mutations,
    getters,
})
