import { QueriesConfig } from "@/config/queries.config"
import { TCart, TCartResponse, TCategory, TOrder, TProduct } from "@/db"
import useSWR from "swr"

const fetcher = (url: string) =>
  fetch(url).then(res => {
    if (!res.ok) throw new Error("Ошибка загрузки данных")
    return res.json()
  })

const authFetcher = (url: string) =>
  fetch(url, { credentials: "include" }).then(res => {
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

export function useCart() {
  const { data, error, isLoading, mutate } = useSWR<TCartResponse>(QueriesConfig.CART, authFetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  })

  const items = (data as TCart | undefined)?.items ?? []

  return { data, items, error, isLoading, mutate }
}

export function useOrders() {
  const { data, error, isLoading, mutate } = useSWR<TOrder[]>(QueriesConfig.ORDERS, authFetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  })

  return { data: data ?? [], error, isLoading, mutate }
}

export function useOrder(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<TOrder>(
    id ? QueriesConfig.ORDER_DETAILS(id) : null,
    authFetcher,
    { revalidateOnFocus: false },
  )

  return { data, error, isLoading, mutate }
}
