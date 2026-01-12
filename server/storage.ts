import { 
  users, type User, type InsertUser,
  transactions, type Transaction, type InsertTransaction,
  cryptos, type Crypto, type InsertCrypto,
  currencies, type Currency, type InsertCurrency,
  settings, type Setting, type InsertSetting,
  paymentMethods, type PaymentMethod, type InsertPaymentMethod,
  swapWallets, type SwapWallet, type InsertSwapWallet
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getTransactions(): Promise<Transaction[]>;
  getTransaction(id: string): Promise<Transaction | undefined>;
  getTransactionByReferenceId(referenceId: string): Promise<Transaction | undefined>;
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
  
  getPaymentMethods(): Promise<PaymentMethod[]>;
  getPaymentMethod(id: string): Promise<PaymentMethod | undefined>;
  getPaymentMethodByKey(key: string): Promise<PaymentMethod | undefined>;
  createPaymentMethod(paymentMethod: InsertPaymentMethod): Promise<PaymentMethod>;
  updatePaymentMethod(id: string, data: Partial<InsertPaymentMethod>): Promise<PaymentMethod | undefined>;
  deletePaymentMethod(id: string): Promise<boolean>;

  getSwapWallets(): Promise<SwapWallet[]>;
  getSwapWallet(id: string): Promise<SwapWallet | undefined>;
  getSwapWalletBySymbol(symbol: string): Promise<SwapWallet | undefined>;
  createSwapWallet(wallet: InsertSwapWallet): Promise<SwapWallet>;
  updateSwapWallet(id: string, data: Partial<InsertSwapWallet>): Promise<SwapWallet | undefined>;
  deleteSwapWallet(id: string): Promise<boolean>;
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

  async getTransactionByReferenceId(referenceId: string): Promise<Transaction | undefined> {
    const [transaction] = await db.select().from(transactions).where(eq(transactions.referenceId, referenceId));
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

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    return db.select().from(paymentMethods).orderBy(paymentMethods.sortOrder);
  }

  async getPaymentMethod(id: string): Promise<PaymentMethod | undefined> {
    const [method] = await db.select().from(paymentMethods).where(eq(paymentMethods.id, id));
    return method || undefined;
  }

  async getPaymentMethodByKey(key: string): Promise<PaymentMethod | undefined> {
    const [method] = await db.select().from(paymentMethods).where(eq(paymentMethods.key, key));
    return method || undefined;
  }

  async createPaymentMethod(paymentMethod: InsertPaymentMethod): Promise<PaymentMethod> {
    const [created] = await db.insert(paymentMethods).values(paymentMethod).returning();
    return created;
  }

  async updatePaymentMethod(id: string, data: Partial<InsertPaymentMethod>): Promise<PaymentMethod | undefined> {
    const [updated] = await db.update(paymentMethods).set(data).where(eq(paymentMethods.id, id)).returning();
    return updated || undefined;
  }

  async deletePaymentMethod(id: string): Promise<boolean> {
    const result = await db.delete(paymentMethods).where(eq(paymentMethods.id, id)).returning();
    return result.length > 0;
  }

  async getSwapWallets(): Promise<SwapWallet[]> {
    return db.select().from(swapWallets);
  }

  async getSwapWallet(id: string): Promise<SwapWallet | undefined> {
    const [wallet] = await db.select().from(swapWallets).where(eq(swapWallets.id, id));
    return wallet || undefined;
  }

  async getSwapWalletBySymbol(symbol: string): Promise<SwapWallet | undefined> {
    const [wallet] = await db.select().from(swapWallets).where(eq(swapWallets.cryptoSymbol, symbol));
    return wallet || undefined;
  }

  async createSwapWallet(wallet: InsertSwapWallet): Promise<SwapWallet> {
    const [created] = await db.insert(swapWallets).values(wallet).returning();
    return created;
  }

  async updateSwapWallet(id: string, data: Partial<InsertSwapWallet>): Promise<SwapWallet | undefined> {
    const [updated] = await db.update(swapWallets).set(data).where(eq(swapWallets.id, id)).returning();
    return updated || undefined;
  }

  async deleteSwapWallet(id: string): Promise<boolean> {
    const result = await db.delete(swapWallets).where(eq(swapWallets.id, id)).returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
