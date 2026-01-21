import { db } from "@/db"
import { category } from "@/db/schema"
import { requireAdmin } from "@/lib/auth-guard"
import { slugGenerator } from "@/utils/slug-generator"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const categories = await db.select().from(category).orderBy(category.name)
    return NextResponse.json(categories, { status: 200 })
  } catch (error) {
    console.error("Ошибка при получении продуктов:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin()
  if (session instanceof NextResponse) return session

  try {
    const { name, specifications } = await request.json()

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Неверные данные" }, { status: 400 })
    }
    const linkName = slugGenerator(name)

    const newCategory = await db
      .insert(category)
      .values({
        name,
        linkName,
        specifications: specifications || null,
      })
      .returning()

    return NextResponse.json(newCategory[0], { status: 201 })
  } catch (error) {
    console.error("Ошибка при создании категории:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}
