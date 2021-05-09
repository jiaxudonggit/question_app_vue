import 'core-js/stable';
import 'regenerator-runtime/runtime';
import Vue from 'vue';
import vuex from 'vue';
import App from './App';
import router from './router';
import store from './vuex/store';
import filters from './filters'; //将全部过滤器放在 filters/index.js 中便于管理
import animated from 'animate.css'; // 动画库
import FastClick from 'fastclick' //使用 fastclick 解决移动端 300ms 点击延迟
import '@vant/touch-emulator'; // vant触摸兼容
import {Toast} from 'vant'; // 轻提示
import VConsole from 'vconsole';
import api from '@/api/api' // 导入api接口

// 初始化调试控制台
if (process.env.NODE_ENV === 'development') new VConsole();

//技巧 同时 use 多个插件 被依赖的插件应放在偏后方
Vue.use(animated, Toast, vuex);

// 将api挂载到vue的原型上
Vue.prototype.$api = api;

// 注册全局过滤器
filters(Vue)

//将此值设置为 false ,会关闭 Vue 启动时的提示信息，推荐
Vue.config.productionTip = false

FastClick.attach(document.body)

// 使用钩子函数对路由进行判断
router.beforeEach((to, from, next) => {
    if (to.query.YzChannelId) {
        next()
    } else {
        let toQuery = JSON.parse(JSON.stringify(to.query));
        toQuery.YzChannelId = from.query.YzChannelId || "YueYou";
        toQuery.t = new Date().getTime();
        next({
            path: to.path,
            query: toQuery
        })
    }
});

// 设置数组随机属性
Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})
