import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertTransactionSchema, insertCryptoSchema, insertCurrencySchema, insertPaymentMethodSchema } from "@shared/schema";
import { z } from "zod";

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
      const paymentMethods = ["paypal", "card", "bitcoin", "ethereum"];
      const statuses = ["completed", "pending", "processing", "completed", "completed"];
      const cryptoTypes = ["BTC", "ETH", "USDT", "SOL"];
      
      for (let i = 0; i < 15; i++) {
        // Most people exchange in even numbers (ending in 0 or 5)
        let amount;
        const randomType = Math.random();
        
        if (randomType > 0.1) {
          // 90% chance for smaller amounts ($100 - $1000)
          const bases = [10, 50, 100];
          const base = bases[Math.floor(Math.random() * bases.length)];
          // Generate between 100 and 1000
          amount = (Math.floor(Math.random() * (900 / base)) + Math.ceil(100 / base)) * base;
        } else {
          // 10% chance for larger amounts ($1000 - $3000)
          const bases = [100, 250, 500];
          const base = bases[Math.floor(Math.random() * bases.length)];
          amount = (Math.floor(Math.random() * (2000 / base)) + Math.ceil(1000 / base)) * base;
        }

        const cryptoType = cryptoTypes[Math.floor(Math.random() * cryptoTypes.length)];
        const rate = cryptoType === "BTC" ? 50000 : cryptoType === "ETH" ? 3000 : 1;
        
        await storage.createTransaction({
          amount,
          currency: "USD",
          cryptoAmount: amount / rate,
          cryptoType,
          paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
          status: statuses[Math.floor(Math.random() * statuses.length)],
          email: `user${i + 1}@example.com`,
          walletAddress: `0x${Math.random().toString(16).slice(2, 42)}`,
          isFeatured: Math.random() > 0.8,
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
        await storage.createPaymentMethod({ name: "Bitcoin", key: "bitcoin", description: "Crypto payment", isActive: true, sortOrder: 3 });
        await storage.createPaymentMethod({ name: "Ethereum", key: "ethereum", description: "ETH payment", isActive: true, sortOrder: 4 });
      }

      res.json({ message: "Seed data created successfully" });
    } catch (error) {
      console.error("Seed error:", error);
      res.status(500).json({ error: "Failed to seed data" });
    }
  });

  return httpServer;
}
