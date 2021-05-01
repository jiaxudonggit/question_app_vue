<!-- 应用底部组件 主页、我的-->
<template>
	<van-tabbar v-if="showTabbar" route class="app-bottom-tabbar fixed-fix" v-model="active" active-color="#000" inactive-color="#a8adb1" style="z-index:999">
		<van-tabbar-item class="app-bottom-item" v-for="(item, index) in tabBarItem" :key="index" :to="item.to">
			<img slot="icon" slot-scope="props" :src="props.active ? item.active : item.normal" alt="">
			<span style="font-size: 6px">{{ item.title }}</span>
		</van-tabbar-item>
	</van-tabbar>
</template>
<script>

import Vue from 'vue';
import {Tabbar, TabbarItem} from 'vant';

Vue.use(Tabbar);
Vue.use(TabbarItem);

export default {
	name: "app-bottom",
	computed: {
		showTabbar() {
			return this.$route.meta.showTabbar;
		}
	},
	data() {
		return {
			active: 0,
			tabBarItem: [
				{
					"name": "home",
					"normal": require("@/assets/images/app_bottom/home-normal.png"),
					"active": require("@/assets/images/app_bottom/home-active.png"),
					"to": '/home',
					"title": '首页',
				},
				{
					"name": "user",
					"normal": require("@/assets/images/app_bottom/user-normal.png"),
					"active": require("@/assets/images/app_bottom/user-acitve.png"),
					"to": '/user',
					"title": '我的',
				},
			],
		}
	},
}
</script>
<style lang="less" scoped>
.app-bottom-tabbar {
	height: 50px;

	.app-bottom-item {
		img {
			width: 20px;
			height: 20px;
			display: block;
		}
	}
}
</style>
