import { getSession } from "@/lib/auth"
import { db } from "@/db"
import { tools, categories, frequentTools, customLinks } from "@/db/schema"
import { eq, desc, asc } from "drizzle-orm"
import { FrequentSection } from "./FrequentSection"

async function getFrequentTools(userId: number) {
  return db
    .select({
      id: tools.id,
      name: tools.name,
      slug: tools.slug,
      description: tools.description,
      url: tools.url,
      logoUrl: tools.logoUrl,
      useCount: frequentTools.useCount,
      categoryName: categories.name,
    })
    .from(frequentTools)
    .innerJoin(tools, eq(frequentTools.toolId, tools.id))
    .innerJoin(categories, eq(tools.categoryId, categories.id))
    .where(eq(frequentTools.userId, userId))
    .orderBy(desc(frequentTools.useCount))
    .limit(12)
}

async function getCustomLinks(userId: number) {
  return db
    .select()
    .from(customLinks)
    .where(eq(customLinks.userId, userId))
    .orderBy(asc(customLinks.sortOrder), asc(customLinks.createdAt))
}

export async function FrequentSectionServer() {
  const session = await getSession()
  const isLoggedIn = !!session.userId
  const isAdmin = session.role === "admin"
  const frequentList = session.userId ? await getFrequentTools(session.userId) : []
  const customList = session.userId ? await getCustomLinks(session.userId) : []

  return (
    <FrequentSection
      initialItems={frequentList}
      initialCustomLinks={customList}
      isLoggedIn={isLoggedIn}
      isAdmin={isAdmin}
    />
  )
}
