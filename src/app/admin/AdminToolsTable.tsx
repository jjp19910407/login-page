"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Trash2Icon, PencilIcon, ExternalLinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Tool {
  id: number
  name: string
  url: string
  logoUrl?: string | null
  isActive?: boolean | null
  isFeatured?: boolean | null
  viewCount?: number | null
  categoryName: string
  regionName: string
}

export function AdminToolsTable({ tools }: { tools: Tool[] }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState<number | null>(null)

  async function deleteTool(id: number, name: string) {
    if (!confirm(`确认删除「${name}」？`)) return
    setDeleting(id)
    try {
      const res = await fetch("/api/admin/tools", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      if (res.ok) {
        toast.success("已删除")
        router.refresh()
      } else {
        toast.error("删除失败")
      }
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <th className="text-left px-4 py-3 font-medium text-slate-600 dark:text-slate-400">工具</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600 dark:text-slate-400">分类</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600 dark:text-slate-400">状态</th>
              <th className="text-right px-4 py-3 font-medium text-slate-600 dark:text-slate-400">点击量</th>
              <th className="text-right px-4 py-3 font-medium text-slate-600 dark:text-slate-400">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {tools.map((tool) => (
              <tr key={tool.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                      {tool.logoUrl ? (
                        <img src={tool.logoUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs font-bold text-slate-400">
                          {tool.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">{tool.name}</div>
                      <div className="text-xs text-slate-400 truncate max-w-48">{tool.url}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                  <span className="text-xs">{tool.regionName} / {tool.categoryName}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    {tool.isActive ? (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">上线</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">下线</Badge>
                    )}
                    {tool.isFeatured && (
                      <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700">推荐</Badge>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">
                  {tool.viewCount ?? 0}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center h-7 w-7 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                    >
                      <ExternalLinkIcon className="w-3.5 h-3.5" />
                    </a>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                      onClick={() => router.push(`/admin/tools/${tool.id}`)}
                    >
                      <PencilIcon className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => deleteTool(tool.id, tool.name)}
                      disabled={deleting === tool.id}
                    >
                      <Trash2Icon className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {tools.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <p>暂无工具，点击右上角新增</p>
          </div>
        )}
      </div>
    </div>
  )
}
