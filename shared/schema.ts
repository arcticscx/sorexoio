import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false),
});

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  amount: real("amount").notNull(),
  currency: text("currency").notNull().default("USD"),
  cryptoAmount: real("crypto_amount"),
  cryptoType: text("crypto_type"),
  paymentMethod: text("payment_method").notNull(),
  status: text("status").notNull().default("pending"),
  email: text("email"),
  walletAddress: text("wallet_address"),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const cryptos = pgTable("cryptos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  symbol: text("symbol").notNull().unique(),
  icon: text("icon"),
  coingeckoId: text("coingecko_id"),
  walletAddress: text("wallet_address"),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
});

export const currencies = pgTable("currencies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  symbol: text("symbol").notNull().unique(),
  icon: text("icon"),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
});

export const settings = pgTable("settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
});

export const paymentMethods = pgTable("payment_methods", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  key: text("key").notNull().unique(),
  icon: text("icon"),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
});

export const transactionsRelations = relations(transactions, ({ }) => ({}));
export const cryptosRelations = relations(cryptos, ({ }) => ({}));
export const currenciesRelations = relations(currencies, ({ }) => ({}));
export const settingsRelations = relations(settings, ({ }) => ({}));
export const usersRelations = relations(users, ({ }) => ({}));
export const paymentMethodsRelations = relations(paymentMethods, ({ }) => ({}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
});

export const insertCryptoSchema = createInsertSchema(cryptos).omit({
  id: true,
});

export const insertCurrencySchema = createInsertSchema(currencies).omit({
  id: true,
});

export const insertSettingSchema = createInsertSchema(settings).omit({
  id: true,
});

export const insertPaymentMethodSchema = createInsertSchema(paymentMethods).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;

export type InsertCrypto = z.infer<typeof insertCryptoSchema>;
export type Crypto = typeof cryptos.$inferSelect;

export type InsertCurrency = z.infer<typeof insertCurrencySchema>;
export type Currency = typeof currencies.$inferSelect;

export type InsertSetting = z.infer<typeof insertSettingSchema>;
export type Setting = typeof settings.$inferSelect;

export type InsertPaymentMethod = z.infer<typeof insertPaymentMethodSchema>;
export type PaymentMethod = typeof paymentMethods.$inferSelect;
