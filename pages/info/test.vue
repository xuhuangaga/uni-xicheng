<template>
	<u-select v-model="show" mode="mutil-column" :list="list" @confirm="confirm"></u-select>
</template>

<script>
	export default {
		data() {
			return {
				show: true,
				list: [
					[
						{
							value: '1',
							label: '江'
						},
						{
							value: '2',
							label: '湖'
						}
					],
					[
						{
							value: '3',
							label: '夜'
						},
						{
							value: '4',
							label: '雨'
						}
					],
					
				],
			}
		},
		methods: {
			// 回调参数为包含多个元素的数组，每个元素分别反应每一列的选择情况
			confirm(e) {
				console.log(e);
			}
		}
	}
</script>