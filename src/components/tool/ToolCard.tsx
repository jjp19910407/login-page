"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { BookmarkIcon, PlusIcon } from "lucide-react"
import { FREQUENT_REFRESH_EVENT } from "./FrequentSection"

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

interface ToolCardProps {
  tool: Tool
  isFavorited?: boolean
  isLoggedIn?: boolean
}

// 根据资费文本决定 badge 颜色
function pricingColor(info: string) {
  const s = info.toLowerCase()
  if (s.includes("免费") && !s.includes("付费")) return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
  if (s.includes("免费")) return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
  return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
}

export function ToolCard({ tool, isFavorited = false, isLoggedIn = false }: ToolCardProps) {
  const router = useRouter()
  const [favorited, setFavorited] = useState(isFavorited)
  const [loading, setLoading] = useState(false)
  const [addingFrequent, setAddingFrequent] = useState(false)

  async function handleClick() {
    fetch(`/api/tools/${tool.id}/click`, { method: "POST" }).catch(() => {})
    window.open(tool.url, "_blank", "noopener,noreferrer")
  }

  async function addToFrequent(e: React.MouseEvent) {
    e.stopPropagation()
    if (!isLoggedIn) {
      toast.error("请先登录")
      router.push("/login")
      return
    }
    setAddingFrequent(true)
    try {
      const res = await fetch("/api/user/frequent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolId: tool.id }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || "添加失败"); return }
      window.dispatchEvent(new Event(FREQUENT_REFRESH_EVENT))
      toast.success(data.added ? `已添加到常用` : "已在常用列表")
    } finally {
      setAddingFrequent(false)
    }
  }

  async function toggleFavorite(e: React.MouseEvent) {
    e.stopPropagation()
    if (!isLoggedIn) {
      toast.error("请先登录")
      router.push("/login")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/user/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolId: tool.id }),
      })
      const data = await res.json()
      setFavorited(data.favorited)
      toast.success(data.favorited ? "已收藏" : "已取消收藏")
    } catch {
      toast.error("操作失败")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      onClick={handleClick}
      className="group relative bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 cursor-pointer hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200"
    >
      <div className="flex items-start gap-4">
        {/* Logo */}
        <div className="shrink-0 w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
          {tool.logoUrl ? (
            <img src={tool.logoUrl} alt={tool.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl font-bold text-slate-400">
              {tool.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="font-semibold text-slate-900 dark:text-white text-base truncate">
              {tool.name}
            </h3>
            {tool.isFeatured && (
              <span className="shrink-0 text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">
                推荐
              </span>
            )}
          </div>

          {/* 资费 badge */}
          {tool.pricingInfo && (
            <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${pricingColor(tool.pricingInfo)}`}>
              {tool.pricingInfo}
            </span>
          )}

          {tool.description && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2">
              {tool.description}
            </p>
          )}
          {tool.tags && tool.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {tool.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* + 常用 button */}
        <button
          onClick={addToFrequent}
          disabled={addingFrequent}
          title="添加到常用"
          className="shrink-0 p-1.5 rounded-lg transition-colors text-slate-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/30 opacity-0 group-hover:opacity-100"
        >
          <PlusIcon className="w-4 h-4" />
        </button>

        {/* Favorite button */}
        <button
          onClick={toggleFavorite}
          disabled={loading}
          className={`shrink-0 p-1.5 rounded-lg transition-colors ${
            favorited
              ? "text-blue-500 bg-blue-50 dark:bg-blue-900/30"
              : "text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 opacity-0 group-hover:opacity-100"
          }`}
        >
          <BookmarkIcon className="w-4 h-4" fill={favorited ? "currentColor" : "none"} />
        </button>
      </div>
    </div>
  )
}
