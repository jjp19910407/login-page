import type { Metadata } from "next"
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: "登录 - AI 导航",
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  )
}
