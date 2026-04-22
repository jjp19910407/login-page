<template>
  <div class="login-page">
    <!-- 主要内容 -->
    <div class="content">
      <!-- 头部区域 -->
      <div class="head">
        <!-- 星空背景效果 -->
        <div class="star-background">
          <div class="star star-1"></div>
          <div class="star star-2"></div>
          <div class="star star-3"></div>
        </div>

        <!-- 渐变光晕 -->
        <div class="glow"></div>

        <!-- 标题区域 -->
        <div class="headline">
          <div class="logo">LOGO</div>
          <div class="title">
            <h1>Log in to your account</h1>
            <p>Welcome back! Please enter your details.</p>
          </div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="input-section">
        <!-- 输入字段 -->
        <div class="fields">
          <div class="input-field">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Loisbecket@gmail.com"
              v-model="email"
            />
          </div>

          <div class="input-field">
            <label for="password">Password</label>
            <div class="password-input">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                placeholder="********"
                v-model="password"
              />
              <button
                type="button"
                class="toggle-password"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          <!-- 忘记密码链接 -->
          <div class="forgot-password">
            <a href="#" class="forgot-link">Forgot password?</a>
          </div>
        </div>

        <!-- 按钮区域 -->
        <div class="buttons">
          <button class="login-btn" @click="handleLogin">
            Log In
          </button>

          <!-- 或使用其他方式登录 -->
          <div class="or-login-with">
            <div class="divider">
              <span class="divider-line"></span>
              <span class="divider-text">Or login with</span>
              <span class="divider-line"></span>
            </div>

            <div class="social-login">
              <button class="social-btn google-btn">
                <span class="social-icon">G</span>
                <span>Google</span>
              </button>
              <button class="social-btn facebook-btn">
                <span class="social-icon">F</span>
                <span>Facebook</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 条款文字 -->
      <div class="terms">
        <p>
          By signing up, you agree to the
          <a href="#" class="terms-link">Terms of Service</a> and
          <a href="#" class="terms-link">Data Processing Agreement</a>
        </p>
      </div>
    </div>

    <!-- 主页指示器 (模拟) -->
    <div class="home-indicator"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const showPassword = ref(false)

const handleLogin = () => {
  console.log('Login attempt:', { email: email.value, password: password.value })
  // 这里可以添加实际的登录逻辑
}
</script>

<style>
/* 重置样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #FFFFFF;
  overflow-x: hidden;
}

.login-page {
  width: 100%;
  min-height: 100vh;
  max-width: 375px;
  margin: 0 auto;
  background: #FFFFFF;
  position: relative;
  overflow: hidden;
  padding-bottom: 34px;
}


/* 主要内容 */
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  width: 100%;
}

/* 头部区域 */
.head {
  background: #0D0D1B;
  border-radius: 0 0 20px 20px;
  height: 263px;
  position: relative;
  overflow: hidden;
}

.star-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.star {
  position: absolute;
  background: radial-gradient(ellipse at 50% 43%, rgba(255, 255, 255, 1) 0%, rgba(217, 217, 217, 0) 100%);
  border-radius: 50%;
}

.star-1 {
  width: 1040px;
  height: 692px;
  top: -155px;
  left: -320px;
  opacity: 0.3;
}

.star-2 {
  width: 852px;
  height: 531.55px;
  top: -74.93px;
  left: -225.92px;
  opacity: 0.7;
}

.star-3 {
  width: 1248.18px;
  height: 806.84px;
  top: -77.17px;
  left: -314.18px;
  opacity: 0.6;
}

.glow {
  position: absolute;
  width: 428.48px;
  height: 432.38px;
  background: linear-gradient(181deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 83%);
  filter: blur(63.73px);
  top: -151.05px;
  left: 100px;
}

.headline {
  position: relative;
  z-index: 1;
  padding: 68px 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  align-items: flex-start;
}

.logo {
  color: white;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 1px;
}

.title h1 {
  color: white;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 12px;
}

.title p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
}

/* 输入区域 */
.input-section {
  width: 100%;
  max-width: 327px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-field label {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.input-field input {
  padding: 12px 16px;
  border: 1px solid #D1D5DB;
  border-radius: 10px;
  font-size: 16px;
  font-family: 'Inter', sans-serif;
  background: white;
  transition: all 0.2s;
}

.input-field input:focus {
  outline: none;
  border-color: #1D61E7;
  box-shadow: 0 0 0 3px rgba(29, 97, 231, 0.1);
}

.input-field input::placeholder {
  color: #9CA3AF;
}

.password-input {
  position: relative;
}

.password-input input {
  padding-right: 40px;
}

.toggle-password {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
  color: #6C7278;
}

.forgot-password {
  display: flex;
  justify-content: flex-end;
}

.forgot-link {
  color: #1D61E7;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;
}

.forgot-link:hover {
  color: #1557D9;
}

/* 按钮区域 */
.buttons {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.login-btn {
  background: linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%), #1D61E7;
  border: 1px solid;
  border-image: linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%) 1;
  border-radius: 10px;
  padding: 16px 24px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0px 0px 0px 1px rgba(55, 93, 251, 1), 0px 1px 2px 0px rgba(37, 62, 167, 0.48);
}

.login-btn:hover {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 100%), #1557D9;
  transform: translateY(-1px);
  box-shadow: 0px 2px 4px 0px rgba(37, 62, 167, 0.3);
}

.login-btn:active {
  transform: translateY(0);
}

/* 其他登录方式 */
.or-login-with {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.divider {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #6B7280;
  font-size: 14px;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: #E5E7EB;
}

.divider-text {
  padding: 0 8px;
}

.social-login {
  display: flex;
  gap: 12px;
}

.social-btn {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #E5E7EB;
  border-radius: 10px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.social-btn:hover {
  background: #F9FAFB;
  border-color: #D1D5DB;
}

.social-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.google-btn {
  color: #111827;
}

.facebook-btn {
  color: #1877F2;
}

/* 条款文字 */
.terms {
  text-align: center;
  color: #6C7278;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;
  width: 100%;
  max-width: 297px;
}

.terms-link {
  color: #111827;
  font-weight: 600;
  text-decoration: none;
}

.terms-link:hover {
  text-decoration: underline;
}

/* 主页指示器 */
.home-indicator {
  width: 100%;
  height: 34px;
  background: #111827;
  border-radius: 20px 20px 0 0;
  position: absolute;
  bottom: 0;
  left: 0;
  max-width: 375px;
  margin: 0 auto;
}

/* 响应式调整 */
@media (max-width: 375px) {
  .login-page {
    max-width: 100%;
  }

  .content {
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }

  .headline {
    padding: 40px 20px;
  }

  .title h1 {
    font-size: 24px;
  }

  .social-login {
    flex-direction: column;
  }
}
</style>