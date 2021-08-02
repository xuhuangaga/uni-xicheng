<template>
	<view>
		<u-mask :show="maskShow">
			<view class="warp">
				<u-loading mode="flower" size="60"></u-loading>
			</view>
		</u-mask>
		<u-toast ref="uToast" />
		<u-field v-model="phone" name='phone' label="手机号码" placeholder="请输入手机号码" required />
		<div class="flex">
			<u-field v-model="code" name="code" label="验证码" placeholder="请输入验证码" required class="code" />
			<div class="gain_code" @click="sendCode">验证码</div>
		</div>
		<u-field v-model="password" type="password" name="password" label="新密码" placeholder="请输入新密码" required />
		<u-field v-model="confirmPassword" type="password" name="confirmPassword" label="确认密码" placeholder="请输入确认密码"
			required />
		<div class="t_a_center m_15">
			<u-button round block type="info" native-type="submit" @click="findPsd" class="bgc_b">提交
			</u-button>
		</div>
	</view>
</template>

<script>
	import $ from 'jquery-2.1.4.js'
	export default {
		data() {
			return {
				maskShow:false,
				phone: '',
				code: '',
				password: '',
				confirmPassword: '',
				timeOunt: 120
			}
		},
		methods: {
			findPsd: function() {
				var that = this
				if (that.password !== that.confirmPassword) {
					that.$refs.uToast.show({
						title: '新密码和和确认密码输入不一致',
						type: 'erro'
					})
				} else {
				that.maskShow = true
					var data = new FormData();
					console.log(that.code)
					data.append('code', that.code);
					data.append('pwd', that.password);
					data.append('cellPhone', that.phone);
					let timer = setTimeout(()=>{
						this.$axios.patch('/agent/user/findpwd', data, {
								headers: {
									"Content-Type": "application/x-www-form-urlencoded"
								}
							})
							.then(function(res) {
								// console.log(res)
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
					},1000)
					
				}
			},
			sendCode() {
				var that = this;
				if (that.phone.trim() != undefined && that.phone.trim() != '') {
					if (that.timeOunt == 120) {
						//使用axios请求后台代码（发送验证码）
						var formData = new FormData()
						formData.append('cellPhone', that.phone)
						formData.append('method', 'findpsd')
						this.$axios.post('/agent/public/sendsms',
								formData, {
									headers: {
										"Content-Type": "application/x-www-form-urlencoded"
									}
								})
							.then(function(res) {
								console.log(res)
								if (res.data.ErrorMessage != "") {
									Toast.fail(res.data.ErrorMessage)
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

					}

				} else {
					that.$refs.uToast.show({
						title: '请输入手机号',
						type: 'erro'
					})
				}
			}
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
