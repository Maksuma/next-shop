"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, X } from "lucide-react"
import { useState } from "react"
import { AddCategoryModal } from "./add-category-modal"

interface CategoriesFiltersProps {
  searchQuery: string
  loading?: boolean
  onSearchChange: (value: string) => void
  onClearFilters: () => void
  onCategoryAdded: () => void
}

export function CategoriesFilters({
  searchQuery,
  loading,
  onSearchChange,
  onClearFilters,
  onCategoryAdded,
}: CategoriesFiltersProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const hasActiveFilters = searchQuery !== ""

  return (
    <>
      <AddCategoryModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} onCategoryAdded={onCategoryAdded} />
      <div className='flex flex-col sm:flex-row gap-4'>
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Поиск по названию...'
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className='pl-9'
            disabled={loading}
          />
        </div>

        <Button onClick={() => setIsAddModalOpen(true)} className='w-full sm:w-auto' disabled={loading}>
          <Plus className='w-4 h-4 mr-2' />
          Добавить
        </Button>

        {hasActiveFilters && (
          <Button variant='ghost' onClick={onClearFilters} className='w-full sm:w-auto' disabled={loading}>
            <X className='w-4 h-4 mr-2' />
            Сбросить
          </Button>
        )}
      </div>
    </>
  )
}
