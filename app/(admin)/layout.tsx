import "@/app/globals.css"
import { AdminSidebar } from "@/components/layout/AdminSidebar"
import { Toaster } from "@/components/ui/sonner"
import { auth } from "@/lib/auth"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "Admin Dashboard",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session || session.user.role !== "admin") {
    redirect("/")
  }

  return (
    <html lang='ru'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className='min-h-screen bg-gray-50'>
          <AdminSidebar />
          <main className='ml-0 lg:ml-64 p-6 lg:p-8'>
            <Toaster position='top-right' />
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
