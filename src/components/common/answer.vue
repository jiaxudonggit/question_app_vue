<!--suppress ALL -->
<template>
	<!--game答案组件-->
	<div class="game-question-block">
		<div class="game-question">{{ question.question_title }}</div>
		<div v-if="question.question_image" class="game-question-img">
			<img :src="appResourcesUrl(model, question.question_image)" class="animate__animated animate__flipInX" alt="">
		</div>
		<div v-if="question.question_audio" class="game-question-audio">
			<mini-audio :audio-source="appResourcesUrl(model,question.question_audio)" html5="true"></mini-audio>
		</div>
		<div v-if="question.question_video" class="game-question-video">
			<img :src="appResourcesUrl(model,question.question_video)" class="animate__animated animate__flipInX" alt="">
		</div>
		<div class="game-question-answers">
			<!--图片-->
			<div v-for="(item, index) in imageAnswers" :key="index" @click="onAnswerClick(item, index)" class="game-question-answer-img animate__animated" :class="imageAnimate" v-press>
				<img :src="appResourcesUrl(model,item.answer_image)" alt="">
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

import {mapGetters, mapState} from "vuex";
import Vue from 'vue'
import VueAudio from 'vue-audio-better';
import {Request} from "@/utils/Utils";

Vue.use(VueAudio)

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
		}
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
		onAnswerClick(item, index) {
			// 创建用户答题记录
			this.createAnswerRecord(item, () => {
				this.$emit("listenerAnswerClick", item, index);
			});
		},

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
		width: 60%;
		margin: 15px auto;

	}

	.game-question-video {
		width: 60%;
		margin: 15px auto;

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
			width: 100%;
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
