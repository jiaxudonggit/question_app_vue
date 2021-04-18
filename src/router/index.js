import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
//app整体由店面页和店内页组成 暂时并没有用到嵌套路由
const routes = [
    {
        path: '/',
        name: "index",
        component: resolve => require(["../components/views/index"], resolve),
        meta: {
            keepAlive: true,
        }
    },
    {
        path: '/game',
        name: "game",
        component: resolve => require(["../components/views/game"], resolve),
        meta: {
            keepAlive: true,
        }
    },
    {
        path: '/result',
        name: "result",
        component: resolve => require(["../components/views/result"], resolve),
        meta: {
            keepAlive: false,
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
