"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDownIcon } from "lucide-react"
import { useState } from "react"

interface Category {
  id: number
  name: string
  slug: string
  type: string
}

interface Region {
  id: number
  name: string
  slug: string
  categories: Category[]
}

const categoryIcons: Record<string, string> = {
  image_generation: "🎨",
  music_generation: "🎵",
  ai_coding: "💻",
  chat: "💬",
  relay_station: "🔄",
  ai_tools: "🛠️",
  other: "📦",
}

export function Sidebar({ regions, className, onNavigate }: { regions: Region[]; className?: string; onNavigate?: () => void }) {
  const pathname = usePathname()
  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    Object.fromEntries(regions.map((r) => [r.slug, true]))
  )

  return (
    <nav className={className ?? "w-56 shrink-0 hidden md:block"}>
      <div className="sticky top-4 space-y-1">
        <Link
          href="/"
          onClick={onNavigate}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            pathname === "/"
              ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
              : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          }`}
        >
          🏠 全部工具
        </Link>

        {regions.map((region) => (
          <div key={region.id}>
            <button
              onClick={() => setExpanded((e) => ({ ...e, [region.slug]: !e[region.slug] }))}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider hover:text-slate-600 dark:hover:text-slate-300"
            >
              {region.name}
              <ChevronDownIcon
                className={`w-3.5 h-3.5 transition-transform ${expanded[region.slug] ? "" : "-rotate-90"}`}
              />
            </button>

            {expanded[region.slug] && (
              <div className="space-y-0.5">
                {region.categories.map((cat) => {
                  const href = `/${region.slug}/${cat.slug}`
                  const active = pathname === href
                  return (
                    <Link
                      key={cat.id}
                      href={href}
                      onClick={onNavigate}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        active
                          ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                          : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                      }`}
                    >
                      <span>{categoryIcons[cat.type] || "📦"}</span>
                      {cat.name}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  )
}
