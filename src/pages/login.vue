<script setup>
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';

    const router = useRouter();

    const username = ref('');
    const password = ref('');

    const handleLogin = () => {
        if (!username.value || !password.value) {
            alert('请输入用户名和密码');
            return;
        }
        // 暂时不做真实验证，直接跳转
        // 后面学 Node.js + JWT 时再补
        router.push('/home');
    };
</script>

<template>
    <div class="login_body flex-def flex-zTopBottom flex-cCenter">
        <!-- Logo -->
        <div class="logo_section flex-def flex-zTopBottom flex-cCenter">
            <div class="logo_icon">💰</div>
            <div class="logo_name">MoneyPro</div>
            <div class="logo_slogan">你的口袋记账管家</div>
        </div>

        <!-- 表单 -->
        <div class="form_section flex-def flex-zTopBottom">
            <div class="input_group">
                <div class="input_label">用户名</div>
                <input
                    type="text"
                    v-model="username"
                    placeholder="请输入用户名"
                    class="form_input"
                />
            </div>
            <div class="input_group">
                <div class="input_label">密码</div>
                <input
                    type="password"
                    v-model="password"
                    placeholder="请输入密码"
                    class="form_input"
                    @keyup.enter="handleLogin"
                />
            </div>
            <div class="login_btn" @click="handleLogin">登录</div>
            <div class="register_tip">没有账号？<span>注册</span></div>
        </div>
    </div>
</template>

<style scoped>
    .login_body {
        height: 100vh;
        padding: 60px 32px;
        background: linear-gradient(180deg, #f5f3ff 0%, #f5f5f5 100%);
    }

    /* Logo 区 */
    .logo_section {
        margin-bottom: 48px;
    }
    .logo_icon {
        font-size: 56px;
        margin-bottom: 12px;
    }
    .logo_name {
        font-size: 28px;
        font-weight: 800;
        color: #6C5CE7;
        margin-bottom: 6px;
        letter-spacing: -0.5px;
    }
    .logo_slogan {
        font-size: 13px;
        color: #B2BEC3;
    }

    /* 表单区 */
    .form_section {
        width: 100%;
        gap: 20px;
    }
    .input_group {
        width: 100%;
    }
    .input_label {
        font-size: 13px;
        color: #636E72;
        margin-bottom: 8px;
        font-weight: 500;
    }
    .form_input {
        width: 100%;
        padding: 14px 16px;
        background: #fff;
        border-radius: 12px;
        font-size: 15px;
        color: #2D3436;
        border: 2px solid transparent;
        transition: border-color 0.2s;
    }
    .form_input:focus {
        border-color: #6C5CE7;
    }

    /* 登录按钮 */
    .login_btn {
        width: 100%;
        text-align: center;
        padding: 15px 0;
        background: linear-gradient(135deg, #6C5CE7, #8B7CF6);
        color: #fff;
        border-radius: 12px;
        font-size: 16px;
        font-weight: 700;
        cursor: pointer;
        box-shadow: 0 4px 16px rgba(108, 92, 231, 0.3);
        margin-top: 8px;
    }
    .login_btn:active {
        opacity: 0.85;
    }

    /* 注册提示 */
    .register_tip {
        text-align: center;
        font-size: 13px;
        color: #B2BEC3;
        margin-top: 4px;
    }
    .register_tip span {
        color: #6C5CE7;
        font-weight: 600;
        cursor: pointer;
    }
</style>
