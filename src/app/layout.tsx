import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-nav.example.com"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AI 导航 — 发现最好的 AI 工具",
    template: "%s | AI 导航",
  },
  description:
    "AI 导航汇聚国内外最优质的 AI 工具，涵盖 AI 图片生成、AI 音乐生成、AI 编程助手、AI 聊天机器人等分类，帮你快速找到最适合的人工智能工具。",
  keywords: [
    "AI工具",
    "AI导航",
    "人工智能工具",
    "AI工具导航",
    "AI工具大全",
    "AI图片生成",
    "AI绘画",
    "Midjourney",
    "Stable Diffusion",
    "DALL-E",
    "AI音乐生成",
    "Suno AI",
    "AI编程",
    "GitHub Copilot",
    "Cursor",
    "AI聊天",
    "ChatGPT",
    "Claude",
    "Gemini",
    "国内AI工具",
    "国外AI工具",
    "免费AI工具",
    "AI效率工具",
    "AIGC",
    "生成式AI",
  ],
  authors: [{ name: "AI 导航" }],
  creator: "AI 导航",
  publisher: "AI 导航",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: siteUrl,
    siteName: "AI 导航",
    title: "AI 导航 — 发现最好的 AI 工具",
    description:
      "AI 导航汇聚国内外最优质的 AI 工具，涵盖 AI 图片生成、AI 音乐生成、AI 编程助手、AI 聊天机器人等分类，帮你快速找到最适合的人工智能工具。",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI 导航 — 发现最好的 AI 工具",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI 导航 — 发现最好的 AI 工具",
    description:
      "汇聚国内外最优质的 AI 工具，涵盖图片生成、音乐生成、AI 编程、聊天机器人等分类。",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: siteUrl,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  )
}
