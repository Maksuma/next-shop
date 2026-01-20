import "dotenv/config"
import { drizzle } from "drizzle-orm/node-postgres"
import { account, category, product, productImage, session, user, verification } from "./schema"

export const db = drizzle(process.env.DATABASE_URL!, {
  schema: {
    user,
    session,
    account,
    verification,
    product,
    productImage,
    category,
  },
})

export type TProduct = typeof product.$inferSelect
export type TCategory = typeof category.$inferSelect
export type TProductImage = typeof productImage.$inferSelect
