/*
* 类似于 Vue 中的 计算属性（可以认为是 store 的计算属性），getter 的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算。
* */
export default {

    // 是否已登录
    isLogin: (state) => {
        return (state.accessToken !== null || window.sessionStorage.getItem("accessToken") !== null) && state.appId !== null;
    },

    // 返回后端接口地址
    appApiUrl: (state) => {
        return `${process.env.NODE_ENV === 'production' ? state.appApiUrl : state.testAppApiUrl}/api`;
    },

    // 返回后端静态文件地址
    appResourcesUrl: (state) => (model, file_name) => {
        if (file_name === "default.png") return `${process.env.NODE_ENV === 'production' ? state.appApiUrl : state.testAppApiUrl}/resources/default/${model}/${file_name}`;
        return `${process.env.NODE_ENV === 'production' ? state.appApiUrl : state.testAppApiUrl}/resources/apps/${state.appId}/${model}/${file_name}`;
    },
    // 返回应用icon地址
    appIconUrl: (state) => (file_name) => {
        if (file_name === "default.png") return `${process.env.NODE_ENV === 'production' ? state.appApiUrl : state.testAppApiUrl}/resources/default/icon/${file_name}`;
        return `${process.env.NODE_ENV === 'production' ? state.appApiUrl : state.testAppApiUrl}/resources/icon/${file_name}`;
    },
    // 返回应用banner地址
    appBannerUrl: (state) => (file_name) => {
        if (file_name === "default.png") return `${process.env.NODE_ENV === 'production' ? state.appApiUrl : state.testAppApiUrl}/resources/default/banner/${file_name}`;
        return `${process.env.NODE_ENV === 'production' ? state.appApiUrl : state.testAppApiUrl}/resources/banner/${file_name}`;
    },
    // 返回应用banner地址
    appTypeUrl: (state) => (file_name) => {
        if (file_name === "default.png") return `${process.env.NODE_ENV === 'production' ? state.appApiUrl : state.testAppApiUrl}/resources/default/type/${file_name}`;
        return `${process.env.NODE_ENV === 'production' ? state.appApiUrl : state.testAppApiUrl}/resources/type/${file_name}`;
    },
    // 返回应用like地址
    appLikeUrl: (state) => (file_name) => {
        if (file_name === "default.png") return `${process.env.NODE_ENV === 'production' ? state.appApiUrl : state.testAppApiUrl}/resources/default/like/${file_name}`;
        return `${process.env.NODE_ENV === 'production' ? state.appApiUrl : state.testAppApiUrl}/resources/like/${file_name}`;
    },
    // 返回弹幕头像地址
    appBarrageAvatarUrl: (state) => (file_name) => {
        return `${process.env.NODE_ENV === 'production' ? state.appApiUrl : state.testAppApiUrl}/resources/barrage/${file_name}`;
    },

    // 返回音频地址
    appAudioUrl: (state) => (file_name) => {
        return `${process.env.NODE_ENV === 'production' ? state.appApiUrl : state.testAppApiUrl}/resources/audio/${file_name}`;
    },
}
