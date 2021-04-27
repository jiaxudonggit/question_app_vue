<template>
	<div id="app">
		<transition name="custom-classes-transition" :enter-active-class="enterAnimate">
			<keep-alive>
				<router-view v-if="$route.meta.keepAlive && isRouterAlive" class=""></router-view>
			</keep-alive>
		</transition>
		<transition name="custom-classes-transition" :enter-active-class="enterAnimate">
			<router-view v-if="!$route.meta.keepAlive && isRouterAlive"></router-view>
		</transition>
		<app_bottom></app_bottom>
		<close_btn v-show="showCloseBtnRoute"></close_btn>
	</div>
</template>

<script>
import app_bottom from "@/components/common/app_bottom";
import close_btn from "@/components/common/close_btn";
import YueYouUtils from "@/utils/YueYouUtils";
import {Request, Utils} from "@/utils/Utils";
import ChannelUtils from "@/utils/ChannelUtils";
import AdUtils from "@/utils/AdUtils";
import {mapState, mapGetters, mapMutations} from "vuex";

export default {
	name: 'app',
	provide() {
		return {
			reload: this.reload,
			autoLogin: this.autoLogin,
			showExitBtn: this.showExitBtn,
			hideExitBtn: this.hideExitBtn,
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
			showCloseBtnRoute: false,
		}
	},
	computed: {
		...mapState(["isAppending", "isGameBack", "debugUserId", "debug",
			"isRunBrowser", "indexData", "appId", "channelId", "isRecordAccess",
			"isShowExitBtn", "showCloseBtn"]),
		...mapGetters(["appApiUrl", "isLogin"]),
	},
	watch: {
		isAppending(val) {
			val ? this.$toast.loading({
					message: "加载中...",
					duration: 0,
					forbidClick: true
				})
				: this.$toast.clear();
		},
		$route(to) {
			this.showCloseBtnRoute = (to.name === "index" || to.name === "home") && this.showCloseBtn;
			if (to.name === "index" || to.name === " home") {
				// 显示关闭按钮
				this.showExitBtn();
			} else {
				// 隐藏关闭按钮
				this.hideExitBtn();
			}
		}
	},
	mounted() {
		window.onresize = () => {
			return (() => {
				this.setAvailHeight(window.screen.availHeight);
			})()
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
			doRecordAccess: "doRecordAccess",
			setShowExitBtn: "setShowExitBtn",
			setShowCloseBtn: "setShowCloseBtn",
		}),

		// 监听移动端返回键事件
		watchReturn() {
			switch (this.$route.path) {
				case "/play":
					// 关闭banner广告
					AdUtils.closeBannerAd(() => {
						this.setShowResultPopup(false);
						if (this.isLogin && this.indexData.show_recommend_layer) this.setGameBack(true);
						this.$router.replace({path: "/", query: {YzAppId: this.appId, YzChannelId: this.channelId, t: new Date().getTime()}});
					});
					break;
				case "/result":
					AdUtils.closeScreenAd(() => {
						if (this.isLogin && this.indexData.show_recommend_layer) this.setGameBack(true);
						this.$router.replace({path: "/", query: {YzAppId: this.appId, YzChannelId: this.channelId, t: new Date().getTime()}});
					});
					break;
				case "/":
					break;
			}
		},

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
					if (err || res.code !== 0) return this.$toast("用户登录失败，" + err);
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
							appId: res.body.app_id,
							channelVersion: res.body.channel_version,
						});
						if (typeof callback === "function") callback();
					},
				})
			}
		},

		// 初始化页面
		autoLogin(callback) {
			this.getAppStatus(() => {
				if (this.isLogin) {
					console.log("========用户已经登录=========");
					// 记录用户进入应用
					this.createAccessRecord(() => {
						if (typeof callback === "function") callback();
					});
				} else {
					console.log("========用户开始登录=========");
					// 获得渠道用户信息
					this.getChannelUserInfo((userInfo) => {
						// 请求登录
						this.userLogin(userInfo, () => {
							// 记录用户进入应用
							this.createAccessRecord(() => {
								console.log("========用户登录成功=========");
								if (typeof callback === "function") callback();
							});
						});
					});
				}
			});
		},

		// 记录用户进入应用
		createAccessRecord(callback) {
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
						if (res && res.code === 0) this.doRecordAccess();
						if (typeof callback == "function") callback();
					}
				});
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

		// 显示关闭webview按钮
		showExitBtn() {
			if (this.channelId === "YueYou" && !this.isShowExitBtn && !this.showCloseBtn && window.nativeObj !== undefined) {
				console.log("============显示关闭按钮===============")
				window.nativeObj.showExitIcon();
				this.setShowExitBtn(true);
			}
		},

		// 隐藏关闭webview按钮
		hideExitBtn() {
			if (this.channelId === "YueYou" && this.isShowExitBtn && window.nativeObj !== undefined) {
				console.log("============隐藏关闭按钮===============")
				window.nativeObj.closeExitIcon();
				this.setShowExitBtn(false);
			}
		},

	}
}
</script>
<style lang="less">
/*将公用的样式统一在此导入*/
@import "assets/css/base.css";
@import "assets/css/common.css";
</style>

