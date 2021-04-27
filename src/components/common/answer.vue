<!--suppress ALL -->
<template>
	<!--game答案组件-->
	<div class="game-question-block">
		<div class="game-question">{{ question.question_title }}</div>
		<div v-if="question.question_image" class="game-question-img">
			<img :src="question.question_image" class="animate__animated animate__flipInX" alt="">
		</div>
		<div v-if="question.question_audio" class="game-question-audio animate__animated animate__flipInX">
			<audio-player
				ref="audioPlayer"
				:audio-list="[question.question_audio]"
				:show-prev-button="false"
				:show-next-button="false"
				:show-volume-button="false"
				:show-playback-rate="false"
				:progress-interval="100"
				:theme-color="'#ffffff'"
				:isLoop="false"
			/>
		</div>
		<div v-if="question.question_video" class="game-question-video animate__animated animate__flipInX">
			<video-player class="video-player vjs-custom-skin game-question-video-inner" ref="bannerVideoPlayer" :playsinline="true" :options="videoOption(question.question_video)">
			</video-player>
		</div>
		<div class="game-question-answers">
			<!--图片-->
			<div v-for="(item, index) in imageAnswers" :key="index" @click="onAnswerClick(item, index)" class="game-question-answer-img animate__animated" :class="imageAnimate" v-press>
				<img :src="item.answer_image" alt="">
				<div></div>
			</div>
			<!--文字-->
			<div v-for="(item, index) in textAnswers" :key="index" @click="onAnswerClick(item, index)" class="game-question-answer-text animate__animated" :class="index % 2 === 0 ? 'animate__bounceInRight' : 'animate__bounceInLeft'" v-change>
				{{ item.answer_title }}
			</div>
		</div>
		<div class="game-answer">

		</div>
	</div>
</template>
<script>
import lodash from "lodash";
import {mapGetters, mapState} from "vuex";
import {Request} from "@/utils/Utils";
import AudioPlayer from '@liripeng/vue-audio-player'
import {videoPlayer} from 'vue-video-player'
import '@liripeng/vue-audio-player/lib/vue-audio-player.css'
import 'video.js/dist/video-js.css'

