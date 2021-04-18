<template>
	<div></div>
	<!--game组件-->
<!--	<div id="index" class="index" :style="{backgroundColor: $store.state.appConfig.indexConfig.backgroundColor}">-->
<!--		<div class="index-content" :style="{minHeight: availHeight + 'px'}">-->
<!--			<div class="index-content-top"><img :src="makePictureUrl($store.state.appConfig.indexConfig.top)" alt=""></div>-->
<!--			<div v-if="$store.state.appConfig.indexConfig.showDetail" class="index-content-center" :style="{backgroundColor: $store.state.appConfig.indexConfig.detailBackgroundColor}">-->
<!--				<div class="index-content-title">{{ $store.state.appConfig.indexConfig.title }}</div>-->
<!--				<div class="index-content-text">{{ $store.state.appConfig.indexConfig.text }}</div>-->
<!--				<div class="index-content-detail">-->
<!--					<div class="index-content-detail-cell" v-for="(item, index) in $store.state.appConfig.indexConfig.detail" :key="index">-->
<!--						<div class="index-content-detail-item">-->
<!--							<div class="index-content-detail-item-top" :style="{color: $store.state.appConfig.indexConfig.detailFontColor}">-->
<!--								<span>{{ item.data }}</span>{{ item.unit }}-->
<!--							</div>-->
<!--							<div class="index-content-detail-item-bottom">{{ item.desc }}</div>-->
<!--						</div>-->
<!--					</div>-->
<!--				</div>-->
<!--			</div>-->
<!--			<div class="index-content-bottom">-->
<!--				<img v-for="(item, index) in $store.state.appConfig.indexConfig.bottom" :src="makePictureUrl(item)" alt="" :key="index">-->
<!--			</div>-->
<!--			<div v-if="$store.state.baseConfig.isShowRecommend" class="index-content-recommend">-->
<!--				<recommend_list v-if="$store.state.baseConfig.isShowRecommend" :recommend="$store.state.recommendConfig" :app-id="appId" v-on:listenerRecommendClick="onClickRecommend"></recommend_list>-->
<!--			</div>-->
<!--		</div>-->
<!--		<div class="index-btn-wrap fixed-fix" @click="$router.push({path: '/game', query: {YzAppId: appId, YzChannelId: channelId}})">-->
<!--			<img class="index-btn" :src="makePictureUrl($store.state.appConfig.indexConfig.btn)" alt="">-->
<!--		</div>-->
<!--		<div v-if="$store.state.baseConfig.isShowRecommend && $store.state.recommendConfig.recommendArray.length > 0 && $store.state.baseConfig.isShowMore" class="index-to-bottom-wrap animate__animated animate__bounceIn" @click="onClickMoreRecommend">-->
<!--			<img src="../../assets/images/index/more.png" alt="">-->
<!--		</div>-->
<!--	</div>-->
</template>
<script>
// import recommend_list from "@/components/common/recommend_list2";
// import {Utils} from "@/utils/Utils";

export default {
	// inject: ['reload'],
	// components: {
	// 	recommend_list,
	// },
	// data() {
	// 	return {
	// 		model: "index",
	// 		availHeight: window.screen.availHeight,
	// 	}
	// },
	// computed: {
	// 	appId() {
	// 		return this.$route.query.YzAppId;
	// 	},
	// 	channelId() {
	// 		return this.$route.query.YzChannelId;
	// 	},
	// },
	// watch: {
	// 	appId(newValue) {
	// 		console.log("========index.appId.changed=========");
	// 		this.initData(newValue, false);
	// 	},
	// 	channelId(newValue) {
	// 		console.log("========index.channelId.changed=========");
	// 		this.$store.commit("setChannelId", newValue)
	// 	}
	// },
	// mounted () {
	// 	const that = this
	// 	window.onresize = () => {
	// 		return (() => {
	// 			that.availHeight = window.screen.availHeight;
	// 		})()
	// 	}
	// },
	// methods: {
	//
	// 	// 拼接图片地址
	// 	makePictureUrl(name) {
	// 		return Utils.makePictureUrl(this.appId, this.model, name);
	// 	},
	//
	// 	// 点击更多推荐事件
	// 	onClickRecommend(item) {
	// 		if (item.appId !== this.appId) {
	// 			this.reload(() => {
	// 				this.$router.replace({path: "/", query: {YzAppId: item.appId, YzChannelId: this.channelId}});
	// 			});
	// 		}
	// 	},
	//
	// 	// 点击更多精彩滚动到推荐
	// 	onClickMoreRecommend() {
	// 		this.$el.querySelector(".recommend-content").scrollIntoView({
	// 			behavior: "smooth",
	// 			block: "nearest",
	// 			inline: "nearest"
	// 		});
	// 	},
	// },
}
</script>
<style lang="less">
@import "../../assets/less/index.less";
</style>
