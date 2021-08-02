<template>
	<view>
		<u-mask :show="maskShow">
			<view class="warp">
				<u-loading mode="flower" size="60"></u-loading>
			</view>
		</u-mask>
		<u-toast ref="uToast" />
		<div class="core p_relative">
			<u-popup v-model="againShow" mode="center" :closeable="true">
				<view>
					<div class="m_20 t_a_center">重新提交</div>
					<div class="popup_d">
						<div>失败原因：</div>
						<div class="fail_msg">{{failMsg}}</div>
						<div class="t_a_center m_15">
							<u-button round block type="info" class="bgc_b" @click="againSubmit" native-type="submit">
								提交</u-button>
						</div>
					</div>
				</view>
			</u-popup>
			<u-popup v-model="show" mode="center" :closeable="true">
				<view>
					<div class="m_20 t_a_center">申请提现</div>
					<div class="popup_d">
						<u-collapse class="p_l15">
							<u-collapse-item title="提现规则" name="1">
								<p>1.满100可提现，且提现金额是100的整数倍</p>
								<p>2.每笔提现收取3%提现手续费</p>
								<p>3.提现成功后1-5个工作日到账</p>
								<p>4.首次申请提现, 需第2个工作日后进行个人身份认证</p>
								<!-- <navigator url="../helper/index">
								<view style="color:#ee0a24">认证指南</view>
							</navigator> -->
							</u-collapse-item>
						</u-collapse>
						<div>
							<u-field v-model="money" label="提现金额" required placeholder="请输入提现金额" />
							<u-field v-model="paypsd" label="支付密码" required placeholder="请输入支付密码" type="password" />
							<div class="t_a_center m_15">
								<u-button round block type="info" class="bgc_b" @click="applywithdraw"
									native-type="submit">
									提交</u-button>
							</div>
						</div>
					</div>
				</view>
			</u-popup>
			<div class="tx_tip" @click="show=true">申请提现</div>
			<u-tabs :list="list" :is-scroll="false" :current="current" @change="change"></u-tabs>
			<div class="container">
				<view>
					<view class="item u-border-bottom">
						<div class="core_div p_relative" v-for='item in myList'>
							<div class="flex_j_between a_center p_10 ">
								<div class="flex a_center">
									<div>
										<img src="../../static/date.svg" alt="" width="25px" height="25px">
									</div>
									<div class="m_l10">{{item.CreateDate}}</div>
								</div>
							</div>
							<div class="core_buttom flex_j_around a_center">
								<div>
									<p>{{item.Money}}</p>
									<p>提现金额</p>
								</div>
								<div class="sx_qh"></div>
								<div>
									<p>{{item.Commission}}</p>
									<p>手续费</p>
								</div>
							</div>
							<div v-show="current===2" class="again" @click="againSubmitClick(item.Id,item.ExamineMsg)">
								重新提交
							</div>
						</div>
					</view>
					<u-loadmore :status="status" />
				</view>

			</div>


		</div>
		<buttom></buttom>
	</view>
</template>

