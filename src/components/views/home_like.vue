<!--主页商店喜欢页组件-->
<template>
	<div id="like" class="like app-model" :style="{minHeight: (availHeight - 46) + 'px'}">
		<van-nav-bar class="van-nav-bar-customer fixed-fix" title="大家爱玩" left-text="返回" left-arrow @click-left="goToHome"/>
		<div class="like-content app-content">
			<van-list class="like-content-app-list" v-model="loading" :finished="page === total_page" finished-text="--我是有底线的--" :error.sync="error" error-text="请求失败，点击重新加载" @load="onLoad">
				<question_list_horizontal :question-list="likeList" :user-bg-color="'background-color: #6e88ff;'" :bg-color="true" @listenerQuestionListClick="onLikeClick"></question_list_horizontal>
			</van-list>
		</div>
	</div>
</template>
<script>

import question_list_horizontal from "@/components/common/question_list_horizontal";
import {mapGetters, mapMutations, mapState} from "vuex";
import Vue from 'vue';
import {List, NavBar} from 'vant';
import {Request} from "@/utils/Utils";

Vue.use(NavBar);
Vue.use(List);


export default {
	inject: ["openNewApp", "goToHome"],
	components: {
		question_list_horizontal,
	},
	computed: {
		...mapState(["isAppending", "loadingTime", "channelId", "homeData", "availHeight"]),
		...mapGetters(["appApiUrl", "appIconUrl", "appResourcesUrl"]),
	},
	data() {
		return {
			likeList: [],
			error: false,
			loading: false,
			total_page: 0,
			page: 0,
			timer: null,
		}
	},
	created() {
		// 初始化
		this.initData();
	},
	destroyed() {
		// 删除定时器
		if (this.timer) clearTimeout(this.timer);
	},
	methods: {
		...mapMutations({
			changeAppending: "changeAppending",
		}),

		// 初始化
		initData(callback) {
			// 开启加载提示框
			!this.isAppending && this.changeAppending(true);
			// 获得[大家爱玩]应用列表
			this.getLikeData(() => {
				// 关闭加载提示框
				this.timer = setTimeout(() => {
					this.changeAppending(false);
				}, this.loadingTime)
				if (typeof callback === "function") callback();
			});
		},

		onLikeClick(item) {
			this.openNewApp(item.app_id, false);
		},

		// 获得[大家爱玩]应用列表
		getLikeData(callback = null) {
			Request.request({
				url: this.appApiUrl + "/test_app/get_app_with_like",
				data: {
					page: this.page + 1,
				},
				callback: (res, err) => {
					if (err || res.code !== 0) return this.error = true;
					// 更新推荐列表
					this.total_page = res.body.total_page;
					this.page = res.body.page;
					for (let i = 0; i < res.body.app_list.length; i++) res.body.app_list[i].app_icon = this.appIconUrl(res.body.app_list[i].app_icon);
					this.likeList = this.likeList.concat(res.body.app_list);
					if (typeof callback === "function") callback();
				},
			})
		},

		onLoad() {
			// 异步更新数据
			setTimeout(() => {
				this.getLikeData(() => {
					// 加载状态结束
					this.loading = false;
				});
			}, 1000);
		},

	},
}
</script>
<style lang="less">
@import "../../assets/less/like.less";
</style>
