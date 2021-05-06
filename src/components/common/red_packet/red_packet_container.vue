<!--红包弹窗-->
<template>
	<div class="red-packet-container">
		<div class="user-avatar">
			<img :src="userAvatar" alt="">
		</div>
		<div class="user-red-packet">
			<div class="user-amount">
				<img src="../../../assets/images/red_packet/red-packet-small-icon.png" alt="">
				<span>余额 <span>{{ balance }}</span> 元</span>
			</div>
			<div class="user-cash-out-btn" @click="onCashOutClick">提现</div>
		</div>
	</div>
</template>
<script>
import {mapState} from "vuex";
import Vue from 'vue';
import {Popup} from 'vant';

Vue.use(Popup);

export default {
	name: "red-packet-container",
	data() {
		return {
			showSelf: true,
			userAvatar: this.headImage ? this.headImage : require('../../../assets/images/red_packet/user-avatar.png'),
		}
	},
	computed: {
		...mapState(["headImage", "nickname", "channelId", "balance"]),
	},

	methods: {
		onCashOutClick() {
			this.$router.replace({
				path: "/cash_out",
				query: {
					YzChannelId: this.channelId,
					t: new Date().getTime(),
				}
			})
		}
	}
}
</script>
<style lang="less" scoped>
.red-packet-container {
	width: 100%;
	height: 40px;
	padding: 0 10px;
	overflow: hidden;
	box-sizing: border-box;
	position: relative;
	z-index: 999;
	border-radius: 25px;
	background-color: rgba(255, 255, 255, .3);
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	align-items: center;

	.user-avatar {
		width: 30px;
		height: 30px;
		margin-right: 20px;
		box-sizing: border-box;
		position: relative;
		overflow: hidden;
		border-radius: 100%;

		img {
			width: 100%;
			height: 100%;
		}
	}

	.user-name {
		width: 30%;
		line-height: 40px;
		font-size: 16px;
		color: #ffffff;
		text-align: center;
		overflow: hidden; //超出的文本隐藏
		text-overflow: ellipsis; //溢出用省略号显示
		white-space: nowrap; //溢出不换行
	}

	.user-red-packet {
		height: 40px;
		position: relative;
		box-sizing: border-box;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;

		.user-amount {
			height: 40px;
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			align-items: center;

			img {
				width: 15px;
				display: block;
				margin-right: 5px;
			}

			span {
				line-height: 20px;
				display: inline-block;
				font-size: 14px;
				color: #ffffff;
				text-align: left;

				span {
					color: #fb4f38;
				}
			}
		}

		.user-cash-out-btn {
			width: 50px;
			height: 25px;
			line-height: 23px;
			box-sizing: border-box;
			position: relative;
			overflow: hidden;
			border-radius: 15px;
			border: 1px solid #fb4f38;
			font-size: 12px;
			color: #ffffff;
			text-align: center;
			margin-left: 10px;
			letter-spacing: 2px
		}
	}

}
</style>
