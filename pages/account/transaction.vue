<template>
	<view>
		<u-tabs :list="list" :is-scroll="false" :current="current" @change="change"></u-tabs>
		<view>
			<view class="item u-border-bottom">
				<div class="log_bottom m_t10">
					<div class="areaList flex_j_between a_center" v-for="item in myList">
						<div class="flex">
							<div>
								<img src="../../static/sr.svg" alt="" width="40px" height="60px" v-if="isSr===true">
								<img src="../../static/zc.svg" alt="" width="40px" height="60px" v-else="isSr===false">
							</div>
							<div class="m_l10 d_remark">
								<div class="remark">{{item.Remark}}</div>
								<div class="f_c_c">{{item.CreateTime}}</div>
							</div>
						</div>
						<div class="f_w_bold" v-if="isSr===true">+{{item.Amount}}</div>
						<div class="f_w_bold" v-if="isSr===false">-{{item.Amount}}</div>
					</div>
				</div>
			</view>
			<u-loadmore :status="status" />
		</view>
		<buttom></buttom>
	</view>
</template>

<script>
	import buttom from '../buttom/buttom.vue'
	import axios from 'axios'
	export default {
		data() {
			return {
				isSr: true,
				list: [{
					name: '收入',
					count: 0
				}, {
					name: '支出',
					count: 0
				}],
				current: 0,
				page: 1,
				myList: [],
				status: 'loadmore',
				pageSize: 20
			}
		},
		components: {
			buttom
		},
		mounted: function() {
			// 默认显示收入列表
			this.getIncomeInfo(this.page)
		},
		methods: {
			change(index) {
				var that = this
				that.isSr = true
				that.status = 'loadmore'
				that.page = 1
				that.current = index;
				that.myList = []
				switch (index) {
					//获取收入数据
					case 0:
						that.getIncomeInfo(that.page)
						break;
						//获取支出数据
					case 1:
						that.isSr = false
						that.getExpendInfo(that.page)
						break;
				}
			},
			//获取收入数据
			getIncomeInfo(page) {
				var that = this
				that.$axios.post('/agent/user/income', JSON.stringify({
						pageSize: 20, // 每页请求条数
						pageIndex: that.page // 请求的页面
					}))
					.then(res => {
						console.log(res)
						that.status = 'nomore';
						// 当请求成功
						if (res.data.Code === 200) {
							// console.log(res.data.Data.length)
							if (res.data.Data != null && res.data.Data.length > 0) {
								that.myList = that.myList.concat(res.data.Data)
								that.list[that.current].count = res.data.DataCount
								if (res.data.DataCount > that.pageSize)
									that.status = 'loading';
							}
						}
					})
					.catch(error => {
						console.log(error)
					});
			},
			//获取支出数据
			getExpendInfo(page) {
				var that = this
				that.$axios.post('/agent/user/expenditure', JSON.stringify({
						pageSize: 20, // 每页请求条数
						pageIndex: that.page // 请求的页面
					}))
					.then(res => {
						console.log(res)
						that.status = 'nomore';
						// 当请求成功
						if (res.data.Code === 200) {
							if (res.data.Data != null && res.data.Data.length > 0) {
								that.myList = that.myList.concat(res.data.Data)
								that.list[that.current].count = res.data.DataCount
								if (res.data.DataCount > that.pageSize)
									that.status = 'loading';
							}
						}
					})
					.catch(error => {
						console.log(error)
					});
			},
			onReachBottom() {
				var that = this
				// if (that.page >= 3) return;
				that.status = 'loading';
				that.page = ++that.page;
				setTimeout(() => {
					switch (that.current) {
						//收入
						case 0:
							that.getIncomeInfo(that.page)
							break;
							//支出
						case 1:
							that.getExpendInfo(that.page)
							break;
					}
				}, 2000)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.d_remark {
		line-height: 30px;
	}
	.remark {
		color: rgb(116,116,116);
		font-size: 16px;
	}

	.f_w_bold {
		font-size: 16px;
	}

	.yx {
		color: #fff;
		background: #66b2ff;
		text-align: center;
		line-height: 66px;
		height: 66px;
		border-radius: 100%;
		width: 66px;
	}

	.areaList {
		padding: 10px;
		display: flex;
		justify-content: space-between;
		color: rgb(120, 120, 120);
		background-color: #fff;
		margin: 2px;
		border-radius: 5px;
	}

	.red {
		background: rgb(255, 0, 0);
	}

	.green {
		background: rgb(0, 255, 128);
	}

	.orange {
		background: rgb(255, 128, 0);
	}

	.area {
		margin-left: 5px;
		color: #fff;
		color: #fff;
		padding: 2px;
		width: 46px;
		text-align: center;
		border-radius: 3px;
	}

	.float_l {
		float: left;
	}

	.float_r {
		float: right;
	}



	.log_top {
		height: 120px;
		background: url('/static/log_bgm.png') no-repeat;

		background-color: rgb(242, 242, 242);
		text-align: center;

		.log_top_div p:first-child {
			// font-size: 2rem;
		}

		.log_top_div p:nth-child(2) {
			// font-size: 0.8rem;
		}

		.log_top_div {
			color: #fff;
			padding-top: 25px;
			margin-bottom: 25px;
			text-align: center;
		}

		.log_left_div {
			padding-left: 50px;
		}

		.log_left_div,
		.log_right_div {
			color: #fff;
			// font-size: 0.8rem;
		}

		.log_left_div p,
		.log_right_div p {
			margin-bottom: 10px;
		}
	}

	.log_bottom {
		height: 100%;
		background-color: rgb(242, 242, 242);
	}

	.log_bottom .van-pull-refresh {
		width: 100%;
	}

	.van-list {
		// font-size: 0.65rem;
		color: rgb(121, 53, 0);
	}

	.list_card {
		border: 1px solid #fff;
		padding: 10px;
		margin: 2px;
		background-color: #fff;
		border-radius: 5px;
	}

	.list_div {
		margin-left: 60px;
	}

	.list_div p {
		margin-bottom: 4px;
	}
</style>
