import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { customLinks } from "@/db/schema"
import { getSession } from "@/lib/auth"
import { and, eq, asc } from "drizzle-orm"

export async function GET() {
  const session = await getSession()
  if (!session.userId) return NextResponse.json({ error: "未登录" }, { status: 401 })

  const result = await db
    .select()
    .from(customLinks)
    .where(eq(customLinks.userId, session.userId))
    .orderBy(asc(customLinks.sortOrder), asc(customLinks.createdAt))

  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session.userId) return NextResponse.json({ error: "未登录" }, { status: 401 })

  const { name, url } = await req.json()
  if (!name?.trim() || !url?.trim()) {
    return NextResponse.json({ error: "名称和网址为必填项" }, { status: 400 })
  }

  // 简单校验 URL 格式
  try {
    new URL(url)
  } catch {
    return NextResponse.json({ error: "网址格式不正确" }, { status: 400 })
  }

  const [link] = await db
    .insert(customLinks)
    .values({ userId: session.userId, name: name.trim(), url: url.trim() })
    .returning()

  return NextResponse.json(link)
}

export async function DELETE(req: NextRequest) {
  const session = await getSession()
  if (!session.userId) return NextResponse.json({ error: "未登录" }, { status: 401 })

  const { id } = await req.json()
  await db
    .delete(customLinks)
    .where(and(eq(customLinks.id, parseInt(id)), eq(customLinks.userId, session.userId)))

  return NextResponse.json({ success: true })
}
