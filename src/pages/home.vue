<script setup>
    import { ref, computed } from 'vue';
    import datePicker from '../components/datePicker.vue';
    import { useBillData } from '../composables/useBillData';

    const userName = ref('椰椰');

    // 当前选中的年月（从日期选择器来）
    const year = ref(new Date().getFullYear());
    const month = ref(new Date().getMonth() + 1);

    // 从共享数据层拿方法和数据
    const { getMonthStats, getBillsByMonth, formatMoney, formatDate } = useBillData();

    // 月度统计 —— 当 year/month 变化时自动重新计算
    const stats = computed(() => getMonthStats(year.value, month.value));

    // 本月最近 5 条账单
    const recentBills = computed(() => {
        return getBillsByMonth(year.value, month.value).slice(0, 5);
    });

    // ========== 日期选择器 ==========
    const showPicker = ref(false);

    const openPicker = () => {
        showPicker.value = true;
    };

    const closePicker = () => {
        showPicker.value = false;
    };

    const confirmPicker = (msg) => {
        year.value = msg.year;
        month.value = msg.month;
        closePicker();
    };
</script>

<template>
    <div class="index_body">
        <!-- 顶部用户栏 -->
        <div class="index_top flex-def flex-cCenter">
            <div class="user_icon">👤</div>
            <div class="flex-one flex-def flex-zTopBottom">
                <span class="title">早上好 👋</span>
                <span class="desc">你好，{{ userName }}</span>
            </div>
            <div class="notify_btn" style="position:relative;">
                🔔
                <div style="position:absolute;top:-2px;right:-2px;width:7px;height:7px;border-radius:50%;background:#FF6B6B;"></div>
            </div>
        </div>

        <!-- 月度收支卡片 -->
        <div class="monthly_card">
            <div class="card_top">
                <div class="flex-def flex-zBetween date_li" @click="openPicker">
                    <div>📅 {{year}}年{{month}}月</div>
                    <div>▼</div>
                </div>
                <div class="flex-def flex-zBetween">
                    <div class="income_li">
                        <div class="title">收入</div>
                        <div class="amount">￥{{formatMoney(stats.income)}}</div>
                    </div>
                    <div class="income_li expense_li flex-def flex-cEnd flex-zTopBottom">
                        <div class="title">支出</div>
                        <div class="amount">￥{{formatMoney(stats.expense)}}</div>
                    </div>
                </div>
            </div>
            <div class="card_bottom flex-def flex-zTopBottom flex-cCenter">
                <div class="balance_li">本月结余</div>
                <div class="amount">￥{{formatMoney(stats.balance)}}</div>
            </div>
        </div>

        <!-- 最近账单 -->
        <div class="section_title">最近账单</div>
        <div class="bill_list">
            <div class="bill_li flex-def" v-for="item in recentBills" :key="item.id">
                <div class="icon flex-def flex-cCenter flex-zCenter">{{item.emoji}}</div>
                <div class="flex-def flex-zTopBottom flex-one bill_info flex-zBetween">
                    <div class="title">{{item.category}}</div>
                    <div class="text">{{item.note}} · {{formatDate(item.date)}}</div>
                </div>
                <div class="amount flex-def flex-cCenter" :class="item.type == 'income' ? 'income_text' : 'expense_text'">
                    {{ item.type == 'income' ? '+' : '-' }}{{formatMoney(item.amount)}}
                </div>
            </div>
        </div>

        <!-- 空状态 -->
        <div class="none_bill" v-if="recentBills.length == 0">
            <div class="icon">📭</div>
            <div class="empty_text">本月还没有记录</div>
        </div>

        <!-- 日期选择器 -->
        <datePicker
            :pickerVisible="showPicker"
            @closePicker="closePicker"
            @confirmPicker="confirmPicker"
        ></datePicker>
    </div>
</template>

<style>
    @import '../asset/css/home.css'
</style>
