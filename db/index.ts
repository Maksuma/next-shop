import "dotenv/config"
import { drizzle } from "drizzle-orm/node-postgres"
import { account, card, category, session, user, verification } from "./schema"

export const db = drizzle(process.env.DATABASE_URL!, {
  schema: {
    user,
    session,
    account,
    verification,
    card,
    category,
  },
})

export type TCard = typeof card.$inferInsert
export type TCategory = typeof category.$inferInsert
