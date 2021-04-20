<template>
	<!--result组件-->
	<div id="result" class="result" :style="{backgroundColor: resultData.bg_color}">
		<div class="result-header fixed-fix">
			<div class="result-header-back" @click="onClickBack"><img src="../../assets/images/play/back.png" alt=""></div>
		</div>
		<div class="result-content" :style="{minHeight: availHeight + 'px'}">
			<div class="result-content-img">
				<img v-for="(item, index) in resultData.bg_images" :src="appResourcesUrl(model, item)" alt="" :key="index">
			</div>
			<div class="result-content-btn-wrap">
				<img v-if="resultData.button_image" :src="appResourcesUrl(model, resultData.button_image)" alt="" class="result-content-btn" @click="onClickBack">
			</div>
			<div v-if="resultData.show_recommend_list" class="result-content-recommend">
				<recommend_list v-if="isLogin" :model="model" v-on:listenerRecommendClick="onClickRecommend"></recommend_list>
			</div>
		</div>
	</div>
</template>
<script>
import recommend_list from '@/components/common/recommend_list';
import {Request} from "@/utils/Utils";
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
		...mapState(["isAppending", "appId", "channelId", "isLogin", "isGameBack", "resultId", "availHeight", "fraction", "resultData"]),
		...mapGetters(["appApiUrl", "appResourcesUrl", "appIconUrl"]),
	},

	activated() {
		// 设置appId和channelId到vuex
		this.setAppId(this.$route.query.YzAppId);
		this.setChannelId(this.$route.query.YzChannelId);
		// 打开插屏广告
		AdUtils.openScreenAd(this.appId);
		this.initData(()=>{
			this.createResultRecord()
		})
	},
	deactivated() {
		// 关闭插屏广告
		AdUtils.closeScreenAd();
	},
	methods: {

		...mapMutations({
			setAppId: "setAppId",
			setChannelId: "setChannelId",
			changeAppending: "changeAppending",
			setResultData: "setResultData",
			setGameBack: "setGameBack",
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
					if (err || res.code !== 0) return this.$toast("网络错误，请稍后");
					// 设置结果页数据到store
					this.setResultData(res.body);
					if (typeof callback === "function") callback();
				},
			})
		},

		// 初始化
		initData(callback) {
			if (this.isLogin && this.resultData.app_id === this.appId) return false;
			// 开启加载提示框
			!this.isAppending && this.changeAppending(true);
			// 用户登录
			this.autoLogin(() => {
				// 获取主页数据
				this.getResultData(() => {
					this.timer = setTimeout(() => {
						// 关闭加载提示框
						this.changeAppending(false);
					}, 500);
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
				this.setGameBack(true);
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
