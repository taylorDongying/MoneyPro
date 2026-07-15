import { ref, computed } from 'vue'

/**
 * 账单数据管理 - composable（组合式函数）
 *
 * 为什么用 composable 而不是每个页面各自存数据？
 * 因为 home/list/stat 三个页面都要读同一份账单数据，
 * 如果各自存一份，在 record 页面新增后其他页面不会更新。
 *
 * 原理：bills 定义在模块顶层（函数外面），所有 import 这个文件的组件共享同一个 ref。
 * 这就是 Pinia 的雏形 —— 模块级单例。后面学 Pinia 时你会发现本质是一样的。
 */

const STORAGE_KEY = 'moneypro_bills'

// ========== 种子数据：首次打开时有几条假数据，不会空荡荡 ==========
const generateSeedData = () => {
    const now = new Date()
    const y = now.getFullYear()
    const m = now.getMonth() + 1
    const d = now.getDate()
    const pad = (n) => String(n).padStart(2, '0')
    const dateStr = (day) => `${y}-${pad(m)}-${pad(day)}`

    return [
        { id: 1,  type: 'expense', category: '餐饮', emoji: '🍚', amount: 35,  note: '早餐包子',  date: dateStr(d) },
        { id: 2,  type: 'expense', category: '交通', emoji: '🚌', amount: 12,  note: '地铁通勤',  date: dateStr(d) },
        { id: 3,  type: 'expense', category: '餐饮', emoji: '🍚', amount: 28,  note: '午餐外卖',  date: dateStr(d - 1) },
        { id: 4,  type: 'income',  category: '工资', emoji: '💰', amount: 12000, note: '本月工资',  date: dateStr(10) },
        { id: 5,  type: 'expense', category: '购物', emoji: '🛍️', amount: 299, note: '夏装',      date: dateStr(9) },
        { id: 6,  type: 'expense', category: '娱乐', emoji: '🎮', amount: 50,  note: '游戏月卡',  date: dateStr(8) },
        { id: 7,  type: 'income',  category: '兼职', emoji: '💼', amount: 800, note: '设计私单',  date: dateStr(7) },
        { id: 8,  type: 'expense', category: '居住', emoji: '🏠', amount: 2000, note: '房租',      date: dateStr(5) },
        { id: 9,  type: 'expense', category: '医疗', emoji: '💊', amount: 45,  note: '感冒药',    date: dateStr(3) },
        { id: 10, type: 'expense', category: '餐饮', emoji: '🍚', amount: 22,  note: '午餐',      date: dateStr(2) },
    ]
}

// ========== 初始化：从 localStorage 读，没有就用种子数据 ==========
const loadBills = () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
        try {
            return JSON.parse(stored)
        } catch {
            // JSON 解析失败，用种子数据重新开始
        }
    }
    const seed = generateSeedData()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed))
    return seed
}

// 模块级 ref —— 所有组件共享这一份数据
const bills = ref(loadBills())

// 写入 localStorage 的工具函数
const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bills.value))
}

/**
 * 日期格式化：'2026-07-14' → '今天' / '昨天' / '7月14日'
 */
const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00')
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.getTime() === today.getTime()) return '今天'
    if (date.getTime() === yesterday.getTime()) return '昨天'

    return `${date.getMonth() + 1}月${date.getDate()}日`
}

/**
 * 金额格式化：12345 → '12,345'
 */
const formatMoney = (money) => {
    return Number(money).toLocaleString()
}

// ========== 导出方法 ==========
export function useBillData() {
    // 添加一条记录
    const addBill = (bill) => {
        bills.value.unshift({
            id: Date.now(),
            ...bill
        })
        save()
    }

    // 删除一条记录
    const deleteBill = (id) => {
        bills.value = bills.value.filter(b => b.id !== id)
        save()
    }

    // 按年月筛选账单
    const getBillsByMonth = (year, month) => {
        return bills.value.filter(b => {
            const d = new Date(b.date + 'T00:00:00')
            return d.getFullYear() === year && (d.getMonth() + 1) === Number(month)
        })
    }

    // 计算月度统计：收入、支出、结余
    const getMonthStats = (year, month) => {
        const monthBills = getBillsByMonth(year, month)
        const income = monthBills
            .filter(b => b.type === 'income')
            .reduce((sum, b) => sum + Number(b.amount), 0)
        const expense = monthBills
            .filter(b => b.type === 'expense')
            .reduce((sum, b) => sum + Number(b.amount), 0)
        return { income, expense, balance: income - expense }
    }

    // 按分类汇总（用于统计页）
    const getCategoryStats = (year, month, type = 'expense') => {
        const monthBills = getBillsByMonth(year, month)
        const categoryMap = {}

        monthBills
            .filter(b => b.type === type)
            .forEach(b => {
                const key = b.category
                if (!categoryMap[key]) {
                    categoryMap[key] = { category: b.category, emoji: b.emoji, total: 0, count: 0 }
                }
                categoryMap[key].total += Number(b.amount)
                categoryMap[key].count++
            })

        // 按金额降序排列
        return Object.values(categoryMap).sort((a, b) => b.total - a.total)
    }

    return {
        bills,              // 所有账单（响应式）
        addBill,            // 添加
        deleteBill,         // 删除
        getBillsByMonth,    // 按月筛选
        getMonthStats,      // 月度统计
        getCategoryStats,   // 分类统计
        formatDate,         // 日期格式化
        formatMoney,        // 金额格式化
    }
}
