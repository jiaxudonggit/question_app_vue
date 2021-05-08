<!--主页商店分类页组件-->
<template>
	<div id="type" class="type app-model">
		<van-nav-bar class="van-nav-bar-customer fixed-fix" :title="type_name" left-text="返回" left-arrow @click-left="goToHome"/>
		<div class="type-content app-content">
			<img :src="type_image" class="type-content-bg-image" alt="">
			<div class="type-content-app-list-wrap">
				<div class="type-content-app-list-title">
					<img src="../../assets/images/home/title_icon_left.png" alt="">
					<span>{{ type_name }}</span>
					<img src="../../assets/images/home/title_icon_right.png" alt="">
				</div>
				<van-list class="type-content-app-list" v-model="loading" :finished="page === total_page" finished-text="--我是有底线的--" :error.sync="error" error-text="请求失败，点击重新加载" @load="onLoad">
					<question_list_horizontal :question-list="typeList" :user-bg-color="'background-color: #6e88ff;'" :bg-color="true" @listenerQuestionListClick="onTypeClick"></question_list_horizontal>
				</van-list>
			</div>

		</div>
	</div>
</template>
<script>

import question_list_horizontal from "@/components/common/question_list_horizontal";
import {mapGetters, mapMutations, mapState} from "vuex";
import Vue from 'vue';
import {List, NavBar} from 'vant';
import {Request} from "@/utils/utils";

Vue.use(NavBar);
Vue.use(List);

export default {
	inject: ["openNewApp", "goToHome"],
	components: {
		question_list_horizontal,
	},
	computed: {
		...mapState(["isAppending", "loadingTime", "channelId", "homeData", "availHeight"]),
		...mapGetters(["appApiUrl", "appIconUrl", "appResourcesUrl", "appTypeUrl"]),
		typeId() {
			return this.$route.query.YzTypeId;
		}
	},
	data() {
		return {
			type_image: require("@/assets/images/home/type_10001_big.png"),
			type_name: "推荐排行",
			typeList: [],
			error: false,
			loading: false,
			total_page: 0,
			page: 0,
			model: "type",
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
			// 获取分类下的应用数据
			this.getTypeData(() => {
				// 关闭加载提示框
				this.timer = setTimeout(() => {
					this.changeAppending(false);
				}, this.loadingTime)
				if (typeof callback === "function") callback();
			});
		},

		// 分类应用点击事件
		onTypeClick(item) {
			this.openNewApp(item.app_id, false);
		},

		// 获得分类下的应用列表
		getTypeData(callback = null) {
			Request.request({
				url: this.appApiUrl + "/test_app/get_app_with_type",
				data: {
					type_id: this.typeId,
					page: this.page + 1,
					page_name: this.model,
				},
				callback: (res, err) => {
					if (err || res.code !== 0) return this.error = true;
					// 更新推荐列表
					this.total_page = res.body.total_page;
					this.page = res.body.page;
					this.type_name = res.body.type_name;
					this.type_image = this.appTypeUrl(res.body.type_image);
					for (let i = 0; i < res.body.app_list.length; i++) res.body.app_list[i].app_icon = this.appIconUrl(res.body.app_list[i].app_icon);
					this.typeList = this.typeList.concat(res.body.app_list);
					if (typeof callback === "function") callback();
				},
			})
		},

		onLoad() {
			// 异步更新数据
			setTimeout(() => {
				this.getTypeData(() => {
					// 加载状态结束
					this.loading = false;
				});
			}, 1000);
		},

	},
}
</script>
<style lang="less">
@import "../../assets/less/type.less";
</style>
