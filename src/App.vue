<template>
	<div id="app">
		<transition v-if="isLogin" name="custom-classes-transition" :enter-active-class="enterAnimate">
			<keep-alive>
				<router-view v-if="$route.meta.keepAlive && isRouterAlive" class=""></router-view>
			</keep-alive>
		</transition>
		<transition v-if="isLogin" name="custom-classes-transition" :enter-active-class="enterAnimate">
			<router-view v-if="!$route.meta.keepAlive && isRouterAlive"></router-view>
		</transition>
		<app_bottom></app_bottom>
		<close_btn></close_btn>
	</div>
</template>

<script>
import app_bottom from "@/components/common/app_bottom";
import close_btn from "@/components/common/close_btn";
import YueYouUtils from "@/utils/YueYouUtils";
import {Request, Utils} from "@/utils/Utils";
import ChannelUtils from "@/utils/ChannelUtils";
import {mapState, mapGetters, mapMutations} from "vuex";

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
	},
	data() {
		return {
			enterAnimate: '',
			isRouterAlive: true,
		}
	},
	computed: {
		...mapState(["isAppending", "isGameBack", "debugUserId", "debug", "isRunBrowser", "indexData",
			"appId", "channelId", "isRecordAccess", "isNewAccount", "adCount"]),
		...mapGetters(["appApiUrl", "isLogin"]),
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

		// 用户登录
		userLogin(userInfo, callback) {
			Request.request({
				url: this.appApiUrl + "/login/user_login",
				data: {
					channel_id: this.channelId,
					channel_userid: userInfo.userid,
					nickname: userInfo.nickname,
					head_img_url: userInfo.head_img_url,
					sex: userInfo.sex,
				},
				callback: (res, err) => {
					if (err || res.code !== 0) {
						// 打开webview关闭按钮
						this.setShowExitBtn(true);
						return this.$toast("用户登录失败，" + err);
					}
					// 设置用户信息到store中
					this.setUserInfo(res.body);
					if (typeof callback === "function") callback();
				},
			})
		},

		// 获取渠道用户信息
		getChannelUserInfo(callback) {
			if ((this.debug && this.isRunBrowser) || this.isRunBrowser) {
				// 浏览器调试时使用默认用户信息
				if (typeof callback === "function") callback({userid: this.debugUserId});
			} else {
				// 否则使用渠道用户信息
				this.channelId === "YueYou" ? YueYouUtils.autoLoginCenter(callback) : ChannelUtils.getUserInfo(callback);
			}
		},

		// 获取应用ID
		getAppStatus(callback) {
			if (this.appId) {
				if (typeof callback === "function") callback();
			} else {
				Request.request({
					url: this.appApiUrl + "/test_app/get_app_status",
					data: {
						channel_id: this.channelId,
					},
					callback: (res, err) => {
						if (err || res.code !== 0) return this.$toast("初始化失败，" + err);
						this.setAppStatus({
							appId: String(res.body.app_id),
							channelVersion: res.body.channel_version,
						});
						if (typeof callback === "function") callback();
					},
				})
			}
		},

		// 初始化页面
		autoLogin(callback = null) {
			this.getAppStatus(() => {
				console.log("========用户开始登录=========");
				// 获得渠道用户信息
				this.getChannelUserInfo((userInfo) => {
					// 请求登录
					this.userLogin(userInfo, () => {
						console.log("========用户登录成功=========");
						// 打开倒计时关闭按钮
						this.setCloseBtnStatus();
						if (typeof callback === "function") callback();
					});
				});
			});
		},

		// 记录用户进入应用
		createAccessRecord(callback) {
			if (!this.$route.meta.accessRecord) return;
			if (this.isRecordAccess) {
				if (typeof callback == "function") callback();
			} else {
				// 记录用户进入应用
				Request.request({
					url: this.appApiUrl + "/test_app/create_access_record",
					data: {
						app_id: this.appId,
					},
					callback: (res) => {
						if (res && res.code === 0) this.setRecordAccess(true);
						if (typeof callback == "function") callback();
					}
				});
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
		}
	}
}
</script>
<style lang="less">
/*将公用的样式统一在此导入*/
@import "assets/css/base.css";
@import "assets/css/common.css";
</style>

