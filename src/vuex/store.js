import Vue from 'vue'
import Vuex from 'vuex'
import mutations from "./mutations"
import getters from "./getters"

Vue.use(Vuex)

// noinspection JSUnresolvedVariable
const state = {
    // 工程配置相关
    isRunBrowser: window.nativeObj === undefined, // 是否在普通浏览器运行
    appApiUrl: "http://interest.ezhigame.com", // 后端接口地址（正式服）
    testAppApiUrl: "http://interest.test.ezhigame.com", // 后端接口地址(测试服)
    yueYouApiUrl: "http://gamecenter.ezhigame.com", // 阅友游戏中心后端接口地址
    debugUserId: "01234567890", // 浏览器调试时用户ID
    centerChannelList: ["YueYou", "DeJian", "QiRead"],
    // 阅友单独使用的数据
    signStr: "bi6tUL8Tf31I+DHx9KRJkVP1M7S0jqQ9vTnUjDARxI6APhslppch7qofwgz8ikdJ2xzY4t8dsH2mhto4s1bHk7+X196BWZ+Iut7dby1dqECTMK17xOAOOb8ABT1AmHuaSIMIrsWicJ43f4TNzC+WF4jTUksL9FiqLYstgS0auAY=", // 验签串
    centerAppId: "700085", // 阅友游戏中心APP ID
    testCenterAppId: "700086", // 阅友游戏中心APP ID
    // 基础配置
    appId: null,
    commonAdAppId: "999999", // 公共广告应用ID
    appTypeId: null,  // 应用类型ID
    appTemplateId: null,  // 应用主题ID
    channelId: null, // 渠道ID
    channelVersion: 330, // 渠道初始版本号
    resultId: null, // 答题结果ID
    fraction: 0, // 答题结果分数
    adCount: 0, // 播放激励视频广告次数
    // 用户数据
    isLogin: false, // 是否已登陆
    isRecordAccess: false, // 是否已记录访问
    nickname: "游客",     // 昵称
    headImage: null,      // 头像
    sex: 0,           // 性别
    accessToken: null, // 身份令牌
    balance: '0.00', // 用户余额
    minCashOutAmount: '2', // 最小可提现金额，单位：元
    alipayAccount: "", // 支付宝账户
    alipayPhone: "", // 支付宝电话号码
    isNewAccount: true, // 是否是新用户
    // UI相关
    isAppending: false, // 是否显示加载动画
    isGameBack: false, // 是否显示推荐弹窗
    isShowResultPopup: false, // 是否显示结果答题弹窗
    timer: null, // 定时器
    availHeight: window.screen.availHeight, // 当前屏幕可视区域高度
    loadingTime: 300, // 延时定时器时间，毫秒
    // 倒计时按钮
    isShowCloseBtn: true, // 是否显示倒计时按钮
    isCountDown: false, // 是否开启倒计时
    countdownTimer: 120, // 倒计时退出时间,单位：秒  3分钟
    countdownSwitch: false, // 倒计时状态
    // webview关闭按钮
    isShowExitBtn: false, // 是否显示webview退出悬浮按钮
    // 红包相关
    isShowRedPacketPopup: false, // 是否显示红包弹窗
    isShowRedPacketTip: false, // 是否显示红包提示
    isShowCashOutAccountPopup: false, // 是否显示提现账户弹窗
    redPacketAmount: 0, // 领取的红包金额
    receiveNumber: 0, // 每日可领取的红包数量
    todayReceiveNumber: 0, // 今日已领取的红包数量
    isCanReceive: false, // 是否可以领取红包
    // 业务数据
    // 商店页数据
    homeData: {
        show_search: true,
        show_banner: true,
        show_type: true,
        show_module: true,
        show_like: true,
        show_more: true,
        banner_list: [],
        type_list: [],
        module_list: [],
        like_list: [],
    },
    // 主页数据
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
        "recommend_number": 10,
        "show_more_btn": false,
    },
    // 答题页数据
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
    // 结果页数据
    resultData: {
        "app_id": null,
        "app_icon": null,
        "app_type": null,
        "type_id": null,
        "template_id": null,
        "bg_color": "#4758fb",
        "button_image": "",
        "show_recommend_list": false,
        "recommend_number": 10,
        "result_id": null,
        "title": "",
        "describes": "",
        "analysis": "",
        "min_fraction": 5,
        "max_fraction": 10,
        "bg_images": [],
    },
    // 推荐列表数据
    recommendData: {
        "total_page": 0,
        "page": 0,
        "recommend_list": [],
    },
    // 弹幕数据
    barrageData: {
        "barrage_number": 200,  // 弹幕数量
        "barrage_loop": true,  // 是否循环显示弹幕
        "barrage_time": 3,  // 弹幕速度
        "barrage_style": "barrage-item-custom",  // 弹幕额外样式
        "barrage_type": "",  // 弹幕方向
        "lanes_count": 3,  // 弹幕航道数量
        "throttle_gap": 3000,  // 弹幕之间的节流时间
        "avatar_list": [],
        "msg_list": [],
        "barrageList": [],
    },
    // 推荐弹窗数据
    popupData: {
        "recommend_list": [],
    },
    // 提现页数据
    cashOutData: {
        "cash_out_list": [

            {
                cash_out_id: 10001, // 提现配置ID
                cash_out_amount: 2, // 提现金额，单位：元
                cash_out_desc: "仅可领取一次", // 提现配置说明
                cash_out_number: 1, // 允许提现次数
                user_cash_out_number: 0, // 用户提现次数
                cash_out_status: true, // 提现配置状态，禁用/可用
            },
            {
                cash_out_id: 10002, // 提现配置ID
                cash_out_amount: 5, // 提现金额，单位：元
                cash_out_desc: "仅可领取一次", // 提现配置说明
                cash_out_number: 1, // 允许提现次数
                user_cash_out_number: 0, // 用户提现次数
                cash_out_status: true, // 提现配置状态，禁用/可用
            },
            {
                cash_out_id: 10003, // 提现配置ID
                cash_out_amount: 10, // 提现金额，单位：元
                cash_out_desc: "仅可领取一次", // 提现配置说明
                cash_out_number: 5, // 允许提现次数
                user_cash_out_number: 0, // 用户提现次数
                cash_out_status: true, // 提现配置状态，禁用/可用
            },
            {
                cash_out_id: 10004, // 提现配置ID
                cash_out_amount: 20, // 提现金额，单位：元
                cash_out_desc: "仅可领取一次", // 提现配置说明
                cash_out_number: 1, // 允许提现次数
                user_cash_out_number: 0, // 用户提现次数
                cash_out_status: true, // 提现配置状态，禁用/可用
            },
            {
                cash_out_id: 10005, // 提现配置ID
                cash_out_amount: 50, // 提现金额，单位：元
                cash_out_desc: "仅可领取一次", // 提现配置说明
                cash_out_number: 1, // 允许提现次数
                user_cash_out_number: 0, // 用户提现次数
                cash_out_status: true, // 提现配置状态，禁用/可用
            },
            {
                cash_out_id: 10006, // 提现配置ID
                cash_out_amount: 100, // 提现金额，单位：元
                cash_out_desc: "仅可领取一次", // 提现配置说明
                cash_out_number: 1, // 允许提现次数
                user_cash_out_number: 0, // 用户提现次数
                cash_out_status: true, // 提现配置状态，禁用/可用
            },

        ],
        "notice_list": [],
        "noticeContent": "",
    },
}
export default new Vuex.Store({
    state,
    mutations,
    getters,
})
