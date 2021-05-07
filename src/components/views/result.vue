<!--测试结果页组件-->
<template>
	<div id="result" class="result app-model" :style="{backgroundColor: resultData.bg_color}">
		<div class="result-header fixed-fix">
			<div class="result-header-back" @click="onClickBack"><img src="../../assets/images/play/back.png" alt=""></div>
		</div>
		<div class="result-content app-content" :style="{minHeight: '20%'}">
			<div class="result-content-img">
				<img v-for="(item, index) in resultData.bg_images" :src="item" alt="" :key="index">
			</div>
			<div class="result-content-btn-wrap">
				<img v-if="resultData.button_image" :src="resultData.button_image" alt="" class="result-content-btn" @click="onClickBack">
			</div>
		</div>
		<recommend_list v-if="resultData.show_recommend_list" :recommend-number="resultData.recommend_number" :model="model" v-on:listenerRecommendClick="goToHome"></recommend_list>
	</div>
</template>
<script>
import recommend_list from '@/components/common/recommend_list';
import {Request} from "@/utils/Utils";
import AdUtils from "@/utils/AdUtils";
import {mapGetters, mapMutations, mapState} from "vuex";

export default {
	inject: ["createAccessRecord", "openNewApp", "goToHome"],
	components: {
		recommend_list,
	},
	data() {
		return {
			timer: [],
			model: "result",
		}
	},
	computed: {
		...mapState(["isAppending", "appId", "channelId", "resultId", "fraction", "resultData", "indexData", "loadingTime", "availHeight"]),
		...mapGetters(["appApiUrl", "appResourcesUrl", "appIconUrl"]),
	},
	activated() {
		// 初始化
		this.initData(() => {
			// 打开插屏广告
			// if (this.appId) AdUtils.openScreenAd(this.appId);
			// 创建查看结果记录
			this.createResultRecord();
			// 领取红包
			this.timer.push(setTimeout(() => {
				this.receiveRedPacket(this.$route.query.YzAdOrderId);
			}, this.loadingTime))
		})
	},
	beforeRouteLeave(to, from, next) {
		// 关闭红包弹窗
		this.setRedPacketPopup(false);
		// 关闭插屏广告
		// AdUtils.closeScreenAd();
		// 关闭定时器
		this.cancelTimeOut();
		// 打开推荐弹窗
		if (to.name === "index" && this.indexData.show_recommend_layer) this.setGameBack(true);
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
			setRedPacketPopup: "setRedPacketPopup",
			setRedPacketData: "setRedPacketData",
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
			if (this.resultData.app_id && this.resultData.result_id &&
				String(this.resultData.app_id) === String(this.appId) &&
				String(this.resultData.result_id) === String(this.resultId)) {
				if (typeof callback === "function") callback();
			} else {
				// 开启加载提示框
				!this.isAppending && this.changeAppending(true);
				// 获取主页数据
				this.getResultData(() => {
					// 记录用户进入应用
					this.createAccessRecord()
					// 关闭加载提示框
					this.timer.push(setTimeout(() => {
						this.changeAppending(false);
					}, this.loadingTime));
					if (typeof callback === "function") callback();
				});
			}
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

		// 领取红包
		receiveRedPacket(order_id, callback) {
			Request.request({
				url: this.appApiUrl + "/red_packet/receive_red_packet",
				data: {
					order_id: order_id,
				},
				callback: (res, err) => {
					if(res && res.code === 10030) this.$toast(err);
					if (res && res.code === 0) {
						// 设置红包数据
						this.setRedPacketData(res.body);
						// 打开红包弹窗
						this.setRedPacketPopup(true);
					}
					if (typeof callback === "function") callback();
				},
			})
		},

		// 返回按钮事件
		onClickBack() {
			AdUtils.closeScreenAd(() => {
				this.$router.back();
			});
		},

		// 点击更多推荐事件
		onClickRecommend(item) {
			this.openNewApp(item.app_id, false);
		},

		// 取消定时器
		cancelTimeOut() {
			this.timer.forEach((item) => {
				if (item) clearTimeout(item);
			});
			this.timer = [];
		},
	},
}
</script>
<style lang="less">
@import "../../assets/less/result.less";
</style>
