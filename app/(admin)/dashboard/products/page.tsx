"use client"

import { ProductsTable } from "@/components/dashboard/product/products-table"
import { useCategories, useProducts } from "@/hooks/useFetch"

export default function DashboardProductsPage() {
  const { data: products, isLoading: productsLoading, refetch } = useProducts()
  const { data: categories, isLoading: categoriesLoading } = useCategories()

  const loading = productsLoading || categoriesLoading

  return (
    <div>
      <h1 className='text-3xl font-bold mb-6'>Продукты</h1>
      <div className='bg-white rounded-lg shadow p-6 mb-6'>
        <p className='text-muted-foreground'>Управление продуктами магазина</p>
      </div>
      <div className='bg-white rounded-lg shadow p-6'>
        <ProductsTable products={products || []} categories={categories || []} loading={loading} onRefetch={refetch} />
      </div>
    </div>
  )
}
