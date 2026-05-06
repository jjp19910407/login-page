import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { hashPassword } from "@/lib/password"
import { getSession } from "@/lib/auth"

export async function POST(req: NextRequest) {
  const { phone, password } = await req.json()

  if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
    return NextResponse.json({ error: "手机号格式不正确" }, { status: 400 })
  }
  if (!password || password.length < 6) {
    return NextResponse.json({ error: "密码至少6位" }, { status: 400 })
  }

  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.phone, phone)).limit(1)
  if (existing) {
    return NextResponse.json({ error: "该手机号已注册" }, { status: 409 })
  }

  const passwordHash = await hashPassword(password)
  const [user] = await db
    .insert(users)
    .values({ phone, passwordHash })
    .returning()

  const session = await getSession()
  session.userId = user.id
  session.phone = user.phone
  session.role = user.role as "user" | "admin"
  await session.save()

  return NextResponse.json({ success: true })
}
