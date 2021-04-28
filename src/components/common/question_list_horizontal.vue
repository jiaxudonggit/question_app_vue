<!-- 题目列表 横向-->
<template>
	<div class="question-block">
		<div class="question-row" v-for="(item, index) in questionList" :key="index" @click="onQuestionListClick(item, index)" :style="{background: bgColor ? bgColorArray.randomElement() : ''}">
			<div class="question-row-left">
				<img class="question-row-icon" :src="item.app_icon" alt="加载错误">
			</div>
			<div class="question-row-center">
				<div class="question-row-title"><img src="../../assets/images/recommend/new.png" alt="" v-if="item.is_new">
					<p>{{ item.app_name }}</p></div>
				<div class="question-row-desc">{{ item.app_desc }}</div>
				<div class="question-row-people-num" :style="userBgColor"><img src="../../assets/images/recommend/hot2.png" alt=""><span>{{ item.user_number }}w人已测</span></div>
			</div>
			<div class="question-row-right">
				<div class="question-row-btn">{{ item.btn_text }}</div>
			</div>
		</div>
	</div>
</template>
<script>

export default {
	name: "question-list",
	props: {
		questionList: {
			type: Array
		},
		userBgColor: {
			type: String,
			default: "background-image: linear-gradient(to right, #ff6a93, #fd939b);",
		},
		bgColor: {
			type: Boolean,
			default: false,
		}
	},
	data() {
		return {
			bgColorArray: [
				'linear-gradient(to top right, #ffffff, #ffffff,#ffffff, rgba(207, 63, 232, 0.3))',
				'linear-gradient(to top right, #ffffff, #ffffff,#ffffff, rgba(2, 180, 250, 0.3))',
				'linear-gradient(to top right, #ffffff, #ffffff,#ffffff, rgba(253, 187, 15, 0.3))',
				'linear-gradient(to top right, #ffffff, #ffffff,#ffffff, rgba(88, 255, 0, 0.3))',
			]
		}
	},
	methods: {
		// 点击事件
		onQuestionListClick(item, index) {
			this.$emit("listenerQuestionListClick", item, index);
		},
	}
}
</script>
<style lang="less" scoped>
.question-block {
	width: 100%;
	padding-left: 5%;
	position: relative;
	box-sizing: border-box;

	.question-row {
		width: 100%;
		height: 80px;
		margin: 0 auto 10px;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		position: relative;
	}

	.question-row-left {
		width: 80px;
		height: 100%;
		overflow: hidden;
		float: left;

		.question-row-icon {
			display: block;
			width: 100%;
			height: 100%;
			border-radius: 10px;
			box-sizing: border-box;
			border: 1px solid #640173;
			vertical-align: bottom;
		}
	}

	.question-row-center {
		width: calc(100% - 80px);
		height: 100%;
		padding: 0 8px;
		overflow: hidden;
		position: relative;
		float: left;

		.question-row-title {
			width: 100%;
			height: 30px;
			position: relative;
			box-sizing: border-box;
			display: flex;
			flex-wrap: wrap;
			justify-content: flex-start;
			align-items: center;

			img {
				height: 16px;
				box-sizing: border-box;
				display: block;
				margin-right: 5px;
			}

			p {
				width: calc(100% - 40px);
				display: block;
				font-size: 16px;
				line-height: 30px;
				text-align: left;
				color: #161616;
				overflow: hidden; //超出的文本隐藏
				text-overflow: ellipsis; //溢出用省略号显示
				white-space: nowrap; //溢出不换行
			}
		}

		.question-row-desc {
			height: 25px;
			width: calc(100% - 80px);
			font-size: 12px;
			line-height: 25px;
			text-align: left;
			color: #959494;
			overflow: hidden; //超出的文本隐藏
			text-overflow: ellipsis; //溢出用省略号显示
			white-space: nowrap; //溢出不换行
		}

		.question-row-people-num {
			height: 20px;
			padding: 0 8px 0 3px;
			box-sizing: border-box;
			font-size: 12px;
			line-height: 20px;
			text-align: left;
			color: #ffffff;
			border-radius: 10px;
			position: absolute;
			bottom: 0;
			display: flex;
			flex-wrap: wrap;
			justify-content: flex-start;
			align-items: center;

			img {
				display: inline-block;
				width: 15px;
				height: 15px;
				margin-right: 2px;
				margin-top: -2px;
			}

			span {
				line-height: 20px;
				display: inline-block;
			}
		}
	}

	.question-row-right {
		width: 80px;
		height: 100%;
		position: absolute;
		right: 5%;
		bottom: 0;

		.question-row-btn {
			width: 80px;
			height: 25px;
			line-height: 23px;
			font-size: 12px;
			text-align: center;
			box-sizing: border-box;
			position: absolute;
			right: 0;
			bottom: 0;
			background-color: #ffd452;
			border: 1px solid #640173;
			border-radius: 25px;
		}

	}

}

</style>
