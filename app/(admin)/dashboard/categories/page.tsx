"use client"

import { CategoriesTable } from "@/components/dashboard/category/categories-table"
import { useCategories } from "@/hooks/useFetch"

export default function CategoriesPage() {
  const { data: categories, isLoading, refetch } = useCategories()

  return (
    <div>
      <h1 className='text-3xl font-bold mb-6'>Категории</h1>
      <div className='bg-white rounded-lg shadow p-6'>
        <CategoriesTable categories={categories || []} loading={isLoading} onRefetch={refetch} />
      </div>
    </div>
  )
}
