<!--答题页组件-->
<template>
	<div id="game" class="game app-model" :style="{backgroundColor: playData.bg_color}">
		<div class="game-header fixed-fix">
			<div class="game-header-back" @click="onClickBack"><img src="../../assets/images/play/back.png" alt=""></div>
			<div class="game-header-title">答题中</div>
		</div>
		<div class="game-content app-content" :style="{minHeight: availHeight + 'px'}">
			<div class="game-title-wrap">
				<img src="../../assets/images/play/game-title.png" alt="">
				<div class="game-title">
					<div class="game-title-head-image">
						<img src="../../assets/images/play/game-title-head.png" alt="">
					</div>
					<div class="game-title-text" :style="{color: playData.title_color}">{{ playData.title }}</div>
				</div>
			</div>
			<div class="game-progress-wrap">
				<div class="game-progress" :style="{backgroundColor: playData.process_bg_color}">
					<div class="game-progress-inner" :style="{backgroundColor: playData.process_color, width: playData.question_list.length > 0 ? (((questionIndex + 1) / (playData.question_list.length) * 100) + '%') : '0%'}"></div>
				</div>
				<div v-if="playData.question_list.length > 0" class="game-progress-text" v-html="`${questionIndex + 1}/${playData.question_list.length}`"></div>
			</div>
			<div class="game-answer-wrap">
				<answer v-if="showAnswer && Object.keys(question).length > 0" :question="question" :model="model" v-on:listenerAnswerClick="onClickAnswer"></answer>
			</div>
			<div class="game-barrage-wrap">
				<vue-danmaku v-if="showBarrage" class="game-barrage" ref="barrage" :danmus="barrageList" useSlot :channels="barrageData.lanes_count" :loop="barrageData.barrage_loop"
					:autoplay="true" :randomChannel="true" :speed="barrageData.barrage_time" :top="15">
					<template slot="dm" slot-scope="{ index, danmu }">
						<div class="barrage-item">
							<img :src="danmu.avatar" alt="">
							<span>{{ danmu.msg }}</span>
						</div>
					</template>
					<!-- 容器插槽 -->
					<div></div>
				</vue-danmaku>
			</div>
		</div>
		<van-popup v-if="showResultPopup" v-model="showResultPopup" class="result-popup" @click="onClickPopup" @click-overlay="onClickPopup" :lock-scroll="true" :close-on-click-overlay="false">
			<img src="../../assets/images/result/kuang1.gif" alt="">
		</van-popup>
	</div>
</template>
<script>

import debounce from 'lodash.debounce';
import Vue from 'vue';
import vueDanmaku from 'vue-danmaku'
import answer from '@/components/common/answer';
import Ad from "@/utils/ad";
import {mapGetters, mapMutations, mapState} from "vuex";
import {Request} from "@/utils/utils";
import {Popup} from 'vant';

Vue.use(Popup);

