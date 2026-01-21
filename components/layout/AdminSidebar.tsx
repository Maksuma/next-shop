"use client"

import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { LogOut, Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "../ui/button"
import { sidebarItems } from "./admin-sidebar.data"

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/")
        },
      },
    })
  }

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className='lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md'
      >
        {isMobileOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
      </button>

      {isMobileOpen && (
        <div className='lg:hidden fixed inset-0 bg-black/50 z-40' onClick={() => setIsMobileOpen(false)} />
      )}
      <aside
        className={cn(
          "w-64 h-screen bg-white border-r flex flex-col transition-transform duration-300 z-40",
          "fixed inset-y-0 left-0",
          "lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "max-lg:-translate-x-full",
        )}
      >
        <div className='p-6 border-b shrink-0'>
          <h2 className='text-xl font-bold text-gray-800'>Панель управления</h2>
        </div>

        <nav className='flex-1 p-4 space-y-1 overflow-y-auto'>
          {sidebarItems.map(item => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  "hover:bg-gray-100 group",
                  isActive ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700",
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 transition-colors",
                    isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600",
                  )}
                />
                <span>{item.title}</span>
              </Link>
            )
          })}
        </nav>

        <div className='p-4 border-t shrink-0'>
          <Button
            variant='ghost'
            onClick={handleLogout}
            className='w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50'
          >
            <LogOut className='w-5 h-5' />
            <span>Выйти</span>
          </Button>
        </div>
      </aside>
    </>
  )
}
