<script setup>
    import { computed } from 'vue';
    import { useRouter } from 'vue-router';
    import { useBillData } from '../composables/useBillData';

    const router = useRouter();
    const { bills, formatMoney } = useBillData();

    // 统计数据
    const totalRecords = computed(() => bills.value.length);
    const totalExpense = computed(() =>
        bills.value.filter(b => b.type === 'expense').reduce((s, b) => s + Number(b.amount), 0)
    );
    const totalIncome = computed(() =>
        bills.value.filter(b => b.type === 'income').reduce((s, b) => s + Number(b.amount), 0)
    );

    // 设置项
    const menuList = [
        { icon: '💰', name: '预算设置', desc: '设置每月支出预算' },
        { icon: '📂', name: '分类管理', desc: '自定义收支分类' },
        { icon: '📤', name: '数据导出', desc: '导出账单数据' },
        { icon: '🔔', name: '提醒设置', desc: '每日记账提醒' },
        { icon: '🌙', name: '深色模式', desc: '即将上线' },
        { icon: 'ℹ️', name: '关于 MoneyPro', desc: 'v1.0.0' },
    ];

    const handleMenu = (item) => {
        alert(`${item.name}：功能开发中`);
    };

    const handleLogout = () => {
        router.push('/login');
    };
</script>

<template>
    <div class="mine_body">
        <!-- 用户信息卡片 -->
        <div class="user_card flex-def flex-cCenter">
            <div class="avatar">椰</div>
            <div class="user_info flex-def flex-zTopBottom">
                <div class="user_name">椰椰</div>
                <div class="user_desc">已记录 {{ totalRecords }} 笔账单</div>
            </div>
        </div>

        <!-- 累计统计 -->
        <div class="total_card flex-def">
            <div class="total_item">
                <div class="total_label">累计收入</div>
                <div class="total_amount income_text">￥{{ formatMoney(totalIncome) }}</div>
            </div>
            <div class="total_divider"></div>
            <div class="total_item">
                <div class="total_label">累计支出</div>
                <div class="total_amount expense_text">￥{{ formatMoney(totalExpense) }}</div>
            </div>
        </div>

        <!-- 设置菜单 -->
        <div class="menu_list">
            <div
                class="menu_item flex-def flex-cCenter"
                v-for="item in menuList"
                :key="item.name"
                @click="handleMenu(item)"
            >
                <div class="menu_icon">{{ item.icon }}</div>
                <div class="flex-one flex-def flex-zBetween">
                    <div class="menu_name">{{ item.name }}</div>
                    <div class="menu_desc">{{ item.desc }} ›</div>
                </div>
            </div>
        </div>

        <!-- 退出登录 -->
        <div class="logout_btn" @click="handleLogout">退出登录</div>
    </div>
</template>

<style scoped>
    .mine_body {
        padding: 16px;
        padding-bottom: 80px;
    }

    /* 用户卡片 */
    .user_card {
        background: linear-gradient(135deg, #6C5CE7, #8B7CF6);
        border-radius: 16px;
        padding: 20px;
        color: #fff;
        margin-bottom: 16px;
    }
    .avatar {
        width: 54px;
        height: 54px;
        border-radius: 50%;
        background: rgba(255,255,255,0.2);
        font-size: 22px;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 14px;
    }
    .user_name {
        font-size: 18px;
        font-weight: 700;
        margin-bottom: 4px;
    }
    .user_desc {
        font-size: 12px;
        opacity: 0.8;
    }

    /* 累计统计 */
    .total_card {
        background: #fff;
        border-radius: 12px;
        padding: 18px 0;
        margin-bottom: 16px;
    }
    .total_item {
        flex: 1;
        text-align: center;
    }
    .total_divider {
        width: 1px;
        background: #f0f0f0;
    }
    .total_label {
        font-size: 11px;
        color: #B2BEC3;
        margin-bottom: 6px;
    }
    .total_amount {
        font-size: 18px;
        font-weight: 700;
    }
    .income_text { color: #00B894; }
    .expense_text { color: #FF6B6B; }

    /* 菜单列表 */
    .menu_list {
        background: #fff;
        border-radius: 12px;
        overflow: hidden;
        margin-bottom: 24px;
    }
    .menu_item {
        padding: 14px 16px;
        cursor: pointer;
        transition: background 0.15s;
    }
    .menu_item:active {
        background: #f9f9f9;
    }
    .menu_icon {
        font-size: 20px;
        margin-right: 12px;
        width: 24px;
        text-align: center;
    }
    .menu_name {
        font-size: 14px;
        color: #2D3436;
    }
    .menu_desc {
        font-size: 12px;
        color: #B2BEC3;
    }

    /* 退出登录 */
    .logout_btn {
        text-align: center;
        padding: 14px;
        background: #fff;
        border-radius: 12px;
        font-size: 14px;
        color: #FF6B6B;
        font-weight: 600;
        cursor: pointer;
    }
    .logout_btn:active {
        background: #fff5f5;
    }
</style>
