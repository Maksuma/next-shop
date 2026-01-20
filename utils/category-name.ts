import { TCategory } from "@/db"

interface Props {
  categoryId: number | undefined
  categories: TCategory[]
}

export function getCategoryName({ categoryId, categories }: Props): string {
  const data = categories.find(cat => cat.id === categoryId)
  return data ? data.name : "Неизвестная категория"
}
