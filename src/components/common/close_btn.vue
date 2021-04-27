<!-- 关闭按钮 倒计时结束后显示真实关闭按钮 -->
<template>
	<div v-if="showCloseBtn" class="app-close-block" @click="onBtnClick">
		<div class="app-close-timer">
			<Countdown :time="countdownTimer" format="ss" :switch="countdownSwitch" @on-end="onCountdownEnd">
				<template slot-scope="{ time }">{{ time }}</template>
			</Countdown>
		</div>
		<img class="app-close-icon" src="../../assets/images/app-close.png" alt="">
		<div class="app-close-text">关闭</div>
	</div>
</template>
<script>
import lodash from "lodash";
import {mapMutations, mapState} from "vuex";
import Countdown from '@choujiaojiao/vue2-countdown'
import AdUtils from "@/utils/AdUtils";

export default {
	name: "close-btn",
	computed: {
		...mapState(["appId", "channelId", "showCloseBtn", "channelVersion", "isShowExitBtn", "countdownTimer", "countdownSwitch"]),
	},
	components: {
		Countdown,
	},
	watch: {
		showCloseBtn(val) {
			if (!val && this.$route.name === "index") this.showExitBtn();
		},
	},
	created() {
		if (AdUtils.getAppVersion() >= this.channelVersion && this.channelId === "YueYou") {
			// 系统状态监听
			window.androidLifeCycleCallBack = (from, callback) => {
				switch (callback) {
					case "onPause":
						console.log("androidLifeCycleCallBack onPause --> " + from);
						this.setCountdownSwitch(false);
						break;
					case "onResume":
						console.log("androidLifeCycleCallBack onResume --> " + from);
						this.setCountdownSwitch(true);
						break;
					case "onStop":
						console.log("androidLifeCycleCallBack onStop --> " + from);
						break;
				}
			};
		}
	},
	methods: {
		...mapMutations({
			setShowCloseBtn: "setShowCloseBtn",
			setShowExitBtn: "setShowExitBtn",
			setCountdownSwitch: "setCountdownSwitch",
			addAdCount: "addAdCount",
		}),

		// 显示关闭按钮
		showExitBtn() {
			if (this.channelId === "YueYou" && !this.isShowExitBtn && window.nativeObj !== undefined) {
				window.nativeObj.showExitIcon();
				this.setShowExitBtn(true);
			}
		},

		// 隐藏关闭按钮
		hideExitBtn() {
			if (this.channelId === "YueYou" && this.isShowExitBtn && window.nativeObj !== undefined) {
				window.nativeObj.closeExitIcon();
				this.setShowExitBtn(false);
			}
		},

		// 点击关闭按钮事件
		onBtnClick: lodash.debounce(function () {
			// 播放广告
			AdUtils.openVideoAd(this.appId, this.channelId, () => {
				// 添加广告统计次数
				this.addAdCount();
				// 隐藏按钮
				this.setShowCloseBtn(false);
			});
		}, 200),

		onCountdownEnd() {
			console.log("============倒计时结束=============")
			// 隐藏按钮
			this.setShowCloseBtn(false);
		}
	}
}
</script>
<style lang="less" scoped>
.app-close-block {
	width: 45px;
	padding: 5px;
	position: fixed;
	right: 10px;
	top: 10px;
	border-radius: 20px;
	box-sizing: border-box;
	background-color: rgba(0, 0, 0, .3);

	.app-close-timer {
		width: 35px;
		height: 35px;
		margin: 0 auto;
		//background-color: #4f75d9;
		border: 1px solid #d9d9d9;
		border-radius: 40px;
		color: #ffffff;
		font-size: 14px;
		line-height: 35px;
		text-align: center;
	}

	.app-close-icon {
		display: block;
		width: 18px;
		height: 18px;
		margin: 3px auto 0;
	}

	.app-close-text {
		width: 100%;
		height: 26px;
		color: #ffffff;
		margin: 0 auto;
		font-size: 15px;
		line-height: 25px;
		text-align: center;
		box-sizing: border-box;
	}
}
</style>

