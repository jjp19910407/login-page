import { db } from "@/db"
import { tools, categories, regions, favorites } from "@/db/schema"
import { eq, and } from "drizzle-orm"
import { getSession } from "@/lib/auth"
import { ToolCard } from "@/components/tool/ToolCard"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{ region: string; category: string }>
}

export default async function CategoryPage({ params }: Props) {
  const { region: regionSlug, category: categorySlug } = await params

  const [region] = await db.select().from(regions).where(eq(regions.slug, regionSlug)).limit(1)
  if (!region) notFound()

  const [category] = await db
    .select()
    .from(categories)
    .where(and(eq(categories.regionId, region.id), eq(categories.slug, categorySlug)))
    .limit(1)
  if (!category) notFound()

  const session = await getSession()
  const allTools = await db
    .select()
    .from(tools)
    .where(and(eq(tools.categoryId, category.id), eq(tools.isActive, true)))
    .orderBy(tools.sortOrder)

  let favoritedIds = new Set<number>()
  if (session.userId) {
    const favs = await db
      .select({ toolId: favorites.toolId })
      .from(favorites)
      .where(eq(favorites.userId, session.userId))
    favoritedIds = new Set(favs.map((f) => f.toolId))
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm text-slate-500">{region.name}</p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{category.name}</h1>
        <p className="text-sm text-slate-500 mt-1">{allTools.length} 个工具</p>
      </div>

      {allTools.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <div className="text-4xl mb-3">📭</div>
          <p>该分类暂无工具</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allTools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              isFavorited={favoritedIds.has(tool.id)}
              isLoggedIn={!!session.userId}
            />
          ))}
        </div>
      )}
    </div>
  )
}
