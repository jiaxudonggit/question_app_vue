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
		...mapState(["isAppending", "appId", "channelId", "resultId", "fraction", "resultData", "indexData", "loadingTime", "availHeight", "isCanReceive"]),
		...mapGetters(["appResourcesUrl", "appIconUrl"]),
	},
	activated() {
		// 初始化
		this.initData(() => {
			// 创建查看结果记录
			this.$api.request.createResultRecord({
				app_id: this.appId,
				result_id: this.resultId,
				fraction: this.fraction
			});
			// 领取红包
			if (this.isCanReceive) {
				this.timer.push(setTimeout(() => {
					this.$api.redPacket.receiveRedPacket({
						order_id: this.$route.query.YzAdOrderId
					}).then(data => {
						// 设置红包数据
						this.setRedPacketData(data.body);
						// 设置领取红包状态
						this.setCanReceive(false);
						// 打开红包弹窗
						this.setRedPacketPopup(true);
					})
				}, this.loadingTime));
			}
		})
	},
	beforeRouteLeave(to, from, next) {
		// 关闭红包弹窗
		this.setRedPacketPopup(false);
		// 关闭定时器
		this.cancelTimeOut();
		// 打开推荐弹窗
		if (to.name === "index" && this.indexData.show_recommend_layer) this.setGameBack(true);
		next();
	},
	methods: {

		...mapMutations({
			changeAppending: "changeAppending",
			setResultData: "setResultData",
			setGameBack: "setGameBack",
			setResultId: "setResultId",
			setRedPacketPopup: "setRedPacketPopup",
			setRedPacketData: "setRedPacketData",
			setCanReceive: "setCanReceive",
		}),

		// 初始化
		initData(callback) {
			if (this.resultData.app_id && this.resultData.result_id &&
				String(this.resultData.app_id) === String(this.appId) &&
				String(this.resultData.result_id) === String(this.resultId)) {
				if (typeof callback === "function") callback();
			} else {
				// 开启加载提示框
				!this.isAppending && this.changeAppending(true);
				// 获取结果页数据
				this.$api.request.getResultData({
					app_id: this.appId,
					fraction: this.fraction,
					result_id: this.resultId,
				}).then(data => {
					// 设置结果页数据到store
					this.setResultData({
						data: data.body,
						appIconUrl: this.appIconUrl,
						appResourcesUrl: this.appResourcesUrl,
						model: this.model,
					});
					// 设置结果ID据到store
					this.setResultId(data.body.result_id);
					// 记录用户进入应用
					this.createAccessRecord()
					// 关闭加载提示框
					this.timer.push(setTimeout(() => {
						this.changeAppending(false);
					}, this.loadingTime));
					// 调用回调方法
					if (typeof callback === "function") callback();
				});
			}
		},

		// 返回按钮事件
		onClickBack() {
			this.$router.back();
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
