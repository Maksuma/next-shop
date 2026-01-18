import ProductItem from "@/components/layout/ProductItem"
import { db } from "@/db"
import { card } from "@/db/schema"

export default async function Home() {
  const product = await db.select().from(card)
  return (
    <div>
      {product.map(item => (
        <ProductItem key={item.id} {...item} />
      ))}
    </div>
  )
}
