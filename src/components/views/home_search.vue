<!--主页商店搜索组件-->
<template>
	<div id="search" class="search app-model">
		<van-nav-bar class="van-nav-bar-customer fixed-fix" title="搜索" left-text="返回" left-arrow @click-left="goToHome"/>
		<div class="search-content app-content">
			<div class="search-content-input-wrap">
				<van-search v-model="value" show-action shape="round" :background="'transparent'" placeholder="搜你想搜的，这里会有你所爱~" @input="onInput" @search="searchAppByName" @clear="onCancel">
					<template #action>
						<div v-if="!result || valueChange" @click="searchAppByName">搜索</div>
						<div v-else @click="onCancel">取消</div>
					</template>
				</van-search>
			</div>

			<div v-show="!result" class="search-content-center" :style="{minHeight: (availHeight - 125) + 'px'}">
				<div class="search-content-hot-wrap">
					<div class="search-content-hot-title">
						<img src="../../assets/images/home/home-search-cai.png" alt="">
					</div>
					<div class="search-content-hot-block">
						<div v-for="item in hotList" :key="item.app_id" class="search-content-hot-row" @click="onHotClick(item)">
							<span>{{ item.app_name }}</span>
							<img v-if="item.is_hot" src="../../assets/images/home/home-search-hot.png" alt="">
						</div>
					</div>
				</div>

				<div class="search-content-type-wrap">
					<div class="search-content-type-top">
						<div class="search-content-type-title"><img src="../../assets/images/home/more.png" alt=""><span>更多好玩</span></div>
					</div>
					<div class="search-content-type-tab-wrap">
						<van-tabs v-model="active" color="#e94005" line-width="5px" line-height="5px" title-active-color="#e94005" title-inactive-color="#000" swipeable animated ellipsis lazy-render @change="onTabsChange">
							<van-tab v-for="item in typeList" :key="item.type_id" :title="item.type_name" :name="item.type_id">
								<van-list class="search-content-type-app-list" v-model="loading" :finished="page === total_page" finished-text="--我是有底线的--" :error.sync="error" error-text="请求失败，点击重新加载" @load="onLoad">
									<question_list_horizontal :question-list="appList" :user-bg-color="'background-color: #6e88ff;'" bg-color @listenerQuestionListClick="onTypeClick"></question_list_horizontal>
								</van-list>
							</van-tab>
						</van-tabs>
					</div>
				</div>
			</div>

			<div v-show="result" class="search-content-result-wrap" :style="{minHeight: (availHeight - 125) + 'px'}">
				<van-list class="search-content-type-app-list" v-model="res_loading" :finished="res_page === res_total_page" finished-text="--我是有底线的--" :error.sync="res_error" error-text="请求失败，点击重新加载" @load="onResLoad">
					<question_list_horizontal :question-list="resultList" :user-bg-color="'background-color: #6e88ff;'" bg-color @listenerQuestionListClick="onResClick"></question_list_horizontal>
				</van-list>
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
			// 搜索数据
			value: "",
			valueChange: false, // 搜索框值是否更新
			// 猜你想玩
			hotList: [], // 热门应用列表
			// 分类数据
			error: false,
			loading: false,
			total_page: 0, // 分类应用总页数
			page: 0, // 分类应用当前页码
			appList: [], // 分类应用列表
			type_id: 0, // 当前所选分类ID
			active: 0,
			typeList: [
				{
					type_name: "全部测试",
					type_id: 0,
				},
			], // 分类列表
			timer: null,
			// 结果数据
			result: false,
			res_error: false,
			res_loading: false,
			res_total_page: 0, // 结果应用总页数
			res_page: 0, // 结果类应用当前页码
			resultList: [], // 结果应用列表
			// 其他
			model: "search",
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
			// 获得最热应用列表
			this.getHotAppList();
			// 获得分类列表
			this.getTypeList();
			// 获得分类下的应用列表
			this.getTypeAppData(this.type_id, () => {
				// 关闭加载提示框
				this.timer = setTimeout(() => {
					this.changeAppending(false);
				}, this.loadingTime)
				if (typeof callback === "function") callback();
			});
		},

		// 搜索点击事件
		onInput() {
			this.valueChange = true;
			this.res_page = 0;
			this.res_total_page = 0;
		},

		// 取消点击事件
		onCancel() {
			// 重置结果
			this.result = false;
			this.valueChange = false;
			this.value = "";
			this.res_page = 0;
			this.res_total_page = 0;
			this.res_error = false;
			this.resultList = [];
		},

		// 最热应用点击事件
		onHotClick(item) {
			this.openNewApp(item.app_id, false);
		},

		// 分类应用点击事件
		onTypeClick(item) {
			this.openNewApp(item.app_id, false);
		},

		// 搜索结果点击事件
		onResClick(item) {
			this.openNewApp(item.app_id, false);
		},

		// tab 切换事件
		onTabsChange(name) {
			// 获得新的分类数据
			this.getTypeAppData(name, () => {
				this.type_id = name;
			});
		},

		// 获得[大家爱玩]应用列表
		getHotAppList(callback = null) {
			Request.request({
				url: this.appApiUrl + "/test_app/get_hot_app",
				callback: (res, err) => {
					if (err || res.code !== 0) return false;
					this.hotList = res.body.app_list;
					if (typeof callback === "function") callback();
				},
			})
		},

		// 获得[大家爱玩]应用列表
		getTypeList(callback = null) {
			Request.request({
				url: this.appApiUrl + "/test_app/get_type_list",
				callback: (res, err) => {
					if (err || res.code !== 0) return false;
					res.body.type_list.unshift({
						tye_id: 0,
						type_name: "全部测试",
					});
					this.typeList = res.body.type_list;
					if (typeof callback === "function") callback();
				},
			})
		},

		// 获得分类下的应用列表
		getTypeAppData(type_id, callback = null) {
			// 不是同一个type_id时，初始化数据
			if (type_id !== this.type_id) {
				// 初始化数据
				this.page = 0;
				this.total_page = 0;
				this.error = false;
			}
			// 开启加载提示框
			if (!this.loading) !this.isAppending && this.changeAppending(true);
			// type_id为0时获取全部
			if (type_id === 0) {
				Request.request({
					url: this.appApiUrl + "/test_app/get_app_with_more",
					data: {
						page: this.page + 1,
						page_name: this.model,
					},
					callback: (res, err) => {
						if (err || res.code !== 0) return this.error = true;
						// 更新推荐列表
						this.total_page = res.body.total_page;
						this.page = res.body.page;
						for (let i = 0; i < res.body.app_list.length; i++) res.body.app_list[i].app_icon = this.appIconUrl(res.body.app_list[i].app_icon);
						if (type_id !== this.type_id) this.appList = [];
						this.appList = this.appList.concat(res.body.app_list);
						if (!this.loading) this.changeAppending(false);
						if (typeof callback === "function") callback();
					},
				})
			} else {
				Request.request({
					url: this.appApiUrl + "/test_app/get_app_with_type",
					data: {
						type_id: type_id,
						page: this.page + 1,
						page_name: this.model,
					},
					callback: (res, err) => {
						if (err || res.code !== 0) return this.error = true;
						// 更新推荐列表
						this.total_page = res.body.total_page;
						this.page = res.body.page;
						for (let i = 0; i < res.body.app_list.length; i++) res.body.app_list[i].app_icon = this.appIconUrl(res.body.app_list[i].app_icon);
						if (type_id !== this.type_id) this.appList = [];
						this.appList = this.appList.concat(res.body.app_list);
						if (!this.loading) this.changeAppending(false);
						if (typeof callback === "function") callback();
					},
				})
			}
		},

		// 搜索应用
		searchAppByName(callback = null) {
			if (!this.value) return this.$toast("请输入搜索内容")
			// 开启加载提示框
			if (!this.res_loading) !this.isAppending && this.changeAppending(true);
			Request.request({
				url: this.appApiUrl + "/test_app/search_app_with_name",
				data: {
					search_content: this.value,
					page: this.res_page + 1,
				},
				callback: (res, err) => {
					if (err || res.code !== 0) return this.res_error = true;
					// 更新推荐列表
					this.res_total_page = res.body.total_page;
					this.res_page = res.body.page;
					for (let i = 0; i < res.body.app_list.length; i++) res.body.app_list[i].app_icon = this.appIconUrl(res.body.app_list[i].app_icon);
					if (this.valueChange) this.resultList = [];
					this.resultList = this.resultList.concat(res.body.app_list);
					if (!this.result) this.result = true;
					if (this.valueChange) this.valueChange = false;
					if (!this.res_loading) this.changeAppending(false);
					if (typeof callback === "function") callback();
				},
			})
		},

		onLoad() {
			// 异步更新数据
			setTimeout(() => {
				this.getTypeAppData(this.type_id, () => {
					// 加载状态结束
					this.loading = false;
				});
			}, 1000);
		},

		onResLoad() {
			// 异步更新数据
			setTimeout(() => {
				this.searchAppByName(() => {
					// 加载状态结束
					this.res_loading = false;
				});
			}, 1000);
		},

	},
}
</script>
<style lang="less">
@import "../../assets/less/search.less";
</style>
