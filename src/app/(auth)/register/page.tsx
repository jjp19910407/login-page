"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export default function RegisterPage() {
  const router = useRouter()
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleRegister() {
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      toast.error("请输入正确的手机号")
      return
    }
    if (password.length < 6) {
      toast.error("密码至少6位")
      return
    }
    if (password !== confirm) {
      toast.error("两次密码不一致")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || "注册失败")
        return
      }
      toast.success("注册成功")
      window.location.href = "/"
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="w-full max-w-sm mx-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🤖</div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">注册账号</h1>
            <p className="text-slate-500 text-sm mt-1">绑定手机号并设置密码</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">
                手机号
              </label>
              <Input
                type="tel"
                placeholder="请输入手机号"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={11}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">
                密码
              </label>
              <Input
                type="password"
                placeholder="至少6位"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">
                确认密码
              </label>
              <Input
                type="password"
                placeholder="再次输入密码"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleRegister()}
              />
            </div>

            <Button className="w-full" onClick={handleRegister} disabled={loading}>
              {loading ? "注册中..." : "注册"}
            </Button>
          </div>

          <p className="text-center text-sm text-slate-500 mt-6">
            已有账号？{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              去登录
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
