import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" })

export const metadata: Metadata = {
  title: "AI 导航 — 发现最好的 AI 工具",
  description: "汇聚国内外优质 AI 工具，包括图片生成、音乐生成、AI编程、Chat聊天等分类",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  )
}
