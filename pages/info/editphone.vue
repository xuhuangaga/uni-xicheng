<template>
	<view>
		<u-mask :show="maskShow">
			<view class="warp">
				<u-loading mode="flower" size="60"></u-loading>
			</view>
		</u-mask>
		<u-toast ref="uToast" />
		<u-field v-model="newPhone" label="新手机号码" placeholder="请输入新手机号码" required />
		<u-field v-model="phone" label="旧手机号码" disabled />
		<div class="flex">
			<u-field v-model="code" label="验证码" placeholder="请输入验证码" required />
			<div class="gain_code" @click="sendCode">获取验证码</div>
		</div>
		<div class="t_a_center m_15">
			<u-button round block type="info" native-type="submit" @click="changePhone" class="bgc_b">提交
			</u-button>
		</div>

		<buttom></buttom>
	</view>
</template>

<script>
	import buttom from '../buttom/buttom.vue'
	import $ from 'jquery-2.1.4.js'
	export default {
		data() {
			return {
				maskShow: false,
				// 旧手机
				phone: '',
				// 新手机
				newPhone: '',
				code: '',
				timeOunt: 120
			};
		},
		mounted: function() {
			this.timeOunt = 120
			this.getOldPhone()
		},
		methods: {
			//获取原手机号码
			getOldPhone() {
				var that = this
				that.$axios.get('/agent/user/getuser')
					.then(function(res) {
						console.log(res)
						var data = res.data
						if (data.ErrorMessage != "") {
							console.log(res.data.ErrorMessage)
						} else {
							if (data.Code === 200) {
								that.phone = data.Data.CellPhone
							} else {
								console.log(data.ErrorMessage)
							}
						}
					})
					.catch(function(error) {
						// console.log('333')
						console.log(error);
					});
			},
			//修改手机号码
			changePhone() {
				var that = this
				if (that.newPhone.trim() != undefined && that.newPhone.trim() != '') {
				that.maskShow = true
					var data = new FormData();
					data.append('code', that.code);
					data.append('newPhone', that.newPhone);
					let timer = setTimeout(() => {
						this.$axios.patch('/agent/user/updatephone', data, {
								headers: {
									"Content-Type": "application/x-www-form-urlencoded"
								}
							})
							.then(function(res) {
								if (res.data.Code === 200) {
									window.sessionStorage.setItem('token', '')
									uni.showModal({
										title: '提示',
										content: '操作成功,请重新登录!',
										showCancel: false,
										icon: 'success',
										success: function(e) {
											if (e.confirm) {
												uni.redirectTo({
													url: '/pages/login/login'
												})
											}
										}
									});
								} else {
									that.$refs.uToast.show({
										title: `${res.data.ErrorMessage}`,
										type: 'erro'
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
					}, 1000)

				} else {
					that.$refs.uToast.show({
						title: '请输入新手机号码',
						type: 'erro'
					})
				}
			},
			sendCode() {
				var that = this;
				// console.log(that.phone1)
				if (that.phone.trim() != undefined && that.phone.trim() != '') {
					if (that.timeOunt == 120) {
						//使用axios请求后台代码（发送验证码）
						var formData = new FormData()
						formData.append('cellPhone', that.phone)
						formData.append('method', 'updatephone')
						this.$axios.post('/agent/public/sendsms',
								formData, {
									headers: {
										"Content-Type": "application/x-www-form-urlencoded"
									}
								})
							.then(function(res) {
								console.log(res)
								if (res.data.ErrorMessage != "") {
									that.$refs.uToast.show({
										title: `${res.data.ErrorMessage}`,
										type: 'error'
									})
								} else {
									if (res.data.Code === 200) {
										// console.log('发送验证码调用接口成功')
										that.timeOunt--;
										$('.gain_code').text(that.timeOunt);
										//调用接口发送验证码

										var setInt = setInterval(() => {
											that.timeOunt -= 1;
											if (that.timeOunt >= 0) {
												$('.gain_code').text(that.timeOunt);
												// 调用接口发送验证码
											} else {
												clearInterval(setInt);
												$('.gain_code').text("获取验证码");
												that.timeOunt = 120;
											}
										}, 1000);
									} else {
										console.log(res.data.ErrorMessage)
									}
								}

							})
							.catch(function(error) {
								console.log(error);
							});
						if (true) {

						}
					}
				} else {
					that.$refs.uToast.show({
						title: '请输入手机号',
						type: 'erro'
					})
				}
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
	.forget {
		font-size: 0.8rem;
		text-align: center;
		margin-top: 10px;
	}

	.gain_code {
		margin: 5px 0px 0px 10px;
		background: #1989fa;
		font-size: 14px;
		width: 120px;
		height: 40px;
		text-align: center;
		line-height: 40px;
		color: #fff;
		border-radius: 3px;
	}
</style>
