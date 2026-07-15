<script setup>
    import { ref, computed, nextTick , watch  } from 'vue';        
    const props = defineProps({
        pickerVisible:Boolean        
    })
    const emit = defineEmits(['closePicker','confirmPicker'])
    
    const tempYear  = ref(new Date().getFullYear());  // 选择中的临时年份
    const tempMonth = ref(new Date().getMonth() + 1); // 选择中的临时月份

    // 年份列表：当前年前后 10 年
    const yearList = computed(() => {
        const cur = new Date().getFullYear();
        const list = [];
        for(let y = cur - 10; y <= cur + 2; y++) list.push(y);
        return list;
    });
    // 月份列表：1-12
    const monthList = computed(() => {
        const list = [];
        for(let m = 1; m <= 12; m++) list.push(m);
        return list;
    });

    // DOM refs
    const yearColRef  = ref(null);
    const monthColRef = ref(null);
    
    watch(() => props.pickerVisible, (newVal) => {
        if (newVal) {
            nextTick(() => {
                const yIdx = yearList.value.indexOf(tempYear.value);
                const mIdx = monthList.value.indexOf(tempMonth.value);
                
                // scrollTo: 滚动到指定位置，behavior: 'auto' 表示平滑滚动,原生DOM方法

                yearColRef.value.scrollTo({
                    top: yIdx * 44,
                    behavior: 'auto'
                })
                monthColRef.value.scrollTo({
                    top: mIdx * 44,
                    behavior: 'auto'
                })                
            });
        }
    });

    

    // 关闭弹层（取消）
    const closePicker = () => {
        emit('closePicker');
    };
    

    // 确认选择       
    const confirmPicker = () => {
        emit('confirmPicker',{
            year: tempYear.value,
            month: tempMonth.value            
        })
    }

    // 年份滚动 
    const onYearScroll = (e) => {
        //获取滚动条的距离，并计算出元素的索引
        const idx = Math.round(e.target.scrollTop / 44);
        const y = yearList.value[idx];
        if (y && y !== tempYear.value) {
            tempYear.value = y;
        }
    };

    // 月份滚动 
    const onMonthScroll = (e) => {
        const idx = Math.round(e.target.scrollTop / 44);
        const m = monthList.value[idx];
        if (m && m !== tempMonth.value) {
            tempMonth.value = m;
        }
    };
</script>


<!-- 年月选择器弹层 -->
<template>    
    <div v-if="pickerVisible">
        <!-- 遮罩 -->
        <div class="picker_mask" @click="closePicker"></div>
        <!-- 弹层主体 -->
        <div class="picker_panel">
            <div class="picker_header">
                <span class="ph_cancel" @click="closePicker">取消</span>
                <span class="ph_title">选择年月</span>
                <span class="ph_confirm" @click="confirmPicker">确定</span>
            </div>
            <div class="picker_body">
                <!-- 高亮选中行 -->
                <div class="picker_highlight"></div>
                <!-- 年份列 -->
                <!-- ref="yearColRef":给年份列表起个名字，方便操作Dom -->
                <div class="picker_col" ref="yearColRef" @scroll="onYearScroll">
                    <div
                        class="picker_item"
                        v-for="y in yearList"
                        :key="y"
                        :class="{is_active: y == tempYear}"                       
                    >{{y}}年</div>
                </div>
                <!-- 分割线 -->
                <div class="picker_divider"></div>
                <!-- 月份列 -->
                <div class="picker_col" ref="monthColRef" @scroll="onMonthScroll">
                    <div
                        class="picker_item"
                        v-for="m in monthList"
                        :key="m"
                        :class="{is_active: m == tempMonth}"                        
                    >{{m}}月</div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* ===== 年月选择器弹层 ===== */
/* 遮罩 */
.picker_mask{
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.45);
    z-index: 200;
    /* 进出场动画 */
    animation: maskIn 0.25s ease;
}
@keyframes maskIn{
    from{ opacity:0; }
    to  { opacity:1; }
}

/* 弹层主体 */
.picker_panel{
    position: fixed;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    width: 100%;
    max-width: 480px;
    background: #fff;
    border-radius: 20px 20px 0 0;
    z-index: 201;
    padding-bottom: env(safe-area-inset-bottom, 0px);    
}
@keyframes slideUp{
    from{ transform: translateX(-50%) translateY(100%); }
    to  { transform: translateX(-50%) translateY(0);    }
}

/* 弹层顶部操作栏 */
.picker_header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px 10px;
    border-bottom: 1px solid #F0F0F0;
}
.picker_header .ph_cancel{
    font-size: 14px;
    color: #B2BEC3;
    cursor: pointer;
    padding: 4px 0;
}
.picker_header .ph_title{
    font-size: 15px;
    font-weight: 700;
    color: #2D3436;
}
.picker_header .ph_confirm{
    font-size: 14px;
    font-weight: 700;
    color: #6C5CE7;
    cursor: pointer;
    padding: 4px 0;
}

/* 滚轮容器 */
.picker_body{
    display: flex;
    height: 220px;
    overflow: hidden;
    position: relative;
}

/* 高亮选中行 */
.picker_highlight{
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 44px;
    background: rgba(108, 92, 231, 0.08);
    border-radius: 12px;
    margin: 0 16px;
    pointer-events: none;
    z-index: 2;
}
/* 上下渐隐遮罩 */
.picker_body::before,
.picker_body::after{
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 80px;
    z-index: 3;
    pointer-events: none;
}
.picker_body::before{
    top: 0;
    background: linear-gradient(to bottom, rgba(255,255,255,0.95), rgba(255,255,255,0));
}
.picker_body::after{
    bottom: 0;
    background: linear-gradient(to top, rgba(255,255,255,0.95), rgba(255,255,255,0));
}

/* 滚轮列 */
.picker_col{
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: y mandatory;
    -ms-overflow-style: none;
    scrollbar-width: none;
    padding: 88px 0;  /* 让第一项/最后一项也能滚到中间 */
}
.picker_col::-webkit-scrollbar{ display: none; }

/* 每一项 */
.picker_item{
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: #636E72;
    scroll-snap-align: center;
    cursor: pointer;
    transition: color 0.2s, font-weight 0.2s;
    user-select: none;
}
.picker_item.is_active{
    color: #6C5CE7;
    font-weight: 700;
    font-size: 18px;
}

/* 分割线 */
.picker_divider{
    width: 1px;
    background: #F0F0F0;
    margin: 20px 0;
    flex-shrink: 0;
}

</style>