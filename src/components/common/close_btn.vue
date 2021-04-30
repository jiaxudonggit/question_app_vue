<!-- 关闭按钮 倒计时结束后显示真实关闭按钮 -->
<template>
	<div v-show="isShowCloseBtn" class="app-close-wrap">
		<div class="app-close-block" @click="onBtnClick">
			<div class="app-close-timer">
				<Countdown v-show="isCountDown" ref="countdown"  :time="countdownTimer" format="ss" :switch="countdownSwitch" @on-end="onCountdownEnd">
					<template slot-scope="{ time }">{{ time }}</template>
				</Countdown>
				<span v-show="!isCountDown">0</span>
			</div>
			<img class="app-close-icon" src="../../assets/images/app-close.png" alt="">
			<div class="app-close-text">关闭</div>
		</div>
	</div>

</template>
<script>
import lodash from "lodash";
import {mapGetters, mapMutations, mapState} from "vuex";
import Countdown from '@choujiaojiao/vue2-countdown'
import AdUtils from "@/utils/AdUtils";

export default {
	name: "close-btn",
	computed: {
		...mapState(["appId", "channelId", "channelVersion", "countdownTimer", "countdownSwitch", "isNewAccount",
			"isShowCloseBtn", "isCountDown", "isShowExitBtn", "IndexPageName"]),
		...mapGetters(["isLogin"])
	},
	components: {
		Countdown,
	},
	watch: {
		isCountDown(val) {
			// 倒计时按钮
			if (val) {
				// 显示/隐藏倒计时按钮
				this.IndexPageName.indexOf(this.$route.name) !== -1 ? this.setShowCloseBtn(true) : this.setShowCloseBtn(false);
				// 开启倒计时
				this.setCountdownSwitch(true);
			} else {
				// 关闭倒计时
				this.setCountdownSwitch(false);
				// 重置倒计时
				if (this.$refs.countdown) this.$refs.countdown.reCountdown();
				// 打开webview关闭按钮
				if (this.IndexPageName.indexOf(this.$route.name) !== -1) this.setShowExitBtn(true);
			}
		},
		// 是否显示webview关闭按钮
		isShowExitBtn(val) {
			console.log("ShowExitBtn: " + val)
			// 阅友渠道/app环境中
			if (this.channelId === "YueYou" && window.nativeObj !== undefined) {
				if (val) {
					if (!this.isCountDown) {
						console.log("============显示webview关闭按钮==============");
						window.nativeObj.showExitIcon();
					}
				} else {
					console.log("============隐藏webview关闭按钮==============");
					window.nativeObj.closeExitIcon();
				}
			}
		},
		// 如果用户不是新用户则关闭倒计时
		isNewAccount(val) {
			val ? this.setCountDown(true) : this.setCountDown(false);
		},
		// 监听router
		$route(to) {
			// 如果倒计时关闭按钮不存在, 只在index页显示webview关闭按钮
			this.setShowExitBtn(this.isLogin && !this.isCountDown && this.IndexPageName.indexOf(to.name) !== -1);
			// 如果倒计时关闭按钮存在，则只在index页显示
			this.setShowCloseBtn(this.IndexPageName.indexOf(to.name) !== -1);
		},
	},

	created() {
		// 设置安卓生命周期
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
			setCountDown: "setCountDown",
			setShowExitBtn: "setShowExitBtn",
			setCountdownSwitch: "setCountdownSwitch",
			addAdCount: "addAdCount",
		}),

		// 点击关闭按钮事件
		onBtnClick: lodash.debounce(function () {
			// 播放广告
			AdUtils.openVideoAd(this.appId, this.channelId, () => {
				// 添加广告统计次数
				this.addAdCount();
				// 隐藏按钮
				this.setCountDown(false);
			});
		}, 800, {
			'leading': true,
			'trailing': false
		}),

		// 倒计时结束
		onCountdownEnd() {
			console.log("============倒计时结束=============")
			// 隐藏按钮
			this.setCountDown(false);
		}
	}
}
</script>
<style lang="less" scoped>
.app-close-wrap {
	position: fixed;
	right: 3px;
	top: 3px;
	border-radius: 20px;
	box-sizing: border-box;

	.app-close-block {
		width: 45px;
		padding: 5px;
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

}

</style>

