<script setup>
    import { computed } from 'vue';
    import { useRouter, useRoute } from 'vue-router';

    const router = useRouter();
    const route = useRoute();

    // 根据当前路由名称自动计算高亮项（只读 computed）
    const activeTab = computed(() => {
        switch (route.name) {
            case 'home':   return 0;
            case 'list':   return 1;
            case 'record': return 2;
            case 'profile': return 3;
            case 'mine':   return 4;
            default:       return 0;
        }
    });

    // 点击 tab 跳转，路由变了 computed 自动更新高亮
    const chooseTab = (index) => {
        const routes = ['/home', '/list', '/record', '/profile', '/mine'];
        router.push(routes[index]);
    };
</script>

<template>
    <div class="nav flex-def flex-zAround">
        <div
            class="flex-def flex-cCenter flex-zTopBottom tab_li"
            :class="{ activeTab: activeTab == 0 }"
            @click="chooseTab(0)"
        >
            <div class="icon">🏠</div>
            <div class="text">首页</div>
        </div>
        <div
            class="flex-def flex-cCenter flex-zTopBottom tab_li"
            :class="{ activeTab: activeTab == 1 }"
            @click="chooseTab(1)"
        >
            <div class="icon">📋</div>
            <div class="text">明细</div>
        </div>
        <div
            class="flex-def flex-cCenter flex-zTopBottom tab_li"
            :class="{ activeTab: activeTab == 2 }"
            @click="chooseTab(2)"
        >
            <div class="icon add_btn_icon">+</div>
            <div class="text">记账</div>
        </div>
        <div
            class="flex-def flex-cCenter flex-zTopBottom tab_li"
            :class="{ activeTab: activeTab == 3 }"
            @click="chooseTab(3)"
        >
            <div class="icon">📊</div>
            <div class="text">统计</div>
        </div>
        <div
            class="flex-def flex-cCenter flex-zTopBottom tab_li"
            :class="{ activeTab: activeTab == 4 }"
            @click="chooseTab(4)"
        >
            <div class="icon">👤</div>
            <div class="text">我的</div>
        </div>
    </div>
</template>

<style scoped>
    .nav {
        background-color: #fff;
        border-top: 1px solid #f0f0f0;
    }
    .tab_li {
        padding: 6px 10px;
        color: #B2BEC3;
        cursor: pointer;
        transition: color 0.2s;
    }
    .tab_li .icon {
        font-size: 22px;
        margin-bottom: 2px;
    }
    .tab_li .text {
        font-size: 10px;
    }
    .add_btn_icon {
        height: 32px;
        width: 32px;
        color: #fff;
        text-align: center;
        border-radius: 50%;
        background-color: #6C5CE7;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        font-weight: 300;
        box-shadow: 0 2px 8px rgba(108, 92, 231, 0.3);
    }
    .activeTab {
        color: #6C5CE7 !important;
    }
</style>
