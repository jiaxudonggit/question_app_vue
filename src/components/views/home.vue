<!--主页商店页面组件-->
<template>
	<div id="home" class="home app-model">
		<div class="home-content app-content"  :style="{minHeight: (availHeight - 50) + 'px'}">
			<img class="home-content-bg" src="../../assets/images/home/home-top-bg.png" alt="">
			<div class="home-search-wrap">
				<van-search shape="round" :background="'transparent'" placeholder="搜你想搜的，这里会有你所爱~"/>
			</div>
			<div class="home-banner-wrap">
				<home_swiper_banner :banner-list="homeData.banner_list" :pagination="true" @listenerBannerClick="onBannerClick"></home_swiper_banner>
			</div>
			<div class="home-type-wrap">
				<van-grid :border="false" :square="true">
					<van-grid-item v-for="item in homeData.type_list" :icon="item.type_icon" :text="item.type_title" :key="item.type_id" @click="onTypeClick(item)"></van-grid-item>
				</van-grid>
			</div>
			<div class="home-module-wrap">
				<home_swiper_interest :module-list="homeData.module_list" @listenerModuleClick="onModuleClick"></home_swiper_interest>
			</div>

			<div class="home-like-wrap">
				<home_swiper_like :like-list="homeData.like_list" @listenerLikeClick="onLikeClick" @listenerMoreClick="onLikeMoreClick"></home_swiper_like>
			</div>

			<div class="home-more-wrap">
				<home_more @listenerMoreClick="onMoreClick"></home_more>
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
import {Search, Grid, GridItem} from 'vant';

Vue.use(Search);
Vue.use(Grid);
Vue.use(GridItem);

