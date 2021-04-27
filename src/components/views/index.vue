<template>
	<!--index组件-->
	<div id="index" class="index" :style="{minHeight: availHeight + 'px', backgroundColor: indexData.bg_color}">
		<div class="index-content">
			<div class="index-bg-images">
				<img v-for="(item, index) in indexData.bg_images" :src="item" alt="" :key="index">
			</div>
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
		<recommend_list v-if="isLogin && indexData.show_recommend_list" :model="model" :padding-bottom="'150px'" v-on:listenerRecommendClick="onClickRecommend"></recommend_list>
		<div class="index-btn-wrap fixed-fix" @click="$router.push({path: '/play', query: {YzAppId: appId, YzChannelId: channelId, t: new Date().getTime()}})">
			<img v-if="indexData.button_image" class="index-btn" :src="indexData.button_image" alt="">
		</div>
		<div v-if="indexData.show_recommend_list && indexData.show_more_btn" class="index-more-btn animate__animated animate__bounceIn" @click="onClickMoreRecommend">
			<img src="../../assets/images/index/more.png" alt="">
		</div>
		<van-popup v-if="indexData.show_recommend_layer && showPopup" v-model="showPopup" class="app-popup" :lock-scroll="true" :close-on-click-overlay="false">
			<img class="app-popup-title" src="../../assets/images/popup/layer-title.png" alt="">
			<div class="app-popup-content">
				<div class="app-popup-app-list">
					<div class="app-popup-app" v-for="(item, index) in popupData.recommend_list" :key="index" @click="onPopupClick(item, index)">
						<div class="app-popup-left">
							<img class="app-popup-icon" :src="item.app_icon" alt="加载错误">
						</div>
						<div class="app-popup-center">
							<div class="app-popup-title">{{ item.app_name }}</div>
							<div class="app-popup-desc">{{ item.app_desc }}</div>
						</div>
						<div class="app-popup-right">
							<div class="app-popup-btn">{{ item.btn_text }}</div>
						</div>
					</div>
				</div>
			</div>
			<img class="app-popup-content-bottom" src="../../assets/images/popup/layer-bottom.png" alt="">
			<img class="app-popup-btn" src="../../assets/images/popup/layer-btn.png" alt="" @click="onClickMorePopup">
			<img class="app-popup-close" src="../../assets/images/popup/layer-close.png" alt="" @click="onClickClosePopup">
		</van-popup>
	</div>
</template>
<script>
import Vue from 'vue';
import recommend_list from "@/components/common/recommend_list";
import {Request, Utils} from "@/utils/Utils";
import {mapGetters, mapMutations, mapState} from "vuex";
import {Popup} from 'vant';

Vue.use(Popup);

export default {
	inject: ['reload', "autoLogin"],
	components: {
		recommend_list,
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
		...mapState(["isAppending", "appId", "channelId", "indexData", "isGameBack", "popupData", "availHeight", "recommendData", "loadingTime", "showCloseBtn"]),
		...mapGetters(["appApiUrl", "appIconUrl", "appResourcesUrl", "isLogin"]),
	},
	watch: {
		isGameBack(val) {
			val ? this.getPopupData(() => {
				this.showPopup = true;
			}) : this.showPopup = false;
		},
	},
	activated() {
		// 页面滚到顶部
		Utils.scrollToTop();
		// 显示关闭按钮
		// this.showExitBtn();
		// 设置appId和channelId到vuex
		this.setAppId(this.$route.query.YzAppId);
		this.setChannelId(this.$route.query.YzChannelId);
		// 初始化
		this.initData();
	},
	deactivated() {
		// 隐藏关闭按钮
		// this.hideExitBtn();
		// 删除定时器
		this.cancelTimeOut();
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
		onClickMorePopup() {
			this.setGameBack(false);
			this.$el.querySelector(".recommend-content").scrollIntoView({
				behavior: "smooth",
				block: "nearest",
				inline: "nearest"
			});
		},

		// 点击弹窗关闭按钮
		onClickClosePopup() {
			this.setGameBack(false);
		},

		// 显示关闭按钮
		showExitBtn() {
			if (this.channelId === "YueYou" && !this.isShowExitBtn && !this.showCloseBtn && window.nativeObj !== undefined) {
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
