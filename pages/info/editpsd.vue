<template>
	<view>
		<u-mask :show="maskShow">
			<view class="warp">
				<u-loading mode="flower" size="60"></u-loading>
			</view>
		</u-mask>
		<u-toast ref="uToast" />
		<u-tabs :list="list" :is-scroll="false" :current="current" @change="change"></u-tabs>
		<div v-show="isLoginShow" title="登录密码">
			<u-field v-model="oldLPsd" name="oldLPsd" type="password" label="原始密码" placeholder="请输入原始密码" required />
			<u-field v-model="newLPsd" name="newLPsd" type="password" label="新密码" placeholder="请输入新密码" required />
			<u-field v-model="confimLPsd" type="password" name="confimLPsd" label="确认密码" placeholder="请输入确认密码"
				required />
			<div class="t_a_center m_15">
				<u-button round block type="info" native-type="submit" @click="changeLPsd" class="bgc_b">提交
				</u-button>
				<navigator url="findpsd">
					<view class="findpsd">
						<div class='forget'>忘记原始密码?</div>
					</view>
				</navigator>
			</div>
		</div>
		<div v-show="isPayShow" title="支付密码">
			<u-field v-model="phone1" name="phone1" label="手机号" disabled />
			<div class="flex">
				<u-field v-model="code1" name="code1" label="验证码" placeholder="请输入验证码" required />
				<div class="gain_code" @click="sendCode">获取验证码</div>
			</div>
			<u-field v-model="payPwd" type="password" name="payPwd" label="支付密码" placeholder="请输入支付密码" required />
			<div class="t_a_center m_15">
				<u-button round block type="info" native-type="submit" @click="changePayPwd" class="bgc_b">提交
				</u-button>
			</div>
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
				isLoginShow: true,
				isPayShow: false,
				username: '',
				oldLPsd: '', //原始登录密码
				newLPsd: '', //新登录密码
				confimLPsd: '', //确认登录密码
				phone: '',
				code: '',
				timeOunt: 120,
				password: '',
				phone1: '',
				code1: '',
				payPwd: '',
				list: [{
					name: '登录密码'
				}, {
					name: '支付密码'
				}],
				current: 0
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
						// console.log(res)
						var data = res.data
						if (data.ErrorMessage != "") {
							console.log(res.data.ErrorMessage)
						} else {
							if (data.Code === 200) {
								// console.log(data.Data.CellPhone)
								that.phone1 = data.Data.CellPhone
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
			change(index) {
				this.current = index;
				if (index === 0) {
					this.isLoginShow = true
					this.isPayShow = false
				} else {
					this.isLoginShow = false
					this.isPayShow = true
				}
			},
			//修改支付密码
			changePayPwd() {
				var that = this
				if (that.phone1.trim() != undefined && that.phone1.trim() != '') {
					that.maskShow = true
					var data = new FormData();
					data.append('code', that.code1);
					data.append('pwd', that.payPwd);
					let timer = setTimeout(() => {
						this.$axios.patch('/agent/user/setpaypwd', data, {
								headers: {
									"Content-Type": "application/x-www-form-urlencoded"
								}
							})
							.then(function(res) {
								if (res.data.Code === 200) {
									that.$refs.uToast.show({
										title: '操作成功',
										type: 'success',
										url: '/pages/info/editpsd'
									})
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
						title: '请输入手机号',
						type: 'erro'
					})
				}
			},
			//修改登录密码
			changeLPsd: function() {
				var that = this
				if (that.newLPsd !== that.confimLPsd) {
					that.$refs.uToast.show({
						title: '新密码和确认密码输入不一致',
						type: 'erro'
					})
				} else {
					that.maskShow = true
					var formData = new FormData();
					formData.append("oldPwd", that.oldLPsd);
					formData.append("newPwd", that.newLPsd);
					let timer = setTimeout(() => {
						that.$axios.patch('/agent/user/updatepwd',
								formData, {
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
							})
							.catch(function(error) {
								console.log(erro)
								that.$refs.uToast.show({
									title: `请求失败`,
									type: 'erro'
								})
							});
						that.maskShow = false
						//清除计时器
						clearTimeout(timer)
					}, 1000)
				}
			},
			sendCode() {
				var that = this;
				// console.log(that.phone1)
				if (that.phone1.trim() != undefined && that.phone1.trim() != '') {
					if (that.timeOunt == 120) {
						//使用axios请求后台代码（发送验证码）
						var formData = new FormData()
						formData.append('cellPhone', that.phone1)
						formData.append('method', 'findpaypsd')
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
