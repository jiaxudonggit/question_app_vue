<template>
	<!--game推荐组件-->
	<div class="recommend-content" id="recommend-content">
		<div class="recommend-title">
			<div class="recommend-title-left">
				<img src="../../assets/images/recommend/hot.png" alt="">
				<div>热门测试</div>
			</div>
			<div class="recommend-title-right">更多好玩的测试--本产品仅供娱乐</div>
		</div>
		<div class="recommend-rows-wrap">
			<van-list v-model="loading" :finished="page === total_page" :error.sync="error" error-text="请求失败，点击重新加载" @load="onLoad">
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
			</van-list>
		</div>

	</div>
</template>
<script>
import {Request} from "@/utils/Utils";
import {mapGetters, mapMutations, mapState} from "vuex";
import Vue from 'vue';
import {List} from 'vant';

Vue.use(List);


export default {
	name: "recommend-list",
	props: {
		model: {
			type: String
		},
	},
	data() {
		return {
			col: 1,
			isRequesting: false,
			error: false,
			loading: false,
			total_page: 0,
			page: 0,
			recommend_list: []
		}
	},
	computed: {
		...mapState(["appId", "recommendData"]),
		...mapGetters(["appApiUrl", "appResourcesUrl", "appIconUrl", "isLogin"]),
	},
	activated() {
		this.total_page = 0;
		this.page = 0;
		this.recommend_list = [];
		this.getRecommendData();
	},
	created() {
		this.getRecommendData();
	},
	methods: {
		...mapMutations({
			updateRecommendData: "updateRecommendData",
		}),

		onRecommendClick(item, index) {
			// 记录用户点击推荐应用
			this.createRecommendRecord(this.appId, item.app_id, () => {
				this.$emit("listenerRecommendClick", item, index);
			});
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
			Request.request({
				url: this.appApiUrl + "/test_app/get_recommend_data",
				data: {
					app_id: this.appId,
					page: this.page + 1,
					page_name: this.model,
				},
				callback: (res, err) => {
					if (err || res.code !== 0) return this.error = true;
					// 更新推荐列表
					this.total_page = res.body.total_page;
					this.page = res.body.page;
					for (let i = 0; i < res.body.recommend_list.length; i++) res.body.recommend_list[i].app_icon = this.appIconUrl(res.body.recommend_list[i].app_icon);
					this.recommend_list = this.recommend_list.concat(res.body.recommend_list);
					if (typeof callback === "function") callback();
				},
			})
		},

		onLoad() {
			// 异步更新数据
			setTimeout(() => {
				this.getRecommendData(() => {
					// 加载状态结束
					this.loading = false;
				});
			}, 1000);
		},

	}
}
</script>
<style lang="less" scoped>
.recommend-content {
	width: 100%;
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
			color: #959494;
			overflow: hidden; //超出的文本隐藏
			text-overflow: ellipsis; //溢出用省略号显示
			white-space: nowrap; //溢出不换行
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
	}
}
</style>
