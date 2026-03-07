"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PagesConfig } from "@/config/pages.config"
import { useOrders } from "@/hooks/useFetch"
import { authClient } from "@/lib/auth-client"
import { priceFormat } from "@/utils/price-firmat"
import { ShoppingBag } from "lucide-react"
import Link from "next/link"

type OrderStatus = "pending" | "paid" | "cancelled"

function StatusBadge({ status }: { status: OrderStatus }) {
  const map: Record<OrderStatus, { label: string; variant: "outline" | "success" | "destructive" }> = {
    pending: { label: "Ожидает оплаты", variant: "outline" },
    paid: { label: "Оплачен", variant: "success" },
    cancelled: { label: "Отменён", variant: "destructive" },
  }
  const { label, variant } = map[status]
  return <Badge variant={variant}>{label}</Badge>
}

function pluralItems(n: number) {
  if (n % 10 === 1 && n % 100 !== 11) return `${n} товар`
  if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return `${n} товара`
  return `${n} товаров`
}

export default function OrdersPage() {
  const { data: session, isPending: sessionLoading } = authClient.useSession()
  const { data: orders, isLoading } = useOrders()

  if (sessionLoading || isLoading) {
    return (
      <div className='max-w-5xl mx-auto mt-10 space-y-4'>
        <Skeleton className='h-8 w-40' />
        <div className='bg-white rounded-lg shadow'>
          <Table>
            <TableHeader>
              <TableRow>
                {["Номер заказа", "Дата", "Статус", "Товары", "Сумма"].map(h => (
                  <TableHead key={h}>{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className='h-4 w-24' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-20' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-6 w-28 rounded-full' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-16' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-20' />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className='flex flex-col items-center gap-4 text-center py-24'>
        <div className='w-20 h-20 rounded-full bg-muted flex items-center justify-center'>
          <ShoppingBag className='w-10 h-10 text-muted-foreground' />
        </div>
        <h1 className='text-2xl font-bold'>Войдите, чтобы просмотреть заказы</h1>
        <p className='text-muted-foreground'>Для просмотра истории заказов необходимо авторизоваться</p>
        <Button asChild size='lg' className='mt-2'>
          <Link href={PagesConfig.LOGIN}>Войти</Link>
        </Button>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className='flex flex-col items-center gap-4 text-center py-24'>
        <div className='w-20 h-20 rounded-full bg-muted flex items-center justify-center'>
          <ShoppingBag className='w-10 h-10 text-muted-foreground' />
        </div>
        <h1 className='text-2xl font-bold'>У вас пока нет заказов</h1>
        <p className='text-muted-foreground'>Оформите первый заказ в нашем магазине</p>
        <Button asChild size='lg' className='mt-2'>
          <Link href={PagesConfig.HOME}>За покупками</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className='max-w-5xl mx-auto mt-10 space-y-4'>
      <h1 className='text-3xl font-bold'>Мои заказы</h1>

      <div className='bg-white rounded-lg shadow'>
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Номер заказа</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Товары</TableHead>
                <TableHead className='text-right'>Сумма</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map(o => (
                <TableRow key={o.id}>
                  <TableCell className='font-mono text-xs text-muted-foreground'>
                    #{o.id.slice(0, 8).toUpperCase()}
                  </TableCell>
                  <TableCell className='text-sm'>
                    {new Date(o.createdAt).toLocaleDateString("ru-RU", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={o.status as OrderStatus} />
                  </TableCell>
                  <TableCell className='text-sm text-muted-foreground'>
                    {pluralItems(o.items.reduce((sum, item) => sum + item.quantity, 0))}
                  </TableCell>
                  <TableCell className='text-right font-semibold text-green-600'>
                    {priceFormat(o.totalAmount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
