<template>
	<!--game组件-->
	<div id="game" class="game"  :style="{backgroundColor: $store.state.appConfig.answerConfig.backgroundColor}">
		<div class="game-header fixed-fix">
			<div class="game-header-back" @click="onClickBack"><img src="../../assets/images/game/back.png" alt=""></div>
			<div class="game-header-title">答题中</div>
		</div>
		<div class="game-content" :style="{minHeight: availHeight + 'px'}">
			<div class="game-title-wrap">
				<img src="../../assets/images/game/game-title.png" alt="">
				<div class="game-title">
					<div class="game-title-headimg">
						<img src="../../assets/images/game/game-title-head.png" alt="">
					</div>
					<div class="game-title-text">{{ $store.state.appConfig.answerConfig.title }}</div>
				</div>
			</div>
			<div class="game-progress-wrap">
				<div class="game-progress">
					<div class="game-progress-inner" :style="{width: subjects.length > 0 ? (((countIndex + 1) / (subjects.length) * 100) + '%') : '0%'}"></div>
				</div>
				<div v-if="subjects.length > 0" class="game-progress-text" v-html="`${countIndex + 1}/${subjects.length}`"></div>
			</div>
			<div class="game-answer-wrap">
				<answer_img_block v-if="subject.type === 1 && showAnswer" :subject="subject" v-on:listenerAnswerClick="onClickAnswer"></answer_img_block>
				<answer_img_row v-if="subject.type === 2 && showAnswer" :subject="subject" v-on:listenerAnswerClick="onClickAnswer"></answer_img_row>
			</div>
			<div class="game-barrage-wrap">
				<vue-baberrage :throttle-gap="$store.state.barrageConfig.throttleGap" :lanes-count="$store.state.barrageConfig.lanesCount" :is-show="$store.state.baseConfig.isShowBarrage" :barrage-list="$store.state.barrageConfig.barrageList" :loop="$store.state.barrageConfig.barrageLoop"></vue-baberrage>
			</div>
		</div>
		<result_dialog v-if="showResultDialog" :show="showResultDialog" v-on:confirm="confirmDialog"></result_dialog>
	</div>
</template>
<script>
import Vue from 'vue';
import {vueBaberrage} from 'vue-baberrage';
import answer_img_block from '@/components/common/answe_img_block';
import answer_img_row from '@/components/common/answe_img_row';
import result_dialog from '@/components/common/result_dialog';
import AdUtils from "@/utils/AdUtils";

Vue.use(vueBaberrage);

export default {
	inject: ['reload', 'initData'],
	components: {
		answer_img_block,
		answer_img_row,
		result_dialog,
	},
	data() {
		return {
			showAnswer: true,
			countIndex: 0,
			currentId: 0,
			fractionArray: [],
			resultId: null,
			subject: {},
			showResultDialog: false,
			availHeight: window.screen.availHeight,
		}
	},
	computed: {
		appId() {
			return this.$route.query.YzAppId;
		},
		channelId() {
			return this.$route.query.YzChannelId;
		},
		subjects() {
			return this.$store.state.appConfig.answerConfig.subjects || [];
		},
		fraction() {
			let result = 0;
			for (let i = this.fractionArray.length - 1; i >= 0; i--) result += parseFloat(this.fractionArray[i]);
			return result;
		},
	},
	watch: {
		subjects() {
			console.log("========game.subjects.changed=========");
			this.getSubject(0);
		},
		appId(newValue) {
			console.log("========game.appId.changed=========");
			this.initData(newValue, false);
		},
		channelId(newValue) {
			console.log("========game.channelId.changed=========");
			this.$store.commit("setChannelId", newValue)
		}
	},
	mounted () {
		const that = this
		window.onresize = () => {
			return (() => {
				that.availHeight = window.screen.availHeight;
			})()
		}
	},
	activated() {
		console.log("====game.activated=====")
		// 初始化数据
		this.resultId = null;
		this.countIndex = 0;
		this.fractionArray = [];
		// 获得题目
		this.getSubject(0);
		// 打开banner广告
		AdUtils.openBannerAd(this.appId);
	},
	deactivated() {
		console.log("====game.deactivated=====")
		// 关闭banner广告
		AdUtils.closeBannerAd();
	},
	methods: {

		// 获得指定题目
		getSubject(countIndex = null) {
			if (countIndex === null) countIndex = 0;
			if (this.subjects.length <= countIndex) return;
			this.showAnswer = false;
			this.countIndex = countIndex;
			this.subject = this.subjects[this.countIndex];
			this.$nextTick(() => {
				this.showAnswer = true;
			});
		},

		// 返回按钮
		onClickBack() {
			// 关闭banner广告
			AdUtils.closeBannerAd(() => {
				this.$router.replace({path: "/", query: {YzAppId: this.appId, YzChannelId: this.channelId}});
			});
		},

		// 答案点击事件
		onClickAnswer(item) {
			// 将每道题答案的分数加入分数数组中，分数数组长度不可超过题目数量。
			if (this.fractionArray.length < this.subjects.length) this.fractionArray.push(item.fraction);

			if (item.resultId.length > 0) {
				// 指定了结果的答案， 直接跳转对应结果
				this.resultId = item.resultId.randomElement();
				this.showResultDialog = true; // 显示结果跳转dialog

			} else if (item.jumpIndex !== null) {
				// 指定了要跳转题目的答案， 跳转对应题目
				this.getSubject(item.jumpIndex - 1);
			} else {
				// 普通答案
				if (this.countIndex + 1 === this.subjects.length) {
					// 此处为最后一题，说明并未指定对应结果，需要使用分数判定结果
					console.log("当前总共得分：" + this.fraction);
					this.resultId = this.getResultIdByFraction();
					this.showResultDialog = true; // 显示结果跳转dialog
				} else {
					// 此处为普通题目，顺序获取下一题即可
					this.getSubject(this.countIndex + 1);
				}
			}
		},

		// 根据分数获得结果
		getResultIdByFraction() {
			let resultObject = this.$store.state.appConfig.resultConfig.resultObject;
			for (let k in resultObject) {
				let maxFraction = parseFloat(resultObject[k].maxFraction), minFraction = parseFloat(resultObject[k].minFraction);
				if (this.fraction >= minFraction && this.fraction <= maxFraction) return resultObject[k].resultId;
			}
			return "100001";
		},

		// 结果弹窗确认事件
		confirmDialog() {
			this.showResultDialog = false;
			AdUtils.openVideoAd(this.appId, () => {
				this.$router.replace({
					path: "/result",
					query: {
						YzAppId: this.appId,
						YzChannelId: this.channelId,
						resultId: this.resultId,
						fraction: this.fraction
					}
				});
			});
		},
	}
}
</script>
<style lang="less">
@import "../../assets/less/game.less";
</style>