<script>
	import buttom from '../buttom/buttom.vue'
	export default {
		data() {
			return {
				maskShow: false,
				isFail: false,
				failMsg: '',
				Id: 0,
				tx_tips: ['温馨提示:请在【08:00-23:59】该时间段内申请提现.'],
				list: [{
					name: '申请中',
					count: 0
				}, {
					name: '提现成功',
					count: 0
				}, {
					name: '提现失败',
					count: 0
				}],
				current: 0,
				status: 'loadmore',
				money: 0,
				paypsd: '',
				page: 1,
				show: false,
				againShow: false,
				myList: [],
				pageSize: 20
			}
		},
		mounted: function() {
			this.getInfo(this.page)
		},
		methods: {
			change(index) {
				var that = this
				that.page = 1
				that.current = index
				that.myList = []
				that.getInfo(that.page)
			},
			//重新提交提现申请
			againSubmit() {
				var that = this
				that.maskShow = true
				// console.log(that.Id)
				let timer = setTimeout(()=>{
					that.$axios.post('/agent/user/againwithdraw?id=' + that.Id
						)
						.then(res => {
							console.log(res)
							// 当请求成功
							if (res.data.Code === 200) {
								that.$refs.uToast.show({
									title: '操作成功',
									type: 'success',
									url: '/pages/account/withdrawal'
								})
							} else {
								that.$refs.uToast.show({
									title: `${res.data.ErrorMessage}`,
									type: 'error'
								})
							}
						})
						.catch(error => {
							console.log(erro)
							that.$refs.uToast.show({
								title: `请求失败`,
								type: 'erro'
							})
						});
						that.maskShow = false
						//清除计时器
						clearTimeout(timer)
				},1000)
				
			},
			//点击重新提交 弹框
			againSubmitClick(value1, value2) {
				var that = this
				that.againShow = true
				that.failMsg = value2
				that.Id = value1
			},
			//提交提现申请
			applywithdraw: function() {
				var that = this
				that.maskShow = true
				let timer = setTimeout(()=>{
					that.$axios.post(`/agent/user/applywithdraw?money=${that.money}&payPsd=${that.paypsd}`).then(function(res) {
						console.log(res)
						if (res.data.Code === 200) {
							that.$refs.uToast.show({
								title: '操作成功',
								type: 'success',
								url: '/pages/account/withdrawal'
							})
						} else {
							that.$refs.uToast.show({
								title: `${res.data.ErrorMessage}`,
								type: 'error'
							})
						}
					}).catch(function(erro) {
						console.log(erro)
						that.$refs.uToast.show({
							title: `请求失败`,
							type: 'erro'
						})
					})
					that.maskShow = false
					//清除计时器
					clearTimeout(timer)
				},1000)
				
			},
			getInfo(page) {
				var that = this
				// console.log(that.current)
				that.$axios.get('/agent/user/withdraw', {
						params: {
							pageSize: that.pageSize, // 每页请求条数
							pageIndex: that.page, // 请求的页面
							status: that.current
						}
					})
					.then(res => {
						console.log(res)
						// 当请求成功
						that.status = 'nomore';
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
			onReachBottom() {
				var that = this
				// if (that.page >= 3) return;
				that.status = 'loading';
				that.page = ++that.page;
				setTimeout(() => {
					that.getInfo(that.page)
				}, 2000)
			}
		},
		components: {
			buttom
		}
	}
</script>

<style lang="scss" scoped>
	.warp {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100%;
		}
	.popup_d .again {
		left: 130px;
	}

	.fail_msg {
		margin-top: 20px;
		text-indent: 2em;
		height: 200px;
	}

	.popup_d {
		width: 350px;
		height: 350px;
		padding: 10px;
	}

	.again {
		position: relative;
		top: -10px;
		left: 160px;
		border: 1px solid #fff;
		padding: 3px;
		background: rgb(98, 153, 241);
		width: 90px;
		text-align: center;
		line-height: 30px;
		border-radius: 20px;
		color: #fff;
	}

	.sx_qh {
		height: 48px;
	}

	.item {
		color: $u-content-color;
		font-size: 28rpx;
	}

	.dv_img {
		line-height: 12px;
	}

	.core {
		padding-bottom: 60px;

		.core_div {
			// font-size: 0.9rem;
			// height: 130px;
			margin: 10px;
			border-radius: 2px;
			background-color: #fff;
		}

		.core_buttom {
			height: 90px;
		}



		.core_buttom .float_l {
			border-right: 1px solid #ccc;
			width: 50%;
		}

		.core_buttom p:first-child {
			text-align: center;
			margin-bottom: 10px;
		}

		.bank {
			position: absolute;
			left: 60px;
			margin-top: -20px;
		}

		.core_buttom p:first-child img {
			margin-left: -6px;
		}

		.state img {
			vertical-align: middle;
			margin-right: 10px;
		}

		.state span {
			// font-size: 0.8rem;
		}

		.close {
			// font-size: 0.9rem;
			color: rgb(38, 190, 201);
			text-align: center;
			float: both;
			margin: 2px 10px 2px 10px;
			padding: 10px;
			background-color: #fff;
			height: 20px;
			line-height: 20px;
		}
	}

	.tx_tip {
		position: absolute;
		top: -34px;
		right: 22px;
		z-index: 9999;
		// font-size: 0.8rem;
		color: rgb(238, 10, 36);
		// border: 1px solid rgb(238, 10, 36);
		padding: 3px;
		width: 70px;
		border-radius: 20px;
	}
</style>
