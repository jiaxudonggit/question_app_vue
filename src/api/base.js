/**
 * 接口域名的管理
 */
import store from "@/vuex/store";

const baseUrl = {
    server: store.getters.appApiUrl,
    YueYou: store.state.yueYouApiUrl,
}

export default baseUrl;

window.androidLifeCycleCallBack = function (from, callback) {
    switch (callback) {
        case 'onPause':
            // do something
            break;
        case 'onResume':
            // do something
            break;
        case 'onStop':
            // do something
            break;
    }
};
