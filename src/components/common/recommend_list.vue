<template>
	<!--game推荐组件-->
	<div class="recommend-content" id="recommend-content" :style="{paddingBottom: paddingBottom}">
		<div class="recommend-title">
			<div class="recommend-title-left">
				<img src="../../assets/images/recommend/hot.png" alt="">
				<div>热门测试</div>
			</div>
			<div class="recommend-title-right" @click="onRefreshClick">
				<img src="../../assets/images/recommend/refresh.png" alt="">
				<span>换一换</span>
			</div>
		</div>
		<div class="recommend-rows-wrap">
			<div class="recommend-row-block">
				<div class="recommend-row" v-for="(item, index) in recommend_list" :key="index" @click="onRecommendClick(item, index)">
					<div class="recommend-row-left">
						<img class="recommend-row-icon" :src="item.app_icon" alt="加载错误">
					</div>
					<div class="recommend-row-center">
						<div class="recommend-row-title"><img src="../../assets/images/recommend/new.png" alt="" v-if="item.is_new">
							<p>{{ item.app_name }}</p></div>
						<div class="recommend-row-desc">{{ item.app_desc }}</div>
						<div class="recommend-row-people-num"><img src="../../assets/images/recommend/hot2.png" alt=""><span>{{ item.user_number }}w人已测</span></div>
					</div>
					<div class="recommend-row-right">
						<div class="recommend-row-btn">{{ item.btn_text }}</div>
					</div>
				</div>
			</div>
			<div v-show="loading" class="recommend-content-loading">
				<div class="recommend-content-loading-inner"></div>
			</div>
		</div>
	</div>
</template>
<script>
import {Request} from "@/utils/Utils";
import {mapGetters, mapMutations, mapState} from "vuex";

export default {
	name: "recommend-list",
	props: {
		model: {
			type: String
		},
		paddingBottom: {
			type: String,
			default: '30px',
		}
	},
	data() {
		return {
			loading: false,
			recommend_list: []
		}
	},
	computed: {
		...mapState(["appId", "recommendData"]),
		...mapGetters(["appApiUrl", "appResourcesUrl", "appIconUrl", "isLogin"]),
	},
	activated() {
		this.recommend_list = [];
		this.getRecommendData();
	},
	created() {
		this.getRecommendData();
	},
	methods: {
		...mapMutations({
			changeAppending: "changeAppending",
		}),

		onRecommendClick(item, index) {
			// 记录用户点击推荐应用
			this.createRecommendRecord(this.appId, item.app_id, () => {
				this.$emit("listenerRecommendClick", item, index);
			});
		},

		onRefreshClick() {
			// 换一换
			this.getRecommendData();
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

		// 获得测一测推荐配置
		getRecommendData(callback = null) {
			// 开启加载提示框
			this.loading = true;
			Request.request({
				url: this.appApiUrl + "/test_app/get_recommend_data",
				data: {
					app_id: this.appId,
					page_name: this.model,
				},
				callback: (res, err) => {
					if (err || res.code !== 0) {
						this.loading = false;
						return this.$toast("网络错误，请稍后，" + err);
					}
					// 更新推荐列表
					for (let i = 0; i < res.body.recommend_list.length; i++) res.body.recommend_list[i].app_icon = this.appIconUrl(res.body.recommend_list[i].app_icon);
					this.recommend_list = res.body.recommend_list;
					this.loading = false;
					if (typeof callback === "function") callback();
				},
			})
		},
	}
}
</script>
<style lang="less" scoped>
.recommend-content {
	width: 100%;
	min-height: 800px;
	background-color: #ffffff;
	padding: 10px 20px 0;
	border-top-left-radius: 12px;
	border-top-right-radius: 12px;
	box-sizing: border-box;
	position: relative;
	margin-top: -30px;

	.recommend-title {
		width: 100%;
		height: 50px;
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
			color: #2c2c2c;
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			align-items: center;

			img {
				width: 15px;
				height: 15px;
				margin-right: 5px;
			}

		}
	}

	.recommend-rows-wrap {
		width: 100%;
		position: relative;

		.recommend-row-block {
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

		.recommend-content-loading {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-color: #ffffff;
			z-index: 99;

			.recommend-content-loading-inner {
				display: block;
				position: relative;
				left: 50%;
				top: 15%;
				width: 50px;
				height: 50px;
				margin: -25px 0 0 -25px;
				border-radius: 50%;
				border: 2px solid #f3730b;
				border-right-color: transparent;
				animation: spin 2s linear infinite;
			}

			.recommend-content-loading-inner:before {
				content: "";
				position: absolute;
				top: 5px;
				left: 5px;
				right: 5px;
				bottom: 5px;
				border-radius: 50%;
				border: 2px solid #f13d18;
				border-top-color: transparent;
				animation: spin 2s linear infinite;
			}

			.recommend-content-loading-inner:after {
				content: "";
				position: absolute;
				top: 15px;
				left: 15px;
				right: 15px;
				bottom: 15px;
				border-radius: 50%;
				border: 2px solid #ff1edd;
				border-bottom-color: transparent;
				animation: spin 2s linear infinite;
			}

		}

		@keyframes spin {
			0% {
				transform: rotate(0deg);
			}
			to {
				transform: rotate(1turn);
			}
		}

	}
}
</style>
