<!--suppress ALL -->
<template>
	<!--game答案组件-->
	<div class="answer-img-block">
		<div class="game-subject">{{ subject.subject }}</div>
		<div class="game-answer">
			<div class="game-answer-img animate__animated" :class="animateClass" v-for="(item, index) in subject.answers" :key="index" @click="onImageBlockClick(item, index)" v-press>
				<img :src="makePictureUrl(item.name)" alt="">
				<div></div>
			</div>
		</div>
	</div>
</template>
<script>

import {Utils} from "@/utils/Utils";
import RecordService from "@/services/record_service";

export default {
	name: "answer-img-block",
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
			model: 'subject',
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
	},
	created() {
		console.log(this.channelId, this.appId)
		this.animateClass = this.animateArray.randomElement();
	},
	methods: {
		onImageBlockClick(item, index) {
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
.answer-img-block {
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

	.game-answer {
		width: 100%;
		position: relative;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		box-sizing: border-box;

		.game-answer-img {
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

	}

}

</style>
