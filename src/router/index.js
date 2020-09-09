import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/views/Users.vue'
import Categories from '../components/views/Categories.vue'
import Reports from '../components/views/Reports.vue'
import Rights from '../components/views/Rights.vue'
import Roles from '../components/views/Roles.vue'
import Goods from '../components/views/Goods.vue'
import Orders from '../components/views/Orders.vue'
import Params from '../components/views/Params.vue'
Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      { path: '/users', component: Users },
      { path: '/categories', component: Categories },
      { path: '/reports', component: Reports },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/goods', component: Goods },
      { path: '/orders', component: Orders },
      { path: '/params', component: Params },
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  //to 代表访问的路径
  // from 代表从哪个路径跳转而来
  // next 代表是一个函数

  //如果用户访问的是登录页直接放行
  if (to.path === '/login') {
    return next();
  }
  //如果不是登录页则判断是否有登录过，没有就强制跳转回登录页
  const tokenStr = window.sessionStorage.getItem('token');
  if (!tokenStr) {
    return next('/login');
  }
  //登录过了直接放行
  next();
})

export default router
