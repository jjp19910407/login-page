import { db } from "@/db"
import { regions, categories } from "@/db/schema"
import { AddToolForm } from "./AddToolForm"

export default async function NewToolPage() {
  const allRegions = await db.select().from(regions).orderBy(regions.sortOrder)
  const allCategories = await db.select().from(categories).orderBy(categories.sortOrder)

  const tree = allRegions.map((r) => ({
    ...r,
    categories: allCategories.filter((c) => c.regionId === r.id),
  }))

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">新增工具</h1>
      </div>
      <AddToolForm regions={tree} />
    </div>
  )
}
