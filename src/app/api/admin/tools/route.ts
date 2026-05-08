import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { tools, categories, regions } from "@/db/schema"
import { getSession } from "@/lib/auth"
import { eq } from "drizzle-orm"

export async function GET() {
  const result = await db
    .select({
      id: tools.id,
      name: tools.name,
      url: tools.url,
      logoUrl: tools.logoUrl,
      isActive: tools.isActive,
      isFeatured: tools.isFeatured,
      viewCount: tools.viewCount,
      categoryId: tools.categoryId,
      categoryName: categories.name,
      regionName: regions.name,
      createdAt: tools.createdAt,
    })
    .from(tools)
    .innerJoin(categories, eq(tools.categoryId, categories.id))
    .innerJoin(regions, eq(categories.regionId, regions.id))
    .orderBy(tools.createdAt)

  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (session.role !== "admin") return NextResponse.json({ error: "无权限" }, { status: 403 })

  const body = await req.json()
  const { name, url, description, logoUrl, categoryId, tags, isFeatured, sortOrder, pricingInfo, company } = body

  if (!name || !url || !categoryId) {
    return NextResponse.json({ error: "名称、网址、分类为必填项" }, { status: 400 })
  }

  const slug = name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
    + "-" + Date.now()

  const [tool] = await db
    .insert(tools)
    .values({
      name,
      slug,
      url,
      description,
      logoUrl,
      pricingInfo,
      company: company || null,
      categoryId: parseInt(categoryId),
      tags: tags || [],
      isFeatured: isFeatured || false,
      sortOrder: sortOrder || 0,
      createdBy: session.userId,
    })
    .returning()

  return NextResponse.json(tool)
}

export async function PUT(req: NextRequest) {
  const session = await getSession()
  if (session.role !== "admin") return NextResponse.json({ error: "无权限" }, { status: 403 })

  const body = await req.json()
  const { id, name, url, description, logoUrl, categoryId, tags, isFeatured, isActive, sortOrder, pricingInfo, company } = body

  const [tool] = await db
    .update(tools)
    .set({
      name,
      url,
      description,
      logoUrl,
      pricingInfo,
      company: company || null,
      categoryId: parseInt(categoryId),
      tags: tags || [],
      isFeatured: isFeatured ?? false,
      isActive: isActive ?? true,
      sortOrder: sortOrder || 0,
      updatedAt: new Date(),
    })
    .where(eq(tools.id, parseInt(id)))
    .returning()

  return NextResponse.json(tool)
}

export async function DELETE(req: NextRequest) {
  const session = await getSession()
  if (session.role !== "admin") return NextResponse.json({ error: "无权限" }, { status: 403 })

  const { id } = await req.json()
  await db.delete(tools).where(eq(tools.id, parseInt(id)))
  return NextResponse.json({ success: true })
}
