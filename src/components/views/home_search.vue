<!--主页商店搜索组件-->
<template>
	<div id="search" class="search app-model" :style="{minHeight: (availHeight - 46) + 'px'}">
		<van-nav-bar class="van-nav-bar-customer fixed-fix" title="搜索" left-text="返回" left-arrow @click-left="onClickLeft"/>
		<div class="search-content app-content">
			<div class="search-content-input-wrap">
				<van-search v-model="value" show-action shape="round" :background="'transparent'" placeholder="搜你想搜的，这里会有你所爱~">
					<template #action>
						<div @click="onSearch">搜索</div>
					</template>
				</van-search>
			</div>

			<div v-show="!result" class="search-content-center" :style="{minHeight: (availHeight - 125) + 'px'}">
				<div class="search-content-hot-wrap">
					<div class="search-content-hot-title">
						<img src="../../assets/images/home/home-search-cai.png" alt="">
					</div>
					<div class="search-content-hot-block">
						<div v-for="item in hotList" :key="item.app_id" class="search-content-hot-row">
							<span>{{ item.app_name }}}</span>
							<img v-if="item.is_hot" src="../../assets/images/home/home-search-hot.png" alt="">
						</div>
					</div>
				</div>

				<div class="search-content-type-wrap">
					<div class="search-content-type-top">
						<div class="search-content-type-title"><img src="../../assets/images/home/more.png" alt=""><span>更多好玩</span></div>
					</div>
					<div class="search-content-type-tab-wrap">
						<van-tabs v-model="active" color="#e94005" line-width="5px" line-height="5px" title-active-color="#e94005" title-inactive-color="#000" swipeable animated ellipsis lazy-render>
							<van-tab v-for="item in typeList" :key="item.type_id" :title="item.type_title" :name="item.type_id">
								<van-list class="search-content-type-app-list" v-model="loading" :finished="page === total_page" finished-text="--我是有底线的--" :error.sync="error" error-text="请求失败，点击重新加载" @load="onLoad">
									<question_list_horizontal :question-list="appList" :user-bg-color="'background-color: #6e88ff;'" bg-color></question_list_horizontal>
								</van-list>
							</van-tab>
						</van-tabs>
					</div>
				</div>
			</div>

			<div v-show="result" class="search-content-result-wrap" :style="{minHeight: (availHeight - 125) + 'px'}">
				<question_list_horizontal :question-list="resultList" :user-bg-color="'background-color: #6e88ff;'" bg-color></question_list_horizontal>
				<div class="search-content-result-tip">--我是有底线的--</div>
			</div>

		</div>
	</div>
</template>
<script>

import question_list_horizontal from "@/components/common/question_list_horizontal";
import {mapGetters, mapMutations, mapState} from "vuex";
import Vue from 'vue';
import {List, NavBar, Search, Tab, Tabs} from 'vant';
import {Request} from "@/utils/Utils";

Vue.use(Tab);
Vue.use(Tabs);
Vue.use(Search);
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
			error: false,
			loading: false,
			total_page: 0,
			page: 0,
			appList: [],
			value: "",
			active: 0,
			result: false,
			hotList: [
				{
					app_id: 234,
					app_name: "你体内隐藏着哪只上古坐骑？",
					is_hot: true,
				},
				{
					app_id: 222,
					app_name: "你体内隐藏着哪只上古坐骑？",
					is_hot: false,
				},
				{
					app_id: 219,
					app_name: "你体内隐藏着哪只上古坐骑？",
					is_hot: false,
				},
				{
					app_id: 345,
					app_name: "你体内隐藏着哪只上古坐骑？",
					is_hot: true,
				},
				{
					app_id: 123,
					app_name: "你体内隐藏着哪只上古坐骑？",
					is_hot: false,
				},
				{
					app_id: 122,
					app_name: "你体内隐藏着哪只上古坐骑？",
					is_hot: false,
				},

			],
			typeList: [
				{
					type_title: "全部",
					type_id: 0,
				},
				{
					type_title: "推荐排行",
					type_id: 10001,
				},
				{
					type_title: "推荐排行",
					type_id: 10002,
				},
				{
					type_title: "推荐排行",
					type_id: 10003,
				},
				{
					type_title: "推荐排行",
					type_id: 10004,
				},
			],
			resultList: [],
		}
	},
	created() {
		// 设置channelId到vuex
		this.setChannelId(this.$route.query.YzChannelId);
		// 获取分类下的应用数据
		this.getTypeData();
	},
	activated() {
		// 设置channelId到vuex
		this.setChannelId(this.$route.query.YzChannelId);
		// 初始化数据
		this.page = 0;
		this.total_page = 0;
		this.appList = [];
		// 获取分类下的应用数据
		this.getTypeData();
	},
	methods: {
		...mapMutations({
			setChannelId: "setChannelId",
			changeAppending: "changeAppending",
		}),

		onSearch() {
			console.log("点击了搜索")
		},

		onTypeClick(item) {
			console.log(item)
		},

		onClickLeft() {
			this.$router.replace({path: "/home", query: {YzChannelId: this.channelId, t: new Date().getTime()}});
		},

		// 获得测一测推荐配置
		getTypeData(callback = null) {
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
					this.appList = this.appList.concat(res.body.recommend_list);
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
@import "../../assets/less/search.less";
</style>
