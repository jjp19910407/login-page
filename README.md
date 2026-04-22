# Vue 3 登录页面

基于 Figma 设计稿实现的移动端登录页面。

## 设计稿
- Figma 链接: https://www.figma.com/design/aBlmNlO2vxh2zKxjs3TuhI/20-Screen-Login---Register-Mobile-App--Community-?node-id=3-16929&t=u0MWORFJOn05BJnI-4
- 页面尺寸: 375x812 (移动端)
- 设计风格: 现代简洁，深色头部背景，渐变按钮

## 功能特点
- ✅ 响应式移动端设计
- ✅ 邮箱和密码输入框
- ✅ 密码显示/隐藏切换
- ✅ 登录按钮（带渐变和阴影效果）
- ✅ Google 和 Facebook 第三方登录
- ✅ 条款协议链接
- ✅ 状态栏和主页指示器模拟

## 技术栈
- Vue 3 (Composition API)
- Vite 构建工具
- CSS3 (Flexbox, Grid, 渐变，阴影)
- Inter 字体

## 项目结构
```
├── src/
│   ├── App.vue          # 主组件
│   └── main.js          # 应用入口
├── index.html           # HTML模板
├── package.json         # 依赖配置
├── vite.config.js       # Vite配置
└── README.md            # 项目说明
```

## 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

然后打开浏览器访问 `http://localhost:3000`

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

## 设计细节

### 颜色方案
- 主背景: `#FFFFFF`
- 头部背景: `#0D0D1B`
- 主按钮: `#1D61E7` (带渐变)
- 文字主色: `#111827`
- 文字次色: `#6C7278`
- 边框颜色: `#E5E7EB`

### 字体
- 字体家族: Inter
- 字号范围: 12px - 28px
- 字重: 400 (Regular), 500 (Medium), 600 (Semi Bold), 700 (Bold)

### 特殊效果
- 头部星空背景: 径向渐变
- 光晕效果: 线性渐变 + 模糊
- 按钮效果: 渐变背景 + 边框渐变 + 阴影

## 自定义

### 修改样式
所有样式都在 `App.vue` 文件的 `<style>` 部分，可以直接修改CSS变量或样式规则。

### 添加功能
- 表单验证: 可以在 `<script setup>` 部分添加验证逻辑
- API集成: 可以在 `handleLogin` 方法中添加API调用
- 路由: 可以集成 Vue Router 实现页面跳转

## 浏览器支持
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 许可证
MIT