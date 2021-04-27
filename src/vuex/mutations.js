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

    // 改变登录记录状态
    doRecordAccess(state) {
        state.isRecordAccess = true;
    },

    // 设置应用ID
    setAppStatus(state, payload) {
        state.appId = payload.appId;
        state.channelVersion = payload.channelVersion;
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

    // 设置广告统计次数
    addAdCount(state) {
        state.adCount += 1;
    },

    // 设置推荐弹窗显示状态
    setGameBack(state, status) {
        state.isGameBack = status;
    },

    // 设置关闭webview悬浮按钮状态
    setShowExitBtn(state, status) {
        state.isShowExitBtn = status;
    },

    // 设置关闭按钮显示状态
    setShowCloseBtn(state, status) {
        state.countdownSwitch = status;
        state.showCloseBtn = status;
    },

    // 设置测试结果弹窗显示状态
    setCountdownSwitch(state, status) {
        state.countdownSwitch = status;
    },

    // 设置测试结果弹窗显示状态
    setShowResultPopup(state, status) {
        state.isShowResultPopup = status;
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
        window.sessionStorage.setItem("accessToken", userInfo.access_token)
    },

    // 设置主页数据
    setIndexData(state, payload) {
        for (let i = 0; i < payload.data.bg_images.length; i++) payload.data.bg_images[i] = payload.appResourcesUrl(payload.model, payload.data.bg_images[i]);
        for (let i = 0; i < payload.data.describes_images.length; i++) payload.data.describes_images[i] = payload.appResourcesUrl(payload.model, payload.data.describes_images[i]);
        payload.data.app_icon = payload.appIconUrl(payload.data.app_icon);
        payload.data.button_image = payload.appResourcesUrl(payload.model, payload.data.button_image);
        state.indexData = payload.data;
    },

    // 设置答题页数据
    setPlayData(state, payload) {
        payload.data.app_icon = payload.appIconUrl(payload.data.app_icon);
        for (let i = 0; i < payload.data.question_list.length; i++) {
            let question = payload.data.question_list[i];
            if (question.question_audio) question.question_audio = payload.appResourcesUrl(payload.model, question.question_audio);
            if (question.question_image) question.question_image = payload.appResourcesUrl(payload.model, question.question_image);
            if (question.question_video) question.question_video = payload.appResourcesUrl(payload.model, question.question_video);
            for (let j = 0; j < question.question_answers.length; j++) {
                let answer = question.question_answers[j];
                if (answer.answer_image) answer.answer_image = payload.appResourcesUrl(payload.model, answer.answer_image);
                question.question_answers[j] = answer;
            }
            payload.data.question_list[i] = question;
        }
        state.playData = payload.data;
    },

    // 设置结果页数据
    setResultData(state, payload) {
        payload.data.app_icon = payload.appIconUrl(payload.data.app_icon);
        payload.data.button_image = payload.appResourcesUrl(payload.model, payload.data.button_image);
        for (let i = 0; i < payload.data.bg_images.length; i++) payload.data.bg_images[i] = payload.appResourcesUrl(payload.model, payload.data.bg_images[i]);
        state.resultData = payload.data;
    },


    // 设置弹幕数据
    setBarrageData(state, payload) {
        let barrageData = payload.data;
        state.barrageData.barrageList = [];
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
        for (let i = 1; i < state.barrageData.barrage_number + 1; i++) state.barrageData.barrageList.push({
            id: i,
            avatar: payload.appBarrageAvatarUrl(state.barrageData.avatar_list.randomElement()),
            msg: state.barrageData.msg_list.randomElement(),
            time: state.barrageData.barrage_time,
            type: state.barrageData.barrage_type,
            barrageStyle: state.barrageData.barrage_style,
            extraWidth: Math.floor(Math.random() * (200 - 80 + 1) + 80),
        });
    },

    // 设置推荐弹窗数据
    setPopupData(state, payload) {
        for (let i = 0; i < payload.data.recommend_list.length; i++) payload.data.recommend_list[i].app_icon = payload.appIconUrl(payload.data.recommend_list[i].app_icon);
        state.popupData = payload.data;
    },

}
export default mutations
