<template>
	<view>
		<u-tabs :list="list" :is-scroll="false" :current="current" @change="change"></u-tabs>
		<view>
			<view class="item u-border-bottom">
				<div v-show="isTeamTopShow" class="log_top" style="height: 170px;">
					<div class="log_top_div">
						<p>{{teamCount}}</p>
						<p>总人数（个）</p>
					</div>
					<div class="flex_j_around">
						<div class="log_left_div">
							<p>{{zjTeamCount}}</p>
							<p>直推人数（个）</p>
						</div>
						<div class="log_right_div">
							<p>{{jtTeamCount}}</p>
							<p>间推人数（个）</p>
						</div>
					</div>
				</div>
				<div class="log_bottom m_t10">
					<!-- 签约区域 -->
					<div class="areaList" v-for="item in myAreaList">
						<div class="areaList_l">
							<div class="areaList_lt">
								<div>{{item.AddressName}}</div>
								<div class="area red" v-if="item.Level===0">省级</div>
								<div class="area orange" v-if="item.Level===1">市级</div>
								<div class="area green" v-if="item.Level===2">区县</div>
							</div>
							<div>{{item.CreateTime}}</div>
						</div>
						<div class="areaList_r">
							<div class="yx">{{item.Ratio}}%</div>
						</div>
					</div>
					<!-- 签约酒店 -->
					<div v-for="item in myHotelList" class="list_card">
						<p class="float_l list_p">
							<img src="../../static/hotel.svg" alt="" width="40px" height="60px">
						</p>
						<div class="list_div">
							<p class="float_r">{{item.phone}}</p>
							<p>{{item.name}}</p>
							<p>{{item.address}}</p>
						</div>
					</div>
					<!-- 我的团队 -->
					<div v-for="item in myAgentList" class="team_card">
						<p class="float_l list_p">
							<img src="../../static/person.svg" alt="" width="40px" height="60px">
						</p>
						<div class="list_div">
							<p class="float_r">{{item.RoleName}}</p>
							<p>{{item.TrueName}}</p>
							<p>{{item.CellPhone}}</p>
							<p>{{item.RelationCount}}人</p>
						</div>
					</div>
				</div>
			</view>
			<u-loadmore :status="status" />
		</view>
		<buttom></buttom>
	</view>
</template>

