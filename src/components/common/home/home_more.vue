<!--更多好玩组件-->
<template>
	<div class="home-more-block">
		<div class="home-more-top">
			<div class="home-more-title"><img src="../../../assets/images/home/more.png" alt=""><span>更多好玩</span></div>
		</div>
		<div class="home-more-center">
			<van-list class="home-more-list" v-model="loading" :finished="page === total_page" finished-text="--我是有底线的--" :error.sync="error" error-text="请求失败，点击重新加载" @load="onLoad">
				<question_list_horizontal :question-list="moreList" :user-bg-color="'background-color: #6e88ff;'" @listenerQuestionListClick="onMoreClick"></question_list_horizontal>
			</van-list>
		</div>
	</div>
</template>
<script>
import question_list_horizontal from "@/components/common/question_list_horizontal";
import {mapGetters} from "vuex";
import {Request} from "@/utils/Utils";
import Vue from 'vue';
import {List} from 'vant';

Vue.use(List);

export default {
	name: "home-more",
	props: {
		model: {
			type: String,
			default: "home",
		},
	},
	components: {
		question_list_horizontal,
	},
	data() {
		return {
			moreList: [],
			error: false,
			loading: false,
			total_page: 0,
			page: 0,
		}
	},
	computed: {
		...mapGetters(["appApiUrl", "appResourcesUrl", "appIconUrl", "isLogin"]),
	},
	created() {
		this.getMoreData();
	},
	activated() {
		// 初始化数据
		this.page = 0;
		this.total_page = 0;
		this.moreList = []
		this.getMoreData();
	},
	methods: {
		onMoreClick(item, index) {
			this.$emit("listenerMoreClick", item, index);
		},

		// 获得测一测推荐配置
		getMoreData(callback = null) {
			Request.request({
				url: this.appApiUrl + "/test_app/get_app_with_more",
				data: {
					page: this.page + 1,
					page_name: this.model,
				},
				callback: (res, err) => {
					if (err || res.code !== 0) return this.error = true;
					// 更新推荐列表
					this.total_page = res.body.total_page;
					this.page = res.body.page;
					for (let i = 0; i < res.body.app_list.length; i++) res.body.app_list[i].app_icon = this.appIconUrl(res.body.app_list[i].app_icon);
					this.moreList = this.moreList.concat(res.body.app_list);
					if (typeof callback === "function") callback();
				},
			})
		},

		onLoad() {
			// 异步更新数据
			setTimeout(() => {
				this.getMoreData(() => {
					// 加载状态结束
					this.loading = false;
				});
			}, 1000);
		},
	}
}
</script>
<style lang="less" scoped>
.home-more-block {
	width: 100%;
	position: relative;
	box-sizing: border-box;

	.home-more-top {
		padding: 0 5%;
		width: 100%;
		height: 50px;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;

		.home-more-title {
			height: 50px;
			position: relative;
			display: flex;
			flex-wrap: wrap;
			justify-content: left;
			align-items: center;

			img {
				display: block;
				width: 20px;
				height: 20px;
				margin: 15px 5px 15px 0;
			}

			span {
				display: block;
				font-size: 18px;
				font-weight: 800;
				color: #070707;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;

			}

		}

		.home-more-tip {
			height: 50px;
			position: relative;
			font-size: 12px;
			line-height: 50px;
			text-align: right;
			color: #969696;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;

		}

	}

	.home-more-center {
		width: 100%;
		position: relative;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;

		.home-more-list {
			position: relative;
			box-sizing: border-box;
			width: 100%;
		}

	}
}
</style>
