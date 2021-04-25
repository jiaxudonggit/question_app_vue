<template>
	<!--result组件-->
	<div id="result" class="result" :style="{minHeight: availHeight + 'px', backgroundColor: resultData.bg_color}">
		<div class="result-header fixed-fix">
			<div class="result-header-back" @click="onClickBack"><img src="../../assets/images/play/back.png" alt=""></div>
		</div>
		<div class="result-content">
			<div class="result-content-img">
				<img v-for="(item, index) in resultData.bg_images" :src="item" alt="" :key="index">
			</div>
			<div class="result-content-btn-wrap">
				<img v-if="resultData.button_image" :src="resultData.button_image" alt="" class="result-content-btn" @click="onClickBack">
			</div>
		</div>
		<recommend_list v-if="isLogin && resultData.show_recommend_list" :model="model" v-on:listenerRecommendClick="onClickRecommend"></recommend_list>
	</div>
</template>
<script>
import recommend_list from '@/components/common/recommend_list';
import {Request, Utils} from "@/utils/Utils";
import AdUtils from "@/utils/AdUtils";
import {mapGetters, mapMutations, mapState} from "vuex";

export default {
	inject: ['reload', "autoLogin"],
	components: {
		recommend_list,
	},
	data() {
		return {
			model: "result",
		}
	},
	computed: {
		...mapState(["isAppending", "appId", "channelId", "isGameBack", "resultId", "availHeight", "fraction", "resultData", "indexData", "loadingTime"]),
		...mapGetters(["appApiUrl", "appResourcesUrl", "appIconUrl", "isLogin"]),
	},
	activated() {
		// 页面滚到顶部
		Utils.scrollToTop();
		// 设置appId和channelId到vuex
		this.setAppId(this.$route.query.YzAppId);
		this.setChannelId(this.$route.query.YzChannelId);
		// 初始化
		this.initData(() => {
			// 打开插屏广告
			if (this.appId) AdUtils.openScreenAd(this.appId);
			// 创建查看结果记录
			this.createResultRecord();
		})
	},
	beforeRouteLeave(to, from, next) {
		// 关闭插屏广告
		AdUtils.closeScreenAd();
		// 关闭定时器
		if (this.timer) clearTimeout(this.timer);
		// 打开推荐弹窗
		if (to.name === "index" && this.isLogin && this.indexData.show_recommend_layer) this.setGameBack(true);
		next();
	},
	methods: {

		...mapMutations({
			setAppId: "setAppId",
			setChannelId: "setChannelId",
			changeAppending: "changeAppending",
			setResultData: "setResultData",
			setGameBack: "setGameBack",
			setResultId: "setResultId",
		}),

		// 获得首页数据
		getResultData(callback) {
			Request.request({
				url: this.appApiUrl + "/test_app/get_result_data",
				data: {
					app_id: this.appId,
					fraction: this.fraction,
					result_id: this.resultId,
				},
				callback: (res, err) => {
					if (err || res.code !== 0) {
						this.$toast("网络错误，请稍后，" + err);
					} else {
						// 设置结果页数据到store
						this.setResultData({
							data: res.body,
							appIconUrl: this.appIconUrl,
							appResourcesUrl: this.appResourcesUrl,
							model: this.model,
						});
						this.setResultId(res.body.result_id);
					}
					if (typeof callback === "function") callback();
				},
			})
		},

		// 初始化
		initData(callback) {
			if (this.isLogin && this.resultData.app_id && this.resultData.result_id && parseInt(this.resultData.app_id) === parseInt(this.appId) &&
				parseInt(this.resultData.result_id) === parseInt(this.resultId)) {
				if (typeof callback === "function") callback();
				return false;
			}
			// 开启加载提示框
			!this.isAppending && this.changeAppending(true);
			// 用户登录
			this.autoLogin(() => {
				// 获取主页数据
				this.getResultData(() => {
					// 关闭加载提示框
					this.timer = setTimeout(() => {
						this.changeAppending(false);
					}, this.loadingTime);
					if (typeof callback === "function") callback();
				});
			});
		},

		// 创建用户查看结果记录
		createResultRecord(callback) {
			Request.request({
				url: this.appApiUrl + "/test_app/create_result_record",
				data: {
					app_id: this.appId,
					result_id: this.resultId,
					fraction: this.fraction
				},
				callback: callback,
			})
		},

		// 返回按钮事件
		onClickBack() {
			AdUtils.closeScreenAd(() => {
				this.$router.replace({path: "/", query: {YzAppId: this.appId, YzChannelId: this.channelId, t: new Date().getTime()}});
			});
		},

		// 点击更多推荐事件
		onClickRecommend(item) {
			this.$router.replace({path: "/", query: {YzAppId: item.app_id, YzChannelId: this.channelId, t: new Date().getTime()}});
		},
	},
}
</script>
<style lang="less">
@import "../../assets/less/result.less";
</style>
