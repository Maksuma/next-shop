import { Button } from "@/components/ui/button"
import { PagesConfig } from "@/config/pages.config"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div>
      <div className='p-4'>Dashboard Admin Page</div>
      <Button asChild>
        <Link href={PagesConfig.DASHBOARD_PRODUCTS}>Products</Link>
      </Button>
    </div>
  )
}
