import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertTransactionSchema, insertCryptoSchema, insertCurrencySchema, insertPaymentMethodSchema } from "@shared/schema";
import { z } from "zod";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";

const clients = new Set<WebSocket>();

function broadcastTransaction(transaction: any) {
  const message = JSON.stringify({ type: "transaction", data: transaction });
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  wss.on("connection", (ws) => {
    clients.add(ws);
    
    ws.on("close", () => {
      clients.delete(ws);
    });

    ws.on("error", () => {
      clients.delete(ws);
    });
  });

  // Register object storage routes for file uploads
  registerObjectStorageRoutes(app);

  // Cache for crypto prices (5 minute TTL)
  let priceCache: { prices: Record<string, number>; timestamp: number } | null = null;
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  app.get("/api/prices", async (_req, res) => {
    try {
      // Check cache
      if (priceCache && Date.now() - priceCache.timestamp < CACHE_TTL) {
        return res.json(priceCache.prices);
      }

      // Fetch live prices from CoinGecko
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,tether&vs_currencies=usd"
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch prices from CoinGecko");
      }

      const data = await response.json();
      
      const prices: Record<string, number> = {
        BTC: data.bitcoin?.usd || 97000,
        ETH: data.ethereum?.usd || 3300,
        SOL: data.solana?.usd || 140,
        USDT: data.tether?.usd || 1,
      };

      // Update cache
      priceCache = { prices, timestamp: Date.now() };

      res.json(prices);
    } catch (error) {
      console.error("Price fetch error:", error);
      // Return fallback prices if API fails
      res.json({
        BTC: 97000,
        ETH: 3300,
        SOL: 140,
        USDT: 1,
      });
    }
  });

  app.get("/api/transactions", async (_req, res) => {
    try {
      const transactions = await storage.getTransactions();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  app.get("/api/transactions/:id", async (req, res) => {
    try {
      const transaction = await storage.getTransaction(req.params.id);
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transaction" });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const data = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(data);
      broadcastTransaction(transaction);
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid transaction data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create transaction" });
    }
  });

  app.patch("/api/transactions/:id", async (req, res) => {
    try {
      const transaction = await storage.updateTransaction(req.params.id, req.body);
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      broadcastTransaction(transaction);
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ error: "Failed to update transaction" });
    }
  });

  app.delete("/api/transactions/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteTransaction(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete transaction" });
    }
  });

  app.get("/api/cryptos", async (_req, res) => {
    try {
      const cryptos = await storage.getCryptos();
      res.json(cryptos);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cryptos" });
    }
  });

  app.post("/api/cryptos", async (req, res) => {
    try {
      const data = insertCryptoSchema.parse(req.body);
      const crypto = await storage.createCrypto(data);
      res.status(201).json(crypto);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid crypto data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create crypto" });
    }
  });

  app.patch("/api/cryptos/:id", async (req, res) => {
    try {
      const crypto = await storage.updateCrypto(req.params.id, req.body);
      if (!crypto) {
        return res.status(404).json({ error: "Crypto not found" });
      }
      res.json(crypto);
    } catch (error) {
      res.status(500).json({ error: "Failed to update crypto" });
    }
  });

  app.delete("/api/cryptos/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteCrypto(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Crypto not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete crypto" });
    }
  });

  app.get("/api/currencies", async (_req, res) => {
    try {
      const currencies = await storage.getCurrencies();
      res.json(currencies);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch currencies" });
    }
  });

  app.post("/api/currencies", async (req, res) => {
    try {
      const data = insertCurrencySchema.parse(req.body);
      const currency = await storage.createCurrency(data);
      res.status(201).json(currency);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid currency data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create currency" });
    }
  });

  app.delete("/api/currencies/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteCurrency(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Currency not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete currency" });
    }
  });

  app.get("/api/settings", async (_req, res) => {
    try {
      const settings = await storage.getSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.post("/api/settings", async (req, res) => {
    try {
      const { key, value } = req.body;
      if (!key || value === undefined) {
        return res.status(400).json({ error: "Key and value are required" });
      }
      const setting = await storage.upsertSetting(key, value);
      res.json(setting);
    } catch (error) {
      res.status(500).json({ error: "Failed to update setting" });
    }
  });

  app.get("/api/payment-methods", async (_req, res) => {
    try {
      const methods = await storage.getPaymentMethods();
      res.json(methods);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch payment methods" });
    }
  });

  app.post("/api/payment-methods", async (req, res) => {
    try {
      const data = insertPaymentMethodSchema.parse(req.body);
      const method = await storage.createPaymentMethod(data);
      res.status(201).json(method);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid payment method data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create payment method" });
    }
  });

  app.patch("/api/payment-methods/:id", async (req, res) => {
    try {
      const method = await storage.updatePaymentMethod(req.params.id, req.body);
      if (!method) {
        return res.status(404).json({ error: "Payment method not found" });
      }
      res.json(method);
    } catch (error) {
      res.status(500).json({ error: "Failed to update payment method" });
    }
  });

  app.delete("/api/payment-methods/:id", async (req, res) => {
    try {
      const deleted = await storage.deletePaymentMethod(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Payment method not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete payment method" });
    }
  });

  app.post("/api/seed", async (_req, res) => {
    try {
      const paymentMethods = ["paypal", "card"];
      const statuses = ["completed", "completed", "completed", "completed", "completed"];
      const cryptoTypes = ["BTC", "ETH", "USDT", "SOL"];
      
      // Amounts ending in 5 or 0 between $100-$1000
      const possibleAmounts = [
        150, 200, 250, 300, 350, 400, 450, 500, 
        550, 600, 650, 700, 755, 800, 850, 900, 955, 1000,
        105, 155, 205, 255, 305, 355, 405, 455, 505, 555, 
        605, 655, 705, 750, 805, 855, 905, 950
      ];
      
      for (let i = 0; i < 8; i++) {
        // Pick random amount ending in 5 or 0
        const amount = possibleAmounts[Math.floor(Math.random() * possibleAmounts.length)];

        const cryptoType = cryptoTypes[Math.floor(Math.random() * cryptoTypes.length)];
        // Fixed rates: BTC ~97k, ETH ~3.3k, SOL ~140, USDT = 1
        const rate = cryptoType === "BTC" ? 97000 : cryptoType === "ETH" ? 3300 : cryptoType === "SOL" ? 140 : 1;
        
        // Apply 5% fee - crypto amount is after fee deduction
        const cryptoAmount = (amount * 0.95) / rate;
        
        // Random timestamp within the past 24 hours
        const now = new Date();
        const randomHoursAgo = Math.floor(Math.random() * 24);
        const randomMinutesAgo = Math.floor(Math.random() * 60);
        const createdAt = new Date(now.getTime() - (randomHoursAgo * 60 + randomMinutesAgo) * 60 * 1000);
        
        await storage.createTransaction({
          amount,
          currency: "USD",
          cryptoAmount,
          cryptoType,
          paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
          status: statuses[Math.floor(Math.random() * statuses.length)],
          email: `user${i + 1}@example.com`,
          walletAddress: `0x${Math.random().toString(16).slice(2, 42)}`,
          isFeatured: Math.random() > 0.8,
          createdAt,
        });
      }

      const existingCryptos = await storage.getCryptos();
      if (existingCryptos.length === 0) {
        await storage.createCrypto({ name: "Bitcoin", symbol: "BTC", isActive: true, sortOrder: 1 });
        await storage.createCrypto({ name: "Ethereum", symbol: "ETH", isActive: true, sortOrder: 2 });
        await storage.createCrypto({ name: "Tether", symbol: "USDT", isActive: true, sortOrder: 3 });
        await storage.createCrypto({ name: "Solana", symbol: "SOL", isActive: true, sortOrder: 4 });
      }

      const existingPaymentMethods = await storage.getPaymentMethods();
      if (existingPaymentMethods.length === 0) {
        await storage.createPaymentMethod({ name: "Card", key: "card", description: "0 KYC", isActive: true, sortOrder: 1 });
        await storage.createPaymentMethod({ name: "PayPal", key: "paypal", description: "Fast & secure", isActive: true, sortOrder: 2 });
      }

      res.json({ message: "Seed data created successfully" });
    } catch (error) {
      console.error("Seed error:", error);
      res.status(500).json({ error: "Failed to seed data" });
    }
  });

  return httpServer;
}
