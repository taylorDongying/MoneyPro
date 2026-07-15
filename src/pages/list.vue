<script setup>
    import { ref, computed } from 'vue';
    import { useBillData } from '../composables/useBillData';

    const { bills, deleteBill, formatMoney, formatDate } = useBillData();

    // 筛选类型：全部 / 收入 / 支出
    const filterType = ref('all');

    // 按类型筛选后的账单
    const filteredBills = computed(() => {
        if (filterType.value === 'all') return bills.value;
        return bills.value.filter(b => b.type === filterType.value);
    });

    // 按日期分组：{ '今天': [...bills], '昨天': [...bills], '7月12日': [...] }
    const groupedBills = computed(() => {
        const groups = {};
        filteredBills.value.forEach(bill => {
            const label = formatDate(bill.date);
            if (!groups[label]) {
                groups[label] = [];
            }
            groups[label].push(bill);
        });
        return groups;
    });

    // 切换筛选
    const switchFilter = (type) => {
        filterType.value = type;
    };

    // 删除记录
    const handleDelete = (id) => {
        if (confirm('确定删除这条记录？')) {
            deleteBill(id);
        }
    };
</script>

<template>
    <div class="list_body">
        <!-- 筛选栏 -->
        <div class="filter_bar flex-def">
            <div
                class="filter_btn"
                :class="{ filter_active: filterType === 'all' }"
                @click="switchFilter('all')"
            >全部</div>
            <div
                class="filter_btn"
                :class="{ filter_active: filterType === 'income' }"
                @click="switchFilter('income')"
            >收入</div>
            <div
                class="filter_btn"
                :class="{ filter_active: filterType === 'expense' }"
                @click="switchFilter('expense')"
            >支出</div>
        </div>

        <!-- 账单列表（按日期分组） -->
        <div class="bill_groups">
            <div class="bill_group" v-for="(group, dateLabel) in groupedBills" :key="dateLabel">
                <!-- 日期标题 -->
                <div class="group_date flex-def flex-cCenter flex-zBetween">
                    <span>{{ dateLabel }}</span>
                    <span class="group_count">{{ group.length }}笔</span>
                </div>
                <!-- 该日期下的账单 -->
                <div class="bill_li flex-def" v-for="item in group" :key="item.id" @click="handleDelete(item.id)">
                    <div class="icon flex-def flex-cCenter flex-zCenter">{{ item.emoji }}</div>
                    <div class="flex-def flex-zTopBottom flex-one bill_info flex-zBetween">
                        <div class="title">{{ item.category }}</div>
                        <div class="text">{{ item.note }}</div>
                    </div>
                    <div class="amount flex-def flex-cCenter" :class="item.type == 'income' ? 'income_text' : 'expense_text'">
                        {{ item.type == 'income' ? '+' : '-' }}{{ formatMoney(item.amount) }}
                    </div>
                </div>
            </div>
        </div>

        <!-- 空状态 -->
        <div class="empty_state" v-if="filteredBills.length === 0">
            <div class="empty_icon">📭</div>
            <div class="empty_text">暂无记录</div>
        </div>
    </div>
</template>

<style scoped>
    .list_body {
        padding: 12px 16px 80px;
    }

    /* 筛选栏 */
    .filter_bar {
        background: #fff;
        border-radius: 10px;
        padding: 3px;
        margin-bottom: 16px;
    }
    .filter_btn {
        flex: 1;
        text-align: center;
        padding: 9px 0;
        font-size: 13px;
        color: #B2BEC3;
        border-radius: 8px;
        transition: all 0.2s;
        cursor: pointer;
    }
    .filter_active {
        background: #6C5CE7;
        color: #fff;
        font-weight: 600;
    }

    /* 日期分组 */
    .bill_group {
        margin-bottom: 16px;
    }
    .group_date {
        padding: 4px 4px 10px;
        font-size: 12px;
        color: #B2BEC3;
    }
    .group_count {
        font-size: 11px;
    }

    /* 账单项 */
    .bill_li {
        padding: 14px;
        margin-bottom: 6px;
        background: #fff;
        border-radius: 12px;
        cursor: pointer;
        transition: transform 0.15s;
    }
    .bill_li:active {
        transform: scale(0.98);
    }
    .bill_li .icon {
        margin-right: 12px;
        width: 42px;
        height: 42px;
        border-radius: 12px;
        font-size: 20px;
        background: rgb(255, 240, 230);
    }
    .bill_info .title {
        color: #2D3436;
        font-size: 14px;
        font-weight: 600;
    }
    .bill_info .text {
        font-size: 11px;
        color: #B2BEC3;
    }
    .bill_li .amount {
        font-size: 16px;
        font-weight: 700;
    }
    .expense_text {
        color: #FF6B6B;
    }
    .income_text {
        color: #00B894;
    }

    /* 空状态 */
    .empty_state {
        margin-top: 80px;
        text-align: center;
        color: #B2BEC3;
    }
    .empty_icon {
        font-size: 48px;
    }
    .empty_text {
        margin-top: 10px;
        font-size: 13px;
    }
</style>
