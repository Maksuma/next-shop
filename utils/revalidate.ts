"use server"

import { revalidatePath } from "next/cache"

export async function revalidateProducts() {
  revalidatePath("/")
  revalidatePath("/dashboard/products")
}

export async function revalidateCategories() {
  revalidatePath("/dashboard/categories")
}
