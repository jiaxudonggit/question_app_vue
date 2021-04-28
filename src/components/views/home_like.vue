<!--主页商店喜欢页组件-->
<template>
	<div id="like" class="like app-model" :style="{minHeight: (availHeight - 46) + 'px'}">
		<van-nav-bar class="van-nav-bar-customer fixed-fix" title="大家爱玩" left-text="返回" left-arrow @click-left="onClickLeft"/>
		<div class="like-content app-content">
			<van-list class="like-content-app-list" v-model="loading" :finished="page === total_page" finished-text="--我是有底线的--" :error.sync="error" error-text="请求失败，点击重新加载" @load="onLoad">
				<question_list_horizontal :question-list="likeList" :user-bg-color="'background-color: #6e88ff;'" :bg-color="true" @listenerQuestionListClick="onTypeClick"></question_list_horizontal>
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
			type_image: require("@/assets/images/home/222_banner.png"),
			likeList: [],
			error: false,
			loading: false,
			total_page: 0,
			page: 0,
		}
	},
	created() {
		// 设置channelId到vuex
		this.setChannelId(this.$route.query.YzChannelId);
		// 获取分类下的应用数据
		this.getLikeData();
	},
	activated() {
		// 设置channelId到vuex
		this.setChannelId(this.$route.query.YzChannelId);
		// 初始化数据
		this.page = 0;
		this.total_page = 0;
		this.likeList = [];
		// 获取分类下的应用数据
		this.getLikeData();
	},
	methods: {
		...mapMutations({
			setChannelId: "setChannelId",
			changeAppending: "changeAppending",
		}),

		onTypeClick(item) {
			console.log(item)
		},

		onClickLeft() {
			this.$router.replace({path: "/home", query: {YzChannelId: this.channelId, t: new Date().getTime()}});
		},

		// 获得测一测推荐配置
		getLikeData(callback = null) {
			Request.request({
				url: this.appApiUrl + "/test_app/get_recommend_data_load",
				data: {
					app_id: 0,
					page: this.page + 1,
					page_name: "home",
				},
				callback: (res, err) => {
					if (err || res.code !== 0) return this.error = true;
					// 更新推荐列表
					this.total_page = res.body.total_page;
					this.page = res.body.page;
					for (let i = 0; i < res.body.recommend_list.length; i++) res.body.recommend_list[i].app_icon = this.appIconUrl(res.body.recommend_list[i].app_icon);
					this.likeList = this.likeList.concat(res.body.recommend_list);
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
