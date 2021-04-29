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
		<!-- 倒计时退出按钮 -->
		<close_btn></close_btn>
	</div>
</template>

<script>
import YueYouUtils from "@/utils/YueYouUtils";
import {Request, Utils} from "@/utils/Utils";
import ChannelUtils from "@/utils/ChannelUtils";
import AdUtils from "@/utils/AdUtils";
import {mapState, mapGetters, mapMutations} from "vuex";
import close_btn from "@/components/common/close_btn";


export default {
	name: 'app',
	provide() {
		return {
			reload: this.reload,
			autoLogin: this.autoLogin,
		}
	},
	data() {
		return {
			enterAnimate: '',
			isRouterAlive: true,
		}
	},
	components: {
		close_btn,
	},
	computed: {
		...mapState(["isAppending", "isGameBack", "debugUserId", "debug", "isRunBrowser", "indexData",
			"appId", "channelId", "isRecordAccess", "isNewAccount", "adCount", "IndexPageName"]),
		...mapGetters(["appApiUrl", "isLogin"]),
	},
	watch: {
		// 是否显示加载动画
		isAppending(val) {
			val ? this.$toast.loading({
					message: "加载中...",
					duration: 0,
					forbidClick: true
				})
				: this.$toast.clear();
		},
	},
	mounted() {
		// 绑定window.onresize事件， 获得屏幕可视高度
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
					this.createAccessRecord();
					// 打开倒计时关闭按钮
					if (this.adCount <= 0) this.isNewAccount ? this.setCountDown(true) : this.setCountDown(false);
					if (typeof callback === "function") callback();
				} else {
					console.log("========用户开始登录=========");
					// 获得渠道用户信息
					this.getChannelUserInfo((userInfo) => {
						// 请求登录
						this.userLogin(userInfo, () => {
							// 记录用户进入应用
							this.createAccessRecord()
							console.log("========用户登录成功=========");
							// 打开倒计时关闭按钮
							if (this.adCount <= 0) this.isNewAccount ? this.setCountDown(true) : this.setCountDown(false);
							if (typeof callback === "function") callback();
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
	}
}
</script>
<style lang="less">
/*将公用的样式统一在此导入*/
@import "assets/css/base.css";
@import "assets/css/common.css";
</style>

