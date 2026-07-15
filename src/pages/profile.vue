<script setup>
    import { ref, computed } from 'vue';
    import datePicker from '../components/datePicker.vue';
    import { useBillData } from '../composables/useBillData';

    const year = ref(new Date().getFullYear());
    const month = ref(new Date().getMonth() + 1);

    const { getMonthStats, getCategoryStats, formatMoney } = useBillData();

    // 月度统计
    const stats = computed(() => getMonthStats(year.value, month.value));

    // 支出分类排行
    const expenseCategories = computed(() => getCategoryStats(year.value, month.value, 'expense'));

    // 收入分类排行
    const incomeCategories = computed(() => getCategoryStats(year.value, month.value, 'income'));

    // 支出分类的占比百分比（用于画柱状条）
    const maxExpense = computed(() => {
        return Math.max(...expenseCategories.value.map(c => c.total), 1);
    });

    const maxIncome = computed(() => {
        return Math.max(...incomeCategories.value.map(c => c.total), 1);
    });

    // 总支出占比（用于收支比例条）
    const expensePercent = computed(() => {
        const total = stats.value.income + stats.value.expense;
        if (total === 0) return 50;
        return Math.round((stats.value.expense / total) * 100);
    });

    // ========== 日期选择器 ==========
    const showPicker = ref(false);

    const openPicker = () => { showPicker.value = true; };
    const closePicker = () => { showPicker.value = false; };
    const confirmPicker = (msg) => {
        year.value = msg.year;
        month.value = msg.month;
        closePicker();
    };
</script>

<template>
    <div class="stat_body">
        <!-- 月份选择 -->
        <div class="month_selector" @click="openPicker">
            📅 {{ year }}年{{ month }}月 ▼
        </div>

        <!-- 收支概览卡片 -->
        <div class="overview_card">
            <div class="overview_title">收支概览</div>
            <div class="overview_amounts flex-def">
                <div class="overview_item">
                    <div class="ov_label">收入</div>
                    <div class="ov_amount income_text">￥{{ formatMoney(stats.income) }}</div>
                </div>
                <div class="overview_divider"></div>
                <div class="overview_item">
                    <div class="ov_label">支出</div>
                    <div class="ov_amount expense_text">￥{{ formatMoney(stats.expense) }}</div>
                </div>
                <div class="overview_divider"></div>
                <div class="overview_item">
                    <div class="ov_label">结余</div>
                    <div class="ov_amount balance_text">￥{{ formatMoney(stats.balance) }}</div>
                </div>
            </div>
            <!-- 收支比例条 -->
            <div class="ratio_bar" v-if="stats.income + stats.expense > 0">
                <div class="ratio_income" :style="{ width: (100 - expensePercent) + '%' }"></div>
                <div class="ratio_expense" :style="{ width: expensePercent + '%' }"></div>
            </div>
        </div>

        <!-- 支出分类排行 -->
        <div class="section_title">支出分类</div>
        <div class="category_list" v-if="expenseCategories.length > 0">
            <div class="category_row" v-for="cat in expenseCategories" :key="cat.category">
                <div class="cat_left flex-def flex-cCenter">
                    <div class="cat_emoji">{{ cat.emoji }}</div>
                    <div class="cat_info">
                        <div class="cat_name">{{ cat.category }}</div>
                        <div class="cat_count">{{ cat.count }}笔</div>
                    </div>
                </div>
                <div class="cat_right">
                    <div class="cat_amount expense_text">￥{{ formatMoney(cat.total) }}</div>
                    <!-- 柱状条：宽度 = 当前分类金额 / 最大分类金额 -->
                    <div class="bar_bg">
                        <div class="bar_fill bar_expense" :style="{ width: (cat.total / maxExpense * 100) + '%' }"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="empty_tip" v-else>本月暂无支出记录</div>

        <!-- 收入分类排行 -->
        <div class="section_title" v-if="incomeCategories.length > 0">收入分类</div>
        <div class="category_list" v-if="incomeCategories.length > 0">
            <div class="category_row" v-for="cat in incomeCategories" :key="cat.category">
                <div class="cat_left flex-def flex-cCenter">
                    <div class="cat_emoji">{{ cat.emoji }}</div>
                    <div class="cat_info">
                        <div class="cat_name">{{ cat.category }}</div>
                        <div class="cat_count">{{ cat.count }}笔</div>
                    </div>
                </div>
                <div class="cat_right">
                    <div class="cat_amount income_text">￥{{ formatMoney(cat.total) }}</div>
                    <div class="bar_bg">
                        <div class="bar_fill bar_income" :style="{ width: (cat.total / maxIncome * 100) + '%' }"></div>
                    </div>
                </div>
            </div>
        </div>

        <datePicker
            :pickerVisible="showPicker"
            @closePicker="closePicker"
            @confirmPicker="confirmPicker"
        ></datePicker>
    </div>