<script>
	import buttom from '../buttom/buttom.vue'
	import axios from 'axios'
	export default {
		data() {
			return {
				isTeamTopShow: false,
				list: [{
					name: '签约区域',
					count: 0
				}, {
					name: '签约酒店',
					count: 0
				}, {
					name: '我的团队',
					count: 0
				}],
				zjTeamCount: 0,
				jtTeamCount: 0,
				teamCount: 0,
				current: 0,
				page: 1,
				myAreaList: [], //签约区域数据
				myHotelList: [], //签约酒店数据
				myAgentList: [], //我的团队数据
				status: 'loadmore',
				pageSize: 20
			}
		},
		components: {
			buttom
		},
		mounted: function() {
			this.current = Number(this.$route.query.index)
			switch (this.current) {
				case 0:
					this.getAreaInfo(this.page)
					break;
				case 1:
					this.getHotelInfo(this.page)
					break;
				default:
					this.isTeamTopShow = true
					this.getAgentInfo(this.page)
					break;
			}
		},
		methods: {
			change(index) {
				var that = this
				that.isTeamTopShow = false
				that.status = 'loadmore'
				that.page = 1
				that.current = index;
				that.myAgentList = []
				that.myHotelList = []
				that.myAreaList = []
				switch (index) {
					//获取签约区域数据
					case 0:
						that.getAreaInfo(that.page)
						break;
						//获取签约酒店数据
					case 1:
						that.getHotelInfo(that.page)
						break;
						//获取我的团队数据
					case 2:
						that.isTeamTopShow = true
						that.getAgentInfo(that.page)
						break;
				}
			},
			//获取签约区域数据
			getAreaInfo(page) {
				var that = this
				// console.log(that.current)
				that.$axios.post('/HotelAPI/agentarea', JSON.stringify({
						pageSize: 20, // 每页请求条数
						pageIndex: that.page // 请求的页面
					}))
					.then(res => {
						// console.log(res)
						that.status = 'nomore';
						// 当请求成功
						if (res.data.Code === 200) {
							// console.log(res.data.Data.length)
							if (res.data.Data != null && res.data.Data.length > 0) {
								that.myAreaList = that.myAreaList.concat(res.data.Data)
								that.list[that.current].count = res.data.DataCount
								if (res.data.DataCount > that.pageSize)
									that.status = 'loading';
							}
						}
					})
					.catch(error => {
						console.log(error)
					});
			},
			//获取签约酒店数据
			getHotelInfo(page) {
				var that = this
				// console.log(page)
				that.$axios.post('/HotelAPI/hotel', JSON.stringify({
						pageSize: 20, // 每页请求条数
						pageIndex: that.page // 请求的页面
					}))
					.then(res => {
						console.log(res)
						that.status = 'nomore';
						// 当请求成功
						if (res.data.Code === 200) {
							if (res.data.Data != null && res.data.Data.length > 0) {
								that.myHotelList = that.myHotelList.concat(res.data.Data)
								that.list[that.current].count = res.data.DataCount
								if (res.data.DataCount > that.pageSize)
									that.status = 'loading';
							}
						}
					})
					.catch(error => {
						console.log(error)
					});
			},
			//获取我的团队数据
			getAgentInfo(page) {
				var that = this
				that.$axios.get('/agent/user/getteam', {
						params: {
							pageSize: that.pageSize, // 每页请求条数
							pageIndex: that.page // 请求的页面
						}
					})
					.then(res => {
						console.log(res)
						// 当请求成功
						that.status = 'nomore';
						if (res.data.Code === 200) {
							if (res.data.Data != null && res.data.Data.TeamUserInfoModels.length > 0) {

								that.myAgentList = that.myAgentList.concat(res.data.Data.TeamUserInfoModels)
								that.list[that.current].count = res.data.DataCount
								that.teamCount = res.data.Data.RelationCount
								that.zjTeamCount = res.data.Data.LayerOne
								that.jtTeamCount = res.data.Data.LayerTwo
								if (res.data.DataCount > that.pageSize)
									that.status = 'loading';
							}
						}
					})
					.catch(error => {
						console.log(error)
					});
			},
			onReachBottom() {
				var that = this
				// if (that.page >= 3) return;
				that.status = 'loading';
				that.page = ++that.page;
				setTimeout(() => {
					switch (that.current) {
						//签约区域
						case 0:
							that.getAreaInfo(that.page)
							break;
							//签约酒店
						case 1:
							that.getHotelInfo(that.page)
							break;
							//我的团队
						case 2:
							that.getAgentInfo(that.page)
							break;
					}
				}, 2000)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.noData {
		text-align: center;
	}

	.yx {
		color: #fff;
		background: #66b2ff;
		text-align: center;
		line-height: 60px;
		height: 60px;
		border-radius: 100%;
		width: 60px;
	}

	.areaList {
		padding: 10px;
		display: flex;
		justify-content: space-between;
		color: rgb(120, 120, 120);
		background-color: #fff;
		margin: 2px;
		border-radius: 5px;
	}

	.areaList_lt {
		display: flex;
		align-items: center;
		margin-bottom: 20px;
	}

	.red {
		background: rgb(255, 0, 0);
	}

	.green {
		background: rgb(0, 255, 128);
	}

	.orange {
		background: rgb(255, 128, 0);
	}

	.area {
		margin-left: 5px;
		color: #fff;
		color: #fff;
		padding: 2px;
		width: 46px;
		text-align: center;
		border-radius: 3px;
	}

	.float_l {
		float: left;
	}

	.float_r {
		float: right;
	}



	.log_top {
		height: 120px;
		background: url('/static/log_bgm.png') no-repeat;
		background-color: rgb(242, 242, 242);
		text-align: center;

		.log_top_div p:first-child {
			// font-size: 2rem;
		}

		.log_top_div p:nth-child(2) {
			// font-size: 0.8rem;
		}

		.log_top_div {
			color: #fff;
			padding-top: 25px;
			margin-bottom: 25px;
			text-align: center;
		}

		.log_left_div,
		.log_right_div {
			color: #fff;
			// font-size: 0.8rem;
		}

		.log_left_div p,
		.log_right_div p {
			margin-bottom: 10px;
		}
	}

	.log_bottom {
		height: 100%;
		background-color: rgb(242, 242, 242);
	}

	.log_bottom .van-pull-refresh {
		width: 100%;
	}

	.van-list {
		// font-size: 0.65rem;
		color: rgb(121, 53, 0);
	}

	.list_card {
		border: 1px solid #fff;
		padding: 10px;
		margin: 2px;
		background-color: #fff;
		border-radius: 5px;
		height: 70px;
		line-height: 35px;
	}

	.team_card {
		border: 1px solid #fff;
		padding: 10px;
		margin: 2px;
		background-color: #fff;
		border-radius: 5px;
	}

	.list_div {
		margin-left: 60px;
	}

	.list_div p {
		margin-bottom: 4px;
	}
</style>
