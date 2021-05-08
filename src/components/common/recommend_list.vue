<!--推荐列表组件 随机权重算法-->
<template>
	<div class="recommend-content" id="recommend-content">
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
		<div class="recommend-rows-wrap" :style="{paddingBottom: paddingBottom, minHeight: (90 * recommendNumber + parseFloat(paddingBottom)) + 'px'}">
			<question_list_horizontal v-if="!loading" :question-list="recommend_list" @listenerQuestionListClick="onRecommendClick"></question_list_horizontal>
			<div v-show="loading" class="recommend-content-loading">
				<div class="recommend-content-loading-inner"></div>
			</div>
			<p class="recommend-content-tip">--我是有底线的--</p>
		</div>
	</div>
</template>
<script>

import debounce from "lodash.debounce";
import {mapGetters, mapMutations, mapState} from "vuex";
import question_list_horizontal from "@/components/common/question_list_horizontal";

export default {
	name: "recommend-list",
	props: {
		model: {
			type: String
		},
		paddingBottom: {
			type: String,
			default: '30px',
		},
		recommendNumber:{
			type: Number,
			default: 10,
		}
	},
	components: {
		question_list_horizontal,
	},
	data() {
		return {
			loading: false,
			recommend_list: []
		}
	},
	computed: {
		...mapState(["appId", "recommendData"]),
		...mapGetters(["appApiUrl", "appResourcesUrl", "appIconUrl"]),
	},
	created() {
		this.getRecommendData();
	},
	activated() {
		this.recommend_list = [];
		this.getRecommendData();
	},
	methods: {

		// 推荐应用点击事件
		onRecommendClick: debounce(function (item, index) {
			// 记录用户点击推荐应用
			this.$api.request.createRecommendRecord({
				from_app_id: this.appId,
				to_app_id: item.app_id,
			})
			this.$emit("listenerRecommendClick", item, index);
		}, 800, {'leading': true, 'trailing': false}),

		// 换一换
		onRefreshClick: debounce(function () {
			if (!this.loading) this.getRecommendData();
		}, 800, {'leading': true, 'trailing': false}),

		// 获得测一测推荐配置
		getRecommendData(callback = null) {
			// 开启加载提示框
			this.loading = true;
			this.$api.request.getRecommendData({
				app_id: this.appId,
				page_name: this.model,
			}).then(data=>{
				// 更新推荐列表
				for (let i = 0; i < data.body.recommend_list.length; i++) data.body.recommend_list[i].app_icon = this.appIconUrl(data.body.recommend_list[i].app_icon);
				this.recommend_list = data.body.recommend_list;
				if (typeof callback === "function") callback();
			}).finally(()=>{
				this.$nextTick(() => {
					this.loading = false;
				});
			})
		},
	}
}
</script>
<style lang="less" scoped>
.recommend-content {
	width: 100%;
	background-color: #ffffff;
	padding: 10px 0 0;
	border-top-left-radius: 12px;
	border-top-right-radius: 12px;
	box-sizing: border-box;
	position: relative;
	margin-top: -30px;

	.recommend-title {
		width: 100%;
		height: 50px;
		padding: 0 5%;
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
		box-sizing: border-box;
		position: relative;

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
				top: 25%;
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

		.recommend-content-tip {
			position: absolute;
			bottom: 3px;
			width: 100%;
			height: 20px;
			font-size: 14px;
			color: #525a66;
			text-align: center;
			line-height: 20px;
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
