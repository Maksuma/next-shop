"use client"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TCategory } from "@/db"
import { Pencil } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { CategoriesFilters } from "./categories-filters"
import { EditCategoryModal } from "./edit-category-modal"

interface CategoriesTableProps {
  categories: TCategory[]
  loading?: boolean
  onRefetch?: () => void
}

export function CategoriesTable({ categories, loading, onRefetch }: CategoriesTableProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [editingCategory, setEditingCategory] = useState<TCategory | null>(null)

  const filteredCategories = useMemo(() => {
    return categories.filter(category => {
      const matchesSearch =
        searchQuery === "" ||
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.linkName?.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesSearch
    })
  }, [categories, searchQuery])

  const handleClearFilters = () => {
    setSearchQuery("")
  }

  const hasActiveFilters = searchQuery !== ""

  const handleCategoryUpdated = () => {
    onRefetch?.()
    router.refresh()
  }

  return (
    <div className='space-y-4'>
      {editingCategory && (
        <EditCategoryModal
          category={editingCategory}
          open={!!editingCategory}
          onOpenChange={open => !open && setEditingCategory(null)}
          onCategoryUpdated={handleCategoryUpdated}
        />
      )}

      <CategoriesFilters
        searchQuery={searchQuery}
        loading={loading}
        onSearchChange={setSearchQuery}
        onClearFilters={handleClearFilters}
        onCategoryAdded={handleCategoryUpdated}
      />

      {/* Информация о результатах */}
      {loading ? (
        <Skeleton className='h-5 w-48' />
      ) : (
        <div className='text-sm text-muted-foreground'>
          Найдено категорий: {filteredCategories.length} из {categories.length}
        </div>
      )}

      {/* Таблица */}
      <div className='rounded-md border bg-white'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[80px]'>ID</TableHead>
              <TableHead>Название</TableHead>
              <TableHead>Link Name</TableHead>
              <TableHead className='w-[200px]'>Характеристики</TableHead>
              <TableHead className='w-[100px]'>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className='h-4 w-12' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-32' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-32' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-16' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-8 w-8' />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className='text-center py-8 text-muted-foreground'>
                  {hasActiveFilters ? "Категории не найдены" : "Нет категорий"}
                </TableCell>
              </TableRow>
            ) : (
              filteredCategories.map(category => (
                <TableRow key={category.id}>
                  <TableCell className='font-medium'>{category.id}</TableCell>
                  <TableCell className='font-medium'>{category.name}</TableCell>
                  <TableCell className='text-muted-foreground'>{category.linkName}</TableCell>
                  <TableCell>
                    <span className='text-sm text-muted-foreground'>{category.specifications?.length || 0} шт.</span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => setEditingCategory(category)}
                      title='Редактировать'
                    >
                      <Pencil className='h-4 w-4' />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
