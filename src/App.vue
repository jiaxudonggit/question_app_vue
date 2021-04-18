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
import RecordService from "@/services/record_service";
import AuthService from "@/services/auth_service";
import {Utils} from "@/utils/Utils";
import ChannelUtils from "@/utils/ChannelUtils";
import {mapState} from "vuex";

export default {
	name: 'app',
	provide() {
		return {
			reload: this.reload,
		}
	},
	data() {
		return {
			enterAnimate: '',
			isRouterAlive: true,
		}
	},
	computed: {
		...mapState(["isAppending"]),
		appId() {
			let appId = Utils.getQueryParams("YzAppId");
			this.$store.commit("setAppId", appId);
			return appId;
		},
		channelId() {
			let channelId = Utils.getQueryParams("YzChannelId");
			this.$store.commit("setChannelId", channelId);
			return channelId;
		},
	},
	watch: {
		isAppending(val) {
			val ? this.$toast.loading({
					message: "加载中...",
					duration: 0,
					forbidClick: true
				})
				: this.$toast.clear();
		}
	},
	created() {
		console.log("========app.created=========");
		console.log("地址：" + window.location.href);
		// 初始化页面
		this.initPage();
	},
	methods: {

		// 用户登录
		userLogin(callback) {
			// 获得渠道用户信息
			this.getChannelUserInfo((userInfo) => {
				AuthService.userLogin({
					url: this.$store.getters.appApiUrl + "/login/user_login",
					data: {
						channel_id: this.channelId,
						channel_userid: userInfo.userid,
						nickname: userInfo.nickname,
						head_img_url: userInfo.head_img_url,
						sex: userInfo.sex,
					},
					callback: callback,
				})
			})
		},

		// 获取渠道用户信息
		getChannelUserInfo(callback) {
			if (this.$store.state.debug && this.$store.state.isRunBrowser) {
				// 浏览器调试时使用默认用户信息
				if (typeof callback === "function") callback({userid: this.$store.state.debugUserId});
			} else {
				// 否则使用渠道用户信息
				this.channelId === "YueYou" ? YueYouUtils.autoLoginCenter(this.$store.state.centerAppId, callback) : ChannelUtils.getUserInfo(callback);
			}
		},

		// 初始化页面
		initPage() {
			console.log("========app.初始化页面=========");
			// 开启加载提示框
			!this.$store.state.isAppending && this.$store.commit("changeAppending", true);
			this.userLogin((res, err) => {
				if (err || res.code !== 0) return this.$toast("登录失败，" + err);
				// 设置用户信息到store终
				this.$store.commit("setUserInfo", res.body);
				// 记录用户进入应用
				RecordService.createAccessRecord({
					url: this.$store.getters.appApiUrl + "/test_app/create_access_record",
					data: {
						app_id: this.appId,
					},
					callback: () => {
						// 关闭加载提示框
						this.$store.commit("changeAppending", false);
					}
				});
			})
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

