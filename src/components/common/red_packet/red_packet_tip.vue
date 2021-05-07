<!--红包弹窗-->
<template>
	<van-popup v-model="showSelf" class="red-packet-tip" :lock-scroll="true" :close-on-click-overlay="false">
		<div class="red-packet-title">满{{ minCashOutAmount }}元即可提取</div>
		<div class="red-packet-text">答题更多，赚的更多!</div>
		<div class="red-packet-btn" @click="onContinueClick">继续答题</div>
	</van-popup>
</template>
<script>
import {mapMutations, mapState} from "vuex";
import Vue from 'vue';
import {Popup} from 'vant';

Vue.use(Popup);

export default {
	name: "red-packet-tip",
	data() {
		return {
			showSelf: true,
		}
	},
	computed: {
		...mapState(["isShowRedPacketTip", "minCashOutAmount"]),
	},
	watch: {
		isShowRedPacketTip(val) {
			this.showSelf = val;
		}
	},
	created() {
		this.showSelf = this.isShowRedPacketTip;
	},
	methods: {
		...mapMutations({
			setRedPacketTip: "setRedPacketTip",
		}),

		// 点击继续事件
		onContinueClick() {
			this.setRedPacketTip(false);
			this.$emit("listenerRedPacketTipContinueClick");
		},

	}
}
</script>
<style lang="less" scoped>
.red-packet-tip {
	width: 70%;
	padding: 15px;
	max-width: 260px;
	min-width: 280px;
	overflow: hidden;
	box-sizing: border-box;
	border-radius: 15px;
	background-color: #ffffff;
	font-family: "PingFang SC", "Helvetica Neue", "Hiragino Sans GB", "Segoe UI", "Microsoft YaHei", "方正舒体", sans-serif !important;

	.red-packet-title {
		width: 100%;
		line-height: 35px;
		font-size: 22px;
		font-weight: 600;
		color: #000000;
		text-align: center;
	}

	.red-packet-text {
		width: 100%;
		margin-top: 5px;
		line-height: 20px;
		font-size: 14px;
		font-weight: 600;
		color: #ff1b00;
		text-align: center;
	}

	.red-packet-btn {
		width: 150px;
		height: 30px;
		position: relative;
		box-sizing: border-box;
		border-radius: 20px;
		color: #ffffff;
		font-size: 16px;
		text-align: center;
		line-height: 30px;
		margin: 20px auto 0;
		z-index: 2;
		background-image: linear-gradient(to right, #ff6517, #ff277b);
	}

}
</style>
