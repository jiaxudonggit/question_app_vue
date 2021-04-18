import {Utils} from "@/utils/Utils";

const mutations = {

    // 设置渠道ID
    setChannelId(state, channelId) {
        state.channelId = channelId;
    },

    // 设置应用ID
    setAppId(state, appId) {
        state.appId = appId;
    },

    // 阅友设置签名串
    setSignStr(state, sign) {
        state.signStr = sign;
    },

    changeAppending(state, status) {
        if (status) {
            state.isAppending = true;
            // 默认30秒后关闭
            state.timer = setTimeout(()=>{
                state.isAppending = false;
            }, 1000 * 30);
        } else {
            if (state.timer) clearTimeout(state.timer);
            state.isAppending = false;
        }

    },

    // 设置应用配置
    setAppStatus(state, data) {
        // 基础配置
        state.baseConfig = data.baseConfig;
        state.baseConfig.centerAppId = String(state.baseConfig.centerAppId);
        state.baseConfig.appId = String(state.baseConfig.appId);
        state.baseConfig.appTypeId = String(state.baseConfig.appTypeId);
        state.baseConfig.appThemeId = String(state.baseConfig.appThemeId);


        // 主页配置
        state.appConfig.indexConfig = data.indexConfig;
        state.appConfig.indexConfig.detail = [
            {data: data.indexConfig.subjectNumber, unit: '道', desc: "测试题目"},
            {data: data.indexConfig.peopleNumber, unit: 'W', desc: "参与测试"},
            {data: data.indexConfig.praiseRate, unit: '%', desc: "好评率"},
        ];

        // 答题配置
        state.appConfig.answerConfig = data.answerConfig;

        // 结果配置
        state.appConfig.resultConfig = data.resultConfig;

        // 弹幕配置
        for (let i = 0; i < data.barrageConfig.barrageList.length; i++) {
            data.barrageConfig.barrageList[i].avatar = Utils.makeBarrageAvatarUrl(data.barrageConfig.barrageList[i].avatar);
        }
        state.barrageConfig = data.barrageConfig;

        // 推荐配置
        state.recommendConfig = data.recommendConfig;
    },

    // 设置用户信息
    setUserInfo(state, userInfo) {
        state.nickname = String(userInfo.nickname);
        state.headImage = String(userInfo.head_img_url);
        state.sex = userInfo.sex;
        state.accessToken = userInfo.access_token;
    },


    // 设置推荐配置
    setRecommendConfig(state, recommendConfig) {
        state.recommendConfig = recommendConfig;
    },

    // 更新推荐配置
    updateRecommendConfig(state, recommendConfig) {
        state.recommendConfig.total_page = recommendConfig.total_page;
        state.recommendConfig.page = recommendConfig.page;
        state.recommendConfig.recommendArray = state.recommendConfig.recommendArray.concat(recommendConfig.recommendArray);
    },

}
export default mutations
