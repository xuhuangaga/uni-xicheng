const files = require.context('.', false, /\.js$/)
const home = [{
	//注意：path必须跟pages.json中的地址对应，最前面别忘了加'/'哦
	path: '/pages/index/index',
	aliasPath:'/', //对于h5端你必须在首页加上aliasPath并设置为/
	name: 'index',
	meta: {title: '首页',},
},
{
	path: '/pages/login/login',
	name: 'list',
	meta: {title: '登录',},
}]

files.keys().forEach(key => {
	if (key === './index.js') return
	const item = files(key).default
	modules.push(...item)
})
export default home