import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { verifyPassword } from "@/lib/password"
import { getSession } from "@/lib/auth"

export async function POST(req: NextRequest) {
  const { phone, password } = await req.json()

  if (!phone || !password) {
    return NextResponse.json({ error: "参数缺失" }, { status: 400 })
  }

  const [user] = await db.select().from(users).where(eq(users.phone, phone)).limit(1)

  if (!user || !user.passwordHash) {
    return NextResponse.json({ error: "账号不存在或未设置密码" }, { status: 401 })
  }

  const ok = await verifyPassword(password, user.passwordHash)
  if (!ok) {
    return NextResponse.json({ error: "密码错误" }, { status: 401 })
  }

  if (!user.isActive) {
    return NextResponse.json({ error: "账号已被禁用" }, { status: 403 })
  }

  await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, user.id))

  const session = await getSession()
  session.userId = user.id
  session.phone = user.phone
  session.role = user.role as "user" | "admin"
  await session.save()

  return NextResponse.json({ success: true })
}
