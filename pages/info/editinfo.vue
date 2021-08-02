<template>
	<view>
		<div>
			<van-form validate-first @failed="onFailed">
				<van-field
				  v-model="tjPhone"
								label="推荐人"
								readonly="readonly"
				/>
				<van-field
				  v-model="nickname"
								label="昵称"
								readonly="readonly"
				/>
				<van-field class="nick"
				  v-model="newNickName"
				  name="pattern"
				  placeholder="请输入新昵称"
				  :rules="[{ pattern, message: '请输入正确昵称' }]"
				/>
			  <van-field
			    v-model="role"
			  				label="角色"
			  				readonly="readonly"
			  />
			  <van-field
			    v-model="userName"
			  				label="用户名"
			  				readonly="readonly"
			  />
			  <van-field
			    v-model="phone"
			  				label="手机号"
			  				readonly="readonly"
			  />
			  <div style="margin: 16px;">
			    <van-button round block type="info" native-type="submit">提交</van-button>
			  </div>
			</van-form>
		</div>
		<buttom></buttom>
	</view>
</template>

<script>
	import buttom from '../buttom/buttom.vue'
	export default {
		data() {
			return {
				tjPhone: '13512345678',
				nickname:'嘻嘻哈哈',
				      role: 'F1',
				      userName: 'qq',
					  newNickName:'',
					  phone:'13709065231',
				      pattern: /\S/,
					  readonly:true
			}
		},
		methods: {
		    onFailed(errorInfo) {
		      console.log('failed', errorInfo);
		    },
		  },
		components: {
			buttom
		}
	}
</script>

<style lang="scss" scoped>
.nick{
	padding-left: 110px;
}
.warp {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100%;
		}
</style>
