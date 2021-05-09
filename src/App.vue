<template>
	<div id="app">
		<!-- 关闭按钮 -->
		<close_btn></close_btn>
		<!-- 页面内容 -->
		<transition v-if="isLogin">
			<keep-alive>
				<router-view v-if="$route.meta.keepAlive && isRouterAlive" class=""></router-view>
			</keep-alive>
		</transition>
		<transition v-if="isLogin">
			<router-view v-if="!$route.meta.keepAlive && isRouterAlive"></router-view>
		</transition>
		<!-- 底部导航栏 -->
		<app_bottom/>
		<!-- 红包弹窗 -->
		<red_packet_popup/>
		<!-- 红包余额不足弹窗 -->
		<red_packet_tip/>
		<!-- 提现账户设置弹窗 -->
		<cash_out_account_popup/>
	</div>
</template>

<script>
import app_bottom from "@/components/common/app_bottom";
import close_btn from "@/components/common/close_btn";
import red_packet_popup from "@/components/common/red_packet/red_packet_popup";
import red_packet_tip from "@/components/common/red_packet/red_packet_tip";
import cash_out_account_popup from "@/components/common/cash_out/cash_out_account_popup";
import CenterLogin from "@/utils/center";
import Utils from "@/utils/utils";
import ChannelUtils from "@/utils/channel";
import {mapGetters, mapMutations, mapState} from "vuex";

export default {
	name: 'app',
	provide() {
		return {
			reload: this.reload,
			autoLogin: this.autoLogin,
			openNewApp: this.openNewApp,
			goToHome: this.goToHome,
			createAccessRecord: this.createAccessRecord,
		}
	},
	components: {
		app_bottom,
		close_btn,
		red_packet_popup,
		red_packet_tip,
		cash_out_account_popup,
	},
	data() {
		return {
			transitionName: 'slide-left',
			isRouterAlive: true,
		}
	},
	computed: {
		...mapState(["isAppending", "isGameBack", "debugUserId", "isRunBrowser", "indexData",
			"appId", "channelId", "isRecordAccess", "isNewAccount", "adCount"]),
		...mapGetters(["isLogin"]),
	},
	watch: {
		isAppending(val) {
			// 控制loading显示/隐藏
			val ? this.$toast.loading({
				message: "加载中...",
				duration: 0,
				forbidClick: true
			}) : this.$toast.clear();
		},
		$route(to) {
			// 页面滚到顶部
			Utils.scrollToTop();
			// 切换应用时重置访问记录状态
			if (to.meta.accessRecord && to.query.YzAppId !== this.appId) this.setRecordAccess(false);
			// 路由参数变化时重新设置appId和channelId到vuex
			if (to.query.YzAppId && this.appId !== to.query.YzAppId) this.setAppId(to.query.YzAppId);
			if (to.query.YzChannelId && this.channelId !== to.query.YzChannelId) this.setChannelId(to.query.YzChannelId);
		},
		channelId() {
			// channelId变化时执行用户登录
			this.autoLogin();
		},

	},
	mounted() {
		// 绑定window.onresize事件， 获得屏幕可视高度
		window.onresize = () => {
			return (() => {
				this.setAvailHeight(window.screen.availHeight);
			})();
		};
	},
	created() {
		// 设置appId和channelId到vuex
		this.setAppId(Utils.getQueryParams("YzAppId"));
		this.setChannelId(Utils.getQueryParams("YzChannelId"));
	},
	methods: {
		...mapMutations({
			setAppId: "setAppId",
			setChannelId: "setChannelId",
			changeAppending: "changeAppending",
			setUserInfo: "setUserInfo",
			setAvailHeight: "setAvailHeight",
			setGameBack: "setGameBack",
			setShowResultPopup: "setShowResultPopup",
			setAppStatus: "setAppStatus",
			setRecordAccess: "setRecordAccess",
			setCountDown: "setCountDown",
			setShowExitBtn: "setShowExitBtn",
		}),

		// 获取渠道用户信息
		getChannelUserInfoFunc(callback) {
			if ((process.env.NODE_ENV === "development" && this.isRunBrowser) || this.isRunBrowser) {
				// 浏览器调试时使用默认用户信息
				if (typeof callback === "function") callback({openid: this.debugUserId});
			} else {
				// 否则使用渠道用户信息
				this.channelId === "YueYou" ? CenterLogin.autoLoginCenter(callback) : ChannelUtils.getUserInfo(callback);
			}
		},

		// 初始化页面
		autoLogin(callback = null) {
			this.changeAppending(true);
			// 获取应用ID
			this.$api.request.getAppStatus({channel_id: this.channelId}).then(data => {
				this.setAppStatus({
					appId: String(data.body.app_id),
					channelVersion: data.body.channel_version,
				});
				console.log("========用户开始登录=========");
				// 获得渠道用户信息
				this.getChannelUserInfoFunc(userInfo => {
					// 用户登录
					this.$api.request.userLogin({
						channel_id: this.channelId,
						channel_userid: userInfo.openid,
						nickname: userInfo.nickname,
						head_img_url: userInfo.headimg,
						sex: userInfo.sex,
					}).then(data => {
						console.log("========用户登录成功=========");
						// 设置用户信息到store中
						this.setUserInfo(data.body);
						// 打开倒计时关闭按钮
						this.setCloseBtnStatus();
						// 关闭loading动画
						this.changeAppending(false);
						if (typeof callback === "function") callback();
					}).catch(() => {
						// 打开webview关闭按钮
						this.setShowExitBtn(true);
					})
				});
			})
		},

		// 记录用户进入应用
		createAccessRecord(callback) {
			if (!this.$route.meta.accessRecord) return;
			if (this.isRecordAccess) {
				if (typeof callback == "function") callback();
			} else {
				// 记录用户进入应用
				this.$api.request.createAccessRecord({app_id: this.appId}).then(() => {
					// 设置记录状态为true
					this.setRecordAccess(true);
				}).finally(() => {
					if (typeof callback == "function") callback();
				})
			}
		},

		// 根据新/老用户设置退出按钮
		setCloseBtnStatus() {

			if (this.isNewAccount) {
				// 打开倒计时功能
				this.setCountDown(true);
				// 隐藏webview关闭按钮
				if (this.$route.meta.showCloseBtn) this.setShowExitBtn(false);
			} else {
				// 关闭倒计时功能
				this.setCountDown(false);
				// 打开webview关闭按钮
				if (this.$route.meta.showCloseBtn) this.setShowExitBtn(true);
			}

		},

		// 刷新路由
		reload(callback) {
			console.log("========app.reloaded=========");
			this.isRouterAlive = false
			this.$nextTick(function () {
				this.isRouterAlive = true;
				if (typeof callback == "function") callback();
			})
		},

		// 切换新应用
		openNewApp(appId, reload = true) {
			return this.$router.replace({
				path: "/",
				query: {
					YzAppId: String(appId),
					YzChannelId: this.channelId,
					t: new Date().getTime()
				}
			}).then(() => {
				if (reload) this.reload()
			});
		},

		// 跳转到商店也
		goToHome() {
			this.$router.replace({path: "/home", query: {YzChannelId: this.channelId, t: new Date().getTime()}});
		},
	}
}
</script>
<style lang="less">
/*将公用的样式统一在此导入*/
@import "assets/css/base.css";
@import "assets/css/common.css";
</style>

