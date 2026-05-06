import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { tools, categories, regions } from "@/db/schema"
import { eq, and, ilike, or } from "drizzle-orm"

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const regionSlug = searchParams.get("region")
  const categorySlug = searchParams.get("category")
  const q = searchParams.get("q")
  const featured = searchParams.get("featured")

  let query = db
    .select({
      id: tools.id,
      name: tools.name,
      slug: tools.slug,
      description: tools.description,
      url: tools.url,
      logoUrl: tools.logoUrl,
      tags: tools.tags,
      isFeatured: tools.isFeatured,
      viewCount: tools.viewCount,
      categoryId: tools.categoryId,
      categoryName: categories.name,
      categorySlug: categories.slug,
      regionId: regions.id,
      regionName: regions.name,
      regionSlug: regions.slug,
    })
    .from(tools)
    .innerJoin(categories, eq(tools.categoryId, categories.id))
    .innerJoin(regions, eq(categories.regionId, regions.id))
    .where(eq(tools.isActive, true))

  const conditions = [eq(tools.isActive, true)]

  if (regionSlug) conditions.push(eq(regions.slug, regionSlug))
  if (categorySlug) conditions.push(eq(categories.slug, categorySlug))
  if (featured === "true") conditions.push(eq(tools.isFeatured, true))
  if (q) {
    conditions.push(
      or(ilike(tools.name, `%${q}%`), ilike(tools.description, `%${q}%`))!
    )
  }

  const result = await db
    .select({
      id: tools.id,
      name: tools.name,
      slug: tools.slug,
      description: tools.description,
      url: tools.url,
      logoUrl: tools.logoUrl,
      tags: tools.tags,
      isFeatured: tools.isFeatured,
      viewCount: tools.viewCount,
      categoryId: tools.categoryId,
      categoryName: categories.name,
      categorySlug: categories.slug,
      regionId: regions.id,
      regionName: regions.name,
      regionSlug: regions.slug,
    })
    .from(tools)
    .innerJoin(categories, eq(tools.categoryId, categories.id))
    .innerJoin(regions, eq(categories.regionId, regions.id))
    .where(and(...conditions))
    .orderBy(tools.sortOrder, tools.viewCount)
    .limit(200)

  return NextResponse.json(result)
}
