import { Suspense } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { NavbarUserArea } from "@/components/layout/NavbarUserArea"
import { Sidebar } from "@/components/layout/Sidebar"
import { FrequentSectionServer } from "@/components/tool/FrequentSectionServer"
import { NavbarUserClient } from "@/components/layout/NavbarUserClient"
import { Toaster } from "@/components/ui/sonner"
import { db } from "@/db"
import { regions, categories } from "@/db/schema"

async function getNavData() {
  const allRegions = await db.select().from(regions).orderBy(regions.sortOrder)
  const allCategories = await db.select().from(categories).orderBy(categories.sortOrder)
  return allRegions.map((r) => ({
    ...r,
    categories: allCategories.filter((c) => c.regionId === r.id),
  }))
}

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const navRegions = await getNavData()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar
        regions={navRegions}
        userSlot={
          <Suspense fallback={<NavbarUserClient user={null} />}>
            <NavbarUserArea />
          </Suspense>
        }
      />
      <div className="max-w-7xl mx-auto px-4 py-4 flex gap-4">
        <Sidebar regions={navRegions} />
        <main className="flex-1 min-w-0">
          <div className="mb-4">
            <Suspense fallback={<FrequentSectionFallback />}>
              <FrequentSectionServer />
            </Suspense>
          </div>
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  )
}

function FrequentSectionFallback() {
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
      </div>
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-9 w-24 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
        ))}
      </div>
    </section>
  )
}
