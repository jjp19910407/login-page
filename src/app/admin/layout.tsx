import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ShieldIcon, LayoutGridIcon, TagIcon } from "lucide-react"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session.userId || session.role !== "admin") redirect("/")

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      {/* Admin sidebar */}
      <aside className="w-52 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 min-h-screen">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <ShieldIcon className="w-5 h-5 text-blue-500" />
            管理后台
          </div>
        </div>
        <nav className="p-3 space-y-1">
          <Link
            href="/admin"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <LayoutGridIcon className="w-4 h-4" />
            工具管理
          </Link>
          <Link
            href="/admin/categories"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <TagIcon className="w-4 h-4" />
            分类管理
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 mt-4"
          >
            ← 返回前台
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
