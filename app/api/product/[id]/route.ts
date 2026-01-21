import { db } from "@/db"
import { product } from "@/db/schema"
import { requireAdmin } from "@/lib/auth-guard"
import { moveImagesFromTemp } from "@/utils/move-images-from-temp"
import { slugGenerator } from "@/utils/slug-generator"
import { eq } from "drizzle-orm"
import fs from "fs/promises"
import { NextRequest, NextResponse } from "next/server"
import path from "path"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = Number((await params).id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Неверный ID продукта" }, { status: 400 })
    }

    const newProduct = await db.select().from(product).where(eq(product.id, id))
    return NextResponse.json(newProduct, { status: 200 })
  } catch (error) {
    console.error("Ошибка при получении продукта:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin()
  if (session instanceof NextResponse) return session

  try {
    const body = await request.json()
    const id = Number((await params).id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Неверный ID продукта" }, { status: 400 })
    }

    const { name, description, price, discountPrice, atStock, categoryId, isPopular, images, specifications } = body

    if (!name || price === undefined || price < 0 || atStock === undefined || !categoryId) {
      return NextResponse.json({ error: "Отсутствуют обязательные поля или неверные значения" }, { status: 400 })
    }

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ error: "Необходимо добавить хотя бы одно изображение" }, { status: 400 })
    }

    if (discountPrice !== null && discountPrice !== undefined && discountPrice < 0) {
      return NextResponse.json({ error: "Цена не может быть отрицательной" }, { status: 400 })
    }

    // Перемещаем изображения из temp-product, если они есть
    let updatedImages = images
    if (images.some((url: string) => url.includes("/temp-product/"))) {
      try {
        updatedImages = await moveImagesFromTemp(name, images)
      } catch (error) {
        console.error("Ошибка при перемещении изображений:", error)
      }
    }

    const updatedProduct = await db
      .update(product)
      .set({
        name,
        description: description || null,
        price,
        discountPrice: discountPrice || null,
        atStock,
        categoryId,
        isPopular: isPopular || false,
        images: updatedImages,
        specifications: specifications || [],
      })
      .where(eq(product.id, id))
      .returning()

    if (!updatedProduct || updatedProduct.length === 0) {
      return NextResponse.json({ error: "Продукт не найден" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      product: updatedProduct[0],
    })
  } catch (error) {
    console.error("Ошибка при обновлении продукта:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin()
  if (session instanceof NextResponse) return session

  try {
    const id = Number((await params).id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Неверный ID продукта" }, { status: 400 })
    }
    const deletedCount = await db.delete(product).where(eq(product.id, id)).returning()

    if (deletedCount.length === 0) {
      return NextResponse.json({ error: "Продукт не найден" }, { status: 404 })
    }

    const imagesDir = path.join(process.cwd(), `uploads/${slugGenerator(deletedCount[0].name)}`)

    try {
      await fs.rm(imagesDir, { recursive: true, force: true })
    } catch (error) {
      console.error("Ошибка при удалении папки с изображениями:", error)
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Ошибка при удалении продукта:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}
