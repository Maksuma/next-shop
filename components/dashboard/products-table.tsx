"use client"

import SkeletonProductsTableRow from "@/components/layout/skeleton/SkeletonProductsTableRow"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TCategory, TProduct } from "@/db"
import { getCategoryName } from "@/utils/category-name"
import { priceFormat } from "@/utils/price-firmat"
import { Pencil } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { EditProductModal } from "./edit-product-modal"
import { ProductsFilters } from "./products-filters"

interface ProductsTableProps {
  products: TProduct[]
  categories: TCategory[]
  loading?: boolean
  onRefetch?: () => void
}

export function ProductsTable({ products, categories, loading, onRefetch }: ProductsTableProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [stockFilter, setStockFilter] = useState<string>("all")
  const [editingProduct, setEditingProduct] = useState<TProduct | null>(null)

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Поиск по названию и описанию
      const matchesSearch =
        searchQuery === "" ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())

      // Фильтр по категории
      const matchesCategory = categoryFilter === "all" || product.categoryId === Number(categoryFilter)

      // Фильтр по наличию
      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "in-stock" && product.atStock > 0) ||
        (stockFilter === "out-of-stock" && product.atStock === 0) ||
        (stockFilter === "low-stock" && product.atStock > 0 && product.atStock <= 10)

      return matchesSearch && matchesCategory && matchesStock
    })
  }, [products, searchQuery, categoryFilter, stockFilter])

  const handleClearFilters = () => {
    setSearchQuery("")
    setCategoryFilter("all")
    setStockFilter("all")
  }

  const hasActiveFilters = searchQuery !== "" || categoryFilter !== "all" || stockFilter !== "all"

  const handleProductUpdated = () => {
    onRefetch?.()
    router.refresh()
  }

  return (
    <div className='space-y-4'>
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          categories={categories}
          open={!!editingProduct}
          onOpenChange={open => !open && setEditingProduct(null)}
          onProductUpdated={handleProductUpdated}
        />
      )}

      <ProductsFilters
        categories={categories}
        searchQuery={searchQuery}
        categoryFilter={categoryFilter}
        stockFilter={stockFilter}
        loading={loading}
        onSearchChange={setSearchQuery}
        onCategoryChange={setCategoryFilter}
        onStockChange={setStockFilter}
        onClearFilters={handleClearFilters}
        onProductAdded={handleProductUpdated}
      />

      {/* Информация о результатах */}
      {loading ? (
        <Skeleton className='h-5 w-48' />
      ) : (
        <div className='text-sm text-muted-foreground'>
          Найдено продуктов: {filteredProducts.length} из {products.length}
        </div>
      )}

      {/* Таблица */}
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-25'>Изображение</TableHead>
              <TableHead>Название</TableHead>
              <TableHead>Категория</TableHead>
              <TableHead>Цена</TableHead>
              <TableHead>Скидка</TableHead>
              <TableHead className='text-center'>В наличии</TableHead>
              <TableHead className='text-center'>Популярный</TableHead>
              <TableHead className='text-center'>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => <SkeletonProductsTableRow key={index} />)
            ) : filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className='text-center py-10'>
                  <p className='text-muted-foreground'>
                    {hasActiveFilters ? "Продукты не найдены по заданным критериям" : "Продукты не найдены"}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map(product => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className='relative w-16 h-16 rounded-md overflow-hidden bg-muted'>
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className='object-cover'
                        sizes='(max-width: 768px) 100vw, 16vw'
                      />
                    </div>
                  </TableCell>
                  <TableCell className='font-medium'>
                    <div>
                      <p>{product.name}</p>
                      {product.description && (
                        <p className='text-sm text-muted-foreground line-clamp-1 mt-1'>{product.description}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className='text-sm'>
                      {getCategoryName({
                        categoryId: product.categoryId,
                        categories,
                      })}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className='font-semibold'>{priceFormat(product.price)}</span>
                  </TableCell>
                  <TableCell>
                    {product.discountPrice ? (
                      <span className='text-green-600 font-semibold'>{priceFormat(product.discountPrice)}</span>
                    ) : (
                      <span className='text-muted-foreground'>—</span>
                    )}
                  </TableCell>
                  <TableCell className='text-center'>
                    <span
                      className={
                        product.atStock > 10
                          ? "text-green-600 font-medium"
                          : product.atStock > 0
                            ? "text-orange-600 font-medium"
                            : "text-red-600 font-medium"
                      }
                    >
                      {product.atStock}
                    </span>
                  </TableCell>
                  <TableCell className='text-center'>
                    {product.isPopular ? (
                      <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'>
                        Да
                      </span>
                    ) : (
                      <span className='text-muted-foreground'>—</span>
                    )}
                  </TableCell>
                  <TableCell className='text-center'>
                    <Button variant='ghost' size='sm' onClick={() => setEditingProduct(product)}>
                      <Pencil className='w-4 h-4 mr-2' />
                      Редактировать
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
