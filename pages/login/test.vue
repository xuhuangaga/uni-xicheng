<template>
	<view>
		<u-notice-bar mode="horizontal" :list="list"></u-notice-bar>

		<u-notice-bar mode="horizontal" :is-circular="false" :list="list"></u-notice-bar>

		<u-notice-bar mode="vertical" :list="list"></u-notice-bar>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [
					'寒雨连江夜入吴',
					'平明送客楚山孤',
					'洛阳亲友如相问',
					'一片冰心在玉壶'
				]
			}
		},
		created: function() {
			this.onSubmit()
		},
		methods: {
			onSubmit() {
				var that = this
				alert('onSubmit')

				//发送 POST 请求
				that.$axios.get('/agent/user/test')
					.then(function(response) {
						console.log(response)
						if (response.data.Code === 200) {
							// alert('code=200')
							console.log(response.data)
						} else {
							// alert('code!=200')
						}
					}).catch(function(error) {
						alert(error + '请求失败')
					})
			}
		}
	}
</script>
