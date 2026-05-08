import { db } from "@/db"
import { tools, categories, regions, favorites } from "@/db/schema"
import { eq, and } from "drizzle-orm"
import { getSession } from "@/lib/auth"
import { ToolCard } from "@/components/tool/ToolCard"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-nav.example.com"

interface Props {
  params: Promise<{ region: string; category: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { region: regionSlug, category: categorySlug } = await params

  const [region] = await db.select().from(regions).where(eq(regions.slug, regionSlug)).limit(1)
  const [category] = await db
    .select()
    .from(categories)
    .where(and(eq(categories.regionId, region?.id ?? 0), eq(categories.slug, categorySlug)))
    .limit(1)

  if (!region || !category) {
    return { title: "分类不存在" }
  }

  const title = `${region.name}${category.name} AI 工具大全`
  const description = `精选${region.name}最优质的${category.name}工具，帮你快速找到最适合的 AI ${category.name}应用，提升工作效率。`
  const canonicalUrl = `${siteUrl}/${regionSlug}/${categorySlug}`

  return {
    title,
    description,
    keywords: [
      `${category.name}`,
      `AI ${category.name}`,
      `${region.name}${category.name}工具`,
      `最好的${category.name}工具`,
      `${category.name}推荐`,
    ],
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    alternates: {
      canonical: canonicalUrl,
    },
  }
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${region.name}${category.name} AI 工具`,
    description: `精选${region.name}最优质的${category.name}工具列表`,
    url: `${siteUrl}/${regionSlug}/${categorySlug}`,
    numberOfItems: allTools.length,
    itemListElement: allTools.slice(0, 20).map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.name,
      description: tool.description,
      url: tool.url,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
    </>
  )
}
