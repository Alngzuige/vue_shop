import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import Axios from 'axios'
import ZkTable from 'vue-table-with-tree-grid'

// 导入富文本编辑框
import VueQuillEditor from 'vue-quill-editor'

// 富文本编辑框css
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

// 顶部加载条
import NProgress from "nprogress"
import 'nprogress/nprogress.css'

Vue.use(VueQuillEditor)

// 自定义全局组件，树形组件
Vue.component('tree-table', ZkTable)

// 自定义全局过滤器，日期过滤器
Vue.filter(`dataFilter`, function (originVal) {
    // 获取日期对象
    const date = new Date(originVal);
    // 获取年月日,并使用es6字符串方法padStart判断是否两位数，不满两位加0
    const y = date.getFullYear();
    const m = (date.getMonth() + 1 + '').padStart(2, "0");
    const d = (date.getDay() + '').padStart(2, "0");
    // 获取时分秒
    const hh = (date.getHours() + '').padStart(2, "0");
    const mm = (date.getMinutes() + '').padStart(2, "0");
    const ss = (date.getSeconds() + '').padStart(2, "0");
    // 将结果拼接成字符串返回去
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`

})
Vue.config.productionTip = false
//配置Axios请求的根路径
Axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
//拦截Axios request是再发起请求的时候
Axios.interceptors.request.use(config => {
    // 加载顶部进度条
    NProgress.start();
    //为请求头对象，添加Token验证的Authorization字段
    config.headers.Authorization = window.sessionStorage.getItem('token')
    //最后必须return config
    return config
})

// response是在拦截结束后
Axios.interceptors.response.use(config => {
    NProgress.done();
    return config
})
//更改Vue的$http原型为Axios
Vue.prototype.$http = Axios

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
