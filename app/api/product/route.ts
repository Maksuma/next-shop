import { db } from "@/db"
import { product } from "@/db/schema"
import { requireAdmin } from "@/lib/auth-guard"
import { moveImagesFromTemp } from "@/utils/move-images-from-temp"
import { slugGenerator } from "@/utils/slug-generator"
import { eq } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const popular = searchParams.get("popular")

    if (popular === "true") {
      const popularProducts = await db.select().from(product).where(eq(product.isPopular, true))
      return NextResponse.json(popularProducts, { status: 200 })
    }

    const products = await db.select().from(product)
    return NextResponse.json(products, { status: 200 })
  } catch (error) {
    console.error("Ошибка при получении продуктов:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin()
  if (session instanceof NextResponse) return session

  try {
    const data = await request.json()
    const linkName = slugGenerator(data.name)
    const discountPrice = data.discountPrice === "" ? null : data.discountPrice

    // Перемещаем изображения из temp-product в правильную папку
    let images = data.images || []
    if (images.length > 0 && images.some((url: string) => url.includes("/temp-product/"))) {
      try {
        images = await moveImagesFromTemp(data.name, images)
      } catch (error) {
        console.error("Ошибка при перемещении изображений:", error)
        // Продолжаем создание продукта даже если перемещение не удалось
      }
    }

    const newProduct = await db
      .insert(product)
      .values({
        ...data,
        linkName,
        discountPrice,
        images,
      })
      .returning()
    return NextResponse.json(newProduct[0], { status: 201 })
  } catch (error) {
    console.error("Ошибка при создании продукта:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}
