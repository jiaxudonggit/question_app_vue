<!--推荐弹窗-->
<template>
	<van-popup v-if="indexData.show_recommend_layer" v-model="showSelf" class="app-popup" :lock-scroll="true" :close-on-click-overlay="false">
		<img class="app-popup-title" src="../../assets/images/popup/layer-title.png" alt="">
		<div class="app-popup-content">
			<div class="app-popup-app-list">
				<div class="app-popup-app" v-for="(item, index) in popupData.recommend_list" :key="index" @click="onPopupClick(item, index)">
					<div class="app-popup-left">
						<img class="app-popup-icon" :src="item.app_icon" alt="加载错误">
					</div>
					<div class="app-popup-center">
						<div class="app-popup-title">{{ item.app_name }}</div>
						<div class="app-popup-desc">{{ item.app_desc }}</div>
					</div>
					<div class="app-popup-right">
						<div class="app-popup-btn">{{ item.btn_text }}</div>
					</div>
				</div>
			</div>
		</div>
		<img class="app-popup-content-bottom" src="../../assets/images/popup/layer-bottom.png" alt="">
		<img class="app-popup-btn" src="../../assets/images/popup/layer-btn.png" alt="" @click="onPopupMoreClick">
		<img class="app-popup-close" src="../../assets/images/popup/layer-close.png" alt="" @click="onPopupCloseClick">
	</van-popup>
</template>
<script>
import {mapGetters, mapState} from "vuex";
import Vue from 'vue';
import {Popup} from 'vant';
import {Request} from "@/utils/Utils";

Vue.use(Popup);

export default {
	name: "recommend-layer",
	props: {
		show: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			showSelf: false,
		}
	},
	computed: {
		...mapState(["indexData", "popupData", "appId"]),
		...mapGetters(["appApiUrl"]),
	},
	watch: {
		show(val) {
			this.showSelf = val;
		}
	},
	activated() {
		this.showSelf = this.show;
	},
	methods: {
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

		// 点击弹窗推荐事件
		onPopupClick(item, index) {
			this.createRecommendRecord(this.appId, item.app_id);
			this.$emit("listenerPopupClick", item, index);
		},

		// 点击弹窗更多按钮
		onPopupMoreClick() {
			this.$emit("listenerPopupMoreClick");
		},

		// 点击弹窗关闭按钮
		onPopupCloseClick() {
			this.$emit("listenerPopupCloseClick");
		},
	}
}
</script>
<style lang="less" scoped>
.app-popup {
	width: 95%;
	max-width: 360px;
	min-width: 330px;
	height: 580px;
	top: 47%;
	overflow-y: inherit;
	box-sizing: border-box;
	background-color: transparent;

	img {
		vertical-align: bottom;
	}

	.app-popup-title {
		display: block;
		width: 100%;
		position: absolute;
		box-sizing: border-box;
		top: 17.5%;
		z-index: 99;
	}

	.app-popup-content {
		width: 85%;
		height: 94%;
		z-index: 98;
		margin: 0 auto;
		overflow: hidden;
		position: relative;
		box-sizing: border-box;
		background-color: transparent;
		background-image: url("../../assets/images/popup/layer-bg.png");
		background-size: 100% 100%;
		background-repeat: no-repeat;

		.app-popup-app-list {
			width: 100%;
			height: 60%;
			top: 30%;
			padding: 5px 25px 75px 38px;
			overflow-x: hidden;
			overflow-y: auto;
			position: relative;

			.app-popup-app {
				width: 100%;
				height: 65px;
				margin: 0 auto 10px;
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;
				align-items: center;
				position: relative;

				.app-popup-left {
					width: 65px;
					height: 100%;
					overflow: hidden;
					float: left;

					.app-popup-icon {
						display: block;
						width: 100%;
						height: 100%;
						border-radius: 10px;
						box-sizing: border-box;
						border: 1px solid #640173;
						vertical-align: bottom;
					}
				}

				.app-popup-center {
					width: calc(100% - 65px);
					height: 100%;
					padding: 0 12px;
					overflow: hidden;
					position: relative;
					float: left;

					.app-popup-title {
						width: 100%;
						height: 22px;
						position: relative;
						top: 2px;
						box-sizing: border-box;
						font-size: 16px;
						line-height: 20px;
						text-align: left;
						color: #161616;
						overflow: hidden; //超出的文本隐藏
						text-overflow: ellipsis; //溢出用省略号显示
						white-space: nowrap; //溢出不换行
					}

					.app-popup-desc {
						width: 100%;
						height: 16px;
						margin-top: 4px;
						font-size: 12px;
						line-height: 15px;
						text-align: left;
						color: #959494;
						overflow: hidden; //超出的文本隐藏
						text-overflow: ellipsis; //溢出用省略号显示
						white-space: nowrap; //溢出不换行
					}

				}

				.app-popup-right {
					width: 80px;
					height: 20px;
					position: absolute;
					right: 20px;
					bottom: 0;

					.app-popup-btn {
						width: 80px;
						height: 20px;
						line-height: 20px;
						font-size: 10px;
						text-align: center;
						box-sizing: border-box;
						position: absolute;
						right: 0;
						bottom: 1px;
						color: #ffffff;
						background-color: #52a1fe;
						border-radius: 25px;
					}

				}
			}

			/* 设置滚动条的样式 */

			::-webkit-scrollbar {
				width: 0;
			}

			/* 滚动槽 */

			::-webkit-scrollbar-track {
				-webkit-box-shadow: inset006pxrgba(0, 0, 0, 0);
				border-radius: 10px;
			}

			/* 滚动条滑块 */

			::-webkit-scrollbar-thumb {
				border-radius: 10px;
				background: rgba(0, 0, 0, 0);
				-webkit-box-shadow: inset006pxrgba(0, 0, 0, 0);
			}

			::-webkit-scrollbar-thumb:window-inactive {
				background: rgba(255, 0, 0, 0);
			}

		}
	}

	.app-popup-content-bottom {
		display: block;
		width: 85%;
		height: 130px;
		position: absolute;
		box-sizing: border-box;
		bottom: 6%;
		left: 7.5%;
		z-index: 99;
	}

	.app-popup-btn {
		display: block;
		width: 50%;
		position: absolute;
		box-sizing: border-box;
		bottom: calc(6% + 20px);
		left: 25%;
		z-index: 100;
	}

	.app-popup-close {
		width: 30px;
		height: 30px;
		display: block;
		position: absolute;
		bottom: 0;
		left: calc((100% - 30px) / 2);
	}

}
</style>
