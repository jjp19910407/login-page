import { db } from "@/db"
import { categories, regions } from "@/db/schema"
import { eq } from "drizzle-orm"
import type { MetadataRoute } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-nav.example.com"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allRegions = await db.select().from(regions)
  const allCategories = await db.select().from(categories)

  const categoryUrls: MetadataRoute.Sitemap = allCategories.map((cat) => {
    const region = allRegions.find((r) => r.id === cat.regionId)
    return {
      url: `${siteUrl}/${region?.slug ?? ""}/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    }
  })

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    ...categoryUrls,
  ]
}
