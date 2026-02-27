import ProductGrid from "@/components/layout/ProductGrid"
import { getProducts } from "@/utils/server-fetch"

export default async function Home() {
  const products = await getProducts()

  return (
    <div className='space-y-8 py-8'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold tracking-tight text-foreground'>Все товары</h1>
      </div>
      <ProductGrid products={products} />
    </div>
  )
}
