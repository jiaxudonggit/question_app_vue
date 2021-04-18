<template>
	<!--result组件-->
	<div id="result" class="result" :style="{backgroundColor: $store.state.appConfig.resultConfig.backgroundColor}">
		<div v-if="showHeader" class="result-header fixed-fix">
			<div class="result-header-back" @click="onClickBack"><img src="../../assets/images/game/back.png" alt=""></div>
			<div class="result-header-title">测试结果</div>
		</div>
		<div class="result-content" :style="{minHeight: availHeight + 'px'}">
			<div class="result-content-img">
				<img v-for="(item, index) in imgList" :src="makePictureUrl(item)" alt="" :key="index">
			</div>
			<div class="result-content-btn-wrap" :style="$store.state.appConfig.resultConfig.btnStyle">
				<img :src="$store.state.appConfig.resultConfig.btnImg ? makePictureUrl($store.state.appConfig.resultConfig.btnImg) : require('@/assets/images/result/result_default_btn.png')" alt="" class="result-content-btn" @click="onClickBack">
			</div>
			<div v-if="$store.state.baseConfig.isShowRecommend" class="result-content-recommend">
				<recommend_list :recommend="$store.state.recommendConfig" :app-id="appId" v-on:listenerRecommendClick="onClickRecommend"></recommend_list>
			</div>
		</div>
	</div>
</template>
<script>
import recommend_list from '@/components/common/recommend_list2';
import {Utils} from "@/utils/Utils";
import AdUtils from "@/utils/AdUtils";
import RecordService from "@/services/record_service";

export default {
	inject: ['reload', 'initData'],
	components: {
		recommend_list,
	},
	data() {
		return {
			showHeader: false,
			model: "result",
			availHeight: window.screen.availHeight,
		}
	},
	computed: {
		appId() {
			return this.$route.query.YzAppId;
		},
		resultId() {
			return this.$route.query.resultId;
		},
		channelId() {
			return this.$route.query.YzChannelId;
		},
		fraction() {
			return this.$route.query.fraction;
		},
		imgList() {
			return Object.keys(this.$store.state.appConfig.resultConfig).length > 0 ? this.$store.state.appConfig.resultConfig.resultObject[this.resultId].imgList : [];
		},
		listenAppId() {
			return this.$store.state.baseConfig.appId;
		},
	},
	watch: {
		appId(newValue) {
			console.log("========result.appId.changed=========");
			this.initData(newValue, false);
		},
		channelId(newValue) {
			console.log("========result.channelId.changed=========");
			this.$store.commit("setChannelId", newValue)
		},
		listenAppId(newValue) {
			if (newValue) {
				RecordService.createResultRecord({
					channelId: this.channelId,
					appId: this.appId,
					result_id: this.resultId,
					fraction: this.fraction,
				});
			}
		}
	},
	mounted() {
		const that = this
		window.onresize = () => {
			return (() => {
				that.availHeight = window.screen.availHeight;
			})()
		}
	},
	created() {
		console.log("========result.created=========");
		// 打开插屏广告
		AdUtils.openScreenAd(this.appId);
		// 创建用户查看结果记录
		if (this.$store.state.baseConfig.appId) {
			RecordService.createResultRecord({
				channelId: this.channelId,
				appId: this.appId,
				result_id: this.resultId,
				fraction: this.fraction,
			});
		}
	},
	destroyed() {
		console.log("========result.destroyed=========");
		// 关闭插屏广告
		AdUtils.closeScreenAd();
	},
	methods: {
		// 返回按钮事件
		onClickBack() {
			AdUtils.closeScreenAd(() => {
				this.$router.replace({path: "/", query: {YzAppId: this.appId, YzChannelId: this.channelId}});
			});
		},

		// 点击更多推荐事件
		onClickRecommend(item) {
			this.$router.replace({path: "/", query: {YzAppId: item.appId, YzChannelId: this.channelId}});
		},

		// 拼接图片地址
		makePictureUrl(name) {
			return Utils.makePictureUrl(this.appId, this.model, name);
		},
	},
}
</script>
<style lang="less">
@import "../../assets/less/result.less";
</style>
