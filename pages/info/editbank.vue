<template>
	<view>
		<u-mask :show="maskShow">
			<view class="warp">
				<u-loading mode="flower" size="60"></u-loading>
			</view>
		</u-mask>
		<u-toast ref="uToast" />
		<u-field v-model="userName" label="开户人姓名" placeholder="请输入开户人姓名" required />
		<u-field v-model="phone" label="预留手机号" placeholder="请输入预留手机号" required />
		<u-field v-model="cardNo" label="银行卡号" placeholder="请输入银行卡号" required />
		<u-field v-model="idCard" label="身份证号码" placeholder="请输入身份证号码" required />
		<u-field readonly clickable v-model="picker" :value="value" label="开户行" required placeholder="请选择开户行"
			@click="showPicker = true" />
		<u-select v-model="showPicker" mode="single-column" :list="columns" @confirm="confirm"></u-select>

		<u-field v-model="branch" label="开户行支行" required />
		<div class="t_a_center m_15">
			<u-button round block type="info" native-type="submit" @click="onSubmit" class="bgc_b">提交</u-button>
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
				value: '',
				columns: [{
						value: '中国工商银行',
						label: '中国工商银行'
					},
					{
						value: '中国农业银行',
						label: '中国农业银行'
					},
					{
						value: '中国银行',
						label: '中国银行'
					},
					{
						value: '中国建设银行',
						label: '中国建设银行'
					},
					{
						value: '中国邮政储蓄银行',
						label: '中国邮政储蓄银行'
					},
					{
						value: '交通银行',
						label: '交通银行'
					},
					{
						value: '招商银行',
						label: '招商银行'
					},
					{
						value: '上海浦东发展银行',
						label: '上海浦东发展银行'
					}
				],
				showPicker: false,
				userName: '',
				phone: '',
				cardNo: '',
				idCard: '',
				branch: '',
				picker: ''
			};
		},
		created: function() {
			var that = this
			that.getInfo()
		},
		methods: {
			getInfo: function() {
				var that = this
				that.$axios.get('/agent/user/getbankinfo')
					.then(function(res) {
						// console.log(res)
						if (res.data.Code === 200 && res.data.Data != null) {
							var data = res.data.Data
							that.userName = data.TrueName
							that.phone = data.Mobile
							that.cardNo = data.CardNumber
							that.idCard = data.IdCard
							that.branch = data.BankBranch
							that.picker = data.BankName
						} else {
							console.log('获取结算卡信息失败！原因：' + res.data.ErrorMessage)
						}
					})
					.catch(function(erro) {
						console.log(erro)
					})
			},
			// 注意返回值为一个数组，单列时取数组的第一个元素即可(只有一个元素)
			confirm(e) {
				this.picker = e[0].value
				this.showPicker = false
			},
			onSubmit: function() {
				var that = this
				that.maskShow = true
				//延迟一秒请求
				let timer = setTimeout(() => {
					that.$axios.post('/agent/user/bindbank', JSON.stringify({
							TrueName: that.userName,
							Mobile: that.phone,
							BankName: that.picker,
							BankBranch: that.branch,
							CardNumber: that.cardNo,
							IdCard: that.idCard
						}))
						.then(res => {
							// console.log(res)
							if (res.data.Code === 200 && res.data.Data) {
								that.$refs.uToast.show({
									title: '操作成功',
									type: 'success'
								})
							} else {
								that.$refs.uToast.show({
									title: `${res.data.ErrorMessage}`,
									type: 'erro'
								})
							}
						})
						.catch(erro => {
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
			},
		},
		components: {
			buttom
		}
	};
</script>

<style lang="scss" scoped>
	.warp {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100%;
		}
</style>