export default {
	inject: ["createAccessRecord"],
	components: {
		answer,
		vueDanmaku,
	},
	data() {
		return {
			showAnswer: true,
			questionIndex: 0,
			fractionArray: [],
			barrageList: [],
			question: {},
			showBarrage: false,
			showResultPopup: false,
			model: "question",
		}
	},
	computed: {
		...mapState(["isAppending", "appId", "channelId", "playData", "barrageData", "availHeight", "isShowResultPopup", "indexData", "loadingTime", "resultId"]),
		...mapGetters(["appApiUrl", "appResourcesUrl", "appBarrageAvatarUrl", "appIconUrl", "isLogin"]),

		fraction() {
			let result = 0;
			for (let i = this.fractionArray.length - 1; i >= 0; i--) result += parseFloat(this.fractionArray[i]);
			return result;
		},
	},
	watch: {
		isShowResultPopup(val) {
			this.showResultPopup = val;
		}
	},
	activated() {
		this.initData(() => {
			// 获得弹幕数据
			this.getBarrageData(() => {
				// 渲染弹幕数据
				this.renderBarrageData()
			});
			// 打开banner广告
			Ad.openBannerAd(this.appId);
			// 初始化数据
			this.setShowResultPopup(false); // 关闭结果提示框
			this.setResultId(null); // 重置结果ID
			this.setFraction(0); // 重置题目
			this.questionIndex = 0; // 重置题目索引
			this.fractionArray = []; // 重置分数
			// 获得题目
			this.getQuestion(0);
		});
	},
	beforeRouteLeave(to, from, next) {
		// 关闭banner广告
		Ad.closeBannerAd();
		// 清除弹幕
		if (this.$refs.barrage) this.$refs.barrage.stop();
		this.showBarrage = false;
		this.barrageList = [];
		// 关闭定时器
		if (this.timer) clearTimeout(this.timer);
		// 关闭结果提示框
		this.setShowResultPopup(false);
		// 打开推荐弹窗
		if (to.name === "index" && this.indexData.show_recommend_layer) this.setGameBack(true);
		next();
	},
	methods: {

		...mapMutations({
			setAppId: "setAppId",
			setChannelId: "setChannelId",
			setResultId: "setResultId",
			setFraction: "setFraction",
			changeAppending: "changeAppending",
			setPlayData: "setPlayData",
			setBarrageData: "setBarrageData",
			setGameBack: "setGameBack",
			setShowResultPopup: "setShowResultPopup",
			updateBarrageData: "updateBarrageData",
			setCountDown: "setCountDown",
			addAdCount: "addAdCount",
			setCanReceive: "setCanReceive",
		}),

		// 初始化
		initData(callback) {
			if (this.playData.app_id && String(this.playData.app_id) === String(this.appId)) {
				if (typeof callback === "function") callback();
			} else {
				// 开启加载提示框
				!this.isAppending && this.changeAppending(true);
				// 获取主页数据
				this.getPlayData(() => {
					// 记录用户进入应用
					this.createAccessRecord();
					// 关闭加载提示框
					this.timer = setTimeout(() => {
						this.changeAppending(false);
					}, this.loadingTime);
					if (typeof callback === "function") callback();
				});
			}
		},

		// 获得首页数据
		getPlayData(callback) {
			Request.request({
				url: this.appApiUrl + "/test_app/get_play_data",
				data: {
					app_id: this.appId,
				},
				callback: (res, err) => {
					if (err || res.code !== 0) {
						this.$toast("网络错误，请稍后，" + err);
					} else {
						// 设置首页数据到store
						this.setPlayData({
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

		// 获得弹幕数据
		getBarrageData(callback) {
			if (this.barrageData.msg_list.length > 0) {
				if (typeof callback === "function") callback();
			} else {
				Request.request({
					url: this.appApiUrl + "/test_app/get_barrage_data",
					callback: (res, err) => {
						if (err || res.code !== 0) return this.$toast("网络错误，请稍后");
						// 设置首页数据到store
						this.setBarrageData(res.body);
						if (typeof callback === "function") callback();
					},
				});
			}
		},

		// 生成弹幕数据
		renderBarrageData() {
			this.showBarrage = false;
			for (let i = 1; i < this.barrageData.barrage_number + 1; i++) this.barrageList.push({
				avatar: this.appBarrageAvatarUrl(this.barrageData.avatar_list.randomElement()),
				msg: this.barrageData.msg_list.randomElement(),
			});
			this.$nextTick(() => {
				this.showBarrage = true;
			});
		},

		// 获得指定题目
		getQuestion(questionIndex = 0) {
			if (this.playData.question_list.length <= questionIndex) return;
			this.showAnswer = false;
			this.questionIndex = questionIndex;
			this.question = this.playData.question_list[this.questionIndex];
			this.$nextTick(() => {
				this.showAnswer = true;
			});
		},

		// 返回按钮
		onClickBack() {
			// 关闭banner广告
			Ad.closeBannerAd(() => {
				this.$router.back();
			});
		},

		// 答案点击事件
		onClickAnswer(item) {
			// 将每道题答案的分数加入分数数组中，分数数组长度不可超过题目数量。
			if (this.fractionArray.length < this.playData.question_list.length) this.fractionArray.push(item.answer_fraction);
			this.setFraction(this.fraction);
			if (item.result_id.length > 0) {
				// 指定了结果的答案， 直接跳转对应结果
				this.setResultId(item.result_id.randomElement());
				this.setShowResultPopup(true); // 显示结果跳转dialog
			} else if (item.answer_next) {
				// 指定了要跳转题目的答案， 跳转对应题目
				this.getQuestion(item.answer_next - 1);
			} else {
				// 普通答案
				if (this.questionIndex === this.playData.question_list.length - 1) {
					// 此处为最后一题，说明并未指定对应结果，需要使用分数判定结果
					console.log("当前总共得分：" + this.fraction);
					this.setFraction(this.fraction);
					this.setShowResultPopup(true); // 显示结果跳转dialog
				} else {
					// 此处为普通题目，顺序获取下一题即可
					this.getQuestion(this.questionIndex + 1);
				}
			}
		},

		// 结果弹窗确认事件 防抖
		onClickPopup: debounce(function () {
			// 关闭结果弹窗
			this.setShowResultPopup(false);
			// 播放广告
			Ad.openVideoAd(this.appId, this.channelId, (orderId) => {
				// 添加广告统计次数
				this.addAdCount();
				// 隐藏倒计时关闭按钮
				this.setCountDown(false);
				// 设置领取红包状态
				this.setCanReceive(true);
				// 跳转结果页
				this.$router.replace({
					path: "/result",
					query: {
						YzAppId: this.appId,
						YzChannelId: this.channelId,
						YzAdOrderId: orderId,
						t: new Date().getTime()
					}
				});
			});
		}, 800, {'leading': true, 'trailing': false}),
	}
}
</script>
<style lang="less">
@import "../../assets/less/play.less";
</style>

