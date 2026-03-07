"use client"

import { Button } from "@/components/ui/button"
import { QueriesConfig } from "@/config/queries.config"
import { useCart } from "@/hooks/useFetch"
import { authClient } from "@/lib/auth-client"
import { ShoppingCart } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface AddToCartButtonProps {
  productId: number
  atStock: number
}

export function AddToCartButton({ productId, atStock }: AddToCartButtonProps) {
  const { data: session } = authClient.useSession()
  const { mutate } = useCart()
  const [loading, setLoading] = useState(false)

  const handleAddToCart = async () => {
    if (!session) {
      toast.error("Войдите в аккаунт, чтобы добавить товар в корзину")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(QueriesConfig.CART_ADD_ITEM, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId, quantity: 1 }),
      })

      if (!res.ok) throw new Error()

      await mutate()
      toast.success("Товар добавлен в корзину")
    } catch {
      toast.error("Не удалось добавить товар в корзину")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button size='lg' className='w-full text-lg h-14' disabled={atStock === 0 || loading} onClick={handleAddToCart}>
      <ShoppingCart className='w-5 h-5 mr-2' />
      {atStock > 0 ? "Добавить в корзину" : "Нет в наличии"}
    </Button>
  )
}
