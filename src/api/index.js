/**
 * 接口列表
 */
import axios from '@/utils/http';
import qs from 'qs';
import baseUrl from './base';
import {Utils} from "@/utils/utils";
import YueYou from "@/api/yueyou";

const request = {

    // 获得应用渠道状态
    getAppStatus(params) {
        return axios.post(`${baseUrl.server}/test_app/get_app_status`, qs.stringify(params));
    },

    // 用户登录
    userLogin(params) {
        return axios.post(`${baseUrl.server}/login/user_login`, qs.stringify(params));
    },

    // 记录用户进入应用
    createAccessRecord(params) {
        return axios.post(`${baseUrl.server}/test_app/create_access_record`, qs.stringify(Utils.renderParams(params)));
    },
}

export default {
    request,
    YueYou,
};
