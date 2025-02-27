import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: integer("price").notNull(), // Price in Euro cents
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  isReserved: boolean("is_reserved").default(false),
  shippingAvailable: boolean("shipping_available").default(true),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  productId: integer("product_id").notNull(),
});

export const insertFavoriteSchema = createInsertSchema(favorites).omit({
  id: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;

// Product Schema for API responses with formatted price
export const productResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(), // in cents
  formattedPrice: z.string(), // formatted as €XX
  description: z.string().optional(),
  imageUrl: z.string(),
  isReserved: z.boolean().default(false),
  shippingAvailable: z.boolean().default(true),
  isFavorited: z.boolean().default(false),
  likesCount: z.number().default(0)
});

export type ProductResponse = z.infer<typeof productResponseSchema>;
