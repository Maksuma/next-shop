import { db } from "@/db"
import { card } from "@/db/schema"
import { eq } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (id) {
    const product = await db.select().from(card).where(eq(card.id, id)).limit(1)

    if (product.length === 0) return NextResponse.json({ message: "Product not found" }, { status: 404 })
    return NextResponse.json(product[0], { status: 200 })
  }
  const products = await db.select().from(card)
  return NextResponse.json(products, { status: 200 })
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const newProduct = await db
    .insert(card)
    .values({
      ...data,
    })
    .returning()
  return NextResponse.json(newProduct[0], { status: 201 })
}
