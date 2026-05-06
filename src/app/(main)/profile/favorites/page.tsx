import { db } from "@/db"
import { favorites, tools, categories, regions } from "@/db/schema"
import { getSession } from "@/lib/auth"
import { eq } from "drizzle-orm"
import { ToolCard } from "@/components/tool/ToolCard"
import { redirect } from "next/navigation"

export default async function FavoritesPage() {
  const session = await getSession()
  if (!session.userId) redirect("/login")

  const favTools = await db
    .select({
      id: tools.id,
      name: tools.name,
      slug: tools.slug,
      description: tools.description,
      url: tools.url,
      logoUrl: tools.logoUrl,
      tags: tools.tags,
      isFeatured: tools.isFeatured,
      categoryName: categories.name,
      regionName: regions.name,
    })
    .from(favorites)
    .innerJoin(tools, eq(favorites.toolId, tools.id))
    .innerJoin(categories, eq(tools.categoryId, categories.id))
    .innerJoin(regions, eq(categories.regionId, regions.id))
    .where(eq(favorites.userId, session.userId))

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">我的收藏</h1>
        <p className="text-sm text-slate-500 mt-1">{favTools.length} 个工具</p>
      </div>

      {favTools.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <div className="text-4xl mb-3">🔖</div>
          <p>还没有收藏任何工具</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {favTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} isFavorited={true} isLoggedIn={true} />
          ))}
        </div>
      )}
    </div>
  )
}