</template>

<style scoped>
    .stat_body {
        padding: 16px;
        padding-bottom: 80px;
    }

    /* 月份选择 */
    .month_selector {
        text-align: center;
        padding: 10px;
        background: #fff;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 600;
        color: #2D3436;
        margin-bottom: 16px;
        cursor: pointer;
    }

    /* 概览卡片 */
    .overview_card {
        background: linear-gradient(135deg, #6C5CE7, #8B7CF6);
        border-radius: 16px;
        padding: 20px;
        color: #fff;
        margin-bottom: 20px;
    }
    .overview_title {
        font-size: 13px;
        opacity: 0.8;
        margin-bottom: 14px;
    }
    .overview_amounts {
        margin-bottom: 16px;
    }
    .overview_item {
        flex: 1;
        text-align: center;
    }
    .overview_divider {
        width: 1px;
        background: rgba(255,255,255,0.15);
    }
    .ov_label {
        font-size: 11px;
        opacity: 0.7;
        margin-bottom: 6px;
    }
    .ov_amount {
        font-size: 18px;
        font-weight: 700;
    }

    /* 收支比例条 */
    .ratio_bar {
        display: flex;
        height: 8px;
        border-radius: 4px;
        overflow: hidden;
        background: rgba(255,255,255,0.1);
    }
    .ratio_income {
        background: #55EFC4;
        transition: width 0.3s;
    }
    .ratio_expense {
        background: #FFD93D;
        transition: width 0.3s;
    }

    /* 分类标题 */
    .section_title {
        font-size: 14px;
        font-weight: 600;
        color: #2D3436;
        margin: 20px 0 12px;
        padding-left: 4px;
    }

    /* 分类排行 */
    .category_list {
        background: #fff;
        border-radius: 12px;
        padding: 4px 0;
    }
    .category_row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
    }
    .cat_left {
        flex-shrink: 0;
    }
    .cat_emoji {
        font-size: 22px;
        margin-right: 10px;
    }
    .cat_name {
        font-size: 14px;
        color: #2D3436;
        font-weight: 500;
    }
    .cat_count {
        font-size: 11px;
        color: #B2BEC3;
    }
    .cat_right {
        flex: 1;
        max-width: 160px;
        text-align: right;
    }
    .cat_amount {
        font-size: 14px;
        font-weight: 700;
        margin-bottom: 6px;
    }

    /* 柱状条 */
    .bar_bg {
        height: 6px;
        background: #f0f0f0;
        border-radius: 3px;
        overflow: hidden;
    }
    .bar_fill {
        height: 100%;
        border-radius: 3px;
        transition: width 0.3s;
    }
    .bar_expense {
        background: #FF6B6B;
    }
    .bar_income {
        background: #00B894;
    }

    /* 文字颜色 */
    .income_text { color: #55EFC4; }
    .expense_text { color: #FFD93D; }
    .balance_text { color: #fff; }

    .empty_tip {
        text-align: center;
        color: #B2BEC3;
        font-size: 13px;
        padding: 30px 0;
    }
</style>
