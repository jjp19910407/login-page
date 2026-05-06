// 开发阶段 mock 短信，生产环境替换为真实短信服务
export async function sendSmsCode(phone: string, code: string): Promise<void> {
  if (process.env.NODE_ENV !== "production") {
    console.log(`[SMS MOCK] 手机号: ${phone}, 验证码: ${code}`)
    return
  }
  // TODO: 接入阿里云/腾讯云短信
  throw new Error("生产环境短信服务未配置")
}
