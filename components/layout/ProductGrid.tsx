import { TProduct } from "@/db"
import ProductItem from "./ProductItem"

interface ProductGridProps {
  products: TProduct[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (!products.length) return <p className='text-sm text-muted-foreground py-6'>Нет продуктов для отображения.</p>

  return (
    <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
      {products.map(item => (
        <ProductItem key={item.id} {...item} />
      ))}
    </div>
  )
}
