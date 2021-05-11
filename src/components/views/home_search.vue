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
import debounce from "lodash.debounce";

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
		...mapState(["isAppending", "loadingTime", "channelId", "homeData"]),
		...mapGetters(["appIconUrl"]),
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
			this.$api.request.getHotAppList().then(data => {
				this.hotList = data.body.app_list;
			})
			// 获得分类列表
			this.$api.request.getTypeList().then(data => {
				data.body.type_list.unshift({
					tye_id: 0,
					type_name: "全部测试",
				});
				this.typeList = data.body.type_list;
				// 关闭加载提示框
				this.timer = setTimeout(() => {
					this.changeAppending(false);
				}, this.loadingTime);
			})
			// 获得分类下的应用列表
			this.getSearchTypeAppData(this.type_id, () => {
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
		onHotClick: debounce(function (item) {
			this.openNewApp(item.app_id, false);
		}, 500, {'leading': true, 'trailing': false}),

		// 分类应用点击事件
		onTypeClick: debounce(function (item) {
			this.openNewApp(item.app_id, false);
		}, 500, {'leading': true, 'trailing': false}),

		// 搜索结果点击事件
		onResClick: debounce(function (item) {
			this.openNewApp(item.app_id, false);
		}, 500, {'leading': true, 'trailing': false}),

		// tab 切换事件
		onTabsChange(name) {
			// 获得新的分类数据
			this.getSearchTypeAppData(name, () => {
				this.type_id = name;
			});
		},

		// 获得分类下的应用列表
		getSearchTypeAppData(type_id, callback = null) {
			// 不是同一个type_id时，初始化数据
			if (type_id !== this.type_id) {
				// 初始化数据
				this.page = 0;
				this.total_page = 0;
				this.error = false;
			}
			// 获得搜索页面分类下的应用列表
			this.$api.request.getSearchTypeAppData({
				type_id: type_id,
				page: this.page + 1,
				page_name: this.model,
			}).then(data => {
				this.total_page = data.body.total_page;
				this.page = data.body.page;
				for (let i = 0; i < data.body.app_list.length; i++) data.body.app_list[i].app_icon = this.appIconUrl(data.body.app_list[i].app_icon);
				if (type_id !== this.type_id) this.appList = [];
				this.appList = this.appList.concat(data.body.app_list);
				if (!this.loading) this.changeAppending(false);
				if (typeof callback === "function") callback();
			}).catch(() => {
				this.error = true;
			}).finally(() => {
				// 加载状态结束
				this.loading = false;
			});
		},

		// 搜索应用
		searchAppByName: debounce(function (callback) {
			if (!this.value) return this.$toast("请输入搜索内容")
			// 开启加载提示框
			if (!this.res_loading) !this.isAppending && this.changeAppending(true);
			this.$api.request.searchAppByName({
				search_content: this.value,
				page: this.res_page + 1,
			}).then(data => {
				// 更新推荐列表
				this.res_total_page = data.body.total_page;
				this.res_page = data.body.page;
				for (let i = 0; i < data.body.app_list.length; i++) data.body.app_list[i].app_icon = this.appIconUrl(data.body.app_list[i].app_icon);
				if (this.valueChange) this.resultList = [];
				this.resultList = this.resultList.concat(data.body.app_list);
				if (!this.result) this.result = true;
				if (this.valueChange) this.valueChange = false;
				if (!this.res_loading) this.changeAppending(false);
				if (typeof callback === "function") callback();
			}).catch(() => {
				this.res_error = true;
			}).finally(()=>{
				// 加载状态结束
				this.res_loading = false;
			});
		}, 500, {'leading': true, 'trailing': false}),

		onLoad() {
			// 异步更新数据
			setTimeout(() => {
				this.getSearchTypeAppData(this.type_id);
			}, 1000);
		},

		onResLoad() {
			// 异步更新数据
			setTimeout(() => {
				this.searchAppByName();
			}, 1000);
		},

	},
}
</script>
<style lang="less">
@import "../../assets/less/search.less";
</style>
