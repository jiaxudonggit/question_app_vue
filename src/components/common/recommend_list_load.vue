<!--推荐列表组件 瀑布流加载-->
<template>
	<div class="recommend-content" id="recommend-content">
		<div class="recommend-title">
			<div class="recommend-title-left">
				<img src="../../assets/images/recommend/hot.png" alt="">
				<div>热门测试</div>
			</div>
			<div class="recommend-title-right">更多好玩的测试--本产品仅供娱乐</div>
		</div>
		<div class="recommend-rows-wrap">
			<van-list class="recommend-rows-list" v-model="loading" :finished="page === total_page" finished-text="--我是有底线的--" :error.sync="error" error-text="请求失败，点击重新加载" @load="onLoad">
				<question_list_horizontal :question-list="recommend_list" @listenerQuestionListClick="onRecommendClick"></question_list_horizontal>
			</van-list>
		</div>

	</div>
</template>
<script>
import {Request} from "@/utils/utils";
import question_list_horizontal from "@/components/common/question_list_horizontal";
import {mapGetters, mapState} from "vuex";
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
	components: {
		question_list_horizontal,
	},
	data() {
		return {
			error: false,
			loading: false,
			total_page: 0,
			page: 0,
			recommend_list: []
		}
	},
	computed: {
		...mapState(["appId",]),
		...mapGetters(["appApiUrl", "appResourcesUrl", "appIconUrl"]),
	},
	created() {
		this.getRecommendData();
	},
	activated() {
		// 初始化数据
		this.page = 0;
		this.total_page = 0;
		this.recommend_list = [];
		this.getRecommendData();
	},
	methods: {
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
				url: this.appApiUrl + "/test_app/get_recommend_data_load",
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
	border-top-left-radius: 12px;
	border-top-right-radius: 12px;
	box-sizing: border-box;
	position: relative;
	margin-top: -30px;

	.recommend-title {
		width: 100%;
		padding: 0 5%;
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

		.recommend-rows-list {
			position: relative;
			width: 100%;
			box-sizing: border-box;
		}
	}
}
</style>
