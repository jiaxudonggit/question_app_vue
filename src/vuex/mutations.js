const mutations = {

    // 设置渠道ID
    setChannelId(state, channelId) {
        if (channelId) state.channelId = String(channelId);
    },

    // 设置应用ID
    setAppId(state, appId) {
        if (appId) state.appId = String(appId);
    },

    // 设置屏幕最小高度
    setAvailHeight(state, availHeight) {
        state.availHeight = availHeight;
    },

    // 设置应用状态
    setAppStatus(state, payload) {
        state.appId = payload.appId;
        state.channelVersion = payload.channelVersion;
    },

    // 改变进入应用记录状态
    setRecordAccess(state, status) {
        state.isRecordAccess = status;
    },

    // 设置答题结果ID
    setResultId(state, resultId) {
        state.resultId = resultId;
    },

    // 设置答题结果分数
    setFraction(state, fraction) {
        state.fraction = fraction;
    },

    // 设置推荐弹窗显示状态
    setGameBack(state, status) {
        state.isGameBack = status;
    },

    // 设置红包弹窗显示状态
    setRedPacketPopup(state, status) {
        state.isShowRedPacketPopup = status;
    },

    // 设置红包余额不足弹窗显示状态
    setRedPacketTip(state, status) {
        state.isShowRedPacketTip = status;
    },

    // 设置红包账户弹窗显示状态
    setCashOutAccountPopup(state, status) {
        state.isShowCashOutAccountPopup = status;
    },

    // 设置webview关闭按钮状态
    setShowExitBtn(state, status) {
        state.isShowExitBtn = status;
    },

    // 设置计时器状态
    setCountdownSwitch(state, status) {
        state.countdownSwitch = status;
    },

    // 设置倒计时关闭按钮显示/隐藏状态
    setShowCloseBtn(state, status) {
        state.isShowCloseBtn = status;
    },
    // 设置倒计时关闭按钮显示/隐藏状态
    setCountDown(state, status) {
        state.isCountDown = status;
    },

    // 设置测试结果弹窗显示状态
    setShowResultPopup(state, status) {
        state.isShowResultPopup = status;
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

    // 设置阅友签名串
    setSignStr(state, sign) {
        state.signStr = sign;
    },

    // 增加广告统计次数
    addAdCount(state) {
        state.adCount += 1;
    },

    // 设置用户信息
    setUserInfo(state, userInfo) {
        state.nickname = String(userInfo.nickname);
        state.headImage = userInfo.head_img_url;
        state.sex = userInfo.sex;
        state.balance = userInfo.balance;
        state.isNewAccount = userInfo.is_new_account;
        state.accessToken = userInfo.access_token;
        window.sessionStorage.setItem("accessToken", userInfo.access_token);
    },

    // 设置红包数据
    setRedPacketData(state, amountData) {
        state.balance = amountData.balance;
        state.redPacketAmount = amountData.amount;
        state.minCashOutAmount = amountData.min_cash_out_amount;
        state.receiveNumber = amountData.receive_number;
        state.todayReceiveNumber = amountData.today_receive_number;
    },

    // 设置领取红包状态
    setCanReceive(state, status) {
        state.isCanReceive = status;
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
    setBarrageData(state, barrageData) {
        state.barrageData.barrage_number = barrageData.barrage_number;
        state.barrageData.barrage_loop = barrageData.barrage_loop;
        state.barrageData.barrage_time = barrageData.barrage_time;
        state.barrageData.barrage_style = barrageData.barrage_style;
        state.barrageData.lanes_count = barrageData.lanes_count;
        state.barrageData.throttle_gap = barrageData.throttle_gap;
        state.barrageData.avatar_list = barrageData.avatar_list;
        state.barrageData.msg_list = barrageData.msg_list;
    },

    // 设置推荐弹窗数据
    setPopupData(state, payload) {
        for (let i = 0; i < payload.data.recommend_list.length; i++) payload.data.recommend_list[i].app_icon = payload.appIconUrl(payload.data.recommend_list[i].app_icon);
        state.popupData = payload.data;
    },

    // 设置商店页数据
    setHomeData(state, payload) {
        // 处理banner图片
        for (let i = 0; i < payload.data.banner_list.length; i++) payload.data.banner_list[i].image_name = payload.appBannerUrl(payload.data.banner_list[i].image_name);
        // 处理type图片
        for (let i = 0; i < payload.data.type_list.length; i++) {
            payload.data.type_list[i].type_icon = payload.appTypeUrl(payload.data.type_list[i].type_icon);
            payload.data.type_list[i].type_image = payload.appTypeUrl(payload.data.type_list[i].type_image);
        }
        // 处理module图片
        for (let i = 0; i < payload.data.module_list.length; i++) payload.data.module_list[i].app_icon = payload.appIconUrl(payload.data.module_list[i].app_icon);
        // 处理like图片
        for (let i = 0; i < payload.data.like_list.length; i++) payload.data.like_list[i].image_name = payload.appLikeUrl(payload.data.like_list[i].image_name);
        state.homeData = payload.data;
    },

    // 设置提现页数据
    setCashOutData(state, cashOutData) {
        // 提现配置
        state.cashOutData.cash_out_list = cashOutData.cash_out_list;
        // 公共列表
        state.cashOutData.notice_list = cashOutData.notice_list;
        // 支付宝账户
        state.alipayAccount = cashOutData.alipay_account;
        state.alipayPhone = cashOutData.alipay_phone;
        // 设置余额
        state.balance = cashOutData.balance;
        // 处理公告
        let content = "";
        for (let i = 0; i < cashOutData.notice_list.length; i++) content += `${cashOutData.notice_list[i].nickname}已累计提现${cashOutData.notice_list[i].total_amount}元！${i > 0 ? ' ... ... ' : ''}`;
        state.cashOutData.noticeContent = content;
    },

    // 设置用户支付宝账户
    setCashOutAccount(state, accountData) {
        state.alipayAccount = accountData.alipay_account;
        state.alipayPhone = accountData.alipay_phone;
    },

}
export default mutations
