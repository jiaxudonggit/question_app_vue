<template>
	<!--game推荐组件-->
	<div v-if="recommend.recommendArray.length > 0" class="recommend-content" id="recommend-content" :style="{paddingBottom: this.bottom}">
		<div class="recommend-title">
			<div class="recommend-title-left">
				<img src="../../assets/images/recommend/hot.png" alt="">
				<div>{{ recommend.title }}</div>
			</div>
			<div class="recommend-title-right">{{ recommend.desc }}</div>
		</div>
		<div class="recommend-rows-wrap">
			<div class="recommend-row" v-for="(item, index) in recommend.recommendArray" :key="index" @click="onRecommendClick(item, index)">
				<div class="recommend-row-left">
					<img class="recommend-row-icon" :src="makePictureUrl(item.icon)" alt="加载错误">
				</div>
				<div class="recommend-row-center">
					<div class="recommend-row-title"><img src="../../assets/images/recommend/new.png" alt="" v-if="item.is_new">
						<p>{{ item.title }}</p></div>
					<div class="recommend-row-desc">{{ item.desc }}</div>
					<div class="recommend-row-people-num"><img src="../../assets/images/recommend/hot2.png" alt=""><span>{{ item.peopleNum }}w人已测</span></div>
				</div>
				<div class="recommend-row-right">
					<div class="recommend-row-btn">{{ item.btnText }}</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import Vue from 'vue';
import waterfall from 'vue-waterfall2';
import {Utils} from "@/utils/Utils";
import RecordService from "@/services/record_service";

Vue.use(waterfall);


export default {
	name: "recommend-list",
	props: {
		recommend: {
			type: Object
		},
		bottom: {
			type: String,
			default: '100px',
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
	methods: {
		onRecommendClick(item, index) {
			// 记录用户点击推荐应用
			RecordService.createRecommendRecord({
				channelId: this.channelId,
				appId: this.appId,
				from_app_id: this.appId,
				to_app_id: item.appId,
				callback: () => {
					this.$emit("listenerRecommendClick", item, index);
				}
			});
		},
		// 拼接图片地址
		makePictureUrl(name) {
			return Utils.makeIconUrl(name);
		},
	}
}
</script>
<style lang="less" scoped>
.recommend-content {
	width: 100%;
	background-color: #ffffff;
	padding: 10px 20px 50px;
	border-top-left-radius: 12px;
	border-top-right-radius: 12px;
	box-sizing: border-box;
	position: relative;
	margin-top: 20px;

	.recommend-title {
		width: 100%;
		height: 50px;
		margin-bottom: 10px;
		position: relative;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;

		.recommend-title-left {
			height: 50px;
			position: relative;
			display: flex;
			flex-wrap: wrap;
			justify-content: flex-start;
			align-items: center;

			img {
				display: block;
				width: 25px;
				height: 25px;
				vertical-align: bottom;
				margin-right: 8px;
			}

			div {
				font-size: 20px;
				font-weight: 800;
				color: #670c87;
				//text-shadow: 5px 5px 5px #670c87, 0 0 2px #670c87;
			}

		}

		.recommend-title-right {
			height: 50px;
			position: relative;
			font-size: 12px;
			line-height: 50px;
			text-align: right;
			color: #959494;
			overflow: hidden; //超出的文本隐藏
			text-overflow: ellipsis; //溢出用省略号显示
			white-space: nowrap; //溢出不换行
		}
	}

	.recommend-rows-wrap {
		width: 100%;
		position: relative;

		.recommend-row {
			width: 100%;
			height: 80px;
			margin: 10px auto;
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			align-items: center;
			position: relative;

			.recommend-row-left {
				width: 80px;
				height: 100%;
				overflow: hidden;
				float: left;

				.recommend-row-icon {
					display: block;
					width: 100%;
					height: 100%;
					border-radius: 10px;
					box-sizing: border-box;
					border: 1px solid #640173;
					vertical-align: bottom;
				}
			}

			.recommend-row-center {
				width: calc(100% - 80px);
				height: 100%;
				padding: 0 8px;
				overflow: hidden;
				position: relative;
				float: left;

				.recommend-row-title {
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
						//line-height: 16px;
						//border-radius: 8px;
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

				.recommend-row-desc {
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

				.recommend-row-people-num {
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
					background-image: linear-gradient(to right, #ff6a93, #fd939b);
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

			.recommend-row-right {
				width: 80px;
				height: 100%;
				position: absolute;
				right: 0;
				bottom: 0;

				.recommend-row-btn {
					width: 80px;
					height: 30px;
					line-height: 28px;
					font-size: 12px;
					text-align: center;
					box-sizing: border-box;
					position: absolute;
					right: 0;
					bottom: 2px;
					background-color: #ffd452;
					border: 1px solid #640173;
					border-radius: 25px;
				}

			}

		}


	}


}
</style>
