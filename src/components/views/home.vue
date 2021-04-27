<!--主页商店页面组件-->
<template>
	<div id="home" class="home app-model">
		<div class="home-content app-content" :style="{minHeight: (availHeight - 50) + 'px'}">
			<img class="home-content-bg" src="../../assets/images/home/home-top-bg.png" alt="">
			<div class="home-search-wrap">
				<van-search shape="round" :background="'transparent'" placeholder="搜你想搜的，这里会有你所爱~"/>
			</div>
			<div class="home-banner-wrap">
				<home_swiper_banner :banner-list="homeData.banner_list" :pagination="true" @listenerBannerClick="onBannerClick"></home_swiper_banner>
			</div>
			<div class="home-type-wrap">
				<van-grid :border="false" :square="true">
					<van-grid-item v-for="item in homeData.type_list" :icon="item.type_icon" :text="item.type_title" :key="item.type_id" @click="onTypeClick(item)"></van-grid-item>
				</van-grid>
			</div>
			<div class="home-module-wrap">
				<home_swiper_interest :module-list="homeData.module_list" @listenerModuleClick="onModuleClick"></home_swiper_interest>
			</div>

			<div class="home-like-wrap">
				<home_swiper_like :like-list="homeData.like_list" @listenerLikeClick="onLikeClick" @listenerMoreClick="onLikeMoreClick"></home_swiper_like>
			</div>

			<div class="home-more-wrap">
				<home_more @listenerMoreClick="onMoreClick"></home_more>
			</div>
		</div>
	</div>
</template>
<script>
import Vue from 'vue';
import home_more from "@/components/common/home/home_more";
import home_swiper_banner from "@/components/common/home/home_swiper_banner";
import home_swiper_interest from "@/components/common/home/home_swiper_interest";
import home_swiper_like from "@/components/common/home/home_swiper_like";
import {mapGetters, mapMutations, mapState} from "vuex";
import {Search, Grid, GridItem} from 'vant';

Vue.use(Search);
Vue.use(Grid);
Vue.use(GridItem);

export default {
	inject: ['reload', "autoLogin"],
	components: {
		home_swiper_banner,
		home_swiper_interest,
		home_swiper_like,
		home_more,
	},
	computed: {
		...mapState(["isAppending", "loadingTime", "channelId", "homeData", "availHeight"]),
		...mapGetters(["appApiUrl", "appIconUrl", "appResourcesUrl", "isLogin"]),
	},
	data() {
		return {
			model: "home",
			timer: [],
		}
	},
	activated() {
		// 设置channelId到vuex
		this.setChannelId(this.$route.query.YzChannelId);
	},
	deactivated() {

	},
	methods: {
		...mapMutations({
			setChannelId: "setChannelId",
			changeAppending: "changeAppending",
		}),

		// 点击banner
		onBannerClick(item) {
			this.$router.replace({path: "/", query: {YzAppId: item.app_id, YzChannelId: this.channelId, t: new Date().getTime()}});
		},

		onTypeClick(item) {
			this.$router.replace({path: "/type", query: {YzChannelId: this.channelId, YzTypeId: item.type_id, YzTypeTitle: item.type_title, t: new Date().getTime()}});
		},

		// 点击趣味精选
		onModuleClick(item) {
			this.$router.replace({path: "/", query: {YzAppId: item.app_id, YzChannelId: this.channelId, t: new Date().getTime()}});
		},

		// 点击大家爱玩
		onLikeClick(item) {
			this.$router.replace({path: "/", query: {YzAppId: item.app_id, YzChannelId: this.channelId, t: new Date().getTime()}});
		},

		// 点击大家爱玩 更多
		onLikeMoreClick() {
			console.log("========点击了更多按钮======")
		},

		// 点击更多好玩列表
		onMoreClick(item) {
			this.$router.replace({path: "/", query: {YzAppId: item.app_id, YzChannelId: this.channelId, t: new Date().getTime()}});
		}

	},
}
</script>
<style lang="less">
@import "../../assets/less/home.less";
</style>
