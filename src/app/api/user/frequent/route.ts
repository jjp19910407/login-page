import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { frequentTools, tools, categories, regions } from "@/db/schema"
import { getSession } from "@/lib/auth"
import { and, eq, desc } from "drizzle-orm"

export async function GET() {
  const session = await getSession()
  if (!session.userId) return NextResponse.json({ error: "未登录" }, { status: 401 })

  const result = await db
    .select({
      id: tools.id,
      name: tools.name,
      slug: tools.slug,
      description: tools.description,
      url: tools.url,
      logoUrl: tools.logoUrl,
      useCount: frequentTools.useCount,
      lastUsedAt: frequentTools.lastUsedAt,
      categoryName: categories.name,
      regionName: regions.name,
    })
    .from(frequentTools)
    .innerJoin(tools, eq(frequentTools.toolId, tools.id))
    .innerJoin(categories, eq(tools.categoryId, categories.id))
    .innerJoin(regions, eq(categories.regionId, regions.id))
    .where(eq(frequentTools.userId, session.userId))
    .orderBy(desc(frequentTools.useCount))
    .limit(20)

  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session.userId) return NextResponse.json({ error: "未登录" }, { status: 401 })

  const { toolId } = await req.json()
  if (!toolId) return NextResponse.json({ error: "参数缺失" }, { status: 400 })

  const [tool] = await db.select({ id: tools.id }).from(tools).where(eq(tools.id, toolId)).limit(1)
  if (!tool) return NextResponse.json({ error: "工具不存在" }, { status: 404 })

  const [existing] = await db
    .select()
    .from(frequentTools)
    .where(and(eq(frequentTools.userId, session.userId), eq(frequentTools.toolId, toolId)))
    .limit(1)

  if (existing) {
    await db
      .update(frequentTools)
      .set({ useCount: existing.useCount! + 1, lastUsedAt: new Date() })
      .where(and(eq(frequentTools.userId, session.userId), eq(frequentTools.toolId, toolId)))
    return NextResponse.json({ added: false, message: "已在常用列表" })
  }

  await db.insert(frequentTools).values({ userId: session.userId, toolId })
  return NextResponse.json({ added: true })
}

export async function DELETE(req: NextRequest) {
  const session = await getSession()
  if (!session.userId) return NextResponse.json({ error: "未登录" }, { status: 401 })

  const { toolId } = await req.json()
  await db
    .delete(frequentTools)
    .where(and(eq(frequentTools.userId, session.userId), eq(frequentTools.toolId, toolId)))

  return NextResponse.json({ success: true })
}

