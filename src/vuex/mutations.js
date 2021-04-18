// noinspection JSUnresolvedVariable

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

    // 设置用户信息
    setUserInfo(state, userInfo) {
        state.nickname = String(userInfo.nickname);
        state.headImage = String(userInfo.head_img_url);
        state.sex = userInfo.sex;
        state.accessToken = userInfo.access_token;
    },

}
export default mutations
