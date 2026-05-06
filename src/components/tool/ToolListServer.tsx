import { db } from "@/db"
import { tools, categories, regions, favorites } from "@/db/schema"
import { eq } from "drizzle-orm"
import { getSession } from "@/lib/auth"
import { ToolListClient } from "./ToolListClient"

async function getTools() {
  return db
    .select({
      id: tools.id,
      name: tools.name,
      slug: tools.slug,
      description: tools.description,
      url: tools.url,
      logoUrl: tools.logoUrl,
      pricingInfo: tools.pricingInfo,
      tags: tools.tags,
      isFeatured: tools.isFeatured,
      categoryName: categories.name,
      regionName: regions.name,
    })
    .from(tools)
    .innerJoin(categories, eq(tools.categoryId, categories.id))
    .innerJoin(regions, eq(categories.regionId, regions.id))
    .where(eq(tools.isActive, true))
    .orderBy(tools.sortOrder)
    .limit(200)
}

export async function ToolListServer() {
  const session = await getSession()
  const allTools = await getTools()

  let favoritedIds: number[] = []
  if (session.userId) {
    const favs = await db
      .select({ toolId: favorites.toolId })
      .from(favorites)
      .where(eq(favorites.userId, session.userId!))
    favoritedIds = favs.map((f) => f.toolId)
  }

  return (
    <ToolListClient
      allTools={allTools}
      favoritedIds={favoritedIds}
      isLoggedIn={!!session.userId}
    />
  )
}
