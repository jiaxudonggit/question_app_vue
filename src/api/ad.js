/**
 * 答题页接口列表
 */
import axios from '@/utils/http';
import qs from 'qs';
import Utils from "@/utils/utils";

export default {

    // 领取红包
    receiveRedPacket(params) {
        return axios.post(`/api/red_packet/receive_red_packet`,  qs.stringify(Utils.renderParams(params)));
    },

    // 获取提现配置
    getCashOutData() {
        return axios.post(`/api/red_packet/get_cash_out_config`,  qs.stringify(Utils.renderParams()));
    },

    // 检测用户提现账户
    checkUserAccount() {
        return axios.post(`/api/red_packet/check_user_account`,  qs.stringify(Utils.renderParams()));
    },

    // 提交用户提现账户
    submitUserAccount(params) {
        return axios.post(`/api/red_packet/submit_user_account`,  qs.stringify(Utils.renderParams(params)));
    },

    // 提交提现申请
    submitCashOut(params) {
        return axios.post(`/api/red_packet/submit_cash_out`,  qs.stringify(Utils.renderParams(params)));
    },

}
