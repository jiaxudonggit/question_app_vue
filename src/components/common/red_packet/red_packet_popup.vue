<!--红包弹窗-->
<template>
	<van-popup v-model="showSelf" class="red-packet-popup" :lock-scroll="true" :close-on-click-overlay="false" @opened="onOpenPopup">
		<img class="red-packet-close" @click="onCloseClick" src="../../../assets/images/red_packet/red-packet-close.png" alt="">
		<img class="red-packet-line" src="../../../assets/images/red_packet/red-packet-line.png" alt="">
		<div class="red-packet-content">
			<div class="red-packet-title">恭喜您获得现金奖励</div>
			<div class="red-packet-amount"><span>3.3</span>元</div>
			<div class="red-packet-tips">
				<p>现金已在您红包余额里</p>
				<p>请随时提取有~</p>
				<p>答题越多，奖励越多</p>
				<p>每日最多可领取（1/4）次</p>
			</div>
		</div>
		<div class="red-packet-btn" @click="onCashOutClick">提现</div>
	</van-popup>
</template>
<script>
import {mapGetters, mapMutations, mapState} from "vuex";
import Vue from 'vue';
import {Popup} from 'vant';
// import {Request} from "@/utils/Utils";

Vue.use(Popup);

export default {
	name: "red-packet-popup",
	data() {
		return {
			showSelf: true,
		}
	},
	computed: {
		...mapState(["isShowRedPacketPopup", "channelId"]),
		...mapGetters(["appApiUrl", "appAudioUrl"]),
	},
	watch: {
		isShowRedPacketPopup(val) {
			this.showSelf = val;
		}
	},
	created() {
		this.showSelf = this.isShowRedPacketPopup;
	},
	methods: {
		...mapMutations({
			setRedPacketPopup: "setRedPacketPopup",
		}),

		// 点击提现事件
		onCashOutClick() {
			this.setRedPacketPopup(false);
			this.$router.replace({
				path: "/cash_out",
				query: {
					YzChannelId: this.channelId,
					sourceUrl: this.$route.path,
					sourceQuery: this.$route.query,
					t: new Date().getTime(),
				}
			}).then(() => {
				this.$emit("listenerRedPacketPopupCashOutClick");
			})
		},

		// 点击弹窗关闭按钮
		onCloseClick() {
			this.setRedPacketPopup(false);
			this.$emit("listenerRedPacketPopupCloseClick");
		},
		//
		onOpenPopup() {
			console.log(this.$refs.redPacketAudioBtn)
			if (this.$refs.redPacketAudioBtn) this.$refs.redPacketAudioBtn.click();
		},
		// 点击弹窗关闭按钮
		onAudioClick() {
			// 播放红包音频
			console.log(this.$refs.redPacketAudio)
			if (this.$refs.redPacketAudio) this.$refs.redPacketAudio.play();
		},
	}
}
</script>
<style lang="less" scoped>
.red-packet-popup {
	width: 86%;
	max-height: 450px;
	max-width: 360px;
	min-width: 330px;
	overflow: hidden;
	box-sizing: border-box;
	border-radius: 15px;
	background-color: #fc503a;
	font-family: "PingFang SC", "Helvetica Neue", "Hiragino Sans GB", "Segoe UI", "Microsoft YaHei", "方正舒体", sans-serif !important;

	.red-packet-close {
		width: 35px;
		height: 35px;
		display: block;
		position: absolute;
		right: 5px;
		top: 5px;
		z-index: 1;
	}

	.red-packet-line {
		width: 100%;
		display: block;
		position: absolute;
		top: 67%;
	}

	.red-packet-content {
		width: 100%;
		height: 100%;
		padding: 20px 10px;
		position: relative;
		box-sizing: border-box;
		text-align: center;

		.red-packet-title {
			width: 100%;
			height: 50px;
			margin-top: 20px;
			line-height: 50px;
			font-size: 28px;
			font-weight: 600;
			color: #890e00;
		}

		.red-packet-amount {
			width: 100%;
			height: 50px;
			margin: 30px auto;
			line-height: 50px;
			font-size: 20px;
			color: #fff5bd;

			span {
				font-size: 50px !important;
			}
		}

		.red-packet-tips {
			width: 100%;
			line-height: 30px;
			font-size: 20px;
			color: #fff5bd;

			p:nth-child(3) {
				margin: 10px 0 0;
				color: #890e00;
				font-weight: 600;
			}

			p:nth-child(4) {
				margin: 0 0 10px;
				color: #890e00;
				font-size: 12px;
			}

		}

	}

	.red-packet-btn {
		width: 130px;
		height: 40px;
		position: relative;
		box-sizing: border-box;
		border-radius: 6px;
		background-color: #f4d081;
		color: #603515;
		font-size: 20px;
		font-weight: 600;
		text-align: center;
		line-height: 40px;
		margin: 10px auto 30px;
		box-shadow: 0 2px 1px 0 rgba(0, 0, 0, .3);
		z-index: 2;
	}

}
</style>
