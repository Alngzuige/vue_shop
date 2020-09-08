import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import Axios from 'axios'
Vue.config.productionTip = false
//配置Axios请求的根路径
Axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
//更改Vue的$http原型为Axios
Vue.prototype.$http = Axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
