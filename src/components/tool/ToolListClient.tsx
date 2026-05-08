"use client"

import { useState } from "react"
import { SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ToolCard } from "./ToolCard"

interface Tool {
  id: number
  name: string
  slug: string
  description?: string | null
  url: string
  logoUrl?: string | null
  pricingInfo?: string | null
  tags?: string[] | null
  isFeatured?: boolean | null
  categoryName?: string
  regionName?: string
}

interface ToolListClientProps {
  allTools: Tool[]
  favoritedIds: number[]
  isLoggedIn: boolean
}

export function ToolListClient({ allTools, favoritedIds, isLoggedIn }: ToolListClientProps) {
  const [query, setQuery] = useState("")
  const favSet = new Set(favoritedIds)

  const filtered = query.trim()
    ? allTools.filter((t) => {
        const q = query.toLowerCase()
        return (
          t.name.toLowerCase().includes(q) ||
          (t.description?.toLowerCase().includes(q) ?? false) ||
          (t.tags?.some((tag) => tag.toLowerCase().includes(q)) ?? false)
        )
      })
    : allTools

  const featured = filtered.filter((t) => t.isFeatured)
  const rest = filtered.filter((t) => !t.isFeatured)

  return (
    <div className="space-y-4">
      {/* 搜索框 */}
      <div className="relative max-w-md">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索工具名称、描述、标签..."
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <div className="text-3xl mb-2">😕</div>
          <p>没有找到相关工具</p>
        </div>
      ) : (
        <>
          {featured.length > 0 && !query.trim() && (
            <section>
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                ⭐ 精选推荐
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {featured.map((tool) => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    isFavorited={favSet.has(tool.id)}
                    isLoggedIn={isLoggedIn}
                  />
                ))}
              </div>
            </section>
          )}

          <section>
            {!query.trim() && (
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                🔥 全部工具
              </h2>
            )}
            {query.trim() && (
              <p className="text-xs text-slate-500 mb-2">找到 {filtered.length} 个结果</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {(query.trim() ? filtered : rest).map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  isFavorited={favSet.has(tool.id)}
                  isLoggedIn={isLoggedIn}
                />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
