"use client"

import { usePopularProducts } from "@/hooks/useFetch"

export default function ProductPopular() {
  const { data } = usePopularProducts()
  return (
    <div>
      <h2>Popular Products</h2>
      <ul>
        {data?.map(product => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  )
}
