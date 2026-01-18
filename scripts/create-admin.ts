import { account, user as userTable } from "@/db/schema"
import { hashPassword } from "better-auth/crypto"
import "dotenv/config"
import { drizzle } from "drizzle-orm/node-postgres"

const db = drizzle(process.env.DATABASE_URL!)

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL!
  const name = process.env.ADMIN_NAME!
  const hashedPassword = await hashPassword(process.env.ADMIN_PASSWORD!)

  const admin: typeof userTable.$inferInsert = {
    id: crypto.randomUUID(),
    email: email,
    name: name,
    role: "admin",
    emailVerified: true,
  }

  await db.insert(userTable).values(admin)

  await db.insert(account).values({
    id: crypto.randomUUID(),
    userId: admin.id,
    accountId: admin.id,
    providerId: "credential",
    password: hashedPassword,
  })
  console.log("New admin created!")

  const users = await db.select().from(userTable)
  console.log("Getting all users from the database: ", users)
}

createAdmin()