export default {
	inject: ['reload', "autoLogin"],
	components: {
		home_swiper_banner,
		home_swiper_interest,
		home_swiper_like,
		home_more,
	},
	computed: {
		...mapState(["isAppending", "loadingTime", "channelId", "homeData", "availHeight"]),
		...mapGetters(["appApiUrl", "appIconUrl", "appResourcesUrl", "isLogin"]),
	},
	data() {
		return {
			model: "home",
			timer: [],
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
	deactivated() {

	},
	methods: {
		...mapMutations({
			setChannelId: "setChannelId",
			changeAppending: "changeAppending",
		}),

		// 点击banner
		onBannerClick(item) {
			this.$router.replace({path: "/", query: {YzAppId: item.app_id, YzChannelId: this.channelId, t: new Date().getTime()}});
		},

		onTypeClick(item) {
			console.log(item)
		},

		// 点击趣味精选
		onModuleClick(item) {
			this.$router.replace({path: "/", query: {YzAppId: item.app_id, YzChannelId: this.channelId, t: new Date().getTime()}});
		},

		// 点击大家爱玩
		onLikeClick(item) {
			this.$router.replace({path: "/", query: {YzAppId: item.app_id, YzChannelId: this.channelId, t: new Date().getTime()}});
		},

		// 点击大家爱玩 更多
		onLikeMoreClick() {
			console.log("========点击了更多按钮======")
		},

		// 点击更多好玩列表
		onMoreClick(item) {
			this.$router.replace({path: "/", query: {YzAppId: item.app_id, YzChannelId: this.channelId, t: new Date().getTime()}});
		}

		// // 初始化
		// initData(callback) {
		// 	if (this.isLogin && this.indexData.app_id && parseInt(this.indexData.app_id) === parseInt(this.appId)) {
		// 		if (typeof callback === "function") callback();
		// 		return false;
		// 	}
		// 	// 开启加载提示框
		// 	!this.isAppending && this.changeAppending(true);
		// 	// 用户登录
		// 	this.autoLogin(() => {
		// 		// 获取主页数据
		// 		this.getIndexData(() => {
		// 			// 关闭加载提示框
		// 			let timer = setTimeout(() => {
		// 				this.changeAppending(false);
		// 			}, this.loadingTime)
		// 			this.timer.push(timer);
		// 			if (typeof callback === "function") callback();
		// 		});
		// 	});
		// },
		//
		// // 获得首页数据
		// getIndexData(callback) {
		// 	Request.request({
		// 		url: this.appApiUrl + "/test_app/get_index_data",
		// 		data: {
		// 			app_id: this.appId,
		// 		},
		// 		callback: (res, err) => {
		// 			if (err || res.code !== 0) {
		// 				this.$toast("网络错误，请稍后，" + err);
		// 			} else {
		// 				// 设置首页数据到store
		// 				this.setIndexData({
		// 					data: res.body,
		// 					appIconUrl: this.appIconUrl,
		// 					appResourcesUrl: this.appResourcesUrl,
		// 					model: this.model,
		// 				});
		// 			}
		// 			if (typeof callback === "function") callback();
		// 		},
		// 	})
		// },
		//
		// // 记录用户点击推荐应用
		// createRecommendRecord(from_app_id, to_app_id, callback) {
		// 	Request.request({
		// 		url: this.appApiUrl + "/test_app/create_recommend_record",
		// 		data: {
		// 			from_app_id: from_app_id,
		// 			to_app_id: to_app_id,
		// 		},
		// 		callback: callback,
		// 	})
		// },
		//
		// // 推荐弹窗数据 setPopupData
		// getPopupData(callback) {
		// 	Request.request({
		// 		url: this.appApiUrl + "/test_app/get_popup_data",
		// 		data: {
		// 			app_id: this.appId,
		// 			page_name: "layer",
		// 		},
		// 		callback: (res, err) => {
		// 			if (err || res.code !== 0) return false;
		// 			this.setPopupData({
		// 				data: res.body,
		// 				appIconUrl: this.appIconUrl,
		// 				appResourcesUrl: this.appResourcesUrl,
		// 				model: this.model,
		// 			});
		// 			if (typeof callback === "function") callback();
		// 		},
		// 	})
		// },
		//
		// // 点击更多推荐事件
		// onClickRecommend(item) {
		// 	this.reload(() => {
		// 		this.$router.replace({path: "/", query: {YzAppId: item.app_id, YzChannelId: this.channelId, t: new Date().getTime()}});
		// 	});
		// },
		//
		// // 点击更多精彩滚动到推荐
		// onClickMoreRecommend() {
		// 	this.$el.querySelector(".recommend-content").scrollIntoView({
		// 		behavior: "smooth",
		// 		block: "nearest",
		// 		inline: "nearest"
		// 	});
		// },
		//
		// // 点击弹窗推荐事件
		// onPopupClick(item) {
		// 	this.createRecommendRecord(this.appId, item.app_id, () => {
		// 		this.setGameBack(false);
		// 		this.onClickRecommend(item);
		// 	})
		// },
		//
		// // 点击弹窗更多按钮
		// onClickMorePopup() {
		// 	this.setGameBack(false);
		// 	this.$el.querySelector(".recommend-content").scrollIntoView({
		// 		behavior: "smooth",
		// 		block: "nearest",
		// 		inline: "nearest"
		// 	});
		// },
		//
		// // 点击弹窗关闭按钮
		// onClickClosePopup() {
		// 	this.setGameBack(false);
		// },
		//
		// // 显示关闭按钮
		// showExitBtn() {
		// 	if (this.channelId === "YueYou" && !this.isShowExitBtn && window.nativeObj !== undefined) {
		// 		window.nativeObj.showExitIcon();
		// 		this.isShowExitBtn = true;
		// 	}
		// },
		//
		// // 隐藏关闭按钮
		// hideExitBtn() {
		// 	if (this.channelId === "YueYou" && this.isShowExitBtn && window.nativeObj !== undefined) {
		// 		window.nativeObj.closeExitIcon();
		// 		this.isShowExitBtn = false;
		// 	}
		// },
		//
		// // 取消定时器
		// cancelTimeOut() {
		// 	this.timer.forEach((item) => {
		// 		if (item) clearTimeout(item);
		// 	});
		// }
	},
}
</script>
<style lang="less">
@import "../../assets/less/home.less";
</style>
