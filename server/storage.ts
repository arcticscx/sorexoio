import { 
  users, type User, type InsertUser,
  transactions, type Transaction, type InsertTransaction,
  cryptos, type Crypto, type InsertCrypto,
  currencies, type Currency, type InsertCurrency,
  settings, type Setting, type InsertSetting
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getTransactions(): Promise<Transaction[]>;
  getTransaction(id: string): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: string, data: Partial<InsertTransaction>): Promise<Transaction | undefined>;
  deleteTransaction(id: string): Promise<boolean>;
  
  getCryptos(): Promise<Crypto[]>;
  getCrypto(id: string): Promise<Crypto | undefined>;
  createCrypto(crypto: InsertCrypto): Promise<Crypto>;
  updateCrypto(id: string, data: Partial<InsertCrypto>): Promise<Crypto | undefined>;
  deleteCrypto(id: string): Promise<boolean>;
  
  getCurrencies(): Promise<Currency[]>;
  getCurrency(id: string): Promise<Currency | undefined>;
  createCurrency(currency: InsertCurrency): Promise<Currency>;
  updateCurrency(id: string, data: Partial<InsertCurrency>): Promise<Currency | undefined>;
  deleteCurrency(id: string): Promise<boolean>;
  
  getSettings(): Promise<Setting[]>;
  getSetting(key: string): Promise<Setting | undefined>;
  upsertSetting(key: string, value: string): Promise<Setting>;
  deleteSetting(key: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getTransactions(): Promise<Transaction[]> {
    return db.select().from(transactions).orderBy(desc(transactions.createdAt));
  }

  async getTransaction(id: string): Promise<Transaction | undefined> {
    const [transaction] = await db.select().from(transactions).where(eq(transactions.id, id));
    return transaction || undefined;
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [created] = await db.insert(transactions).values(transaction).returning();
    return created;
  }

  async updateTransaction(id: string, data: Partial<InsertTransaction>): Promise<Transaction | undefined> {
    const [updated] = await db.update(transactions).set(data).where(eq(transactions.id, id)).returning();
    return updated || undefined;
  }

  async deleteTransaction(id: string): Promise<boolean> {
    const result = await db.delete(transactions).where(eq(transactions.id, id)).returning();
    return result.length > 0;
  }

  async getCryptos(): Promise<Crypto[]> {
    return db.select().from(cryptos).orderBy(cryptos.sortOrder);
  }

  async getCrypto(id: string): Promise<Crypto | undefined> {
    const [crypto] = await db.select().from(cryptos).where(eq(cryptos.id, id));
    return crypto || undefined;
  }

  async createCrypto(crypto: InsertCrypto): Promise<Crypto> {
    const [created] = await db.insert(cryptos).values(crypto).returning();
    return created;
  }

  async updateCrypto(id: string, data: Partial<InsertCrypto>): Promise<Crypto | undefined> {
    const [updated] = await db.update(cryptos).set(data).where(eq(cryptos.id, id)).returning();
    return updated || undefined;
  }

  async deleteCrypto(id: string): Promise<boolean> {
    const result = await db.delete(cryptos).where(eq(cryptos.id, id)).returning();
    return result.length > 0;
  }

  async getCurrencies(): Promise<Currency[]> {
    return db.select().from(currencies).orderBy(currencies.sortOrder);
  }

  async getCurrency(id: string): Promise<Currency | undefined> {
    const [currency] = await db.select().from(currencies).where(eq(currencies.id, id));
    return currency || undefined;
  }

  async createCurrency(currency: InsertCurrency): Promise<Currency> {
    const [created] = await db.insert(currencies).values(currency).returning();
    return created;
  }

  async updateCurrency(id: string, data: Partial<InsertCurrency>): Promise<Currency | undefined> {
    const [updated] = await db.update(currencies).set(data).where(eq(currencies.id, id)).returning();
    return updated || undefined;
  }

  async deleteCurrency(id: string): Promise<boolean> {
    const result = await db.delete(currencies).where(eq(currencies.id, id)).returning();
    return result.length > 0;
  }

  async getSettings(): Promise<Setting[]> {
    return db.select().from(settings);
  }

  async getSetting(key: string): Promise<Setting | undefined> {
    const [setting] = await db.select().from(settings).where(eq(settings.key, key));
    return setting || undefined;
  }

  async upsertSetting(key: string, value: string): Promise<Setting> {
    const existing = await this.getSetting(key);
    if (existing) {
      const [updated] = await db.update(settings).set({ value }).where(eq(settings.key, key)).returning();
      return updated;
    }
    const [created] = await db.insert(settings).values({ key, value }).returning();
    return created;
  }

  async deleteSetting(key: string): Promise<boolean> {
    const result = await db.delete(settings).where(eq(settings.key, key)).returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
