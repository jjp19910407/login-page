import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { smsCodes } from "@/db/schema"
import { sendSmsCode } from "@/lib/sms"
import { eq, and, gt } from "drizzle-orm"

export async function POST(req: NextRequest) {
  const { phone } = await req.json()

  if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
    return NextResponse.json({ error: "手机号格式不正确" }, { status: 400 })
  }

  // 频率限制：60秒内只能发一次
  const recent = await db
    .select()
    .from(smsCodes)
    .where(
      and(
        eq(smsCodes.phone, phone),
        gt(smsCodes.createdAt, new Date(Date.now() - 60 * 1000))
      )
    )
    .limit(1)

  if (recent.length > 0) {
    return NextResponse.json({ error: "发送太频繁，请60秒后再试" }, { status: 429 })
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString()
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000)

  await db.insert(smsCodes).values({ phone, code, expiresAt })
  await sendSmsCode(phone, code)

  // 开发环境在响应中返回验证码，方便调试
  const isDev = process.env.NODE_ENV !== "production"
  return NextResponse.json({ success: true, ...(isDev && { code }) })
}
