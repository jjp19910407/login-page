import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { smsCodes, users } from "@/db/schema"
import { getSession } from "@/lib/auth"
import { eq, and, gt } from "drizzle-orm"

export async function POST(req: NextRequest) {
  const { phone, code } = await req.json()

  if (!phone || !code) {
    return NextResponse.json({ error: "参数缺失" }, { status: 400 })
  }

  // 验证验证码
  const [smsRecord] = await db
    .select()
    .from(smsCodes)
    .where(
      and(
        eq(smsCodes.phone, phone),
        eq(smsCodes.code, code),
        eq(smsCodes.isUsed, false),
        gt(smsCodes.expiresAt, new Date())
      )
    )
    .limit(1)

  if (!smsRecord) {
    return NextResponse.json({ error: "验证码错误或已过期" }, { status: 400 })
  }

  // 标记验证码已使用
  await db.update(smsCodes).set({ isUsed: true }).where(eq(smsCodes.id, smsRecord.id))

  // 查找或创建用户
  let [user] = await db.select().from(users).where(eq(users.phone, phone)).limit(1)

  if (!user) {
    const adminPhone = process.env.ADMIN_PHONE
    const role = adminPhone && phone === adminPhone ? "admin" : "user"
    ;[user] = await db
      .insert(users)
      .values({ phone, role })
      .returning()
  } else {
    // 检查是否需要升级为 admin
    const adminPhone = process.env.ADMIN_PHONE
    if (adminPhone && phone === adminPhone && user.role !== "admin") {
      ;[user] = await db
        .update(users)
        .set({ role: "admin", lastLoginAt: new Date() })
        .where(eq(users.id, user.id))
        .returning()
    } else {
      await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, user.id))
    }
  }

  // 写入 session
  const session = await getSession()
  session.userId = user.id
  session.phone = user.phone
  session.role = user.role as "user" | "admin"
  await session.save()

  return NextResponse.json({ success: true, user: { id: user.id, phone: user.phone, role: user.role, nickname: user.nickname } })
}
