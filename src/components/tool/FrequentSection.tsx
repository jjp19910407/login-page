"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { PlusIcon, XIcon } from "lucide-react"
import { toast } from "sonner"

export const FREQUENT_REFRESH_EVENT = "frequent-refresh"

interface FrequentItem {
  id: number
  name: string
  slug: string
  url: string
  logoUrl?: string | null
  useCount?: number | null
  categoryName?: string
  description?: string | null
}

interface FrequentSectionProps {
  initialItems: FrequentItem[]
  isLoggedIn: boolean
  isAdmin: boolean
}

export function FrequentSection({ initialItems, isLoggedIn, isAdmin }: FrequentSectionProps) {
  const router = useRouter()
  const [items, setItems] = useState(initialItems)
  const [showPicker, setShowPicker] = useState(false)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState<number | null>(null)
  const [allTools, setAllTools] = useState<FrequentItem[]>([])
  const [toolsLoading, setToolsLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!isLoggedIn) return
    try {
      const res = await fetch("/api/user/frequent")
      if (res.ok) setItems(await res.json())
    } catch {}
  }, [isLoggedIn])

  useEffect(() => {
    window.addEventListener(FREQUENT_REFRESH_EVENT, refresh)
    return () => window.removeEventListener(FREQUENT_REFRESH_EVENT, refresh)
  }, [refresh])

  useEffect(() => {
    if (!showPicker || allTools.length > 0) return
    setToolsLoading(true)
    fetch("/api/tools")
      .then((r) => r.json())
      .then((data) => setAllTools(data))
      .catch(() => {})
      .finally(() => setToolsLoading(false))
  }, [showPicker, allTools.length])

  const frequentIds = new Set(items.map((i) => i.id))
  const filtered = allTools.filter(
    (t) =>
      !frequentIds.has(t.id) &&
      (search === "" || t.name.toLowerCase().includes(search.toLowerCase()))
  )

  async function addTool(tool: FrequentItem) {
    setLoading(tool.id)
    try {
      const res = await fetch("/api/user/frequent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolId: tool.id }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || "添加失败"); return }
      if (!data.added) { toast.info("已在常用列表"); return }
      await refresh()
      toast.success(`已添加 ${tool.name}`)
      setShowPicker(false)
      setSearch("")
    } finally {
      setLoading(null)
    }
  }

  async function removeTool(toolId: number) {
    await fetch("/api/user/frequent", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toolId }),
    })
    setItems((prev) => prev.filter((i) => i.id !== toolId))
    toast.success("已移除")
  }

  function handleAddClick() {
    if (!isLoggedIn) {
      toast.error("请先登录")
      router.push("/login")
      return
    }
    setShowPicker(true)
  }

  function openTool(tool: FrequentItem) {
    fetch(`/api/tools/${tool.id}/click`, { method: "POST" }).catch(() => {})
    window.open(tool.url, "_blank", "noopener,noreferrer")
  }

  // 未登录时不显示区块
  if (!isLoggedIn && items.length === 0) {
    return (
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">常用网址</h2>
          <button
            onClick={handleAddClick}
            className="flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            添加
          </button>
        </div>
        <div className="text-sm text-slate-400 py-4">
          <a href="/login" className="text-blue-500 hover:underline">登录</a> 后可添加常用网址
        </div>
      </section>
    )
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">常用网址</h2>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600 transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          添加
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-sm text-slate-400 py-4">
          还没有常用网址，点击 + 添加
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm transition-all cursor-pointer"
              onClick={() => openTool(item)}
            >
              <div className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                {item.logoUrl ? (
                  <img src={item.logoUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-bold text-slate-400">
                    {item.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {item.name}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); removeTool(item.id) }}
                className="ml-1 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all"
              >
                <XIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 工具选择弹窗 */}
      {showPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowPicker(false)}>
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900 dark:text-white">添加常用网址</h3>
              <button onClick={() => setShowPicker(false)} className="text-slate-400 hover:text-slate-600">
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <input
              type="text"
              placeholder="搜索工具名称..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white mb-3 outline-none focus:border-blue-400"
              autoFocus
            />
            <div className="max-h-72 overflow-y-auto space-y-1">
              {toolsLoading ? (
                <p className="text-sm text-slate-400 text-center py-6">加载中...</p>
              ) : filtered.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-6">没有更多工具了</p>
              ) : (
                filtered.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => addTool(tool)}
                    disabled={loading === tool.id}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                      {tool.logoUrl ? (
                        <img src={tool.logoUrl} alt={tool.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-sm font-bold text-slate-400">
                          {tool.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{tool.name}</p>
                      {tool.categoryName && (
                        <p className="text-xs text-slate-400 truncate">{tool.categoryName}</p>
                      )}
                    </div>
                    <PlusIcon className="w-4 h-4 text-slate-400 shrink-0" />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
