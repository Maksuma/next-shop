import { QueriesConfig } from "@/config/queries.config"
import { TCategory, TProduct } from "@/db"
import useSWR from "swr"

const fetcher = (url: string) =>
  fetch(url).then(res => {
    if (!res.ok) throw new Error("Ошибка загрузки данных")
    return res.json()
  })

export function useFetch<T>(url: string | null) {
  const { data, error, isLoading, mutate } = useSWR<T>(url, fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  })

  return {
    data,
    error,
    isLoading,
    refetch: () => mutate(),
    mutate,
  }
}

export function useProducts() {
  return useFetch<TProduct[]>(QueriesConfig.PRODUCT_LIST)
}

export function useProductsInCategory(id: string | number) {
  return useFetch<TProduct[]>(QueriesConfig.PRODUCTS_IN_CATEGORIES(id))
}

export function useCategories() {
  return useFetch<TCategory[]>(QueriesConfig.CATEGORY_LIST)
}

export function useCategoryBySlug(slug: string) {
  return useFetch<TCategory>(QueriesConfig.CATEGORY_BY_SLUG(slug))
}

export function useProduct(id: string | number) {
  return useFetch<TProduct>(QueriesConfig.PRODUCT_DETAILS(id))
}

export function usePopularProducts() {
  return useFetch<TProduct[]>(QueriesConfig.PRODUCT_LIST + "?popular=true")
}
