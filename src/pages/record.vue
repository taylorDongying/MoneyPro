<script setup>
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
    import { useBillData } from '../composables/useBillData';

    const router = useRouter();
    const { addBill } = useBillData();

    // 收入/支出类型切换
    const billType = ref('expense'); // 默认支出

    // 分类数据
    const expenseCategories = [
        { name: '餐饮', emoji: '🍚' },
        { name: '交通', emoji: '🚌' },
        { name: '购物', emoji: '🛍️' },
        { name: '娱乐', emoji: '🎮' },
        { name: '居住', emoji: '🏠' },
        { name: '医疗', emoji: '💊' },
        { name: '教育', emoji: '📚' },
        { name: '通讯', emoji: '📱' },
        { name: '零食', emoji: '🍿' },
        { name: '运动', emoji: '⚽' },
        { name: '旅行', emoji: '✈️' },
        { name: '其他', emoji: '📝' },
    ];

    const incomeCategories = [
        { name: '工资', emoji: '💰' },
        { name: '红包', emoji: '🧧' },
        { name: '投资', emoji: '📈' },
        { name: '兼职', emoji: '💼' },
        { name: '退款', emoji: '💳' },
        { name: '其他', emoji: '📝' },
    ];

    // 当前显示的分类列表（根据类型切换）
    const currentCategories = ref(expenseCategories);

    // 选中的分类
    const selectedCategory = ref(null);

    // 切换类型时重置分类
    const switchType = (type) => {
        billType.value = type;
        currentCategories.value = type === 'expense' ? expenseCategories : incomeCategories;
        selectedCategory.value = null;
    };

    const selectCategory = (cat) => {
        selectedCategory.value = cat;
    };

    // 金额和备注
    const amount = ref('');
    const note = ref('');

    // 日期（默认今天）
    const today = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const date = ref(`${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`);

    // 保存记录
    const saveBill = () => {
        if (!selectedCategory.value) {
            alert('请选择分类');
            return;
        }
        if (!amount.value || Number(amount.value) <= 0) {
            alert('请输入金额');
            return;
        }

        addBill({
            type: billType.value,
            category: selectedCategory.value.name,
            emoji: selectedCategory.value.emoji,
            amount: Number(amount.value),
            note: note.value || '无备注',
            date: date.value,
        });

        // 保存后跳回首页
        router.push('/home');
    };
</script>

<template>
    <div class="record_body">
        <!-- 收入/支出切换 -->
        <div class="type_switch flex-def">
            <div
                class="type_btn"
                :class="{ active_expense: billType === 'expense' }"
                @click="switchType('expense')"
            >支出</div>
            <div
                class="type_btn"
                :class="{ active_income: billType === 'income' }"
                @click="switchType('income')"
            >收入</div>
        </div>

        <!-- 分类网格 -->
        <div class="category_grid">
            <div
                class="category_item flex-def flex-zTopBottom flex-cCenter"
                v-for="cat in currentCategories"
                :key="cat.name"
                :class="{ category_active: selectedCategory && selectedCategory.name === cat.name }"
                @click="selectCategory(cat)"
            >
                <div class="cat_emoji">{{ cat.emoji }}</div>
                <div class="cat_name">{{ cat.name }}</div>
            </div>
        </div>

        <!-- 金额输入 -->
        <div class="amount_box">
            <div class="amount_label">金额</div>
            <div class="amount_input_wrap flex-def flex-cCenter">
                <span class="currency">￥</span>
                <input
                    type="number"
                    v-model="amount"
                    placeholder="0.00"
                    class="amount_input"
                />
            </div>
        </div>

        <!-- 备注 -->
        <div class="note_box">
            <div class="note_label">备注</div>
            <input
                type="text"
                v-model="note"
                placeholder="添加备注（选填）"
                class="note_input"
            />
        </div>

        <!-- 日期 -->
        <div class="date_box flex-def flex-cCenter flex-zBetween">
            <span class="date_label">日期</span>
            <input type="date" v-model="date" class="date_input" />
        </div>

        <!-- 保存按钮 -->
        <div class="save_btn" @click="saveBill">保存</div>
    </div>
</template>

<style scoped>
    .record_body {
        padding: 16px;
        padding-bottom: 80px;
    }

    /* 类型切换 */
    .type_switch {
        background: #f0f0f0;
        border-radius: 10px;
        padding: 3px;
        margin-bottom: 20px;
    }
    .type_btn {
        flex: 1;
        text-align: center;
        padding: 10px 0;
        font-size: 14px;
        font-weight: 600;
        color: #B2BEC3;
        border-radius: 8px;
        transition: all 0.2s;
        cursor: pointer;
    }
    .active_expense {
        background: #fff;
        color: #FF6B6B;
        box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }
    .active_income {
        background: #fff;
        color: #00B894;
        box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }

    /* 分类网格 */
    .category_grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 12px;
        margin-bottom: 24px;
    }
    .category_item {
        padding: 14px 0;
        background: #fff;
        border-radius: 12px;
        border: 2px solid transparent;
        transition: all 0.15s;
        cursor: pointer;
    }
    .category_item:active {
        transform: scale(0.95);
    }
    .category_active {
        border-color: #6C5CE7;
        background: rgba(108, 92, 231, 0.06);
    }
    .cat_emoji {
        font-size: 26px;
        margin-bottom: 4px;
    }
    .cat_name {
        font-size: 12px;
        color: #636E72;
    }

    /* 金额输入 */
    .amount_box {
        background: #fff;
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 12px;
    }
    .amount_label {
        font-size: 12px;
        color: #B2BEC3;
        margin-bottom: 8px;
    }
    .amount_input_wrap {
        border-bottom: 2px solid #f0f0f0;
        padding-bottom: 8px;
    }
    .currency {
        font-size: 24px;
        font-weight: 700;
        color: #2D3436;
        margin-right: 6px;
    }
    .amount_input {
        flex: 1;
        font-size: 32px;
        font-weight: 700;
        color: #2D3436;
    }

    /* 备注 */
    .note_box {
        background: #fff;
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 12px;
    }
    .note_label {
        font-size: 12px;
        color: #B2BEC3;
        margin-bottom: 8px;
    }
    .note_input {
        width: 100%;
        font-size: 15px;
        color: #2D3436;
    }

    /* 日期 */
    .date_box {
        background: #fff;
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 24px;
    }
    .date_label {
        font-size: 14px;
        color: #2D3436;
    }
    .date_input {
        font-size: 14px;
        color: #636E72;
    }

    /* 保存按钮 */
    .save_btn {
        background: linear-gradient(135deg, #6C5CE7, #8B7CF6);
        color: #fff;
        text-align: center;
        padding: 15px 0;
        border-radius: 12px;
        font-size: 16px;
        font-weight: 700;
        cursor: pointer;
        box-shadow: 0 4px 16px rgba(108, 92, 231, 0.3);
        transition: opacity 0.2s;
    }
    .save_btn:active {
        opacity: 0.8;
    }
</style>
