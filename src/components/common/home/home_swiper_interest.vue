<!--趣味精选组件-->
<template>
	<div class="home-module-block">
		<div class="home-module-top">
			<div class="home-module-title"><img src="../../../assets/images/home/interest.png" alt=""><span>趣味精选</span></div>
			<div class="home-module-tip">更多好玩测试--本产品仅供娱乐</div>
		</div>
		<div class="home-module-center">
			<swiper ref="moduleSwiper" class="swiper home-module-item-wrap" :options="swiperOption">
				<swiper-slide v-for="(item, index) in moduleList" :key="index" class="home-module-item" :style="{backgroundImage: item.bg_color}">
					<div class="home-module-item-block" :data-key="item.app_id" @click="onClick(item, index)">
						<img class="home-module-item-icon" :src="item.app_icon" alt="">
						<div class="home-module-item-name">{{ item.module_title }}</div>
						<div class="home-module-item-title">{{ item.app_name }}</div>
						<div class="home-module-item-btn">{{ item.btn_text }}</div>
					</div>
				</swiper-slide>
				<div class="swiper-pagination" slot="pagination"></div>
			</swiper>
		</div>
	</div>
</template>
<script>
import {directive, Swiper, SwiperSlide} from 'vue-awesome-swiper';
import 'swiper/swiper-bundle.css';
import SwiperCore, {Navigation, Pagination, EffectFade, Autoplay} from 'swiper';

SwiperCore.use([Navigation, Pagination, EffectFade, Autoplay]);

export default {
	name: "home-swiper-interest",
	props: {
		moduleList: {
			type: Array,
		},
		speed: {
			type: Number,
			default: 600,
		},
		slidesPerView: {
			type: Number,
			default: 3,
		},
		spaceBetween: {
			type: Number,
			default: 15,
		},
		pagination: {
			type: Boolean,
			default: false,
		},
		delay: {
			type: Number,
			default: 3000,
		},
		autoplay: {
			type: Boolean,
			default: false,
		},
		loop: {
			type: Boolean,
			default: false,
		},
	},
	components: {
		Swiper,
		SwiperSlide
	},
	directives: {
		swiper: directive
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
			},
		}
	},
	methods: {
		onClick(item, index) {
			this.$emit("listenerModuleClick", item, index);
		}
	}
}
</script>
<style lang="less" scoped>
.home-module-block {
	width: 100%;
	position: relative;
	box-sizing: border-box;

	.home-module-top {
		width: 100%;
		height: 50px;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;

		.home-module-title {
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

		.home-module-tip {
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

	.home-module-center {
		width: 100%;
		position: relative;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;

		.home-module-item-wrap {
			width: 100%;
			position: relative;
			box-sizing: border-box;

			.home-module-item {
				margin-top: 22px;
				border-radius: 15px;
				background: linear-gradient(to bottom, #01cfff, #157dfc);

				.home-module-item-block {
					width: 100%;
					padding-bottom: 5px;
					position: relative;
					box-sizing: border-box;

					.home-module-item-icon {
						width: 75px;
						height: 75px;
						display: block;
						margin: -18px auto 0;
						border-radius: 15px;
					}

					.home-module-item-name {
						width: 95%;
						margin: 10px auto 0;
						font-size: 14px;
						text-align: center;
						line-height: 20px;
					}

					.home-module-item-title {
						width: 95%;
						height: 32px;
						margin: 0 auto;
						font-size: 12px;
						text-align: center;
						line-height: 16px;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box; //作为弹性伸缩盒子模型显示。
						-webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
						-webkit-line-clamp: 2; //显示的行
					}

					.home-module-item-btn {
						width: 60px;
						height: 20px;
						box-sizing: border-box;
						border-radius: 12px;
						border: 1px solid #ffffff;
						margin: 5px auto;
						font-size: 12px;
						line-height: 20px;
						text-align: center;
					}

				}

			}

		}

	}
}
</style>
