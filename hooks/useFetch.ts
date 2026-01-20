import { TCategory, TProduct } from "@/db"
import useSWR from "swr"

const fetcher = (url: string) =>
  fetch(url).then(res => {
    if (!res.ok) throw new Error("Ошибка загрузки данных")
    return res.json()
  })

export function useFetch<T>(url: string | null) {
  const { data, error, isLoading, mutate } = useSWR<T>(url, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
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
  return useFetch<TProduct[]>("/api/product")
}

export function useCategories() {
  return useFetch<TCategory[]>("/api/category")
}

export function useProduct(id: string | number | null) {
  return useFetch<TProduct>(id ? `/api/product/${id}` : null)
}

export function usePopularProducts() {
  return useFetch<TProduct[]>("/api/product?popular=true")
}
