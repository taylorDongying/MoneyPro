//1.导入依赖
import { createRouter,createWebHistory } from 'vue-router';

//2.配置路由
const routes = [
  //根路径重定向
  {
    path:'/',
    redirect:'/home'
  },
  //登陆页面
  {
    path:'/login',
    name:'login',
    component:()=>import('../pages/login.vue')
  },
  //首页
  {
    path:'/home',
    name:'home',
    component:()=>import('../pages/home.vue')
  },
  //其他页面
  {
    path:'/list',
    name:'list',
    component:()=>import('../pages/list.vue')
  },
  {
    path:'/mine',
    name:'mine',
    component:()=>import('../pages/mine.vue')
  },
  {
    path:'/profile',
    name:'profile',
    component:()=>import('../pages/profile.vue')
  },
  {
    path:'/record',
    name:'record',
    component:()=>import('../pages/record.vue')
  }
]

//3.创建路由实例
const router = createRouter({
  history:createWebHistory(),//使用history模式，不带#号
  routes
})

//4.导出路由实例
export default router;

