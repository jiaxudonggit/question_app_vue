import {Request} from '@/utils/Utils';

export default class AuthService {

    // 获取app配置(全部)
    static userLogin(option) {
        Request.request({
            url: option.url,
            data: option.data,
            callback: option.callback,
        });
    }

}

