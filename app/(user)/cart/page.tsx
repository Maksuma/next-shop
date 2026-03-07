"use client"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PagesConfig } from "@/config/pages.config"
import { QueriesConfig } from "@/config/queries.config"
import { useCart } from "@/hooks/useFetch"
import { authClient } from "@/lib/auth-client"
import { priceFormat } from "@/utils/price-firmat"
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"

export default function CartPage() {
  const { data: session, isPending: sessionLoading } = authClient.useSession()
  const { items, isLoading, mutate } = useCart()
  const [loadingItem, setLoadingItem] = useState<number | null>(null)
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const total = items.reduce((sum, item) => {
    const price = item.product.discountPrice ?? item.product.price
    return sum + price * item.quantity
  }, 0)
  const discount = subtotal - total
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const handleUpdateQuantity = async (itemId: number, quantity: number) => {
    if (quantity < 1) return
    setLoadingItem(itemId)
    try {
      const res = await fetch(QueriesConfig.CART_UPDATE_ITEM(itemId), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ quantity }),
      })
      if (!res.ok) throw new Error()
      await mutate()
    } catch {
      toast.error("Не удалось обновить количество")
    } finally {
      setLoadingItem(null)
    }
  }

  const handleRemoveItem = async (itemId: number) => {
    setLoadingItem(itemId)
    try {
      const res = await fetch(QueriesConfig.CART_REMOVE_ITEM(itemId), {
        method: "DELETE",
        credentials: "include",
      })
      if (!res.ok) throw new Error()
      await mutate()
      toast.success("Товар удалён из корзины")
    } catch {
      toast.error("Не удалось удалить товар")
    } finally {
      setLoadingItem(null)
    }
  }

  const handleClearCart = async () => {
    try {
      const res = await fetch(QueriesConfig.CART_CLEAR, {
        method: "DELETE",
        credentials: "include",
      })
      if (!res.ok) throw new Error()
      await mutate()
      toast.success("Корзина очищена")
    } catch {
      toast.error("Не удалось очистить корзину")
    }
  }

  const handleCheckout = async () => {
    setIsCheckingOut(true)
    try {
      const res = await fetch(QueriesConfig.CHECKOUT_CREATE_SESSION, {
        method: "POST",
        credentials: "include",
      })
      if (!res.ok) {
        const body = await res.json()
        throw new Error(body.message ?? "Ошибка оформления заказа")
      }
      const { url } = await res.json()
      window.location.href = url
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Не удалось перейти к оплате")
      setIsCheckingOut(false)
    }
  }

  if (sessionLoading || isLoading) {
    return (
      <div className='max-w-7xl mx-auto'>
        <Skeleton className='h-9 w-36 mb-6' />
        <div className='grid lg:grid-cols-[1fr_360px] gap-6 items-start'>
          <div className='bg-white rounded-lg shadow p-6'>
            <div className='flex justify-between items-center mb-4'>
              <Skeleton className='h-5 w-32' />
              <Skeleton className='h-9 w-36 rounded-md' />
            </div>
            <div className='rounded-md border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    {["Изображение", "Товар", "Количество", "Цена", ""].map(h => (
                      <TableHead key={h}>{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className='w-16 h-16 rounded-md' />
                      </TableCell>
                      <TableCell>
                        <Skeleton className='h-4 w-44' />
                      </TableCell>
                      <TableCell>
                        <Skeleton className='h-8 w-24 rounded-md mx-auto' />
                      </TableCell>
                      <TableCell>
                        <Skeleton className='h-4 w-20' />
                      </TableCell>
                      <TableCell>
                        <Skeleton className='h-8 w-8 rounded-md' />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className='bg-white rounded-lg shadow p-6 space-y-4'>
            <Skeleton className='h-6 w-32' />
            <div className='h-px bg-border' />
            {[1, 2, 3].map(i => (
              <div key={i} className='flex justify-between gap-2'>
                <Skeleton className='h-4 w-32' />
                <Skeleton className='h-4 w-20' />
              </div>
            ))}
            <div className='h-px bg-border' />
            <div className='space-y-2'>
              <div className='flex justify-between'>
                <Skeleton className='h-4 w-28' />
                <Skeleton className='h-4 w-20' />
              </div>
              <div className='flex justify-between'>
                <Skeleton className='h-4 w-20' />
                <Skeleton className='h-4 w-16' />
              </div>
            </div>
            <div className='h-px bg-border' />
            <div className='flex justify-between'>
              <Skeleton className='h-6 w-20' />
              <Skeleton className='h-6 w-28' />
            </div>
            <Skeleton className='h-11 w-full rounded-md' />
          </div>
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
        <h1 className='text-2xl font-bold'>Войдите, чтобы открыть корзину</h1>
        <p className='text-muted-foreground'>Для просмотра и управления корзиной необходимо авторизоваться</p>
        <Button asChild size='lg' className='mt-2'>
          <Link href='/auth/login'>Войти</Link>
        </Button>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className='flex flex-col items-center gap-4 text-center py-24'>
        <div className='w-20 h-20 rounded-full bg-muted flex items-center justify-center'>
          <ShoppingBag className='w-10 h-10 text-muted-foreground' />
        </div>
        <h1 className='text-2xl font-bold'>Корзина пуста</h1>
        <p className='text-muted-foreground'>Добавьте товары, чтобы оформить заказ</p>
        <Button asChild size='lg' className='mt-2'>
          <Link href={PagesConfig.HOME}>За покупками</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className='max-w-7xl mx-auto mt-10'>
      <div className='grid lg:grid-cols-[1fr_360px] gap-6 items-start'>
        {/* Таблица товаров */}
        <div className='bg-white rounded-lg shadow p-6'>
          <div className='flex justify-between items-center mb-4'>
            <p className='text-sm text-muted-foreground'>
              {itemCount} {itemCount === 1 ? "товар" : itemCount < 5 ? "товара" : "товаров"}
            </p>
            <Button onClick={handleClearCart} variant='destructive' size='sm'>
              <Trash2 className='w-4 h-4 mr-2' />
              Очистить корзину
            </Button>
          </div>
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[90px]'>Изображение</TableHead>
                  <TableHead>Товар</TableHead>
                  <TableHead className='text-center'>Количество</TableHead>
                  <TableHead>Цена за шт.</TableHead>
                  <TableHead>Сумма</TableHead>
                  <TableHead className='w-[50px]' />
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map(item => {
                  const unitPrice = item.product.discountPrice ?? item.product.price
                  const isUpdating = loadingItem === item.id

                  return (
                    <TableRow key={item.id} className={isUpdating ? "opacity-60 pointer-events-none" : ""}>
                      {/* Изображение */}
                      <TableCell>
                        <Link href={PagesConfig.PRODUCT_DETAILS(item.product.linkName)}>
                          <div className='relative w-16 h-16 rounded-md overflow-hidden bg-muted'>
                            {item.product.images[0] && (
                              <Image
                                src={item.product.images[0]}
                                alt={item.product.name}
                                fill
                                className='object-cover'
                                sizes='64px'
                              />
                            )}
                          </div>
                        </Link>
                      </TableCell>

                      {/* Товар + варианты */}
                      <TableCell className='font-medium'>
                        <div className='space-y-1.5'>
                          <Link
                            href={PagesConfig.PRODUCT_DETAILS(item.product.linkName)}
                            className='hover:underline line-clamp-2'
                          >
                            {item.product.name}
                          </Link>
                          {(item.color || item.size) && (
                            <div className='flex gap-1.5'>
                              {item.color && (
                                <span className='inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground'>
                                  {item.color}
                                </span>
                              )}
                              {item.size && (
                                <span className='inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground'>
                                  {item.size}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* Количество */}
                      <TableCell className='text-center'>
                        <div className='inline-flex items-center border border-border rounded-md overflow-hidden'>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className='px-2.5 py-1.5 hover:bg-muted transition-colors disabled:opacity-40'
                            aria-label='Уменьшить'
                          >
                            <Minus className='w-3.5 h-3.5' />
                          </button>
                          <span className='px-3 py-1.5 text-sm font-medium min-w-[2.25rem] text-center tabular-nums border-x border-border'>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.atStock}
                            className='px-2.5 py-1.5 hover:bg-muted transition-colors disabled:opacity-40'
                            aria-label='Увеличить'
                          >
                            <Plus className='w-3.5 h-3.5' />
                          </button>
                        </div>
                      </TableCell>

                      {/* Цена за шт. */}
                      <TableCell>
                        <div className='space-y-0.5'>
                          <p className='font-semibold text-green-600'>{priceFormat(unitPrice)}</p>
                          {item.product.discountPrice && (
                            <p className='text-xs text-muted-foreground line-through'>
                              {priceFormat(item.product.price)}
                            </p>
                          )}
                        </div>
                      </TableCell>

                      {/* Сумма */}
                      <TableCell>
                        <p className='font-semibold text-green-600'>{priceFormat(unitPrice * item.quantity)}</p>
                      </TableCell>

                      {/* Удалить */}
                      <TableCell>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => handleRemoveItem(item.id)}
                          className='text-muted-foreground hover:text-destructive'
                          aria-label='Удалить товар'
                        >
                          <Trash2 className='w-4 h-4' />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Сводка */}
        <div className='bg-white rounded-lg shadow p-6 sticky top-4 space-y-4'>
          <h2 className='text-xl font-bold'>Итого</h2>
          <div className='h-px bg-border' />

          {/* Список товаров */}
          <div className='space-y-2 text-sm max-h-52 overflow-y-auto pr-1'>
            {items.map(item => {
              const price = item.product.discountPrice ?? item.product.price
              return (
                <div key={item.id} className='flex justify-between gap-2'>
                  <span className='text-muted-foreground line-clamp-1 flex-1'>
                    {item.product.name}
                    {item.quantity > 1 ? ` × ${item.quantity}` : ""}
                  </span>
                  <span className='shrink-0 font-medium tabular-nums'>{priceFormat(price * item.quantity)}</span>
                </div>
              )
            })}
          </div>

          <div className='h-px bg-border' />

          {/* Расчёт */}
          <div className='space-y-2.5 text-sm'>
            {discount > 0 && (
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Скидка</span>
                <span className='font-medium tabular-nums text-red-500'>− {priceFormat(discount)}</span>
              </div>
            )}
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Доставка</span>
              <span className='font-medium text-green-600'>Бесплатно</span>
            </div>
          </div>

          <div className='h-px bg-border' />

          <div className='flex justify-between items-center'>
            <span className='font-bold text-base'>К оплате</span>
            <span className='text-2xl font-bold text-green-600'>{priceFormat(total)}</span>
          </div>

          {discount > 0 && (
            <div className='rounded-md bg-green-50 border border-green-100 px-3 py-2 text-sm text-green-700 text-center'>
              Вы экономите {priceFormat(discount)}
            </div>
          )}

          <Button
            size='lg'
            className='w-full'
            onClick={handleCheckout}
            disabled={isCheckingOut}
          >
            {isCheckingOut ? "Переход к оплате..." : "Оплатить заказ"}
          </Button>
        </div>
      </div>
    </div>
  )
}
