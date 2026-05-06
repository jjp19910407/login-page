"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UploadIcon, LinkIcon } from "lucide-react"

interface Category {
  id: number
  name: string
  slug: string
}

interface Region {
  id: number
  name: string
  categories: Category[]
}

export function AddToolForm({ regions }: { regions: Region[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [logoPreview, setLogoPreview] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({
    name: "",
    url: "",
    description: "",
    logoUrl: "",
    pricingInfo: "",
    categoryId: "",
    tags: "",
    isFeatured: false,
    sortOrder: 0,
  })

  function set(key: string, value: string | boolean | number) {
    setForm((f) => ({ ...f, [key]: value }))
    if (key === "logoUrl") setLogoPreview(value as string)
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]
    if (!ALLOWED.includes(file.type)) { toast.error("仅支持 JPG/PNG/WebP/GIF/SVG"); return }
    if (file.size > 50 * 1024) { toast.error("文件不能超过 50KB"); return }
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result as string
      setForm((f) => ({ ...f, logoUrl: base64 }))
      setLogoPreview(base64)
    }
    reader.readAsDataURL(file)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.url || !form.categoryId) {
      toast.error("名称、网址、分类为必填项")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/admin/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || "添加失败")
        return
      }
      toast.success("添加成功")
      router.push("/admin")
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
      <div>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">
          工具名称 <span className="text-red-500">*</span>
        </label>
        <Input
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="如：ChatGPT"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">
          网址 <span className="text-red-500">*</span>
        </label>
        <Input
          value={form.url}
          onChange={(e) => set("url", e.target.value)}
          placeholder="https://..."
          type="url"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">
          分类 <span className="text-red-500">*</span>
        </label>
        <select
          value={form.categoryId}
          onChange={(e) => set("categoryId", e.target.value)}
          className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="">请选择分类</option>
          {regions.map((r) => (
            <optgroup key={r.id} label={r.name}>
              {r.categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">
          简介
        </label>
        <Input
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="一句话介绍这个工具"
        />
      </div>

      {/* Logo 字段：CDN URL + 本地上传 */}
      <div>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">
          Logo
        </label>
        <div className="flex gap-2 items-start">
          {/* 预览 */}
          <div className="shrink-0 w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden">
            {logoPreview ? (
              <img src={logoPreview} alt="logo preview" className="w-full h-full object-cover" onError={() => setLogoPreview("")} />
            ) : (
              <span className="text-slate-400 text-xs">预览</span>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <Input
                  value={form.logoUrl}
                  onChange={(e) => set("logoUrl", e.target.value)}
                  placeholder="CDN 地址 https://..."
                  className="pl-8"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="shrink-0 gap-1.5"
              >
                <UploadIcon className="w-3.5 h-3.5" />
                本地上传
              </Button>
            </div>
            <p className="text-xs text-slate-400">支持 JPG/PNG/WebP/GIF/SVG，最大 50KB</p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>

      {/* 资费情况 */}
      <div>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">
          资费情况
        </label>
        <Input
          value={form.pricingInfo}
          onChange={(e) => set("pricingInfo", e.target.value)}
          placeholder="如：免费 / 免费+付费 / $20/月 / 按量计费"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">
          标签（逗号分隔）
        </label>
        <Input
          value={form.tags}
          onChange={(e) => set("tags", e.target.value)}
          placeholder="免费, API, 中文"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="featured"
          checked={form.isFeatured}
          onChange={(e) => set("isFeatured", e.target.checked)}
          className="rounded"
        />
        <label htmlFor="featured" className="text-sm text-slate-700 dark:text-slate-300">
          设为推荐
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? "添加中..." : "添加工具"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          取消
        </Button>
      </div>
    </form>
  )
}
