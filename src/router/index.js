import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = Router.prototype.push

Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
//app整体由店面页和店内页组成 暂时并没有用到嵌套路由
const routes = [
    {
        path: '/home',
        name: "home",
        component: resolve => require(["../components/views/home"], resolve),
        meta: {
            keepAlive: true,
            showTabbar: false,
            showCloseBtn: true,
            accessRecord: false,
        }
    },
    {
        path: '/user',
        name: "user",
        component: resolve => require(["../components/views/home_type"], resolve),
        meta: {
            keepAlive: true,
            showTabbar: false,
            showCloseBtn: true,
            accessRecord: false,
        }
    },
    {
        path: '/type',
        name: "type",
        component: resolve => require(["../components/views/home_type"], resolve),
        meta: {
            keepAlive: false,
            showTabbar: false,
            showCloseBtn: false,
            accessRecord: false,
        }
    },
    {
        path: '/search',
        name: "search",
        component: resolve => require(["../components/views/home_search"], resolve),
        meta: {
            keepAlive: false,
            showTabbar: false,
            showCloseBtn: false,
            accessRecord: false,
        }
    },
    {
        path: '/like',
        name: "like",
        component: resolve => require(["../components/views/home_like"], resolve),
        meta: {
            keepAlive: false,
            showTabbar: false,
            showCloseBtn: false,
            accessRecord: false,
        }
    },
    {
        path: '/',
        name: "index",
        component: resolve => require(["../components/views/index"], resolve),
        meta: {
            keepAlive: true,
            showTabbar: false,
            showCloseBtn: true,
            accessRecord: true,
        }
    },
    {
        path: '/play',
        name: "play",
        component: resolve => require(["../components/views/play"], resolve),
        meta: {
            keepAlive: true,
            showTabbar: false,
            showCloseBtn: false,
            accessRecord: true,
        }
    },
    {
        path: '/result',
        name: "result",
        component: resolve => require(["../components/views/result"], resolve),
        meta: {
            keepAlive: true,
            showTabbar: false,
            showCloseBtn: false,
            accessRecord: true,
        }
    },
]
export default new Router({
    // base: "/vue-views/",
    mode: 'history',
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return {x: 0, y: 0}
        }
    }
})
