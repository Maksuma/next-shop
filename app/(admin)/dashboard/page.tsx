import { Button } from "@/components/ui/button"
import { PagesConfig } from "@/config/pages.config"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div>
      <h1 className='text-3xl font-bold mb-6'>Панель управления</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6'>
        <div className='bg-white rounded-lg shadow p-6'>
          <h3 className='text-lg font-semibold mb-2'>Товары</h3>
          <p className='text-3xl font-bold text-blue-600 mb-4'>0</p>
          <Button asChild variant='outline' className='w-full'>
            <Link href={PagesConfig.DASHBOARD_PRODUCTS}>Управление</Link>
          </Button>
        </div>

        <div className='bg-white rounded-lg shadow p-6'>
          <h3 className='text-lg font-semibold mb-2'>Заказы</h3>
          <p className='text-3xl font-bold text-green-600 mb-4'>0</p>
          <Button asChild variant='outline' className='w-full'>
            <Link href={PagesConfig.DASHBOARD_ORDERS}>Управление</Link>
          </Button>
        </div>

        <div className='bg-white rounded-lg shadow p-6'>
          <h3 className='text-lg font-semibold mb-2'>Пользователи</h3>
          <p className='text-3xl font-bold text-purple-600 mb-4'>0</p>
          <Button asChild variant='outline' className='w-full'>
            <Link href={PagesConfig.DASHBOARD_USERS}>Управление</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
