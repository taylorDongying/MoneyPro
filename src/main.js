//1.导入createApp函数，用于初始化Vue应用
import { createApp } from 'vue'
//导入根组件
import App from './App.vue'
//导入路由配置
import router from './router'

//创建Vue应用实例
const app = createApp(App)
//注册路由组件，使得所有子组件都可以使用$router、$route 和 <router-view />
app.use(router)
//挂载到#app元素上，启动应用
app.mount('#app')
