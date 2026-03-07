"use client"

import { Button } from "@/components/ui/button"
import { PagesConfig } from "@/config/pages.config"
import { XCircle } from "lucide-react"
import Link from "next/link"

export default function CheckoutCancelPage() {
  return (
    <div className='flex flex-col items-center gap-6 text-center py-24 max-w-md mx-auto'>
      <div className='w-20 h-20 rounded-full bg-red-100 flex items-center justify-center'>
        <XCircle className='w-10 h-10 text-red-500' />
      </div>

      <div className='space-y-2'>
        <h1 className='text-2xl font-bold'>Оплата отменена</h1>
        <p className='text-muted-foreground'>
          Вы отменили оплату. Ваша корзина сохранена — вы можете вернуться к ней в любой момент.
        </p>
      </div>

      <div className='flex gap-3 mt-2'>
        <Button asChild variant='outline'>
          <Link href={PagesConfig.HOME}>На главную</Link>
        </Button>
        <Button asChild>
          <Link href={PagesConfig.CART}>Вернуться в корзину</Link>
        </Button>
      </div>
    </div>
  )
}
