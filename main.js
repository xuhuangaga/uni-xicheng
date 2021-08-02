import Vue from 'vue'
import App from './App'
import uView from "uview-ui";
import axios from 'axios';
// import router from './router'
// import { RouterMount } from 'uni-simple-router'


// Vue.use(Router)
Vue.use(uView);

axios.defaults.timeout = 5000; // 在超时前，所有请求都会等待 5 秒
 axios.defaults.baseURL = 'http://192.168.191.104:3001/api'; // 配置接口地址
// axios.defaults.baseURL = '/api';
var token = window.sessionStorage.getItem('token');
axios.interceptors.request.use(
	config => {
		// console.log(token);
		if (token != null && token != undefined) {
			config.headers['content-type'] = 'application/json';
			config.headers.Authorization = 'Bearer ' + token; //把localStorage的token放在Authorization里
		}
		return config;
	},
	function(err) {
		console.log("失败信息" + err);
	}
);
//拦截器
axios.interceptors.response.use(
	response => {
		return response
	},
	error => {
		if (error.response) {
			// alert(error.response.status)
			switch (error.response.status) {
				case 401:
					// 超时重新登录
					uni.showModal({
						title: '提示',
						content: '您已超时,请重新登录!',
						showCancel: false,
						icon: 'success',
						success: function(e) {
							if (e.confirm) {
								uni.redirectTo({
									url: 'pages/login/login'
								})
							}
						}
					});
					case 500:
					// 超时重新登录
					uni.showModal({
						title: '提示',
						content: '您已超时,请重新登录!',
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
			}
			
		}
		return Promise.reject(error.response.data) // 返回接口返回的错误信息
	})

Vue.prototype.$axios = axios
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App
})
// RouterMount(app,'#app');
app.$mount()
