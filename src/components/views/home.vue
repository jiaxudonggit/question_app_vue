<template>
	<!--index组件-->
	<div id="home" class="home" :style="{minHeight: availHeight + 'px'}">
		<div class="home-content">
			<img class="home-content-bg" src="../../assets/images/home/home-top-bg.png" alt="">
			<div class="home-content-top">
				<div class="home-search-wrap">
					<van-search shape="round" :background="'transparent'" placeholder="搜你想搜的，这里会有你所爱~"/>
				</div>
				<div class="home-banner-wrap">
					<van-swipe :autoplay="3000" class="home-banner">
						<van-swipe-item v-for="(image, index) in homeData.banner_list" :key="index">
							<img :src="image" alt=""/>
						</van-swipe-item>
					</van-swipe>
				</div>
				<div class="home-type-wrap"></div>
			</div>

		</div>
	</div>
</template>
<script>
import Vue from 'vue';
import {mapGetters, mapMutations, mapState} from "vuex";
import {Search, Swipe, SwipeItem} from 'vant';

Vue.use(Swipe);
Vue.use(SwipeItem);
Vue.use(Search);

export default {
	inject: ['reload', "autoLogin"],
	data() {
		return {
			model: "home",
			timer: [],
			showPopup: false,
			isShowExitBtn: false,
		}
	},
	computed: {
		...mapState(["isAppending", "loadingTime", "appId", "channelId", "homeData", "availHeight"]),
		...mapGetters(["appApiUrl", "appIconUrl", "appResourcesUrl", "isLogin"]),
	},
	watch: {
		isGameBack(val) {
			val ? this.getPopupData(() => {
				this.showPopup = true;
			}) : this.showPopup = false;
		},
	},
	created() {
		// // 页面滚到顶部
		// Utils.scrollToTop();
		// // 显示关闭按钮
		// this.showExitBtn();
		// // 设置appId和channelId到vuex
		// this.setAppId(this.$route.query.YzAppId);
		// this.setChannelId(this.$route.query.YzChannelId);
		// // 初始化
		// this.initData();
	},
	destroyed() {
		// 隐藏关闭按钮
		// this.hideExitBtn();
		// // 删除定时器
		// this.cancelTimeOut();
	},
	methods: {
		...mapMutations({
			setAppId: "setAppId",
			setChannelId: "setChannelId",
			changeAppending: "changeAppending",
			setIndexData: "setIndexData",
			setGameBack: "setGameBack",
			setPopupData: "setPopupData",
		}),

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
