<!--banner组件-->
<template>
	<swiper ref="renderSwiper" class="home-swiper" :options="swiperOption">
		<swiper-slide v-for="item in bannerList" :key="item.app_id">
			<img :src="item.image_name" alt="" :data-key="item.app_id"/>
		</swiper-slide>
		<div class="swiper-pagination" slot="pagination"></div>
	</swiper>
</template>
<script>

export default {
	name: "home-swiper-banner",
	props: {
		bannerList: {
			type: Array,
		},
		speed: {
			type: Number,
			default: 600,
		},
		slidesPerView: {
			type: Number,
			default: 1,
		},
		spaceBetween: {
			type: Number,
			default: 0,
		},
		pagination: {
			type: Boolean,
			default: true,
		},
		autoplay: {
			type: Boolean,
			default: true,
		},
		delay: {
			type: Number,
			default: 3000,
		},
		loop: {
			type: Boolean,
			default: true,
		},
	},
	data() {
		return {
			swiperOption: {
				pagination: this.pagination ? {el: '.swiper-pagination'} : false,
				autoplay: this.autoplay ? {delay: this.delay} : false,
				loop: this.loop,
				slidesPerView: this.slidesPerView, // 设置slider容器能够同时显示的slides数量(carousel模式)。
				spaceBetween: this.spaceBetween, // 滑块间隔
				speed: this.speed, // 动画速度
				watchOverflow: true, // 当没有足够的slide切换时，例如只有1个slide，swiper会失效且隐藏导航等
				observer: true,//修改swiper自己或子元素时，自动初始化swiper
				observeParents: true,//修改swiper的父元素时，自动初始化swiper
				on: {
					click: (swiper) => {
						this.$emit("listenerBannerClick", this.bannerList[swiper.realIndex], swiper.realIndex);
					},
				},
			},
		}
	},
}
</script>
<style lang="less" scoped>
.home-swiper {
	width: 100%;
	position: relative;
	box-sizing: border-box;

	img {
		display: block;
		width: 100%;
		border-radius: 10px;
		box-sizing: border-box;
	}

	.swiper-pagination-bullets {
		bottom: 3px;
	}
}
</style>
