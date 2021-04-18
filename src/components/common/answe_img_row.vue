<template>
	<!--game答案组件-->
	<div class="answer-img-row">
		<div class="game-subject">{{ subject.subject }}</div>
		<div v-if="subject.subjectImg" class="game-answer-img">
			<img :src="makePictureUrl(subject.subjectImg)" class="animate__animated animate__flipInX" alt="">
		</div>
		<div class="game-answer">
			<div v-for="(item, index) in subject.answers" class="game-answer-inner animate__animated" :class="index % 2 === 0 ? 'animate__bounceInRight' : 'animate__bounceInLeft'" :key="index" @click="onImageRowClick(item, index)" v-press>
				<img :src="answerBg" alt="">
				<div><span>{{ item.name }}</span></div>
			</div>
		</div>
	</div>
</template>
<script>

import {Utils} from "@/utils/Utils";
import RecordService from "@/services/record_service";

export default {
	name: "answer-img-row",
	props: {
		subject: {
			type: Object
		},
	},
	computed: {
		appId() {
			return this.$route.query.YzAppId;
		},
		channelId() {
			return this.$route.query.YzChannelId;
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
			animateClass: "animate__flipInX",
			answerBg: require("@/assets/images/game/answer-bg.png"),
			model: 'subject',
		}
	},
	directives: {
		press: {
			inserted(element) {
				element.addEventListener('touchstart', () => {
					// 用bind时，vue还没插入到dom,故dom获取为 undefine，用 inserted 代替 bind,也可以开个0秒的定时器
					element.children.item(0).setAttribute("src", require("@/assets/images/game/answer-bg-actived.png"))
					// e.preventDefault()
				}, false);

				element.addEventListener('touchend', function () {
					element.children.item(0).setAttribute("src", require("@/assets/images/game/answer-bg.png"))
					// e.preventDefault()
				}, false)
			}
		},
	},
	created() {
		console.log(this.channelId, this.appId)
		this.animateClass = this.animateArray.randomElement();
	},
	methods: {
		onImageRowClick(item, index) {
			// 创建用户答题记录
			RecordService.createAnswerRecord({
				channelId: this.channelId,
				appId: this.appId,
				subject_id: this.subject.subjectId,
				answer_id: item.answerId,
				callback: () => {
					this.$emit("listenerAnswerClick", item, index);
				}
			});
		},
		// 拼接图片地址
		makePictureUrl(name) {
			return Utils.makePictureUrl(this.appId, this.model, name);
		},
	}
}
</script>
<style lang="less" scoped>
.answer-img-row {
	width: 100%;
	padding: 0 20px;
	position: relative;
	box-sizing: border-box;

	.game-subject {
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

	.game-answer-img {
		width: 60%;
		margin: 15px auto;

		img {
			width: 100%;
			height: 100%;
			display: block;
		}
	}

	.game-answer {
		width: 85%;
		margin: 0 auto;
		position: relative;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		box-sizing: border-box;

		.game-answer-inner {
			width: 100%;
			position: relative;
			box-sizing: border-box;
			display: flex;
			flex-wrap: wrap;
			justify-content: flex-start;
			align-items: center;
			margin: 10px auto;

			img {
				display: block;
				width: 100%;
			}

			div {
				width: 100%;
				height: 100%;
				position: absolute;
				top: 0;
				left: 0;
				display: flex;
				flex-wrap: wrap;
				justify-content: center;
				align-items: center;

				span {
					display: block;
					font-size: 18px;
					color: #000000;
					letter-spacing: 2px;
				}
			}
		}
	}

}

</style>
