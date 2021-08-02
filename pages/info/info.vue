<template>
	<view>
		<div class="info">
			<div class="info_top">
				<p class="float_l info_top_img">
					<img src="../../static/agent.svg" alt="" width="50px" height="50px">
				</p>
				<div class="info_top_p">
					<p>{{userName}}</p>
					<p>{{roleName}}</p>
				</div>
			</div>
			<div class="info_buttom">
				<div class="sh_data">
					<navigator url="./editbank">
						<view>
							<div class="flex_j_between a_center sh_data_top">
								<div class="flex">
									<div>
										<img src="../../static/bank.svg" alt="" width="20px" height="20px">
									</div>
									<div class="m_l10">结算卡修改</div>
								</div>
								<div>
									<u-icon name="arrow-right" class="float_r" />
								</div>
							</div>
						</view>
					</navigator>
					<hr size="1" />
					<navigator url="editpsd">
						<view>
							<div class="flex_j_between a_center sh_data_top">
								<div class="flex">
									<div>
										<img src="../../static/changepsd.svg" alt="" width="20px" height="20px">
									</div>
									<div class="m_l10">修改密码</div>
								</div>
								<div>
									<u-icon name="arrow-right" class="float_r" />
								</div>
							</div>
						</view>
					</navigator>
					<hr size="1" />
					<navigator url="editphone">
						<view>
							<div class="flex_j_between a_center sh_data_top">
								<div class="flex">
									<div>
										<img src="../../static/changePhone.svg" alt="" width="20px" height="20px">
									</div>
									<div class="m_l10">修改手机号码</div>
								</div>
								<div>
									<u-icon name="arrow-right" class="float_r" />
								</div>
							</div>
						</view>
					</navigator>
				</div>
				<!-- <div class="sh_data">
					<div class="flex_j_between a_center sh_data_top">
						<div class="flex">
							<div><img src="../../static/about.svg" alt="" width="25px" height="25px"></div>
							<div class="m_l10">关于我们</div>
						</div>
						<div>
							<u-icon name="arrow-right" class="float_r" />
						</div>
					</div>
				</div> -->
				<div class="sh_data t_a_center m_b10 sh_data_top p_20">
					<span @click='logOut'>退出登录</span>
				</div>
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
				userName: '',
				roleName: ''
			}
		},
		mounted: function() {
			this.getInfo()
		},
		methods: {
			getInfo() {
				var that = this
				that.$axios.get('/agent/user/getuser')
					.then(function(res) {
						// console.log(res)
						var data = res.data
						if (data.ErrorMessage != "") {
							console.log(res.data.ErrorMessage)
						} else {
							if (data.Code === 200) {
								that.roleName = data.Data.RoleName
								that.userName = data.Data.TrueName
							} else {
								console.log(data.ErrorMessage)
							}
						}
					})
					.catch(function(error) {
						console.log('333')
						console.log(error);
					});
			},
			logOut() {
				window.sessionStorage.setItem('token', '')
				window.setTimeout(window.location.href = '/#/pages/login/login', 6000)
			}
		},
		components: {
			buttom
		}
	}
</script>

<style lang="scss" scoped>
	.float_l {
		float: left;
	}

	.float_r {
		float: right;
	}

	.info {
		background-color: rgb(242, 242, 242);
		height: 100%;

		.info_top {
			background-color: #fff;
			height: 70px;
			padding-top: 25px;

			.info_top_img {
				border: 1px solid #ccc;
				border-radius: 25px;
				margin-left: 25px;
			}

			.info_top_p {
				font-size: 0.8rem;
				margin-left: 95px;
			}

			.info_top_p p:nth-child(2) {
				margin-top: 5px;
				margin-left: -5px;
				background-color: rgb(32, 192, 180);
				width: 70px;
				border-radius: 15px;
				color: #fff;
				padding: 5px;
				font-size: 0.6rem;
				text-align: center;
			}
		}
	}

	.info_buttom {
		background-color: rgb(242, 242, 242);

		.sh_data {
			background-color: #fff;
			margin-top: 10px;

			.sh_data_top {
				height: 50px;
				line-height: 50px;
				padding: 0px 10px 0px 5px;
			}

			.sh_data_top img {
				vertical-align: middle;
			}

			.sh_data_top span {
				margin-left: 10px;
				font-size: 0.8rem;
				color: rgb(85, 85, 85);
			}

			.u-icon {
				line-height: 50px;
				width: 20px;
				height: 20px;
			}

			hr {
				color: rgb(121, 53, 0);
				margin: 0px 10px 10px 10px;
			}
		}

	}
</style>
