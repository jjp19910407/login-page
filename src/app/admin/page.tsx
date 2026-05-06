import { db } from "@/db"
import { tools, categories, regions } from "@/db/schema"
import { eq } from "drizzle-orm"
import Link from "next/link"
import { PlusIcon } from "lucide-react"
import { AdminToolsTable } from "./AdminToolsTable"

export default async function AdminPage() {
  const allTools = await db
    .select({
      id: tools.id,
      name: tools.name,
      url: tools.url,
      logoUrl: tools.logoUrl,
      isActive: tools.isActive,
      isFeatured: tools.isFeatured,
      viewCount: tools.viewCount,
      categoryName: categories.name,
      regionName: regions.name,
    })
    .from(tools)
    .innerJoin(categories, eq(tools.categoryId, categories.id))
    .innerJoin(regions, eq(categories.regionId, regions.id))
    .orderBy(tools.createdAt)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">工具管理</h1>
          <p className="text-sm text-slate-500 mt-1">共 {allTools.length} 个工具</p>
        </div>
        <Link
          href="/admin/tools/new"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          <PlusIcon className="w-4 h-4" />
          新增工具
        </Link>
      </div>

      <AdminToolsTable tools={allTools} />
    </div>
  )
}
