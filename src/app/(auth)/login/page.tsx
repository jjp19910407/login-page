"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

type LoginMode = "password" | "sms"

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<LoginMode>("password")

  // 密码登录
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")

  // 短信登录
  const [smsPhone, setSmsPhone] = useState("")
  const [code, setCode] = useState("")
  const [smsStep, setSmsStep] = useState<"phone" | "code">("phone")
  const [countdown, setCountdown] = useState(0)

  const [loading, setLoading] = useState(false)

  async function loginWithPassword() {
    if (!phone || !password) {
      toast.error("请输入手机号和密码")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/auth/login-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || "登录失败")
        return
      }
      toast.success("登录成功")
      router.push("/")
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  async function sendCode() {
    if (!/^1[3-9]\d{9}$/.test(smsPhone)) {
      toast.error("请输入正确的手机号")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: smsPhone }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || "发送失败")
        return
      }
      setSmsStep("code")
      toast.success("验证码已发送")
      if (data.code) toast.info(`[开发模式] 验证码: ${data.code}`)
      setCountdown(60)
      const timer = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) { clearInterval(timer); return 0 }
          return c - 1
        })
      }, 1000)
    } finally {
      setLoading(false)
    }
  }

  async function loginWithSms() {
    if (!code || code.length !== 6) {
      toast.error("请输入6位验证码")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: smsPhone, code }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || "验证失败")
        return
      }
      toast.success("登录成功")
      router.push("/")
      router.refresh()
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
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">AI 导航</h1>
            <p className="text-slate-500 text-sm mt-1">发现最好的 AI 工具</p>
          </div>

          {/* 切换 tab */}
          <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800 p-1 mb-6">
            <button
              className={`flex-1 text-sm py-1.5 rounded-md transition-colors ${
                mode === "password"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-medium"
                  : "text-slate-500"
              }`}
              onClick={() => setMode("password")}
            >
              密码登录
            </button>
            <button
              className={`flex-1 text-sm py-1.5 rounded-md transition-colors ${
                mode === "sms"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-medium"
                  : "text-slate-500"
              }`}
              onClick={() => setMode("sms")}
            >
              验证码登录
            </button>
          </div>

          {mode === "password" ? (
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
                  placeholder="请输入密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && loginWithPassword()}
                />
              </div>
              <Button className="w-full" onClick={loginWithPassword} disabled={loading}>
                {loading ? "登录中..." : "登录"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">
                  手机号
                </label>
                <Input
                  type="tel"
                  placeholder="请输入手机号"
                  value={smsPhone}
                  onChange={(e) => setSmsPhone(e.target.value)}
                  disabled={smsStep === "code"}
                  maxLength={11}
                />
              </div>
              {smsStep === "code" && (
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">
                    验证码
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="6位验证码"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                      maxLength={6}
                      onKeyDown={(e) => e.key === "Enter" && loginWithSms()}
                    />
                    <Button
                      variant="outline"
                      onClick={sendCode}
                      disabled={countdown > 0 || loading}
                      className="shrink-0 w-28"
                    >
                      {countdown > 0 ? `${countdown}s` : "重新发送"}
                    </Button>
                  </div>
                </div>
              )}
              {smsStep === "phone" ? (
                <Button className="w-full" onClick={sendCode} disabled={loading}>
                  {loading ? "发送中..." : "获取验证码"}
                </Button>
              ) : (
                <Button className="w-full" onClick={loginWithSms} disabled={loading}>
                  {loading ? "验证中..." : "登录"}
                </Button>
              )}
            </div>
          )}

          <div className="flex justify-center gap-4 mt-6 text-sm text-slate-500">
            <Link href="/register" className="hover:text-blue-600">
              注册账号
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
