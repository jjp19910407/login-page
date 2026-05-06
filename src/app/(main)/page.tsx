import { Suspense } from "react"
import { ToolListServer } from "@/components/tool/ToolListServer"

export default function HomePage() {
  return (
    <Suspense fallback={<ToolListFallback />}>
      <ToolListServer />
    </Suspense>
  )
}

function ToolListFallback() {
  return (
    <div className="space-y-8">
      <section>
        <div className="h-7 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 h-32 animate-pulse" />
          ))}
        </div>
      </section>
    </div>
  )
}
