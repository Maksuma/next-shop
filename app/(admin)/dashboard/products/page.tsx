"use client"

import { ProductsTable } from "@/components/dashboard/products-table"
import { useCategories, useProducts } from "@/hooks/useFetch"

export default function DashboardProductsPage() {
  const { data: products, isLoading: productsLoading, refetch } = useProducts()
  const { data: categories, isLoading: categoriesLoading } = useCategories()

  const loading = productsLoading || categoriesLoading

  return (
    <div className='container mx-auto py-6'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold'>Продукты</h1>
        <p className='text-muted-foreground mt-2'>Управление продуктами магазина</p>
      </div>

      <ProductsTable products={products || []} categories={categories || []} loading={loading} onRefetch={refetch} />
    </div>
  )
}
