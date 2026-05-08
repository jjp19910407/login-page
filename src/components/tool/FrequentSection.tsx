"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { PlusIcon, XIcon, LinkIcon } from "lucide-react"
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

interface CustomLink {
  id: number
  name: string
  url: string
}

interface FrequentSectionProps {
  initialItems: FrequentItem[]
  initialCustomLinks: CustomLink[]
  isLoggedIn: boolean
  isAdmin: boolean
}

// 颜色池，根据名称首字母映射固定颜色
const COLORS = [
  "bg-blue-500", "bg-purple-500", "bg-green-500", "bg-orange-500",
  "bg-pink-500", "bg-teal-500", "bg-red-500", "bg-indigo-500",
]
function nameColor(name: string) {
  const code = name.charCodeAt(0) || 0
  return COLORS[code % COLORS.length]
}

export function FrequentSection({ initialItems, initialCustomLinks, isLoggedIn, isAdmin }: FrequentSectionProps) {
  const router = useRouter()
  const [items, setItems] = useState(initialItems)
  const [customLinks, setCustomLinks] = useState(initialCustomLinks)
  const [showPicker, setShowPicker] = useState(false)
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState<number | null>(null)
  const [allTools, setAllTools] = useState<FrequentItem[]>([])
  const [toolsLoading, setToolsLoading] = useState(false)
  const [customForm, setCustomForm] = useState({ name: "", url: "" })
  const [customSaving, setCustomSaving] = useState(false)

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

  async function addCustomLink() {
    if (!customForm.name.trim() || !customForm.url.trim()) {
      toast.error("名称和网址不能为空")
      return
    }
    setCustomSaving(true)
    try {
      const res = await fetch("/api/user/custom-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customForm),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || "添加失败"); return }
      setCustomLinks((prev) => [...prev, data])
      setCustomForm({ name: "", url: "" })
      setShowCustomForm(false)
      toast.success("已添加")
    } finally {
      setCustomSaving(false)
    }
  }

  async function removeCustomLink(id: number) {
    await fetch("/api/user/custom-links", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    setCustomLinks((prev) => prev.filter((l) => l.id !== id))
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

  function openCustomLink(url: string) {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const hasContent = items.length > 0 || customLinks.length > 0

  return (
    <section>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">常用网址</h2>
        <div className="flex items-center gap-2">
          {isLoggedIn && (
            <button
              onClick={() => setShowCustomForm(true)}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 transition-colors"
              title="添加自定义链接"
            >
              <LinkIcon className="w-3.5 h-3.5" />
              自定义
            </button>
          )}
          <button
            onClick={handleAddClick}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 transition-colors"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            添加
          </button>
        </div>
      </div>

      {!isLoggedIn && !hasContent ? (
        <div className="text-xs text-slate-400 py-2">
          <a href="/login" className="text-blue-500 hover:underline">登录</a> 后可添加常用网址
        </div>
      ) : !hasContent ? (
        <div className="text-xs text-slate-400 py-2">还没有常用网址，点击右上角添加</div>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {/* 常用工具 */}
          {items.map((item) => (
            <div
              key={`tool-${item.id}`}
              className="group relative flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm transition-all cursor-pointer"
              onClick={() => openTool(item)}
            >
              <div className="w-5 h-5 rounded flex items-center justify-center overflow-hidden shrink-0">
                {item.logoUrl ? (
                  <img src={item.logoUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <span className={`w-full h-full flex items-center justify-center text-white text-xs font-bold rounded ${nameColor(item.name)}`}>
                    {item.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
                {item.name}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); removeTool(item.id) }}
                className="ml-0.5 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all"
              >
                <XIcon className="w-3 h-3" />
              </button>
            </div>
          ))}

          {/* 自定义链接 */}
          {customLinks.map((link) => (
            <div
              key={`custom-${link.id}`}
              className="group relative flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-sm transition-all cursor-pointer"
              onClick={() => openCustomLink(link.url)}
            >
              <span className={`w-5 h-5 flex items-center justify-center text-white text-xs font-bold rounded shrink-0 ${nameColor(link.name)}`}>
                {link.name.charAt(0).toUpperCase()}
              </span>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
                {link.name}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); removeCustomLink(link.id) }}
                className="ml-0.5 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all"
              >
                <XIcon className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 从工具库选择弹窗 */}
      {showPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowPicker(false)}>
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900 dark:text-white">从工具库添加</h3>
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
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                  >
                    <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                      {tool.logoUrl ? (
                        <img src={tool.logoUrl} alt={tool.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className={`w-full h-full flex items-center justify-center text-white text-xs font-bold ${nameColor(tool.name)}`}>
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

      {/* 自定义链接添加弹窗 */}
      {showCustomForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowCustomForm(false)}>
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900 dark:text-white">添加自定义链接</h3>
              <button onClick={() => setShowCustomForm(false)} className="text-slate-400 hover:text-slate-600">
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">名称</label>
                <input
                  type="text"
                  placeholder="如：我的博客"
                  value={customForm.name}
                  onChange={(e) => setCustomForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-400"
                  autoFocus
                  maxLength={50}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">网址</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={customForm.url}
                  onChange={(e) => setCustomForm((f) => ({ ...f, url: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-400"
                  onKeyDown={(e) => e.key === "Enter" && addCustomLink()}
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={addCustomLink}
                  disabled={customSaving}
                  className="flex-1 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {customSaving ? "添加中..." : "添加"}
                </button>
                <button
                  onClick={() => setShowCustomForm(false)}
                  className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
