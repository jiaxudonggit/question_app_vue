<!--主页商店页面组件-->
<template>
	<div id="type" class="type app-model" :style="{minHeight: availHeight + 'px'}">
		<div class="type-content app-content">
			<van-list class="home-more-list" v-model="loading" :finished="page === total_page" finished-text="--我是有底线的--" :error.sync="error" error-text="请求失败，点击重新加载" @load="onLoad">
				<question_list_horizontal :question-list="typeList" :user-bg-color="'background-color: #6e88ff;'" :padding="'0'" @listenerQuestionListClick="onTypeClick"></question_list_horizontal>
			</van-list>
		</div>
	</div>
</template>
<script>

import question_list_horizontal from "@/components/common/question_list_horizontal";
import {mapGetters, mapMutations, mapState} from "vuex";
// import {Request} from "@/utils/Utils";
import Vue from 'vue';
import {List} from 'vant';
Vue.use(List);


export default {
	inject: ['reload', "autoLogin"],
	components: {
		question_list_horizontal,
	},
	computed: {
		...mapState(["isAppending", "loadingTime", "channelId", "homeData", "availHeight"]),
		...mapGetters(["appApiUrl", "appIconUrl", "appResourcesUrl", "isLogin"]),
	},
	data() {
		return {
			typeList: [],
			error: false,
			loading: false,
			total_page: 0,
			page: 0,
		}
	},
	activated() {
		// 设置channelId到vuex
		this.setChannelId(this.$route.query.YzChannelId);
		// 初始化
		// this.initData(() => {
		// 	// 打开插屏广告
		// 	if (this.appId) AdUtils.openScreenAd(this.appId);
		// 	// 创建查看结果记录
		// 	this.createResultRecord();
		// })
	},
	destroyed() {

	},
	methods: {
		...mapMutations({
			setChannelId: "setChannelId",
			changeAppending: "changeAppending",
		}),

		onTypeClick(item) {
			console.log(item)
		},

		onLoad() {
			// 异步更新数据
			// setTimeout(() => {
			// 	this.getMoreData(() => {
			// 		// 加载状态结束
			// 		this.loading = false;
			// 	});
			// }, 1000);
		},
	},
}
</script>
<style lang="less">
@import "../../assets/less/home.less";
</style>
