<template>
	<view>
		<u-mask :show="maskShow">
			<view class="warp">
				<u-loading mode="flower" size="60"></u-loading>
			</view>
		</u-mask>
		<u-toast ref="uToast" />
		<div class="log_div p_relative">
			<div class="log_bom">
				<div class="log_main">
					<h2 class="log_h2 m_t20 m_b20">欢迎登录</h2>
					<view class="u_view">
						<u-input v-model="username" type="type" border="border" border-color="#ccc" placeholder="请输入用户名/手机号"
							class="m_b20" />
						<u-input v-model="password" type="password" border="border" border-color="#ccc"
							placeholder="请输入密码" class="m_b20" />
					</view>
					<div>
						<navigator url="/pages/info/findpsd">
							<view>
								<div class="forget_pwd">忘记密码?</div>
							</view>
						</navigator>
						<u-button size="medium" slot="right" type="success" @click="onSubmit" class="m_t20">登录
						</u-button>
					</div>
				</div>
			</div>
		</div>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				maskShow: false,
				username: "",
				password: ""
			};
		},
		methods: {
			onSubmit() {
				var that = this
				that.maskShow = true
				//发送 POST 请求
				that.$axios.post('/agent/user/login', JSON.stringify({ //这里将json格式转成string格式发送
					CellPhone: that.username,
					Psd: that.password,
				})).then(function(response) {
					if (response.data.Code === 200) {
						if (response.data.Data != null && response.data.Data != undefined) {
							window.sessionStorage.setItem('token', response.data.Data)
							that.$refs.uToast.show({
								title: '登录成功',
								type: 'success'
							})
							that.maskShow = false
							window.setTimeout(window.location.href = '/', 6000)
						} else {
							that.$refs.uToast.show({
								title: '登录失败',
								type: 'erro'
							})
							that.maskShow = false
						}

					} else {
						that.$refs.uToast.show({
							title: `${response.data.ErrorMessage}`,
							type: 'error'
						})
						that.maskShow = false
					}
				}).catch(function(error) {
					console.log(error)
					that.$refs.uToast.show({
						title: `请求失败`,
						type: 'erro'
					})
					that.maskShow = false
				})

			}
		}
	}
</script>

<style lang="scss">
	.uni-input-input {
		width: 100% !important;
	}
	.warp {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	.forget_pwd {
		margin: 0px 30px;
		text-align: left;
		color: rgb(0, 123, 255);
	}

	page,
	.u-btn {
		background: rgb(111, 153, 232);
	}

	.u_view {
		margin: 0px 30px;
		text-align: center;
	}

	.u-size-medium {
		width: 200px;
	}

	.log_div {
		min-height: 625px;
		height: 100%;
		// line-height: 100%;
		text-align: center;
		margin: 0 auto;
		// background: rgb(111, 153, 232);
	}

	.log_main {
		height: 350px;
		width: 350px;
		position: absolute;
		top: 20%;
		// width: 350px;
		border-radius: 5px;
		border: 1px solid #fff;
		// box-shadow: 0px 0px 2px 2px rgb(231, 251, 254);
		background-color: #fff;
		// margin-left: 25px;
	}

	.log_bom {
		display: flex;
		justify-content: center;
	}

	.log_btn {
		margin: 16px;
		margin-top: 50px;
	}

	.wj_psd {
		font-size: 13px;
		font-size: #ccc;
	}

	.log_h2 {
		height: 50px;
		line-height: 50px;
	}
</style>
