<!--主页组件-->
<template>
	<div id="index" class="index app-model" :style="{backgroundColor: indexData.bg_color}">
		<div class="index-header fixed-fix">
			<div class="index-header-home" @click="onClickHome"><img src="../../assets/images/index/home.png" alt=""></div>
		</div>
		<div class="index-content app-content" :style="{minHeight: availHeight + 'px'}">
			<!-- 背景图片 -->
			<div class="index-bg-images">
				<img v-for="(item, index) in indexData.bg_images" :src="item" alt="" :key="index">
			</div>
			<!-- 简介背景图 -->
			<div v-if="indexData.show_describes" class="index-content-describes-wrap" :style="{backgroundColor: indexData.bg_color}">
				<div class="index-content-title" :style="{color: indexData.title_color}">{{ indexData.title }}</div>
				<div class="index-content-describes" :style="{color: indexData.title_color}">{{ indexData.describes }}</div>
				<div class="index-content-describes-box" :style="{backgroundColor: indexData.box_color}">
					<div class="index-content-describes-cell">
						<div class="index-content-describes-item">
							<div class="index-content-describes-item-top" :style="{color: indexData.describes_color}">
								<span>{{ indexData.question_number }}</span>道
							</div>
							<div class="index-content-describes-item-bottom">测试题目</div>
						</div>
					</div>
					<div class="index-content-describes-cell">
						<div class="index-content-describes-item">
							<div class="index-content-describes-item-top" :style="{color: indexData.describes_color}">
								<span>{{ indexData.user_number }}</span>W
							</div>
							<div class="index-content-describes-item-bottom">参与测试</div>
						</div>
					</div>
					<div class="index-content-describes-cell">
						<div class="index-content-describes-item">
							<div class="index-content-describes-item-top" :style="{color: indexData.describes_color}">
								<span>{{ indexData.evaluate }}</span>%
							</div>
							<div class="index-content-describes-item-bottom">好评率</div>
						</div>
					</div>
				</div>
				<div class="index-content-describes-images">
					<img v-for="(item, index) in indexData.describes_images" :src="item" alt="" :key="index">
				</div>
			</div>
		</div>
		<!-- 推荐列表 -->
		<recommend_list v-if="isLogin && indexData.show_recommend_list" :model="model" :padding-bottom="'130px'" v-on:listenerRecommendClick="onClickRecommend"></recommend_list>
		<!-- 按钮 -->
		<div class="index-btn-wrap fixed-fix" @click="$router.push({path: '/play', query: {YzAppId: appId, YzChannelId: channelId, t: new Date().getTime()}})">
			<img v-if="indexData.button_image" class="index-btn" :src="indexData.button_image" alt="">
		</div>
		<!-- 更多按钮 -->
		<div v-if="indexData.show_recommend_list && indexData.show_more_btn" class="index-more-btn animate__animated animate__bounceIn" @click="onClickMoreRecommend">
			<img src="../../assets/images/index/more.png" alt="">
		</div>
		<!-- 推荐弹窗 -->
		<recommend_layer :show="showPopup" @listenerPopupClick="onPopupClick" @listenerPopupMoreClick="onPopupMoreClick" @listenerPopupCloseClick="onPopupCloseClick"></recommend_layer>
	</div>
</template>
<script>
import Vue from 'vue';
import recommend_list from "@/components/common/recommend_list";
import recommend_layer from "@/components/common/recommend_layer";
import {Request, Utils} from "@/utils/Utils";
import {mapGetters, mapMutations, mapState} from "vuex";
import {Popup} from 'vant';

Vue.use(Popup);

