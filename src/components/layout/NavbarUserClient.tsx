"use client"

import Link from "next/link"
import { toast } from "sonner"
import { UserIcon, LogOutIcon, ShieldIcon, BookmarkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface User {
  id: number
  phone: string
  role?: string | null
  nickname?: string | null
  avatarUrl?: string | null
}

export function NavbarUserClient({ user }: { user: User | null }) {
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" })
    toast.success("已退出登录")
    window.location.href = "/"
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/register"
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          注册
        </Link>
        <Link
          href="/login"
          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          <UserIcon className="w-4 h-4" />登录
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center gap-2 px-1">
        <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center overflow-hidden shrink-0">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs font-bold text-blue-600 dark:text-blue-300">
              {user.phone.slice(-4)}
            </span>
          )}
        </div>
        <span className="text-sm text-slate-600 dark:text-slate-300 hidden sm:block">
          {user.nickname || user.phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")}
        </span>
      </div>
      {user.role === "admin" && (
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
        >
          <ShieldIcon className="w-4 h-4" />管理
        </Link>
      )}
      <Link
        href="/profile/favorites"
        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
      >
        <BookmarkIcon className="w-4 h-4" />收藏
      </Link>
      <Button variant="ghost" size="icon" onClick={logout} title="退出">
        <LogOutIcon className="w-4 h-4" />
      </Button>
    </>
  )
}
