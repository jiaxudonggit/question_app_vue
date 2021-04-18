<template>
	<!--初始化加载层-->
	<div v-if="show" class="loader fixed-fix">
		<div class="loader-inner"></div>
	</div>
</template>

<script>
export default {
	name: "loading",
	props: ["show"],
}
</script>
<style lang="less" scoped>
/**初始化加载层*/
.loader {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0,0,0,0);
	z-index: 9999;

	.loader-inner {
		display: block;
		position: relative;
		left: 50%;
		top: 50%;
		width: 100px;
		height: 100px;
		margin: -50px 0 0 -50px;
		border-radius: 50%;
		border: 3px solid #f3730b;
		border-right-color: transparent;
		animation: spin 2s linear infinite;
	}

	.loader-inner:before {
		content: "";
		position: absolute;
		top: 5px;
		left: 5px;
		right: 5px;
		bottom: 5px;
		border-radius: 50%;
		border: 3px solid #f13d18;
		border-top-color: transparent;
		animation: spin 2s linear infinite;
	}

	.loader-inner:after {
		content: "";
		position: absolute;
		top: 15px;
		left: 15px;
		right: 15px;
		bottom: 15px;
		border-radius: 50%;
		border: 3px solid #ff1edd;
		border-bottom-color: transparent;
		animation: spin 2s linear infinite;
	}

}

@keyframes spin {
	0% {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(1turn);
	}
}

</style>
