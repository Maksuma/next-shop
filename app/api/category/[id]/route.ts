import { db } from "@/db"
import { category } from "@/db/schema"
import { requireAdmin } from "@/lib/auth-guard"
import { eq } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin()
  if (session instanceof NextResponse) return session

  try {
    const id = Number((await params).id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Неверный ID категории" }, { status: 400 })
    }

    const { name, specifications } = await request.json()

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Неверные данные" }, { status: 400 })
    }

    const linkName = name.toLowerCase().replace(/\s+/g, "-")

    const updatedCategory = await db
      .update(category)
      .set({
        name,
        linkName,
        specifications: specifications || null,
      })
      .where(eq(category.id, id))
      .returning()

    if (updatedCategory.length === 0) {
      return NextResponse.json({ error: "Категория не найдена" }, { status: 404 })
    }

    return NextResponse.json(updatedCategory[0], { status: 200 })
  } catch (error) {
    console.error("Ошибка при обновлении категории:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin()
  if (session instanceof NextResponse) return session

  try {
    const id = Number((await params).id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Неверный ID категории" }, { status: 400 })
    }

    await db.delete(category).where(eq(category.id, id))

    return NextResponse.json({ message: "Категория удалена" }, { status: 200 })
  } catch (error) {
    console.error("Ошибка при удалении категории:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}
