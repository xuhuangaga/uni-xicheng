<template>
	<view>
		<view class="u-page">
			<u-toast ref="uToast" />
			<div class="log_top p_t20">
				<div class="flex_j_center">
					<div class="log_top_div flex_j_between">
						<div class="f_c_w">
							<p class="m_b10">{{count}}</p>
							<p>总收益（元）</p>
						</div>
						<div class="f_c_w">
							<p class="m_b10">{{balance}}</p>
							<p>余额（元）</p>
						</div>
					</div>
				</div>
				<div class="m_t20">
					<navigator url="/pages/account/withdrawal">
						<view class="withdrawal ">
							<div class="index_btn">提现</div>
						</view>
					</navigator>
				</div>
			</div>
			<div class="log_buttom">
				<div class="sh_data">
					<div class="sh_data_top">
						<navigator url="../info/signdata?index=0">
							<view class="transaction flex_j_between a_center">
								<div @click="goto(0)">
									<u-icon name="man-add-fill" class="m_r5"></u-icon>商户数据
								</div>
								<div>
									<u-icon name="arrow-right" class="float_r" />
								</div>
							</view>
						</navigator>
					</div>
					<div class="hx_qh m_b10"></div>
					<div class="flex_j_between">
						<div class=" dataList">
							<p>{{qyArea}}</p>
							<navigator url="../info/signdata?index=0">
								<p>签约区域 </p>
							</navigator>
						</div>
						<div class=" dataList">
							<p>{{qyHotel}}</p>
							<navigator url="../info/signdata?index=1">
								<p>签约酒店 </p>
							</navigator>
						</div>
						<div class=" dataList">
							<p>{{qyAgent}}</p>
							<navigator url="../info/signdata?index=2">
								<p>推荐代理 </p>
							</navigator>
						</div>
					</div>
				</div>
				<div class="sh_data">
					<div class="sh_data_top">
						<navigator url="../account/transaction">
							<view class="transaction flex_j_between a_center">
								<div>
									<u-icon name="rmb-circle-fill" class="m_r5"></u-icon>收益数据
								</div>
								<div>
									<u-icon name="arrow-right" class="float_r" />
								</div>
							</view>
						</navigator>
					</div>
					<div class="hx_qh m_b10"></div>
					<div class="flex_j_between">
						<div class=" dataList">
							<p>{{zrCount}}</p>
							<p>昨日收益 </p>
						</div>
						<div class=" dataList">
							<p>{{bzCount}}</p>
							<p>本周收益 </p>
						</div>
						<div class="dataList ">
							<p>{{byCount}}</p>
							<p>本月收益 </p>
						</div>
					</div>
				</div>
			</div>
			<buttom></buttom>
		</view>
	</view>
</template>

<script>
	import buttom from '../buttom/buttom.vue'
	export default {
		data() {
			return {
				count: 0, //总收益
				balance: 0, //余额
				frCount: 0, //分润收益总额
				tgCount: 0, //推广收益总额
				zrCount: 0, //昨日收益
				bzCount: 0, //本周收益
				byCount: 0, //本月收益
				qyArea: 0, //签约区域
				qyHotel: 0, //签约酒店
				qyAgent: 0, //签约代理商
			}
		},
		mounted: function() {
			this.getinfo()
		},
		methods: {
			getinfo() {
				var that = this
				// console.log('开始获取数据')
				that.$axios.get('/HotelAPI/homesummary')
					.then(function(res) {
						var data = res.data
						console.log(data)
						if (data.Code === 200) {
							that.count = data.Data.IncomeTotal
							that.zrCount = data.Data.YesterdayIncome
							that.bzCount = data.Data.WeekIncome
							that.byCount = data.Data.MonthIncome
							that.qyArea = data.Data.AreaCount
							that.qyHotel = data.Data.SelfHotelCount
							that.qyAgent = data.Data.AgentCount
						} else {
							console.log(data.ErroMessage)
						}
					})
					.catch(function(erro) {
						console.log(erro)
					})
				//获取首页余额数据
				that.$axios.get('/agent/user/account')
					.then(function(res) {
						var data = res.data
						// console.log(data)
						if (data.Code === 200) {
							that.balance = data.Data.Balance
						} else {
							console.log(data.ErroMessage)
						}
					})
					.catch(function(erro) {
						console.log(erro)
					})
			}
		},
		components: {
			buttom
		}
	}
</script>

<style lang="scss" scoped>
	.index_btn {
		width: 70px;
		// font-size: 13px;
		height: 35px;
		line-height: 35px;
		padding: 0 40px;
		background: rgb(25, 137, 250);
		border-radius: 20px;
		color: #fff;
		position: relative;
		left: 30%;
		border: 1px solid #fff;
	}

	.log_top {
		height: 200px;
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
			width: 300px;
			color: #fff;
			padding-top: 25px;
			margin-bottom: 25px;
			text-align: center;
		}






		.van-button {
			border: 1px solid #fff;
			width: 120px;
			height: 35px;
			margin-top: 10px;
		}
	}

	.log_buttom {
		background-color: rgb(242, 242, 242);
		height: 374px;

		.sh_data {
			background-color: #fff;
			height: 120px;
			margin-bottom: 10px;

			.sh_data_top {
				line-height: 50px;
				padding: 0px 10px 0px 5px;
			}



			.van-icon {
				line-height: 50px;
				width: 20px;
				height: 20px;
				vertical-align: top;
			}

			hr {
				color: rgb(121, 53, 0);
				margin: 0px 10px 10px 10px;
			}

			.dataList {
				width: 30%;
				margin: 0px 5px 0px 5px;
				text-align: center;
			}

			.dataList p:last-child {
				// font-size: 0.5rem;
				color: rgb(85, 85, 85);
			}

		}

	}
</style>
