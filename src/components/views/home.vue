<!--主页商店页面组件-->
<template>
	<div id="home" class="home app-model">
		<div class="home-content app-content" :style="{minHeight: (availHeight - 50) + 'px'}">
			<img class="home-content-bg" src="../../assets/images/home/home-top-bg.png" alt="">
			<div v-if="homeData.show_search" class="home-search-wrap">
				<div class="home-search" @click="onSearchClick">
					<img src="../../assets/images/home/home-search.png" alt="">
					<span>搜你想搜的，这里会有你所爱~</span>
				</div>
			</div>
			<div v-if="homeData.show_banner" class="home-banner-wrap">
				<home_swiper_banner :banner-list="homeData.banner_list" :pagination="true" @listenerBannerClick="onBannerClick"></home_swiper_banner>
			</div>
			<div v-if="homeData.show_type" class="home-type-wrap">
				<van-grid :border="false" :square="true">
					<van-grid-item v-for="item in homeData.type_list" :icon="item.type_icon" :text="item.type_name" :key="item.type_id" @click="onTypeClick(item)"></van-grid-item>
				</van-grid>
			</div>
			<div v-if="homeData.show_module" class="home-module-wrap">
				<home_swiper_interest :module-list="homeData.module_list" @listenerModuleClick="onModuleClick"></home_swiper_interest>
			</div>

			<div v-if="homeData.show_like" class="home-like-wrap">
				<home_swiper_like :like-list="homeData.like_list" @listenerLikeClick="onLikeClick" @listenerMoreClick="onLikeMoreClick"></home_swiper_like>
			</div>

			<div v-if="homeData.show_more" class="home-more-wrap">
				<home_more :model="this.model" @listenerMoreClick="onMoreClick"></home_more>
			</div>
		</div>
	</div>
</template>
<script>
import Vue from 'vue';
import home_more from "@/components/common/home/home_more";
import home_swiper_banner from "@/components/common/home/home_swiper_banner";
import home_swiper_interest from "@/components/common/home/home_swiper_interest";
import home_swiper_like from "@/components/common/home/home_swiper_like";
import {mapGetters, mapMutations, mapState} from "vuex";
import {Grid, GridItem} from 'vant';
import {Request} from "@/utils/Utils";

Vue.use(Grid);
Vue.use(GridItem);

export default {
	inject: ["openNewApp"],
	components: {
		home_swiper_banner,
		home_swiper_interest,
		home_swiper_like,
		home_more,
	},
	computed: {
		...mapState(["isAppending", "loadingTime", "channelId", "homeData", "availHeight", "indexData"]),
		...mapGetters(["appApiUrl", "appIconUrl", "appResourcesUrl", "appBannerUrl", "appTypeUrl", "appLikeUrl"]),
	},
	data() {
		return {
			model: "home",
			timer: null,
		}
	},
	activated() {
		// 初始化
		this.initData();
	},
	beforeRouteLeave(to, from, next) {
		// 删除定时器
		if (this.timer) clearTimeout(this.timer);
		// 打开推荐弹窗
		if (to.name === "index") this.setGameBack(true);
		next();
	},
	methods: {
		...mapMutations({
			setChannelId: "setChannelId",
			changeAppending: "changeAppending",
			setHomeData: "setHomeData",
			setGameBack: "setGameBack",
		}),

		initData(callback) {
			if (this.homeData.type_list.length > 0 || this.homeData.banner_list.length > 0 ||
				this.homeData.module_list.length > 0 || this.homeData.like_list.length > 0) {
				if (typeof callback === "function") callback();
			} else {
				// 开启加载提示框
				!this.isAppending && this.changeAppending(true);
				// 获取主页数据
				this.getHomeData(() => {
					// 关闭加载提示框
					this.timer = setTimeout(() => {
						this.changeAppending(false);
					}, this.loadingTime);
					if (typeof callback === "function") callback();
				});
			}
		},

		// 获得首页数据
		getHomeData(callback) {
			Request.request({
				url: this.appApiUrl + "/test_app/get_home_data",
				callback: (res, err) => {
					if (err || res.code !== 0) {
						this.$toast("网络错误，请稍后，" + err);
					} else {
						// 设置首页数据到store
						this.setHomeData({
							data: res.body,
							appIconUrl: this.appIconUrl,
							appBannerUrl: this.appBannerUrl,
							appTypeUrl: this.appTypeUrl,
							appLikeUrl: this.appLikeUrl,
						});
					}
					if (typeof callback === "function") callback();
				},
			})
		},

		// 点击搜索
		onSearchClick() {
			this.$router.replace({path: "/search", query: {YzChannelId: this.channelId, t: new Date().getTime()}});
		},

		// 点击banner
		onBannerClick(item) {
			this.openNewApp(item.app_id, false);
		},

		// 点击类型图标
		onTypeClick(item) {
			this.$router.replace({
				path: "/type", query: {
					YzChannelId: this.channelId,
					YzTypeId: item.type_id,
					t: new Date().getTime()
				}
			});
		},

		// 点击趣味精选
		onModuleClick(item) {
			this.openNewApp(item.app_id, false);
		},

		// 点击大家爱玩
		onLikeClick(item) {
			this.openNewApp(item.app_id, false);
		},

		// 点击大家爱玩 更多
		onLikeMoreClick() {
			this.$router.replace({path: "/like", query: {YzChannelId: this.channelId, t: new Date().getTime()}});
		},

		// 点击更多好玩列表
		onMoreClick(item) {
			this.openNewApp(item.app_id, false);
		},
	},
}
</script>
<style lang="less">
@import "../../assets/less/home.less";
</style>
