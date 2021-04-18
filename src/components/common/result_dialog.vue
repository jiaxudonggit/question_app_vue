<template>
	<div class="game-dialog" :style="{'z-index': 99}">
		<div class="dialog-mark" :style="{'z-index': 100}" @click="confirmMyself"></div>
		<div class="dialog-sprite animate__animated animate__fadeIn" :style="{'z-index': 101}" @click="confirmMyself">
			<!-- 弹窗的主题内容 -->
			<section class="dialog-body">
				<img class="game-img" :src="require('@/assets/images/result/kuang1.gif')" alt="">
			</section>
		</div>
	</div>
</template>

<script>
export default {
	name: "result_dialog",
	created() {
		this.forbidScroll();
	},
	destroyed() {
		this.sloveBodyOverflow();
	},
	data() {
		return {
			bodyOverflow: '',
		}
	},
	methods: {
		// 确认按钮操作
		confirmMyself() {
			this.showSelf = false;
			this.sloveBodyOverflow();
			this.$emit('confirm');
		},

		/** 禁止页面滚动 */
		forbidScroll() {
			this.bodyOverflow = document.body.style.overflow
			document.body.style.overflow = 'hidden'
		},

		/** 恢复页面的滚动 */
		sloveBodyOverflow() {
			document.body.style.overflow = this.bodyOverflow;
		},
	}
}
</script>

<style lang="less" scoped>
.game-dialog {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0);
	z-index: 99;
}

.dialog-mark {
	position: absolute;
	top: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, .5);
}

.dialog-sprite {
	width: 65%;
	max-width: 450px;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	z-index: 100;
	background-color: rgba(0, 0, 0, 0);
}

.dialog-body {
	position: relative;
}

.game-img {
	width: 100%;
	vertical-align: bottom;
	user-select: none;
}
</style>

