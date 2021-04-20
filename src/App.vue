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
	</div>
</template>

<script>
import YueYouUtils from "@/utils/YueYouUtils";
import {Request} from "@/utils/Utils";
import ChannelUtils from "@/utils/ChannelUtils";
import AdUtils from "@/utils/AdUtils";
import {mapState, mapGetters, mapMutations} from "vuex";

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
	computed: {
		...mapState(["isAppending", "appId", "channelId", "isGameBack","debugUserId", "debug",
			"isRunBrowser", "centerAppId", "isLogin", "indexData"]),
		...mapGetters(["appApiUrl"]),
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
	},
	mounted() {
		window.onresize = () => {
			return (() => {
				this.setAvailHeight(window.screen.availHeight);
			})()
		};
		// 挂载完成后，判断浏览器是否支持popstate，监听popstate
		if (window.history && window.history.pushState) {
			history.pushState(null, null, document.URL);
			window.addEventListener('popstate', this.watchReturn, false);//false阻止默认事件
		}
	},
	destroyed() {
		// 页面销毁时，取消监听
		window.removeEventListener('popstate', this.watchReturn, false);//false阻止默认事件
	},
	methods: {
		...mapMutations({
			setAppId: "setAppId",
			setChannelId: "setChannelId",
			changeAppending: "changeAppending",
			setUserInfo: "setUserInfo",
			setAvailHeight: "setAvailHeight",
			setGameBack: "setGameBack",
			setPopupData: "setPopupData",
		}),

		// 监听移动端返回键事件
		watchReturn() {
			switch (this.$route.path) {
				case "/play":
					// 关闭banner广告
					AdUtils.closeBannerAd(() => {
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
			if (this.debug && this.isRunBrowser) {
				// 浏览器调试时使用默认用户信息
				if (typeof callback === "function") callback({userid: this.debugUserId});
			} else {
				// 否则使用渠道用户信息
				this.channelId === "YueYou" ? YueYouUtils.autoLoginCenter(this.centerAppId, callback) : ChannelUtils.getUserInfo(callback);
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
						this.setAppId(res.body.app_id);
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
								if (typeof callback === "function") callback();
							});
						});
					});
				}
			});
		},

		// 记录用户进入应用
		createAccessRecord(callback) {
			// 记录用户进入应用
			Request.request({
				url: this.appApiUrl + "/test_app/create_access_record",
				data: {
					app_id: this.appId,
				},
				callback: callback
			});
		},

		// 刷新路由
		reload(callback) {
			console.log("========app.reloaded=========");
			this.isRouterAlive = false
			this.$nextTick(function () {
				this.isRouterAlive = true;
				if (typeof callback == "function") callback();
			})
		}
	}
}
</script>
<style lang="less">
/*将公用的样式统一在此导入*/
@import "assets/css/base.css";
@import "assets/css/common.css";
</style>

