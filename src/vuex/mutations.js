import {MESSAGE_TYPE} from 'vue-baberrage'

const mutations = {

    // 设置渠道ID
    setChannelId(state, channelId) {
        state.channelId = channelId;
    },

    // 设置应用ID
    setAppId(state, appId) {
        state.appId = appId;
    },

    // 设置屏幕最小高度
    setAvailHeight(state, availHeight) {
        state.availHeight = availHeight;
    },

    // 设置答题结果ID
    setResultId(state, resultId) {
        state.resultId = resultId;
    },

    // 设置答题结果分数
    setFraction(state, fraction) {
        state.fraction = fraction;
    },

    // 设置弹窗显示状态
    setGameBack(state, status) {
        state.isGameBack = status;
    },

    // 阅友设置签名串
    setSignStr(state, sign) {
        state.signStr = sign;
    },

    // 切换loading状态
    changeAppending(state, status) {
        if (status) {
            state.isAppending = true;
            // 默认30秒后关闭
            state.timer = setTimeout(() => {
                state.isAppending = false;
            }, 1000 * 30);
        } else {
            if (state.timer) clearTimeout(state.timer);
            state.isAppending = false;
        }

    },

    // 设置用户信息
    setUserInfo(state, userInfo) {
        state.nickname = String(userInfo.nickname);
        state.headImage = String(userInfo.head_img_url);
        state.sex = userInfo.sex;
        state.accessToken = userInfo.access_token;
        state.isLogin = true;
    },

    // 设置主页数据
    setIndexData(state, indexData) {
        state.indexData = indexData;
    },

    // 设置主页数据
    resetIndexData(state, indexData) {
        state.indexData = indexData;
    },

    // 设置答题页数据
    setPlayData(state, playData) {
        state.playData = playData;
    },

    // 设置结果页数据
    setResultData(state, resultData) {
        state.resultData = resultData;
    },

    // 更新推荐列表
    updateRecommendData(state, recommendData) {
        state.recommendData.total_page = recommendData.total_page;
        state.recommendData.page = recommendData.page;
        state.recommendData.recommend_list = state.recommendData.recommend_list.concat(recommendData.recommend_list);
    },

    // 设置弹幕数据
    setBarrageData(state, barrageData) {
        state.barrageData.barrage_number = barrageData.barrage_number;
        state.barrageData.barrage_loop = barrageData.barrage_loop;
        state.barrageData.barrage_time = barrageData.barrage_time;
        state.barrageData.barrage_style = barrageData.barrage_style;
        state.barrageData.lanes_count = barrageData.lanes_count;
        state.barrageData.throttle_gap = barrageData.throttle_gap;
        state.barrageData.avatar_list = barrageData.avatar_list;
        state.barrageData.msg_list = barrageData.msg_list;
        switch (barrageData.barrage_type) {
            case "NORMAL":
                state.barrageData.barrage_type = MESSAGE_TYPE.NORMAL;
                break;
            case "FROM_TOP":
                state.barrageData.barrage_type = MESSAGE_TYPE.FROM_TOP;
                break;
            case "FROM_BOTTOM":
                state.barrageData.barrage_type = MESSAGE_TYPE.FROM_BOTTOM;
                break;
        }
    },

    // 设置推荐弹窗数据
    setPopupData(state, popupData) {
        state.popupData = popupData;
    },

}
export default mutations
