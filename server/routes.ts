import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertTransactionSchema, insertCryptoSchema, insertCurrencySchema, insertPaymentMethodSchema, insertSwapWalletSchema } from "@shared/schema";
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

  // Dynamic sitemap.xml with accurate priorities and lastmod
  const seoPages = [
    { path: "/", priority: 1.0, changefreq: "daily" },
    { path: "/exchange", priority: 0.9, changefreq: "daily" },
    { path: "/swap", priority: 0.9, changefreq: "daily" },
    { path: "/buy-crypto-with-paypal", priority: 0.95, changefreq: "weekly" },
    { path: "/card-to-crypto", priority: 0.95, changefreq: "weekly" },
    { path: "/crypto-swap", priority: 0.85, changefreq: "weekly" },
    { path: "/no-kyc-crypto", priority: 0.95, changefreq: "weekly" },
    { path: "/supported-coins", priority: 0.7, changefreq: "weekly" },
    { path: "/fees", priority: 0.6, changefreq: "weekly" },
    { path: "/faq", priority: 0.5, changefreq: "monthly" },
    { path: "/sitemap", priority: 0.3, changefreq: "monthly" }
  ];

  app.get("/sitemap.xml", (_req, res) => {
    const baseUrl = "https://zengoswap.com";
    const lastmod = new Date().toISOString().split("T")[0];
    
    const urls = seoPages.map(page => `
  <url>
    <loc>${baseUrl}${page.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority.toFixed(1)}</priority>
  </url>`).join("");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">${urls}
</urlset>`;

    res.header("Content-Type", "application/xml");
    res.header("Cache-Control", "public, max-age=3600");
    res.send(sitemap);
  });

  // robots.txt with sitemap reference
  app.get("/robots.txt", (_req, res) => {
    const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://zengoswap.com/sitemap.xml

# ZengoSwap Crypto Exchange
# Buy crypto with PayPal and Card - No KYC required
`;
    res.header("Content-Type", "text/plain");
    res.send(robotsTxt);
  });

  // Cache for crypto prices (5 minute TTL)
  let priceCache: { prices: Record<string, number>; timestamp: number } | null = null;
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  app.get("/api/prices", async (_req, res) => {
    try {
      // Check cache
      if (priceCache && Date.now() - priceCache.timestamp < CACHE_TTL) {
        return res.json(priceCache.prices);
      }

      // Fetch live prices from CoinGecko for all supported cryptos
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,tether,litecoin,ripple,binancecoin,bitcoin-cash,usd-coin,tron&vs_currencies=usd"
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch prices from CoinGecko");
      }

      const data = await response.json();
      
      const prices: Record<string, number> = {
        BTC: data.bitcoin?.usd || 97000,
        ETH: data.ethereum?.usd || 3300,
        SOL: data.solana?.usd || 180,
        USDT: data.tether?.usd || 1,
        LTC: data.litecoin?.usd || 100,
        XRP: data.ripple?.usd || 2.5,
        BNB: data.binancecoin?.usd || 600,
        BCH: data["bitcoin-cash"]?.usd || 400,
        USDC: data["usd-coin"]?.usd || 1,
        TRX: data.tron?.usd || 0.25,
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
        SOL: 180,
        USDT: 1,
        LTC: 100,
        XRP: 2.5,
        BNB: 600,
        BCH: 400,
        USDC: 1,
        TRX: 0.25,
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

  app.get("/api/transactions/verify/:referenceId", async (req, res) => {
    try {
      const transaction = await storage.getTransactionByReferenceId(req.params.referenceId);
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transaction" });
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
      // Check for duplicate referenceId (unique constraint violation)
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('duplicate key') || errorMessage.includes('unique constraint')) {
        return res.status(409).json({ error: "Transaction with this reference ID already exists" });
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

  app.get("/api/swap-wallets", async (_req, res) => {
    try {
      const wallets = await storage.getSwapWallets();
      res.json(wallets);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch swap wallets" });
    }
  });

  app.get("/api/swap-wallets/:symbol", async (req, res) => {
    try {
      const wallet = await storage.getSwapWalletBySymbol(req.params.symbol.toUpperCase());
      if (!wallet) {
        return res.status(404).json({ error: "Swap wallet not found" });
      }
      res.json(wallet);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch swap wallet" });
    }
  });

  app.post("/api/swap-wallets", async (req, res) => {
    try {
      const data = insertSwapWalletSchema.parse(req.body);
      const wallet = await storage.createSwapWallet(data);
      res.status(201).json(wallet);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid swap wallet data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create swap wallet" });
    }
  });

  app.patch("/api/swap-wallets/:id", async (req, res) => {
    try {
      const wallet = await storage.updateSwapWallet(req.params.id, req.body);
      if (!wallet) {
        return res.status(404).json({ error: "Swap wallet not found" });
      }
      res.json(wallet);
    } catch (error) {
      res.status(500).json({ error: "Failed to update swap wallet" });
    }
  });

  app.delete("/api/swap-wallets/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteSwapWallet(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Swap wallet not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete swap wallet" });
    }
  });

  // Sell order validation schema
  const sellOrderSchema = z.object({
    cryptoType: z.string().min(1, "Crypto type is required"),
    cryptoAmount: z.number().positive("Amount must be positive"),
    payoutMethod: z.string().min(1, "Payout method is required"),
    paypalEmail: z.string().email().optional().nullable(),
    venmoUsername: z.string().optional().nullable(),
    applePayPhone: z.string().min(10).optional().nullable(),
    giftCardType: z.string().optional().nullable(),
    giftCardEmail: z.string().email().optional().nullable(),
    cashTag: z.string().optional().nullable(),
    bankName: z.string().optional().nullable(),
    accountHolder: z.string().optional().nullable(),
    routingNumber: z.string().regex(/^\d{9}$/, "Routing number must be 9 digits").optional().nullable(),
    accountNumber: z.string().regex(/^\d{8,17}$/, "Account number must be 8-17 digits").optional().nullable(),
    iban: z.string().optional().nullable(),
    bankType: z.enum(["us", "iban"]).optional().nullable(),
    revolutTag: z.string().optional().nullable(),
    wiseEmail: z.string().email().optional().nullable(),
    referenceId: z.string().optional(),
  });

  // Create sell order endpoint
  app.post("/api/sell-orders", async (req, res) => {
    try {
      const parsed = sellOrderSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid sell order data", details: parsed.error.errors });
      }

      const data = parsed.data;
      
      // Validate payout details based on method
      if (data.payoutMethod === "paypal" && !data.paypalEmail) {
        return res.status(400).json({ error: "PayPal email is required" });
      }
      if (data.payoutMethod === "applepay" && !data.applePayPhone) {
        return res.status(400).json({ error: "Apple Pay phone number is required" });
      }
      if (data.payoutMethod === "giftcards" && (!data.giftCardType || !data.giftCardEmail)) {
        return res.status(400).json({ error: "Gift card type and email are required" });
      }
      if (data.payoutMethod === "cashapp" && !data.cashTag) {
        return res.status(400).json({ error: "Cash App $cashtag is required" });
      }
      if (data.payoutMethod === "bank") {
        if (!data.accountHolder) {
          return res.status(400).json({ error: "Account holder name is required" });
        }
        if (data.bankType === "iban") {
          if (!data.iban) {
            return res.status(400).json({ error: "IBAN is required" });
          }
        } else {
          if (!data.bankName || !data.routingNumber || !data.accountNumber) {
            return res.status(400).json({ error: "All US bank details are required (bank name, routing number, account number)" });
          }
        }
      }
      if (data.payoutMethod === "venmo" && !data.venmoUsername) {
        return res.status(400).json({ error: "Venmo username is required" });
      }
      if (data.payoutMethod === "revolut" && !data.revolutTag) {
        return res.status(400).json({ error: "Revolut @tag is required" });
      }
      if (data.payoutMethod === "wise" && !data.wiseEmail) {
        return res.status(400).json({ error: "Wise email is required" });
      }

      // Get the platform wallet address for this crypto
      const swapWallet = await storage.getSwapWalletBySymbol(data.cryptoType.toUpperCase());
      
      // Build payout details string
      let payoutDetails = "";
      if (data.payoutMethod === "paypal") payoutDetails = data.paypalEmail || "";
      else if (data.payoutMethod === "applepay") payoutDetails = data.applePayPhone || "";
      else if (data.payoutMethod === "giftcards") payoutDetails = `${data.giftCardType}: ${data.giftCardEmail}`;
      else if (data.payoutMethod === "cashapp") payoutDetails = data.cashTag || "";
      else if (data.payoutMethod === "bank") {
        if (data.bankType === "iban") {
          payoutDetails = `IBAN: ${data.iban} - ${data.accountHolder}`;
        } else {
          payoutDetails = `${data.bankName} - ${data.accountHolder} - ****${data.accountNumber?.slice(-4)}`;
        }
      }
      else if (data.payoutMethod === "venmo") payoutDetails = `@${data.venmoUsername}`;
      else if (data.payoutMethod === "revolut") payoutDetails = `@${data.revolutTag}`;
      else if (data.payoutMethod === "wise") payoutDetails = data.wiseEmail || "";

      // Create transaction record for the sell order
      const transaction = await storage.createTransaction({
        referenceId: data.referenceId || `SELL-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        amount: 0, // Will be calculated based on crypto value
        currency: "USD",
        cryptoAmount: data.cryptoAmount,
        cryptoType: data.cryptoType,
        paymentMethod: `sell_${data.payoutMethod}`,
        status: "pending",
        email: data.paypalEmail || data.giftCardEmail || null,
        walletAddress: payoutDetails, // Store payout details in wallet address field
      });

      broadcastTransaction(transaction);

      res.status(201).json({
        success: true,
        transactionId: transaction.id,
        referenceId: transaction.referenceId,
        walletAddress: swapWallet?.walletAddress || null,
        cryptoType: data.cryptoType,
        message: swapWallet?.walletAddress 
          ? `Send your ${data.cryptoType} to the provided wallet address`
          : "Wallet address will be provided after review",
      });
    } catch (error) {
      console.error("Sell order error:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('duplicate key') || errorMessage.includes('unique constraint')) {
        return res.status(409).json({ error: "A sell order with this reference already exists" });
      }
      res.status(500).json({ error: "Failed to create sell order" });
    }
  });

  // SumUp checkout validation schema
  const sumupCheckoutSchema = z.object({
    amount: z.union([z.string(), z.number()]).transform(val => parseFloat(String(val))),
    currency: z.string().min(3).max(3),
    description: z.string().optional(),
    referenceId: z.string().optional()
  });

  // SumUp checkout endpoint
  app.post("/api/sumup/checkout", async (req, res) => {
    try {
      const parsed = sumupCheckoutSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid request data", details: parsed.error.errors });
      }

      const { amount, currency, description, referenceId } = parsed.data;

      const apiKey = process.env.SUMUP_API_KEY;
      const merchantCode = process.env.SUMUP_MERCHANT_CODE;
      // SumUp requires merchant's country currency - default to GBP
      const merchantCurrency = process.env.SUMUP_CURRENCY || 'GBP';

      if (!apiKey || !merchantCode) {
        return res.status(500).json({ error: "SumUp not configured" });
      }

      // Convert amount to merchant currency if needed (approximate rates)
      let finalAmount = amount;
      const inputCurrency = currency.toUpperCase();
      if (inputCurrency !== merchantCurrency) {
        // Simple conversion rates (USD/EUR/GBP)
        const rates: Record<string, Record<string, number>> = {
          'USD': { 'EUR': 0.92, 'GBP': 0.79 },
          'EUR': { 'USD': 1.09, 'GBP': 0.86 },
          'GBP': { 'USD': 1.27, 'EUR': 1.16 }
        };
        const rate = rates[inputCurrency]?.[merchantCurrency] || 1;
        finalAmount = Math.round(amount * rate * 100) / 100;
      }

      // Create checkout via SumUp API
      const response = await fetch('https://api.sumup.com/v0.1/checkouts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          checkout_reference: referenceId || `ZEN-${Date.now()}`,
          amount: finalAmount,
          currency: merchantCurrency,
          merchant_code: merchantCode,
          description: description || 'ZengoSwap Exchange',
          redirect_url: `${req.protocol}://${req.get('host')}/exchange?status=success`
        })
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('SumUp checkout error:', errorBody);
        return res.status(500).json({ error: "Failed to create SumUp checkout" });
      }

      const checkout = await response.json();
      res.json({ checkoutId: checkout.id, checkout });
    } catch (error) {
      console.error('SumUp checkout error:', error);
      res.status(500).json({ error: "Failed to create SumUp checkout" });
    }
  });

  // Get SumUp checkout status
  app.get("/api/sumup/checkout/:id", async (req, res) => {
    try {
      const apiKey = process.env.SUMUP_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: "SumUp not configured" });
      }

      const response = await fetch(`https://api.sumup.com/v0.1/checkouts/${req.params.id}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });

      if (!response.ok) {
        return res.status(404).json({ error: "Checkout not found" });
      }

      const checkout = await response.json();
      res.json(checkout);
    } catch (error) {
      res.status(500).json({ error: "Failed to get checkout status" });
    }
  });

  // Verify SumUp payment and confirm it was successful
  app.post("/api/sumup/verify", async (req, res) => {
    try {
      const { checkoutId } = req.body;
      
      if (!checkoutId) {
        return res.status(400).json({ error: "Checkout ID is required" });
      }

      const apiKey = process.env.SUMUP_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: "SumUp not configured" });
      }

      // Verify checkout status with SumUp API
      const response = await fetch(`https://api.sumup.com/v0.1/checkouts/${checkoutId}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });

      if (!response.ok) {
        return res.status(404).json({ error: "Checkout not found", verified: false });
      }

      const checkout = await response.json();
      
      // Only return verified: true if payment was actually completed
      const isPaid = checkout.status === 'PAID';
      
      res.json({ 
        verified: isPaid, 
        status: checkout.status,
        amount: checkout.amount,
        currency: checkout.currency,
        reference: checkout.checkout_reference
      });
    } catch (error) {
      console.error('SumUp verify error:', error);
      res.status(500).json({ error: "Failed to verify payment", verified: false });
    }
  });

  // Generate payment link securely (credentials stored server-side)
  app.post("/api/payment-link", (req, res) => {
    try {
      const { amount, email } = req.body;
      
      if (!amount || !email) {
        return res.status(400).json({ error: "Amount and email are required" });
      }

      const merchantId = process.env.PAYMENTIQ_MERCHANT_ID;
      const userId = process.env.PAYMENTIQ_USER_ID;
      const sessionId = process.env.PAYMENTIQ_SESSION_ID;

      if (!merchantId || !userId || !sessionId) {
        return res.status(500).json({ error: "Payment gateway not configured" });
      }

      const baseUrl = "https://checkout.paymentiq.io/cashier/master/payment-method";
      
      const queryParams = new URLSearchParams({
        merchantId,
        userId,
        sessionId,
        environment: "production",
        amount: String(amount),
        method: "deposit",
        locale: "en",
        mode: "ecommerce",
        scrollToOffset: "8",
        allowMobilePopup: "true",
        showHeader: "false",
        showFooter: "false",
        showAccounts: "inline",
        providerType: "creditcard",
        fixedProviderType: "true",
        containerWidth: "360px",
        logoSize: "100%",
        theme_input_color: "#FFF",
        theme_inputbackground_color: "#1C2028",
        theme_labels_color: "#FFF",
        theme_headings_color: "#FFF",
        theme_loader_color: "#29b355",
        theme_buttons_color: "#00a15b",
        theme_cardbackground_color: "#20232B",
        theme_background_color: "#20232B",
        theme_cashierbackground_color: "#20232B",
        theme_headerbackground_color: "#20232b",
        "attributes.payer_type": "user",
        "attributes.country": "MA",
        "attributes.playerRouting": "payment_iq",
        "attributes.trusted_deposit_count": "0",
        "attributes.hostUri": "https://api.hellcase.com",
        "user.email": email,
        "attributes.bootstrapVersion": "1.4.4"
      });

      res.json({ url: `${baseUrl}?${queryParams.toString()}` });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate payment link" });
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
