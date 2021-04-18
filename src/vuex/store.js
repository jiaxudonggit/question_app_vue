import Vue from 'vue'
import Vuex from 'vuex'
import mutations from "./mutations"
import getters from "./getters"

Vue.use(Vuex)

const state = {
    // 工程配置相关
    debug: true,
    isRunBrowser: true,
    appApiUrl: "http://interest.app.ezhigame.com", // 后端接口地址（正式服）
    // testAppApiUrl: "http://interest.test.ezhigame.com", // 后端接口地址(测试服)
    testAppApiUrl: "http://127.0.0.1:8000", // 后端接口地址(测试服)
    // 基础配置
    appId: null,
    appTypeId: null,  // 应用类型ID
    appTemplateId: null,  // 应用主题ID
    channelId: null, // 渠道ID
    channelVersion: 330, // 渠道初始版本号
    // 用户数据
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
}
export default new Vuex.Store({
    state,
    mutations,
    getters,
})
