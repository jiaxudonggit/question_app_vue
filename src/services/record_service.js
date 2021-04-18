import {Request, Utils} from '@/utils/Utils';
import store from '../vuex/store';

export default class RecordService {

    // 创建进入应用记录
    static createAccessRecord(option) {
        Request.request({
            url: option.url,
            data: option.data,
            callback: option.callback,
        });
    }

    // 创建用户答题记录
    static createAnswerRecord(option) {
        Request.request({
            url: Utils.getAppAPiUrl() + "/interest_test_app/record/create_answer_record",
            data: {
                channel_id: option.channelId,
                app_id: option.appId,
                openid: store.state.userInfo.openId,
                user_id: store.state.userInfo.userId,
                subject_id: option.subject_id,
                answer_id: option.answer_id,
            },
            callback: option.callback,
        });
    }

    // 创建用户查看结果记录
    static createResultRecord(option) {
        Request.request({
            url: Utils.getAppAPiUrl() + "/interest_test_app/record/create_result_record",
            data: {
                channel_id: option.channelId,
                app_id: option.appId,
                openid: store.state.userInfo.openId,
                user_id: store.state.userInfo.userId,
                result_id: option.result_id,
                fraction: option.fraction,
            },
            callback: option.callback,
        });
    }

    // 记录用户点击推荐应用
    static createRecommendRecord(option) {
        Request.request({
            url: Utils.getAppAPiUrl() + "/interest_test_app/record/create_recommend_record",
            data: {
                channel_id: option.channelId,
                app_id: option.appId,
                user_id: store.state.userInfo.userId,
                from_app_id: option.from_app_id,
                to_app_id: option.to_app_id,
            },
            callback: option.callback,
        });
    }

}

