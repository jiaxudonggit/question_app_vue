<!--主页商店分类页组件-->
<template>
	<div id="cash-out" class="cash-out app-model">
		<van-nav-bar class="van-nav-bar-customer fixed-fix" title="红包提现" left-text="返回" left-arrow @click-left="onBackClick"/>
		<div class="cash-out-content app-content">
			<div class="cash-out-content-top">
				<img class="cash-out-content-top-bg" src="../../assets/images/cash-out/cash-out-top-bg.png" alt="">
				<div class="cash-out-info">
					<div class="cash-out-amount">
						余额 <span>3.24</span> 元
					</div>
					<div class="cash-out-account">您的红包将提现到支付宝账号：<span>{{ account }}</span></div>
					<div class="cash-out-line"></div>
					<div class="cash-out-tip">天天答题，天天领红包！</div>
				</div>
				<div class="cash-out-notice">
					<van-notice-bar v-if="noticeContent" :text="noticeContent"/>
				</div>
			</div>
			<div class="cash-out-content-center">
				<div class="cash-out-title">请选择提现金额</div>
				<div class="cash-out-block">
					<div v-for="(item, index) in cashOutData.cash_out_list" :key="index" class="cash-out-row" :class="cashOutStatus(item.cash_out_status)" @click="onSelectRowClick(item, index)">
						<span class="cash-out-row-amount">{{ item.cash_out_amount }}元</span>
						<span v-if="item.cash_out_desc" class="cash-out-row-desc">{{ item.cash_out_desc }}</span>
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
						<p>&bull; 用户每天只可提现一次。</p>
						<p>&bull; 提现核对无误后，预计三个工作日内发放至支付宝账户。</p>
						<p>&bull; 如果遇到以下情况，平台有权单方面取消您的提现资格：</p>
						<span>① 账号不存在下。</span>
						<span>② 账号封停。</span>
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

import question_list_horizontal from "@/components/common/question_list_horizontal";
import {mapGetters, mapMutations, mapState} from "vuex";
import Vue from 'vue';
import {NoticeBar, NavBar} from 'vant';
import {Request} from "@/utils/Utils";
import debounce from "lodash.debounce";
import AdUtils from "@/utils/AdUtils";

Vue.use(NavBar);
Vue.use(NoticeBar);

export default {
	inject: ["openNewApp", "goToHome"],
	components: {
		question_list_horizontal,
	},
	computed: {
		...mapState(["isAppending", "loadingTime", "channelId", "homeData", "cashOutData", "availHeight", "account", "noticeContent"]),
		...mapGetters(["appApiUrl", "appIconUrl", "appResourcesUrl", "appTypeUrl"]),
		cashOutStatus() {
			return function (status) {
				return !status ? 'cash-out-row-prohibit' : '';
			}
		}
	},
	data() {
		return {
			type_image: require("@/assets/images/home/type_10001_big.png"),
			type_name: "推荐排行",
			typeList: [],
			error: false,
			loading: false,
			total_page: 0,
			page: 0,
			model: "type",
			timer: null,
			selectedIndex: -1,
			selectedItem: {},
		}
	},
	created() {
		// 初始化
		// this.initData();
	},
	destroyed() {
		// 删除定时器
		if (this.timer) clearTimeout(this.timer);
	},
	methods: {
		...mapMutations({
			changeAppending: "changeAppending",
		}),

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
			console.log("========提现=======")

		}, 800, {
			'leading': true,
			'trailing': false
		}),


		// 初始化
		initData(callback) {
			// 开启加载提示框
			!this.isAppending && this.changeAppending(true);
			// 获取分类下的应用数据
			this.getTypeData(() => {
				// 关闭加载提示框
				this.timer = setTimeout(() => {
					this.changeAppending(false);
				}, this.loadingTime)
				if (typeof callback === "function") callback();
			});
		},

		// 返回事件
		onBackClick() {
			this.$route.query.sourceUrl ? this.$router.replace({
				path: this.$route.query.sourceUrl,
				query: this.$route.query.sourceQuery,
			}) : this.goToHome();
		},

		// 分类应用点击事件
		onTypeClick(item) {
			this.openNewApp(item.app_id, false);
		},

		// 获得分类下的应用列表
		getTypeData(callback = null) {
			Request.request({
				url: this.appApiUrl + "/test_app/get_app_with_type",
				data: {
					type_id: this.typeId,
					page: this.page + 1,
					page_name: this.model,
				},
				callback: (res, err) => {
					if (err || res.code !== 0) return this.error = true;
					// 更新推荐列表
					this.total_page = res.body.total_page;
					this.page = res.body.page;
					this.type_name = res.body.type_name;
					this.type_image = this.appTypeUrl(res.body.type_image);
					for (let i = 0; i < res.body.app_list.length; i++) res.body.app_list[i].app_icon = this.appIconUrl(res.body.app_list[i].app_icon);
					this.typeList = this.typeList.concat(res.body.app_list);
					if (typeof callback === "function") callback();
				},
			})
		},

		onLoad() {
			// 异步更新数据
			setTimeout(() => {
				this.getTypeData(() => {
					// 加载状态结束
					this.loading = false;
				});
			}, 1000);
		},

	},
}
</script>
<style lang="less">
@import "../../assets/less/cash-out.less";
</style>
