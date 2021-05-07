<!--用户提现账户设置弹窗-->
<template>
	<van-popup v-model="showSelf" class="cash-out-account" :lock-scroll="true" :close-on-click-overlay="false">
		<img class="cash-out-account-close" src="../../../assets/images/red_packet/red-packet-close.png" alt="" @click="onCloseClick">
		<div class="cash-out-account-title">提现账户设置</div>
		<van-form class="cash-out-account-form" @submit="onSubmit">
			<van-field
				class="cash-out-account-input"
				v-model="alipayAccount"
				placeholder="请输入支付宝账号"
				:rules="[{ required: true, message: '支付宝账号不能为空' }]"
			/>
			<van-field
				class="cash-out-account-input"
				v-model="alipayPhone"
				type="tel"
				placeholder="请输入手机号码"
				:rules="[{ validator, message: '手机号码格式错误' }]"
			/>
			<div class="cash-out-account-tip">
				该资料填写后不可更改，请认真核对后再提交。核实无误后，3个工作日内到账。
			</div>
			<div class="cash-out-account-btn">
				<van-button round block type="info" native-type="submit">提交</van-button>
			</div>
		</van-form>
	</van-popup>
</template>
<script>

import debounce from 'lodash.debounce';
import {mapGetters, mapMutations, mapState} from "vuex";
import Vue from 'vue';
import {Popup, Field, Form, Button} from 'vant';
import {Request} from "@/utils/Utils";

Vue.use(Popup);
Vue.use(Field);
Vue.use(Form);
Vue.use(Button);

export default {
	name: "cash-out-account-popup",
	computed: {
		...mapState(["isShowCashOutAccountPopup", "channelId"]),
		...mapGetters(["appApiUrl"]),
	},
	data() {
		return {
			showSelf: true,
			alipayAccount: "", // 支付宝账户
			alipayPhone: "", // 支付宝电话号码
		}
	},
	watch: {
		isShowCashOutAccountPopup(val) {
			this.showSelf = val;
		}
	},
	created() {
		this.showSelf = this.isShowCashOutAccountPopup;
	},
	methods: {
		...mapMutations({
			setCashOutAccount: "setCashOutAccount",
			setCashOutAccountPopup: "setCashOutAccountPopup",
		}),

		validator(val) {
			return /^1[3-9]\d{9}$/.test(val);
		},

		onSubmit: debounce(function () {
			Request.request({
				url: this.appApiUrl + "/red_packet/submit_user_account",
				data: {
					alipay_account: this.alipayAccount,
					alipay_phone: this.alipayPhone,
				},
				callback: (res, err) => {
					if (err || res.code !== 0) {
						this.$toast("账户设置失败，" + err);
					} else {
						this.$toast("账户设置成功");
						// 设置账户信息
						this.setCashOutAccount(res.body);
					}
					// 清空输入框
					this.alipayAccount = "";
					this.alipayPhone = "";
					// 关闭窗口
					this.setCashOutAccountPopup(false);
					this.$emit("listenerAccountSubmitClick");
				},
			})
		}, 800, {
			'leading': true,
			'trailing': false
		}),

		// 点击关闭事件
		onCloseClick() {
			// 清空输入框
			this.alipayAccount = "";
			this.alipayPhone = "";
			// 关闭窗口
			this.setCashOutAccountPopup(false);
			this.$emit("listenerAccountCloseClick");
		},

	}
}
</script>
<style lang="less" scoped>
.cash-out-account {
	width: 85%;
	overflow: hidden;
	box-sizing: border-box;
	border-radius: 12px;
	background-color: #ffffff;
	font-family: "PingFang SC", "Helvetica Neue", "Hiragino Sans GB", "Segoe UI", "Microsoft YaHei", "方正舒体", sans-serif !important;

	.cash-out-account-close {
		width: 30px;
		height: 30px;
		display: block;
		position: absolute;
		right: 5px;
		top: 5px;
		z-index: 1;
	}

	.cash-out-account-title {
		width: 100%;
		position: relative;
		box-sizing: border-box;
		padding: 15px 15px 0;
		font-size: 18px;
		font-weight: 600;
		text-align: center;
		line-height: 26px;
	}

	.cash-out-account-form {
		width: 85%;
		margin: 20px auto 15px;
		position: relative;
		box-sizing: border-box;

		.cash-out-account-input {
			width: 100%;
			margin: 15px auto;
			border-radius: 8px;
			border: 1px solid rgba(149, 149, 149, 0.3);
		}

	}

	.cash-out-account-tip {
		width: 90%;
		margin: 25px auto 20px;
		font-size: 14px;
		text-align: left;
		line-height: 20px;
		color: #908f8f;
	}

	.cash-out-account-btn {
		margin: 25px auto 20px;
	}
}

</style>
