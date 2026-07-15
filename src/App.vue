<script setup>
import { ref } from 'vue';
import moneyNav from './components/nav.vue'
</script>

<template>
  <div id="app" class="moneyBody flex-def flex-zTopBottom">
    <div class="moneyTop flex-one">
      <!-- 路由出口，所有页面都显示在这里 -->
      <router-view/>
    </div>
    <moneyNav></moneyNav>
  </div>
</template>
<style>
@import './asset/css/publicStyle.css';

.moneyBody{
  height: 100vh;
  overflow: hidden;
  background-color: #f5f5f5;
}
.moneyTop{
  overflow-y: auto;
  overflow-x: hidden;
}


</style>

