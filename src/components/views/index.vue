<template>
	<!--index组件-->
	<div id="index" class="index" :style="{backgroundColor: indexData.bg_color}">
		<div class="index-content" :style="{minHeight: availHeight + 'px'}">
			<div class="index-bg-images">
				<img v-for="(item, index) in indexData.bg_images" :src="appResourcesUrl(model,item)" alt="" :key="index">
			</div>
			<div v-if="indexData.show_describes" class="index-content-describes-wrap" :style="{backgroundColor: indexData.bg_color}">
				<div class="index-content-title" :style="{color: indexData.title_color}">{{ indexData.title }}</div>
				<div class="index-content-describes" :style="{color: indexData.title_color}">{{ indexData.describes }}</div>
				<div class="index-content-describes-box" :style="{backgroundColor: indexData.box_color}">
					<div class="index-content-describes-cell">
						<div class="index-content-describes-item">
							<div class="index-content-describes-item-top" :style="{color: indexData.describes_color}">
								<span>{{ indexData.question_number }}</span>道
							</div>
							<div class="index-content-describes-item-bottom">测试题目</div>
						</div>
					</div>
					<div class="index-content-describes-cell">
						<div class="index-content-describes-item">
							<div class="index-content-describes-item-top" :style="{color: indexData.describes_color}">
								<span>{{ indexData.user_number }}</span>W
							</div>
							<div class="index-content-describes-item-bottom">参与测试</div>
						</div>
					</div>
					<div class="index-content-describes-cell">
						<div class="index-content-describes-item">
							<div class="index-content-describes-item-top" :style="{color: indexData.describes_color}">
								<span>{{ indexData.evaluate }}</span>%
							</div>
							<div class="index-content-describes-item-bottom">好评率</div>
						</div>
					</div>
				</div>
				<div class="index-content-describes-images">
					<img v-for="(item, index) in indexData.describes_images" :src="appResourcesUrl(model,item)" alt="" :key="index">
				</div>
			</div>
			<recommend_list v-if="isLogin" :model="model" v-on:listenerRecommendClick="onClickRecommend"></recommend_list>
		</div>
		<div class="index-btn-wrap fixed-fix" @click="$router.push({path: '/game', query: {YzAppId: appId, YzChannelId: channelId}})">
			<img class="index-btn" :src="appResourcesUrl(model, indexData.button_image)" alt="">
		</div>
		<div v-if="indexData.show_recommend_list && indexData.show_more_btn" class="index-more-btn animate__animated animate__bounceIn" @click="onClickMoreRecommend">
			<img src="../../assets/images/index/more.png" alt="">
		</div>
	</div>
</template>
<script>
import recommend_list from "@/components/common/recommend_list";
import {Request} from "@/utils/Utils";
import {mapGetters, mapMutations, mapState} from "vuex";

export default {
	inject: ['reload', "autoLogin"],
	components: {
		recommend_list,
	},
	data() {
		return {
			model: "index",
		}
	},
	computed: {
		...mapState(["isAppending", "appId", "channelId", "availHeight", "indexData", "isLogin"]),
		...mapGetters(["appApiUrl", "appResourcesUrl",]),
	},
	activated() {
		// 设置appId和channelId到vuex
		this.setAppId(this.$route.query.YzAppId);
		this.setChannelId(this.$route.query.YzChannelId);
		this.initData();
	},
	methods: {
		...mapMutations({
			setAppId: "setAppId",
			setChannelId: "setChannelId",
			changeAppending: "changeAppending",
			setIndexData: "setIndexData",
		}),

		// 初始化
		initData(callback) {
			// 开启加载提示框
			!this.isAppending && this.changeAppending(true);
			// 用户登录
			this.autoLogin(() => {
				// 获取主页数据
				this.getIndexData(() => {
					// 关闭加载提示框
					this.changeAppending(false);
					if (typeof callback === "function") callback();
				});
			});
		},

		// 获得首页数据
		getIndexData(callback) {
			Request.request({
				url: this.appApiUrl + "/test_app/get_index_data",
				data: {
					app_id: this.appId,
				},
				callback: (res, err) => {
					if (err || res.code !== 0) return this.$toast("网络错误，请稍后");
					// 设置首页数据到store
					this.setIndexData(res.body);
					if (typeof callback === "function") callback();
				},
			})
		},

		// 点击更多推荐事件
		onClickRecommend(item) {
			if (item.appId !== this.appId) {
				this.reload(() => {
					this.$router.replace({path: "/", query: {YzAppId: item.appId, YzChannelId: this.channelId}});
				});
			}
		},

		// 点击更多精彩滚动到推荐
		onClickMoreRecommend() {
			this.$el.querySelector(".recommend-content").scrollIntoView({
				behavior: "smooth",
				block: "nearest",
				inline: "nearest"
			});
		},
	},
}
</script>
<style lang="less">
@import "../../assets/less/index.less";
</style>