export default {
	inject: ['reload', "autoLogin"],
	components: {
		recommend_list,
		recommend_layer,
	},
	data() {
		return {
			model: "index",
			timer: [],
			showPopup: false,
			isShowExitBtn: false,
		}
	},
	computed: {
		...mapState(["isAppending", "appId", "channelId", "indexData", "isGameBack", "loadingTime", "availHeight"]),
		...mapGetters(["appApiUrl", "appIconUrl", "appResourcesUrl", "isLogin"]),
	},
	watch: {
		isGameBack(val) {
			val ? this.getPopupData(() => {
				let timer = setTimeout(()=>{
					this.showPopup = true;
				}, this.loadingTime)
				this.timer.push(timer);
			}) : this.showPopup = false;
		},
	},
	created() {
		// 页面滚到顶部
		Utils.scrollToTop();
		// 显示关闭按钮
		this.showExitBtn();
		// 设置appId和channelId到vuex
		this.setAppId(this.$route.query.YzAppId);
		this.setChannelId(this.$route.query.YzChannelId);
		// 初始化
		this.initData(() => {
			this.isGameBack ? this.getPopupData(() => {
				let timer = setTimeout(()=>{
					this.showPopup = true;
				}, this.loadingTime)
				this.timer.push(timer);
			}) : this.showPopup = false;
		});
	},
	beforeRouteLeave(to, from, next) {
		// 删除定时器
		this.cancelTimeOut();
		// 隐藏关闭按钮
		if (to.name === "home" && this.isLogin && this.indexData.show_recommend_layer) this.hideExitBtn();
		next();
	},
	methods: {
		...mapMutations({
			setAppId: "setAppId",
			setChannelId: "setChannelId",
			changeAppending: "changeAppending",
			setIndexData: "setIndexData",
			setGameBack: "setGameBack",
			setPopupData: "setPopupData",
		}),

		// 初始化
		initData(callback) {
			if (this.isLogin && this.indexData.app_id && parseInt(this.indexData.app_id) === parseInt(this.appId)) {
				if (typeof callback === "function") callback();
				return false;
			}
			// 开启加载提示框
			!this.isAppending && this.changeAppending(true);
			// 用户登录
			this.autoLogin(() => {
				// 获取主页数据
				this.getIndexData(() => {
					// 关闭加载提示框
					let timer = setTimeout(() => {
						this.changeAppending(false);
					}, this.loadingTime)
					this.timer.push(timer);
					if (typeof callback === "function") callback();
				});
			});
		},

		// 获得首页数据
		getIndexData(callback) {
			Request.request({
				url: this.appApiUrl + "/test_app/get_index_data",
				data: {
					app_id: this.appId,
				},
				callback: (res, err) => {
					if (err || res.code !== 0) {
						this.$toast("网络错误，请稍后，" + err);
					} else {
						// 设置首页数据到store
						this.setIndexData({
							data: res.body,
							appIconUrl: this.appIconUrl,
							appResourcesUrl: this.appResourcesUrl,
							model: this.model,
						});
					}
					if (typeof callback === "function") callback();
				},
			})
		},

		// 记录用户点击推荐应用
		createRecommendRecord(from_app_id, to_app_id, callback) {
			Request.request({
				url: this.appApiUrl + "/test_app/create_recommend_record",
				data: {
					from_app_id: from_app_id,
					to_app_id: to_app_id,
				},
				callback: callback,
			})
		},

		// 推荐弹窗数据 setPopupData
		getPopupData(callback) {
			Request.request({
				url: this.appApiUrl + "/test_app/get_popup_data",
				data: {
					app_id: this.appId,
					page_name: "layer",
				},
				callback: (res, err) => {
					if (err || res.code !== 0) return false;
					this.setPopupData({
						data: res.body,
						appIconUrl: this.appIconUrl,
						appResourcesUrl: this.appResourcesUrl,
						model: this.model,
					});
					if (typeof callback === "function") callback();
				},
			})
		},

		// 点击更多推荐事件
		onClickRecommend(item) {
			this.reload(() => {
				this.$router.replace({path: "/", query: {YzAppId: item.app_id, YzChannelId: this.channelId, t: new Date().getTime()}});
			});
		},

		// 点击更多精彩滚动到推荐
		onClickMoreRecommend() {
			this.$el.querySelector(".recommend-content").scrollIntoView({
				behavior: "smooth",
				block: "nearest",
				inline: "nearest"
			});
		},

		// 点击弹窗推荐事件
		onPopupClick(item) {
			this.createRecommendRecord(this.appId, item.app_id, () => {
				this.setGameBack(false);
				this.onClickRecommend(item);
			})
		},

		// 点击弹窗更多按钮
		onPopupMoreClick() {
			this.setGameBack(false);
			this.$el.querySelector(".recommend-content").scrollIntoView({
				behavior: "smooth",
				block: "nearest",
				inline: "nearest"
			});
		},

		// 点击弹窗关闭按钮
		onPopupCloseClick() {
			this.setGameBack(false);
		},

		// 点击返回商店主页按钮
		onClickHome() {
			this.$router.replace({path: "/home", query: {YzChannelId: this.channelId, t: new Date().getTime()}})
		},

		// 显示关闭按钮
		showExitBtn() {
			if (this.channelId === "YueYou" && !this.isShowExitBtn && window.nativeObj !== undefined) {
				window.nativeObj.showExitIcon();
				this.isShowExitBtn = true;
			}
		},

		// 隐藏关闭按钮
		hideExitBtn() {
			if (this.channelId === "YueYou" && this.isShowExitBtn && window.nativeObj !== undefined) {
				window.nativeObj.closeExitIcon();
				this.isShowExitBtn = false;
			}
		},

		// 取消定时器
		cancelTimeOut() {
			this.timer.forEach((item) => {
				if (item) clearTimeout(item);
			});
		}
	},
}
</script>
<style lang="less">
@import "../../assets/less/index.less";
</style>
