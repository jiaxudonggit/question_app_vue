<!--主页商店分类页组件-->
<template>
	<div id="cash-out" class="cash-out app-model" :style="{minHeight: (availHeight - 46) + 'px'}">
		<van-nav-bar class="van-nav-bar-customer fixed-fix" title="红包提现" left-text="返回" left-arrow @click-left="onBackClick"/>
		<div class="cash-out-content app-content">
			<div class="cash-out-content-top">
				<img class="cash-out-content-top-bg" src="../../assets/images/cash-out/cash-out-top-bg.png" alt="">
				<div class="cash-out-info">
					<div class="cash-out-amount">
						余额 <span>{{ balance }}</span> 元
					</div>
					<div class="cash-out-account">您的红包将提现到支付宝账号：<span>{{ alipayAccount }}</span></div>
					<div class="cash-out-line"></div>
					<div class="cash-out-tip">天天答题，天天领红包！</div>
				</div>
				<div class="cash-out-notice">
					<van-notice-bar v-if="cashOutData.noticeContent" left-icon="volume-o" :text="cashOutData.noticeContent"/>
				</div>
			</div>
			<div class="cash-out-content-center">
				<div class="cash-out-title">请选择提现金额</div>
				<div class="cash-out-block">
					<div v-for="(item, index) in cashOutData.cash_out_list" :key="index" class="cash-out-row" :class="cashOutStatus(item.cash_out_status)" @click="onSelectRowClick(item, index)">
						<span class="cash-out-row-amount">{{ item.cash_out_amount }}元</span>
						<span v-if="item.cash_out_desc && item.cash_out_number !== 0" class="cash-out-row-desc">{{ item.cash_out_desc }}({{ item.user_cash_out_number }}/{{ item.cash_out_number }})</span>
						<img v-if="selectedIndex === index" class="cash-out-row-selected" src="../../assets/images/cash-out/cash-out-row-selected.png" alt=""/>
					</div>
				</div>
				<div class="cash-out-btn" @click="onCashOutClick">马上提现</div>
			</div>
			<div class="cash-out-content-bottom">
				<div class="cash-out-message">
					<div class="cash-out-message-title">提现说明</div>
					<div class="cash-out-message-text">
						<p>&bull; 红包提现将会把所选提现金额转账到您提供的支付宝账号中。</p>
						<p>&bull; 提现核对无误后，预计三个工作日内发放至支付宝账户。</p>
						<p>&bull; 如果遇到以下情况，平台有权单方面取消您的提现资格：</p>
						<span>① 提现账号不存在。</span>
						<span>② 提现账号封停。</span>
						<span>③ 提示绑定多个账户。</span>
						<span>④ 使用非法、不正当手段参与本活动。</span>
						<span>⑤ 其他违反国家相关法规行为。</span>
					</div>
				</div>
				<div class="cash-out-message">
					<div class="cash-out-message-title">红包说明</div>
					<div class="cash-out-message-text">
						<p>&bull; 根据国家税务总局规定，对个人获得企业派发的网络红包，应按照所得相应金额缴纳个人所得税，税款由派发红包的企业代扣代缴。</p>
						<p>&bull; 代缴方案：按提现金额的20%收取个人所得税。</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>

import {mapMutations, mapState} from "vuex";
import Vue from 'vue';
import {NoticeBar, NavBar, Dialog} from 'vant';
import debounce from "lodash.debounce";

Vue.use(NavBar);
Vue.use(NoticeBar);
Vue.use(Dialog);

export default {
	inject: ["goToHome"],
	computed: {
		...mapState(["isAppending", "loadingTime", "cashOutData", "availHeight", "alipayAccount", "balance"]),
		cashOutStatus() {
			return function (status) {
				return status ? '' : 'cash-out-row-prohibit';
			}
		}
	},
	data() {
		return {
			timer: null,
			selectedIndex: -1,
			selectedItem: {},
		}
	},
	created() {
		// 初始化
		this.initData();
	},
	destroyed() {
		// 删除定时器
		if (this.timer) clearTimeout(this.timer);
	},
	methods: {
		...mapMutations({
			changeAppending: "changeAppending",
			setCashOutData: "setCashOutData",
			setCashOutAccountPopup: "setCashOutAccountPopup",
		}),

		// 初始化
		initData(callback) {
			// 开启加载提示框
			!this.isAppending && this.changeAppending(true);
			// 获取提现配置
			this.getCashOutData(() => {
				// 关闭加载提示框
				this.timer = setTimeout(() => {
					this.changeAppending(false);
				}, this.loadingTime)
				if (typeof callback === "function") callback();
			})
		},

		// 获取提现配置
		getCashOutData(callback) {
			this.$api.redPacket.getCashOutData().then(data => {
				// 设置提现配置数据
				this.setCashOutData(data.body);
				if (typeof callback === "function") callback();
			});
		},

		// 检测用户提现账户
		checkUserAccount(callback = null) {
			this.$api.redPacket.checkUserAccount().then(data => {
				if (typeof callback === "function") callback(data.body.status);
			});
		},

		// 提交提现申请
		submitCashOut(callback = null) {
			this.$api.redPacket.submitCashOut({
				cash_out_id: this.selectedItem.cash_out_id,
			}).then(data => {
				Dialog.alert({
					message: data.body.message,
				}).then(() => {
					this.getCashOutData();
				});
			}).catch(err => {
				if (err.code) Dialog.alert({
					message: err.body.message,
				});
			}).finally(() => {
				this.selectedIndex = -1;
				this.selectedItem = {};
				if (typeof callback === "function") callback();
			})
		},


		// 选择提现选项点击事件
		onSelectRowClick: debounce(function (item, index) {
			// 设置选中的索引
			this.selectedIndex = index;
			// 设置选中的对象
			this.selectedItem = item;
		}, 400, {
			'leading': true,
			'trailing': false
		}),

		// 点击提现按钮事件
		onCashOutClick: debounce(function () {
			// 判断是否选择了金额
			if (this.selectedIndex === -1) return Dialog.alert({message: "请先选择一个提现金额！"});
			// 先检测是否设置支付宝账户
			this.checkUserAccount((status) => {
				// 已经设置过支付宝账户，则提交提现申请，否则打开设置账户弹窗
				status ? this.submitCashOut() : this.setCashOutAccountPopup(true);
			})
		}, 800, {
			'leading': true,
			'trailing': false
		}),

		// 返回事件
		onBackClick() {
			this.$route.query.sourceUrl ? this.$router.replace({
				path: this.$route.query.sourceUrl,
				query: this.$route.query.sourceQuery,
			}) : this.goToHome();
		},
	},
}
</script>
<style lang="less">
@import "../../assets/less/cash-out.less";
</style>
