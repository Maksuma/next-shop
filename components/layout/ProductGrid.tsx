"use client"

import { useProducts } from "@/hooks/useFetch"
import ProductItem from "./ProductItem"
import SkeletonProductItem from "./skeleton/SkeletonProductItem"

export default function ProductGrid() {
  const { data: products, isLoading } = useProducts()

  if (isLoading)
    return (
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonProductItem key={i} />
        ))}
      </div>
    )

  if (!products) return null

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
      {products.map(item => (
        <ProductItem key={item.id} {...item} />
      ))}
    </div>
  )
}
