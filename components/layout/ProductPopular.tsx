"use client"

import { usePopularProducts } from '@/hooks/useFetch'

export default function ProductPopular() {
  const {data} = usePopularProducts()
    return (

  )
}