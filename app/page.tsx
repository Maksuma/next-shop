"use client"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function Home() {
  const { data: session, isPending: loading } = authClient.useSession()
  const [hasAdminPermissions, setHasAdminPermissions] = useState(false)

  useEffect(() => {
    authClient.admin.hasPermission({ permission: { user: ["set-role"] } }).then(({ data }) => {
      setHasAdminPermissions(data?.success ?? false)
    })
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }
  if (!session?.user) {
    return (
      <div className='container mx-auto p-4'>
        <h1 className='text-4xl font-bold mb-4'>Welcome to Next Admin</h1>
        <p>Please log in to access the dashboard.</p>
        <Button asChild>
          <Link href='/auth/login'>Login</Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <h1 className='text-4xl font-bold mb-4'>Welcome to Next Admin {session.user.name}</h1>
      <Button onClick={() => authClient.signOut()} variant='destructive'>
        Logout
      </Button>
      {hasAdminPermissions && (
        <Button asChild>
          <Link href='/dashboard'>Dashboard</Link>
        </Button>
      )}
    </div>
  )
}
