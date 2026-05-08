import {
  pgTable,
  serial,
  varchar,
  text,
  boolean,
  timestamp,
  integer,
  pgEnum,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// ---- Enums ----

export const categoryTypeEnum = pgEnum("category_type", [
  "image_generation",
  "music_generation",
  "ai_coding",
  "chat",
  "relay_station",
  "ai_tools",
  "other",
])

export const userRoleEnum = pgEnum("user_role", ["user", "admin"])

// ---- Tables ----

export const regions = pgTable("regions", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  slug: varchar("slug", { length: 50 }).notNull().unique(),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
})

export const categories = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    regionId: integer("region_id")
      .notNull()
      .references(() => regions.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull(),
    type: categoryTypeEnum("type").notNull(),
    icon: varchar("icon", { length: 255 }),
    sortOrder: integer("sort_order").default(0),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [uniqueIndex("categories_region_slug_idx").on(t.regionId, t.slug)]
)

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  phone: varchar("phone", { length: 20 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }),
  nickname: varchar("nickname", { length: 100 }),
  avatarUrl: varchar("avatar_url", { length: 500 }),
  role: userRoleEnum("role").default("user"),
  isActive: boolean("is_active").default(true),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
})

export const tools = pgTable(
  "tools",
  {
    id: serial("id").primaryKey(),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 200 }).notNull(),
    slug: varchar("slug", { length: 200 }).notNull().unique(),
    description: text("description"),
    url: varchar("url", { length: 500 }).notNull(),
    logoUrl: text("logo_url"),
    pricingInfo: text("pricing_info"),
    company: varchar("company", { length: 200 }),
    tags: text("tags").array(),
    isActive: boolean("is_active").default(true),
    isFeatured: boolean("is_featured").default(false),
    viewCount: integer("view_count").default(0),
    sortOrder: integer("sort_order").default(0),
    createdBy: integer("created_by").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [
    index("tools_category_idx").on(t.categoryId),
    index("tools_active_idx").on(t.isActive),
  ]
)

export const smsCodes = pgTable(
  "sms_codes",
  {
    id: serial("id").primaryKey(),
    phone: varchar("phone", { length: 20 }).notNull(),
    code: varchar("code", { length: 10 }).notNull(),
    isUsed: boolean("is_used").default(false),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [index("sms_codes_phone_idx").on(t.phone)]
)

export const favorites = pgTable(
  "favorites",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    toolId: integer("tool_id")
      .notNull()
      .references(() => tools.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [uniqueIndex("favorites_user_tool_idx").on(t.userId, t.toolId)]
)

export const frequentTools = pgTable(
  "frequent_tools",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    toolId: integer("tool_id")
      .notNull()
      .references(() => tools.id, { onDelete: "cascade" }),
    useCount: integer("use_count").default(1),
    lastUsedAt: timestamp("last_used_at").defaultNow(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [uniqueIndex("frequent_tools_user_tool_idx").on(t.userId, t.toolId)]
)

export const customLinks = pgTable(
  "custom_links",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 100 }).notNull(),
    url: varchar("url", { length: 500 }).notNull(),
    sortOrder: integer("sort_order").default(0),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [index("custom_links_user_idx").on(t.userId)]
)

// ---- Relations ----

export const regionsRelations = relations(regions, ({ many }) => ({
  categories: many(categories),
}))

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  region: one(regions, { fields: [categories.regionId], references: [regions.id] }),
  tools: many(tools),
}))

export const toolsRelations = relations(tools, ({ one, many }) => ({
  category: one(categories, { fields: [tools.categoryId], references: [categories.id] }),
  favorites: many(favorites),
  frequentTools: many(frequentTools),
}))

export const usersRelations = relations(users, ({ many }) => ({
  favorites: many(favorites),
  frequentTools: many(frequentTools),
  customLinks: many(customLinks),
}))

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, { fields: [favorites.userId], references: [users.id] }),
  tool: one(tools, { fields: [favorites.toolId], references: [tools.id] }),
}))

export const frequentToolsRelations = relations(frequentTools, ({ one }) => ({
  user: one(users, { fields: [frequentTools.userId], references: [users.id] }),
  tool: one(tools, { fields: [frequentTools.toolId], references: [tools.id] }),
}))

export const customLinksRelations = relations(customLinks, ({ one }) => ({
  user: one(users, { fields: [customLinks.userId], references: [users.id] }),
}))

