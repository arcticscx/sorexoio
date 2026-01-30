import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { spawn } from "child_process";
import path from "path";
import { db } from "./db";
import { cryptos, paymentMethods, currencies, swapWallets } from "@shared/schema";

const app = express();

// Fix ALL corrupted database tables on startup - complete reset
async function fixCorruptedData() {
  console.log('[DATA FIX] Starting database fix...');
  console.log('[DATA FIX] Environment:', process.env.NODE_ENV || 'unknown');
  
  // Correct data for all tables
  const correctCryptos = [
    { name: 'Bitcoin', symbol: 'BTC', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1024px-Bitcoin.svg.png', isActive: true, sortOrder: 1 },
    { name: 'Ethereum', symbol: 'ETH', icon: null, isActive: true, sortOrder: 2 },
    { name: 'Tether', symbol: 'USDT', icon: null, isActive: true, sortOrder: 3 },
    { name: 'Solana', symbol: 'SOL', icon: null, isActive: true, sortOrder: 4 },
    { name: 'Litecoin', symbol: 'LTC', icon: null, isActive: true, sortOrder: 5 },
    { name: 'XRP', symbol: 'XRP', icon: null, isActive: true, sortOrder: 6 },
    { name: 'BNB', symbol: 'BNB', icon: null, isActive: true, sortOrder: 7 },
    { name: 'Bitcoin Cash', symbol: 'BCH', icon: null, isActive: true, sortOrder: 8 },
    { name: 'USD Coin', symbol: 'USDC', icon: null, isActive: true, sortOrder: 9 },
    { name: 'TRON', symbol: 'TRX', icon: null, isActive: true, sortOrder: 10 }
  ];
  
  const correctPaymentMethods = [
    { name: 'Card', key: 'card', icon: null, description: '0 KYC', isActive: true, sortOrder: 1 },
    { name: 'PayPal', key: 'paypal', icon: null, description: 'Fast & secure', isActive: true, sortOrder: 2 },
    { name: 'SumUp', key: 'sumup', icon: null, description: 'Card via SumUp', isActive: true, sortOrder: 3 }
  ];
  
  const correctCurrencies = [
    { name: 'US Dollar', symbol: 'USD', icon: null, isActive: true, sortOrder: 1 },
    { name: 'Euro', symbol: 'EUR', icon: null, isActive: true, sortOrder: 2 },
    { name: 'British Pound', symbol: 'GBP', icon: null, isActive: true, sortOrder: 3 }
  ];

  try {
    // Fix cryptos table
    console.log('[DATA FIX] Fixing cryptos table...');
    await db.delete(cryptos);
    for (const crypto of correctCryptos) {
      await db.insert(cryptos).values(crypto);
    }
    console.log('[DATA FIX] Cryptos table reset with', correctCryptos.length, 'entries');
    
    // Fix payment_methods table
    console.log('[DATA FIX] Fixing payment_methods table...');
    await db.delete(paymentMethods);
    for (const method of correctPaymentMethods) {
      await db.insert(paymentMethods).values(method);
    }
    console.log('[DATA FIX] Payment methods table reset with', correctPaymentMethods.length, 'entries');
    
    // Fix currencies table
    console.log('[DATA FIX] Fixing currencies table...');
    await db.delete(currencies);
    for (const currency of correctCurrencies) {
      await db.insert(currencies).values(currency);
    }
    console.log('[DATA FIX] Currencies table reset with', correctCurrencies.length, 'entries');
    
    // Clear swap_wallets (admin can re-add these)
    console.log('[DATA FIX] Clearing swap_wallets table...');
    await db.delete(swapWallets);
    console.log('[DATA FIX] Swap wallets table cleared');
    
    console.log('[DATA FIX] All database tables fixed successfully!');
  } catch (error) {
    console.error('[DATA FIX] Error resetting database:', error);
  }
}

// Start Discord bot as a child process
let botProcess: ReturnType<typeof spawn> | null = null;
let botRestarting = false;

function startDiscordBot() {
  if (botProcess) {
    botProcess.kill();
    botProcess = null;
  }
  
  const botPath = path.join(process.cwd(), 'discord-bot', 'index.js');
  botProcess = spawn('node', [botPath], {
    stdio: 'inherit',
    env: process.env
  });
  
  botProcess.on('error', (err) => {
    console.log(`Discord bot error: ${err.message}`);
  });
  
  botProcess.on('exit', (code) => {
    if (code !== 0 && !botRestarting) {
      console.log(`Discord bot exited with code ${code}, restarting in 5s...`);
      botRestarting = true;
      setTimeout(() => {
        botRestarting = false;
        startDiscordBot();
      }, 5000);
    }
  });
}

// Cleanup on server shutdown
process.on('SIGTERM', () => {
  if (botProcess) botProcess.kill();
});
process.on('SIGINT', () => {
  if (botProcess) botProcess.kill();
});

// Only start bot if DISCORD_BOT_TOKEN is set
if (process.env.DISCORD_BOT_TOKEN) {
  startDiscordBot();
} else {
  console.log('DISCORD_BOT_TOKEN not set, bot disabled');
}
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Fix ALL corrupted database tables before starting server
  await fixCorruptedData();
  
  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
})();
