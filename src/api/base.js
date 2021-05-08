/**
 * 接口域名的管理
 */
const store = require("@/vuex/store")

const baseUrl = {
    server: store.getters.appApiUrl,
    YueYou: store.state.yueYouApiUrl,
}

export default baseUrl;
