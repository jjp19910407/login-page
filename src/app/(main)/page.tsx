import { Suspense } from "react"
import { ToolListServer } from "@/components/tool/ToolListServer"
import type { Metadata } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-nav.example.com"

export const metadata: Metadata = {
  alternates: {
    canonical: siteUrl,
  },
}

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "AI 导航",
  url: siteUrl,
  description: "汇聚国内外最优质的 AI 工具，涵盖 AI 图片生成、AI 音乐生成、AI 编程助手、AI 聊天机器人等分类。",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteUrl}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <Suspense fallback={<ToolListFallback />}>
        <ToolListServer />
      </Suspense>
    </>
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
