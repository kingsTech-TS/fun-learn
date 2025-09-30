"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BookOpen, Library, Upload, User, Home } from "lucide-react"

export function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/upload", label: "Upload", icon: Upload },
    { href: "/library", label: "Library", icon: Library },
    { href: "/profile", label: "Profile", icon: User },
  ]

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-2 group transition-transform duration-200 hover:scale-105"
          >
            <BookOpen className="h-8 w-8 text-primary transition-colors duration-200 group-hover:text-purple-400" />
            <span className="text-xl font-bold text-foreground">Fun-Learn</span>
          </Link>

          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Button
                  key={item.href}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  asChild
                  className={`transition-all duration-200 hover:scale-105 ${
                    isActive ? "bg-purple-600 hover:bg-purple-700 shadow-lg" : "hover:bg-slate-700/50"
                  }`}
                >
                  <Link href={item.href} className="flex items-center space-x-2">
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Link>
                </Button>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
