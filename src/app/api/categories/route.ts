import { NextResponse } from "next/server"
import { db } from "@/db"
import { regions, categories } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function GET() {
  const allRegions = await db.select().from(regions).orderBy(regions.sortOrder)
  const allCategories = await db.select().from(categories).orderBy(categories.sortOrder)

  const tree = allRegions.map((r) => ({
    ...r,
    categories: allCategories.filter((c) => c.regionId === r.id),
  }))

  return NextResponse.json(tree)
}
