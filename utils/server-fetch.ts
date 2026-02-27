import { QueriesConfig } from "@/config/queries.config"
import { TCategory, TProduct } from "@/db"

export async function getProducts(): Promise<TProduct[]> {
  const res = await fetch(QueriesConfig.PRODUCT_LIST, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error("Ошибка загрузки продуктов")
  return res.json()
}

export async function getPopularProducts(): Promise<TProduct[]> {
  const res = await fetch(QueriesConfig.PRODUCT_LIST + "?popular=true", { next: { revalidate: 60 } })
  if (!res.ok) throw new Error("Ошибка загрузки популярных продуктов")
  return res.json()
}

export async function getProductByName(name: string): Promise<TProduct> {
  const res = await fetch(QueriesConfig.PRODUCT_BY_SLUG(name), { next: { revalidate: 60 } })
  if (!res.ok) throw new Error("Продукт не найден")
  return res.json()
}

export async function getCategories(): Promise<TCategory[]> {
  const res = await fetch(QueriesConfig.CATEGORY_LIST, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error("Ошибка загрузки категорий")
  return res.json()
}
