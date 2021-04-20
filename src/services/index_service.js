import {Request, Utils} from '@/utils/Utils';

export default class ConfigService {

    // 获取主页配置(全部)
    static getIndexData(option) {
        Request.request({
            url: option.url,
            data: {
                channel_id: option.channel_id,
                app_id: option.app_id,
            },
            callback: option.callback,
        });
    }

    // 获取app配置
    static getBaseConfig(option) {
        Request.request({
            url: Utils.getAppAPiUrl() + "/interest_test_app/config/get_app_config",
            data: {
                channel_id: option.channel_id,
                app_id: option.app_id,
            },
            callback: option.callback,
        });
    }

    // 获取主页配置
    static getIndexConfig(option) {
        Request.request({
            url: Utils.getAppAPiUrl() + "/interest_test_app/config/get_index_data",
            data: {
                channel_id: option.channel_id,
                app_id: option.app_id,
            },
            callback: option.callback,
        });
    }

    // 获取答题配置
    static getAnswerConfig(option) {
        Request.request({
            url: Utils.getAppAPiUrl() + "/interest_test_app/config/get_answer_data",
            data: {
                channel_id: option.channel_id,
                app_id: option.app_id,
            },
            callback: option.callback,
        });
    }

    // 获取测试结果配置
    static getResultConfig(option) {
        Request.request({
            url: Utils.getAppAPiUrl() + "/interest_test_app/config/get_result_data",
            data: {
                channel_id: option.channel_id,
                app_id: option.app_id,
            },
            callback: option.callback,
        });
    }

    // 获取推荐配置
    static getRecommendConfig(option) {
        Request.request({
            url: Utils.getAppAPiUrl() + "/interest_test_app/config/get_recommend_data",
            data: {
                channel_id: option.channel_id,
                app_id: option.app_id,
                page: option.page,
            },
            callback: option.callback,
        });
    }

    // 获取弹幕配置
    static getBarrageConfig(option) {
        Request.request({
            url: Utils.getAppAPiUrl() + "/interest_test_app/config/get_barrage_data",
            data: {
                channel_id: option.channel_id,
                app_id: option.app_id,
            },
            callback: option.callback,
        });
    }
}

