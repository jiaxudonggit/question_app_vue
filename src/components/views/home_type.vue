<!--主页商店分类页组件-->
<template>
	<div id="type" class="type app-model" :style="{minHeight: (availHeight - 46) + 'px'}">
		<van-nav-bar class="van-nav-bar-customer fixed-fix" :title="$route.query.YzTypeTitle" left-text="返回" left-arrow @click-left="onClickLeft"/>
		<div class="type-content app-content">
			<img :src="type.type_image" class="type-content-bg-image" alt="">
			<div class="type-content-app-list-wrap">
				<div class="type-content-app-list-title">
					{{ $route.query.YzTypeTitle }}
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
import {Request} from "@/utils/Utils";

Vue.use(NavBar);
Vue.use(List);


export default {
	inject: ['reload', "autoLogin"],
	components: {
		question_list_horizontal,
	},
	computed: {
		...mapState(["isAppending", "loadingTime", "channelId", "homeData", "availHeight"]),
		...mapGetters(["appApiUrl", "appIconUrl", "appResourcesUrl", "isLogin"]),
		typeId() {
			return this.$route.query.YzTypeId;
		}
	},
	data() {
		return {
			type_image: require("@/assets/images/home/type_10001_big.png"),
			typeList: [],
			error: false,
			loading: false,
			total_page: 0,
			page: 0,
			type: {},
			model: "type",
		}
	},
	activated() {
		// 设置channelId到vuex
		this.setChannelId(this.$route.query.YzChannelId);
		// 初始化数据
		this.page = 0;
		this.total_page = 0;
		this.typeList = [];
		this.type = {};
		// 初始化接口
		this.initData();
	},
	methods: {
		...mapMutations({
			setChannelId: "setChannelId",
			changeAppending: "changeAppending",
		}),

		// 初始化
		initData(callback) {
			// 开启加载提示框
			!this.isAppending && this.changeAppending(true);
			// 用户登录
			this.autoLogin(() => {
				// 通过type_id获取类型
				this.getTypeById(() => {
					// 获取分类下的应用数据
					this.getTypeData(()=>{
						// 关闭加载提示框
						let timer = setTimeout(() => {
							this.changeAppending(false);
						}, this.loadingTime)
						this.timer.push(timer);
						if (typeof callback === "function") callback();
					});
				})
			});
		},

		onTypeClick(item) {
			this.$router.replace({path: "/", query: {YzAppId: item.app_id, YzChannelId: this.channelId, t: new Date().getTime()}});
		},

		onClickLeft() {
			this.$router.replace({path: "/home", query: {YzChannelId: this.channelId, t: new Date().getTime()}});
		},

		// 获得测一测推荐配置
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

		// 通过type_id获取类型
		getTypeById(callback) {
			for (let i = 0; i < this.homeData.type_list.length; i++) if (this.homeData.type_list[i].type_id + "" === this.typeId + "") this.type = this.homeData.type_list[i];
			if (typeof callback === "function") callback();
		},
	},
}
</script>
<style lang="less">
@import "../../assets/less/type.less";
</style>
