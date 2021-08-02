<template>	
	<view>
		<view class="u-page">
				<!-- <a href="/pages/index/index">ssss</a> -->
					<!-- 所有内容的容器 -->
				</view>
				<!-- 与包裹页面所有内容的元素u-page同级，且在它的下方 -->
				<u-tabbar v-model="current" :list="list"></u-tabbar>
	</view>
</template>

<script>
	export default {
			data() {
				return {
					list: [{
							iconPath: "home",
							selectedIconPath: "home-fill",
							text: '首页',
							isDot: false,
							customIcon: false,
							pagePath:'/pages/index/index'
						},
						{
							iconPath: "account",
							selectedIconPath: "account-fill",
							text: '我的',
							isDot: false,
							customIcon: false,
							pagePath:'/pages/info/info'
						},
					],
					current: 0
				}
			},
		}
</script>

<style>

</style>
