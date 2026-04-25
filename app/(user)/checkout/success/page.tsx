"use client"

import { Button } from "@/components/ui/button"
import { PagesConfig } from "@/config/pages.config"
import { QueriesConfig } from "@/config/queries.config"
import { useCart } from "@/hooks/useFetch"
import { CheckCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useRef, useState } from "react"

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const { mutate: mutateCart } = useCart()

  const [status, setStatus] = useState<"loading" | "done" | "error">("loading")
  const called = useRef(false)

  useEffect(() => {
    if (!sessionId || called.current) return
    called.current = true

    fetch(QueriesConfig.CHECKOUT_VERIFY_SESSION(sessionId), { credentials: "include" })
      .then(res => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then(() => {
        mutateCart()
        setStatus("done")
      })
      .catch(() => setStatus("error"))
  }, [sessionId, mutateCart])

  if (status === "loading") {
    return (
      <div className='flex flex-col items-center gap-4 text-center py-24'>
        <Loader2 className='w-10 h-10 animate-spin text-muted-foreground' />
        <p className='text-muted-foreground'>Подтверждаем оплату...</p>
      </div>
    )
  }

  return (
    <div className='flex flex-col items-center gap-6 text-center py-24 max-w-md mx-auto'>
      <div className='w-20 h-20 rounded-full bg-green-100 flex items-center justify-center'>
        <CheckCircle className='w-10 h-10 text-green-600' />
      </div>

      <div className='space-y-2'>
        <h1 className='text-2xl font-bold'>{status === "done" ? "Оплата прошла успешно!" : "Заказ оформлен"}</h1>
        <p className='text-muted-foreground'>Ваш заказ принят и будет обработан в ближайшее время.</p>
      </div>

      <div className='flex gap-3 mt-2'>
        <Button asChild variant='outline'>
          <Link href={PagesConfig.HOME}>Продолжить покупки</Link>
        </Button>
        <Button asChild>
          <Link href={PagesConfig.ORDERS}>Мои заказы</Link>
        </Button>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className='flex flex-col items-center gap-4 text-center py-24'>
          <Loader2 className='w-10 h-10 animate-spin text-muted-foreground' />
          <p className='text-muted-foreground'>Подтверждаем оплату...</p>
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  )
}
