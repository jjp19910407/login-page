"use client"

import Link from "next/link"
import { useState } from "react"
import { MenuIcon } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Sidebar } from "./Sidebar"

interface Region {
  id: number
  name: string
  slug: string
  categories: { id: number; name: string; slug: string; type: string }[]
}

interface NavbarProps {
  regions: Region[]
  userSlot?: React.ReactNode
}

export function Navbar({ regions, userSlot }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-3">
        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger className="md:hidden shrink-0 inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <MenuIcon className="w-5 h-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-64 pt-8">
            <Sidebar regions={regions} className="w-full block" />
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/" className="shrink-0 flex items-center gap-2 font-bold text-slate-900 dark:text-white">
          <span className="text-xl">🤖</span>
          <span className="hidden sm:block">AI 导航</span>
        </Link>

        {/* User area */}
        <div className="ml-auto shrink-0 flex items-center gap-1">
          {userSlot}
        </div>
      </div>
    </header>
  )
}

