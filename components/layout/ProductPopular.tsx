import { TProduct } from "@/db"

interface ProductPopularProps {
  products: TProduct[]
}

export default function ProductPopular({ products }: ProductPopularProps) {
  return (
    <div>
      <h2>Popular Products</h2>
      <ul>
        {products.map(product => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  )
}
