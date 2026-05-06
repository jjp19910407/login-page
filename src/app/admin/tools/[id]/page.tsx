import { db } from "@/db"
import { tools, categories, regions } from "@/db/schema"
import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import { EditToolForm } from "./EditToolForm"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditToolPage({ params }: Props) {
  const { id } = await params
  const toolId = parseInt(id)
  if (isNaN(toolId)) notFound()

  const [tool] = await db.select().from(tools).where(eq(tools.id, toolId)).limit(1)
  if (!tool) notFound()

  const allRegions = await db.select().from(regions).orderBy(regions.sortOrder)
  const allCategories = await db.select().from(categories).orderBy(categories.sortOrder)

  const regionsWithCategories = allRegions.map((r) => ({
    ...r,
    categories: allCategories.filter((c) => c.regionId === r.id),
  }))

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">编辑工具</h1>
        <p className="text-sm text-slate-500 mt-1">{tool.name}</p>
      </div>
      <EditToolForm tool={tool} regions={regionsWithCategories} />
    </div>
  )
}
