"use client"

import { PagesConfig } from "@/config/pages.config"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Fragment } from "react/jsx-runtime"
import { Button } from "../ui/button"
import { headerMenu } from "./header-menu.data"

export function Header() {
  const { data: session } = authClient.useSession()
  const [hasAdminPermissions, setHasAdminPermissions] = useState(false)
  const router = useRouter()

  useEffect(() => {
    authClient.admin.hasPermission({ permission: { user: ["set-role"] } }).then(({ data }) => {
      setHasAdminPermissions(data?.success ?? false)
    })
  }, [])

  return (
    <header className='grid grid-cols-[1fr_3fr_1.5fr] gap-5 items-center mt-3 mx-3'>
      <div className='flex justify-center items-center'>
        <Image src='/next.svg' alt='Kav Shop' width={120} height={60} />
      </div>

      <div className='rounded-xl border-2 items-center flex px-4 py-2'>
        <input type='text' placeholder='Поиск...' value='' className='w-full' onChange={() => {}} />
        <button className='px-2'>
          <Search />
        </button>
      </div>
      <div className='flex gap-5 items-center justify-center'>
        {headerMenu.map(item => (
          <Fragment key={item.title}>
            {session?.user && item.title === "Войти" ? (
              <Link
                key={item.title}
                href={PagesConfig.PROFILE}
                className={cn("flex items-center flex-col transition-opacity hover:opacity-100 opacity-70")}
              >
                <item.icon />
                <span>Профиль</span>
              </Link>
            ) : (
              <Link
                key={item.title}
                href={item.href}
                className={cn("flex items-center flex-col transition-opacity hover:opacity-100 opacity-70")}
              >
                <item.icon />
                <span>{item.title}</span>
              </Link>
            )}
          </Fragment>
        ))}
        {hasAdminPermissions && (
          <Button asChild>
            <Link href={PagesConfig.DASHBOARD}>Dashboard</Link>
          </Button>
        )}
        <Button
          asChild
          onClick={() => {
            authClient.signOut({
              fetchOptions: {
                onSuccess: () => {
                  router.push(PagesConfig.HOME)
                },
              },
            })
          }}
        >
          <span>Logout</span>
        </Button>
      </div>
    </header>
  )
}
