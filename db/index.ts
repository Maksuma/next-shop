import "dotenv/config"
import { drizzle } from "drizzle-orm/node-postgres"
import { account, cart, cartItem, category, order, orderItem, product, productImage, session, user, verification } from "./schema"

export const db = drizzle(process.env.DATABASE_URL!, {
  schema: {
    user,
    session,
    account,
    verification,
    product,
    productImage,
    category,
    cart,
    cartItem,
    order,
    orderItem,
  },
})

export type TProduct = typeof product.$inferSelect
export type TCategory = typeof category.$inferSelect
export type TProductImage = typeof productImage.$inferSelect
export type TCartItem = typeof cartItem.$inferSelect & { product: TProduct }
export type TCart = typeof cart.$inferSelect & { items: TCartItem[] }
export type TCartResponse = TCart | { items: [] }
export type TOrderItem = typeof orderItem.$inferSelect & { product: TProduct | null }
export type TOrder = typeof order.$inferSelect & { items: TOrderItem[] }
