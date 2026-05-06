import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { favorites, tools, categories, regions } from "@/db/schema"
import { getSession } from "@/lib/auth"
import { eq, and } from "drizzle-orm"

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
      categoryName: categories.name,
      regionName: regions.name,
    })
    .from(favorites)
    .innerJoin(tools, eq(favorites.toolId, tools.id))
    .innerJoin(categories, eq(tools.categoryId, categories.id))
    .innerJoin(regions, eq(categories.regionId, regions.id))
    .where(eq(favorites.userId, session.userId))

  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session.userId) return NextResponse.json({ error: "未登录" }, { status: 401 })

  const { toolId } = await req.json()

  // 检查是否已收藏
  const existing = await db
    .select()
    .from(favorites)
    .where(and(eq(favorites.userId, session.userId), eq(favorites.toolId, toolId)))
    .limit(1)

  if (existing.length > 0) {
    // 取消收藏
    await db
      .delete(favorites)
      .where(and(eq(favorites.userId, session.userId), eq(favorites.toolId, toolId)))
    return NextResponse.json({ favorited: false })
  } else {
    await db.insert(favorites).values({ userId: session.userId, toolId })
    return NextResponse.json({ favorited: true })
  }
}
