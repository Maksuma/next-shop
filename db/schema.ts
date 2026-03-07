import { relations } from "drizzle-orm"
import { boolean, index, integer, jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  role: text("role").default("user"),
  banned: boolean("banned").default(false),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
})

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    impersonatedBy: text("impersonated_by"),
  },
  table => [index("session_userId_idx").on(table.userId)],
)

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  table => [index("account_userId_idx").on(table.userId)],
)

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  table => [index("verification_identifier_idx").on(table.identifier)],
)

export const product = pgTable("product", {
  id: serial("id").primaryKey().notNull(),
  name: text("name").notNull(),
  linkName: text("link_name").notNull(),
  description: text("description"),
  specifications: jsonb("specifications").$type<Array<{ name: string; value: string }>>(),
  price: integer("price").notNull(),
  discountPrice: integer("discount_price"),
  atStock: integer("at_stock").notNull(),
  categoryId: serial("category_id")
    .notNull()
    .references(() => category.id, { onDelete: "cascade" }),
  colors: text("colors").array(),
  hasColors: boolean("has_colors").default(false).notNull(),
  sizes: text("sizes").array(),
  hasSizes: boolean("has_sizes").default(false).notNull(),
  images: text("images").array().notNull(),
  isPopular: boolean("is_popular").default(false).notNull(),
  reviewsCount: integer("reviews_count").default(0).notNull(),
  rating: integer("rating").default(0).notNull(),
})

export const productImage = pgTable(
  "product_image",
  {
    id: serial("id").primaryKey(),
    productId: serial("product_id")
      .notNull()
      .references(() => product.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    order: integer("order").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  table => [index("product_image_productId_idx").on(table.productId), index("product_image_order_idx").on(table.order)],
)

export const category = pgTable("category", {
  id: serial("id").primaryKey().notNull(),
  name: text("name").notNull(),
  linkName: text("link_name").notNull(),
  specifications: text("specifications").array(),
  image: text("image").notNull(),
})

export const productRelations = relations(product, ({ one, many }) => ({
  category: one(category, {
    fields: [product.categoryId],
    references: [category.id],
  }),
  productImages: many(productImage),
}))

export const productImageRelations = relations(productImage, ({ one }) => ({
  product: one(product, {
    fields: [productImage.productId],
    references: [product.id],
  }),
}))

export const categoryRelations = relations(category, ({ many }) => ({
  products: many(product),
}))

export const userRelations = relations(user, ({ many, one }) => ({
  sessions: many(session),
  accounts: many(account),
  cart: one(cart, {
    fields: [user.id],
    references: [cart.userId],
  }),
  orders: many(order),
}))

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}))

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}))

export const cart = pgTable("cart", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})

export const cartItem = pgTable("cart_item", {
  id: serial("id").primaryKey().notNull(),
  cartId: text("cart_id")
    .notNull()
    .references(() => cart.id, { onDelete: "cascade" }),
  productId: integer("product_id")
    .notNull()
    .references(() => product.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull().default(1),
  color: text("color"),
  size: text("size"),
})

export const cartRelations = relations(cart, ({ one, many }) => ({
  user: one(user, {
    fields: [cart.userId],
    references: [user.id],
  }),
  items: many(cartItem),
}))

export const cartItemRelations = relations(cartItem, ({ one }) => ({
  cart: one(cart, {
    fields: [cartItem.cartId],
    references: [cart.id],
  }),
  product: one(product, {
    fields: [cartItem.productId],
    references: [product.id],
  }),
}))

export const order = pgTable("order", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  stripeSessionId: text("stripe_session_id").unique(),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  status: text("status").notNull().default("pending").$type<"pending" | "paid" | "cancelled">(),
  totalAmount: integer("total_amount").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})

export const orderItem = pgTable("order_item", {
  id: serial("id").primaryKey().notNull(),
  orderId: text("order_id")
    .notNull()
    .references(() => order.id, { onDelete: "cascade" }),
  productId: integer("product_id").references(() => product.id, { onDelete: "set null" }),
  productName: text("product_name").notNull(),
  productPrice: integer("product_price").notNull(),
  quantity: integer("quantity").notNull().default(1),
  color: text("color"),
  size: text("size"),
})

export const orderRelations = relations(order, ({ one, many }) => ({
  user: one(user, {
    fields: [order.userId],
    references: [user.id],
  }),
  items: many(orderItem),
}))

export const orderItemRelations = relations(orderItem, ({ one }) => ({
  order: one(order, {
    fields: [orderItem.orderId],
    references: [order.id],
  }),
  product: one(product, {
    fields: [orderItem.productId],
    references: [product.id],
  }),
}))
