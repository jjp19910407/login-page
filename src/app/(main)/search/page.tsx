import { db } from "@/db"
import { tools, categories, regions, favorites } from "@/db/schema"
import { eq, and, ilike, or } from "drizzle-orm"
import { getSession } from "@/lib/auth"
import { ToolCard } from "@/components/tool/ToolCard"

interface Props {
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams
  const session = await getSession()

  if (!q) {
    return (
      <div className="text-center py-16 text-slate-400">
        <div className="text-4xl mb-3">🔍</div>
        <p>请输入关键词搜索</p>
      </div>
    )
  }

  const results = await db
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
    .where(
      and(
        eq(tools.isActive, true),
        or(ilike(tools.name, `%${q}%`), ilike(tools.description, `%${q}%`))
      )
    )
    .orderBy(tools.sortOrder)
    .limit(100)

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
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          搜索：{q}
        </h1>
        <p className="text-sm text-slate-500 mt-1">找到 {results.length} 个结果</p>
      </div>

      {results.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <div className="text-4xl mb-3">😕</div>
          <p>没有找到相关工具</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {results.map((tool) => (
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
