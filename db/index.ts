import "dotenv/config"
import { drizzle } from "drizzle-orm/node-postgres"
import { account, card, session, user, verification } from "./schema"

export const db = drizzle(process.env.DATABASE_URL!, {
  schema: {
    user,
    session,
    account,
    verification,
    card,
  },
})
