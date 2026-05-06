import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { tools, frequentTools } from "@/db/schema"
import { getSession } from "@/lib/auth"
import { and, eq, sql } from "drizzle-orm"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const toolId = parseInt(id)

  // 增加浏览量
  await db.update(tools).set({ viewCount: sql`${tools.viewCount} + 1` }).where(eq(tools.id, toolId))

  // 记录常用（登录用户）
  const session = await getSession()
  if (session.userId) {
    const existing = await db
      .select()
      .from(frequentTools)
      .where(and(eq(frequentTools.userId, session.userId), eq(frequentTools.toolId, toolId)))
      .limit(1)

    if (existing.length > 0) {
      await db
        .update(frequentTools)
        .set({ useCount: sql`${frequentTools.useCount} + 1`, lastUsedAt: new Date() })
        .where(eq(frequentTools.id, existing[0].id))
    } else {
      await db.insert(frequentTools).values({ userId: session.userId, toolId })
    }
  }

  return NextResponse.json({ success: true })
}
