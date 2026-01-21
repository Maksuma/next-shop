"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import SkeletonProductsFilters from "@/components/layout/skeleton/SkeletonProductsFilters"
import { TCategory } from "@/db"
import { Plus, Search, X } from "lucide-react"
import { useState } from "react"
import { AddProductModal } from "./add-product-modal"

interface ProductsFiltersProps {
  categories: TCategory[]
  searchQuery: string
  categoryFilter: string
  stockFilter: string
  loading?: boolean
  onSearchChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onStockChange: (value: string) => void
  onClearFilters: () => void
  onProductAdded: () => void
}

export function ProductsFilters({
  categories,
  searchQuery,
  categoryFilter,
  stockFilter,
  loading,
  onSearchChange,
  onCategoryChange,
  onStockChange,
  onClearFilters,
  onProductAdded,
}: ProductsFiltersProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const hasActiveFilters = searchQuery !== "" || categoryFilter !== "all" || stockFilter !== "all"

  if (loading) {
    return <SkeletonProductsFilters />
  }

  return (
    <>
      <AddProductModal
        categories={categories}
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onProductAdded={onProductAdded}
      />
      <div className='flex flex-col sm:flex-row gap-4'>
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Поиск по названию или описанию...'
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className='pl-9'
          />
        </div>

        <Select value={categoryFilter} onValueChange={onCategoryChange}>
          <SelectTrigger className='w-full sm:w-50'>
            <SelectValue placeholder='Все категории' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Все категории</SelectItem>
            {categories.map(category => (
              <SelectItem key={category.id} value={String(category.id)}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={stockFilter} onValueChange={onStockChange}>
          <SelectTrigger className='w-full sm:w-50'>
            <SelectValue placeholder='Все товары' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Все товары</SelectItem>
            <SelectItem value='in-stock'>В наличии</SelectItem>
            <SelectItem value='low-stock'>Мало (≤10)</SelectItem>
            <SelectItem value='out-of-stock'>Нет в наличии</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={() => setIsAddModalOpen(true)} className='w-full sm:w-auto'>
          <Plus className='w-4 h-4 mr-2' />
          Добавить
        </Button>

        {hasActiveFilters && (
          <Button variant='ghost' onClick={onClearFilters} className='w-full sm:w-auto'>
            <X className='w-4 h-4 mr-2' />
            Сбросить
          </Button>
        )}
      </div>
    </>
  )
}
