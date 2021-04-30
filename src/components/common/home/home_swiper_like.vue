<!--大家爱玩组件-->
<template>
	<div class="home-like-block">
		<div class="home-like-top">
			<div class="home-like-title"><img src="../../../assets/images/home/like.png" alt=""><span>大家爱玩</span></div>
			<div class="home-like-more-btn" @click="onMoreClick"><span>更多</span><img src="../../../assets/images/home/like-more.png" alt=""></div>
		</div>
		<div class="home-like-center">
			<swiper ref="moduleSwiper" class="swiper home-like-item-wrap" :options="swiperOption">
				<swiper-slide v-for="(item, index) in likeList" :key="index" class="home-like-item" :style="{backgroundColor: index % 2 === 0 ? '#ffeeca' : '#c7eafe'}">
					<div class="home-like-item-block"  @click="onClick(item, index)">
						<img class="home-like-item-banner" :src="item.image_name" alt="">
						<div class="home-like-item-text">
							<span class="home-like-item-title">{{ item.app_name }}</span>
							<span class="home-like-item-desc">{{ item.app_desc }}</span>
						</div>
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
	name: "home-swiper-like",
	props: {
		likeList: {
			type: Array,
		},
		speed: {
			type: Number,
			default: 600,
		},
		slidesPerView: {
			type: Number,
			default: 1.4,
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
	methods:{
		// 更多按钮点击事件
		onMoreClick(){
			this.$emit("listenerMoreClick");
		},

		onClick(item, index) {
			this.$emit("listenerLikeClick", item, index);
		}
	}
}
</script>
<style lang="less" scoped>
.home-like-block {
	width: 100%;
	position: relative;
	box-sizing: border-box;

	.home-like-top {
		width: 100%;
		height: 50px;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;

		.home-like-title {
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

		.home-like-more-btn {
			width: 70px;
			height: 50px;
			position: relative;
			display: flex;
			flex-wrap: wrap;
			justify-content: flex-end;
			align-items: center;

			span{
				display: block;
				font-size: 14px;
				line-height: 20px;
				text-align: right;
				color: #000000;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				margin-right: 3px;
			}

			img {
				display: block;
				width: 13px;
				margin-top: -1px;
				vertical-align: center;
			}

		}

	}

	.home-like-center {
		width: 100%;
		//margin-top: 27px;
		position: relative;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;

		.home-like-item-wrap {
			width: 100%;
			position: relative;
			box-sizing: border-box;

			.home-like-item {
				border-radius: 10px;
				padding: 10px;
				background-color: #ffeeca;

				.home-like-item-block {
					width: 100%;
					position: relative;
					box-sizing: border-box;
					background-color: #ffffff;
					border-radius: 10px;
					overflow: hidden;

					.home-like-item-banner {
						display: block;
						width: 100%;
						vertical-align: bottom;
					}

					.home-like-item-text {
						width: 100%;
						padding: 12px 15px 10px;
						box-sizing: border-box;
						background-color: #ffffff;

						.home-like-item-title {
							display: block;
							width: 100%;
							font-size: 14px;
							font-weight: 800;
							line-height: 20px;
							text-align: left;
							color: #374c78;
							overflow: hidden; //超出的文本隐藏
							text-overflow: ellipsis; //溢出用省略号显示
							white-space: nowrap; //溢出不换行
						}
						.home-like-item-desc {
							display: block;
							width: 100%;
							font-weight: 600;
							font-size: 12px;
							line-height: 16px;
							text-align: left;
							color: #7f91a9;
							overflow: hidden; //超出的文本隐藏
							text-overflow: ellipsis; //溢出用省略号显示
							white-space: nowrap; //溢出不换行
						}

					}

				}
			}

		}

	}
}
</style>