export default {
	name: "answer",
	props: {
		question: {
			type: Object
		},
		model: {
			type: String
		}
	},
	components: {
		AudioPlayer,
		videoPlayer
	},
	computed: {
		...mapState(["appId", "channelId"]),
		...mapGetters(["appApiUrl", "appResourcesUrl"]),
		imageAnswers: function () {
			return this.question.question_answers.filter(function (answer) {
				return answer.answer_image
			})
		},
		textAnswers: function () {
			return this.question.question_answers.filter(function (answer) {
				return answer.answer_title
			})
		},
		videoOption() {
			return function (url) {
				return {
					playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放速度
					autoplay: false, // 如果为true,浏览器准备好时开始回放。
					muted: false, // 默认情况下将会消除任何音频。
					loop: false, // 是否视频一结束就重新开始。
					preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
					language: 'zh-CN',
					// aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
					fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
					sources: [{
						type: "video/mp4", // 类型
						src: url, // url地址
					}],
					poster: require("@/assets/images/play/video_default.jpg"), // 封面地址
					notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
					controlBar: {
						timeDivider: true, // 当前时间和持续时间的分隔符
						durationDisplay: true, // 显示持续时间
						remainingTimeDisplay: true, // 是否显示剩余时间功能
						fullscreenToggle: true // 是否显示全屏按钮
					}
				}
			}
		},
	},
	data() {
		return {
			animateArray: [
				"animate__bounceInLeft",
				"animate__shakeX",
				"animate__shakeY",
				"animate__bounce",
				"animate__swing",
				"animate__headShake",
				"animate__tada",
				"animate__wobble",
				"animate__flipInX",
				"animate__flipInY",
			],
			imageAnimate: "animate__flipInX",
		}
	},
	directives: {
		press: {
			inserted(element) {
				element.addEventListener('touchstart', () => {
					// 用bind时，vue还没插入到dom,故dom获取为 undefine，用 inserted 代替 bind,也可以开个0秒的定时器
					element.children.item(1).style.display = "block";
				}, false);

				element.addEventListener('touchend', function () {
					element.children.item(1).style.display = "none";
				}, false)
			}
		},

		change: {
			inserted(element) {
				element.addEventListener('touchstart', () => {
					// 用bind时，vue还没插入到dom,故dom获取为 undefine，用 inserted 代替 bind,也可以开个0秒的定时器
					let classVal = element.getAttribute("class");
					classVal = classVal.replace("game-question-answer-text", "game-question-answer-text-active");
					element.setAttribute("class", classVal);
				}, false);

				element.addEventListener('touchend', function () {
					let classVal = element.getAttribute("class");
					classVal = classVal.replace("game-question-answer-text-active", "game-question-answer-text");
					element.setAttribute("class", classVal);
				}, false)
			}
		},
	},
	created() {
		this.imageAnimate = this.animateArray.randomElement();
	},
	methods: {

		onAnswerClick: lodash.debounce(function (item, index) {
			// 创建用户答题记录
			this.createAnswerRecord(item);
			this.$emit("listenerAnswerClick", item, index);
		}, 200),

		// 创建用户答题记录
		createAnswerRecord(item, callback) {
			Request.request({
				url: this.appApiUrl + "/test_app/create_question_record",
				data: {
					app_id: this.appId,
					question_id: item.question_id,
					answer_id: item.answer_id,
				},
				callback: callback,
			})
		},
	}
}
</script>
<style lang="less" scoped>
.game-question-block {
	width: 100%;
	padding: 0 20px;
	position: relative;
	box-sizing: border-box;

	.game-question {
		width: 100%;
		box-sizing: border-box;
		margin-bottom: 15px;
		font-size: 20px;
		color: #ffffff;
		text-align: center;
		line-height: 40px;
		word-wrap: break-word;
		word-break: break-all;
	}

	.game-question-img {
		width: 60%;
		margin: 15px auto;

		img {
			width: 100%;
			height: 100%;
			display: block;
		}
	}

	.game-question-audio {
		width: 80%;
		margin: 0 auto 15px;
		padding: 15px 25px 5px;
		position: relative;
		border-radius: 10px;
		overflow: hidden;
		background-image: linear-gradient(to bottom, #6b78ec, #54b5db, #6eeea1);
		box-shadow: 3px 4px 4px -1px rgba(0, 0, 0, .4);
	}

	.game-question-video {
		width: 80%;
		margin: 0 auto 15px;
		position: relative;
		position: relative;
		border-radius: 10px;
		overflow: hidden;
		background-image: linear-gradient(to bottom, #6b78ec, #54b5db, #6eeea1);
		box-shadow: 3px 4px 4px -1px rgba(0, 0, 0, .4);

		.game-question-video-inner {
			width: 100%;
		}
	}

	.game-question-answers {
		width: 100%;
		position: relative;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		box-sizing: border-box;

		.game-question-answer-img {
			width: 130px;
			height: 130px;
			position: relative;
			margin: 8px;
			border-radius: 40px;
			overflow: hidden;
			border: 3px solid #ffffff;
			box-sizing: border-box;

			img {
				width: 100%;
				height: 100%;
				display: block;
			}

			div {
				width: 100%;
				height: 100%;
				background-color: rgba(98, 196, 131, .7);
				position: absolute;
				top: 0;
				left: 0;
				display: none;
			}
		}

		.game-question-answer-text {
			width: 85%;
			height: 50px;
			position: relative;
			box-sizing: border-box;
			margin: 10px auto;
			padding: 12.5px 10px;
			color: #000000;
			font-size: 13px;
			text-align: center;
			overflow-wrap: break-word;
			line-height: 25px;
			background-image: url("../../assets/images/play/answer-bg.png");
			background-size: 100% 100%;
			background-repeat: no-repeat;
		}

		.game-question-answer-text-active {
			width: 85%;
			height: 50px;
			position: relative;
			box-sizing: border-box;
			margin: 10px auto;
			padding: 12.5px 10px;
			color: #000000;
			font-size: 13px;
			text-align: center;
			overflow-wrap: break-word;
			line-height: 25px;
			background-image: url("../../assets/images/play/answer-bg-actived.png");
			background-size: 100% 100%;
			background-repeat: no-repeat;
		}

	}

}

</style>
<style>
.audio__progress-wrap {
	margin-top: 10px !important;
}

.video-player .vjs-big-play-button {
	font-size: 3em !important;
	line-height: 40px !important;
	height: 40px !important;
	width: 40px !important;
	position: absolute !important;
	top: calc((100% - 40px) / 2) !important;
	left: calc((100% - 40px) / 2) !important;
	border: none !important;
	background-color: #525a66 !important;
	background-color: rgba(43, 51, 63, 0.6) !important;
	border-radius: 25px !important;
}
</style>
