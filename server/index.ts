import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { spawn } from "child_process";
import path from "path";
import { db } from "./db";
import { cryptos } from "@shared/schema";
import { eq } from "drizzle-orm";

const app = express();

// Fix corrupted crypto data on startup - complete reset
async function fixCryptoData() {
  console.log('[CRYPTO FIX] Starting crypto data fix...');
  console.log('[CRYPTO FIX] Environment:', process.env.NODE_ENV || 'unknown');
  
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

  try {
    // Check current state before fix
    const existingCryptos = await db.select().from(cryptos);
    console.log('[CRYPTO FIX] Found', existingCryptos.length, 'existing cryptos');
    if (existingCryptos.length > 0) {
      console.log('[CRYPTO FIX] First crypto name:', existingCryptos[0].name);
      console.log('[CRYPTO FIX] First crypto symbol:', existingCryptos[0].symbol);
    }
    
    // Delete all existing cryptos
    console.log('[CRYPTO FIX] Deleting all existing cryptos...');
    await db.delete(cryptos);
    console.log('[CRYPTO FIX] Deleted all cryptos');
    
    // Insert fresh data
    console.log('[CRYPTO FIX] Inserting', correctCryptos.length, 'correct cryptos...');
    for (const crypto of correctCryptos) {
      await db.insert(cryptos).values(crypto);
    }
    console.log('[CRYPTO FIX] Successfully inserted all cryptos');
    
    // Verify the fix
    const verifiedCryptos = await db.select().from(cryptos);
    console.log('[CRYPTO FIX] Verification - now have', verifiedCryptos.length, 'cryptos');
    if (verifiedCryptos.length > 0) {
      console.log('[CRYPTO FIX] First crypto after fix:', verifiedCryptos[0].name, verifiedCryptos[0].symbol);
    }
    
    console.log('[CRYPTO FIX] Crypto data completely reset on startup');
  } catch (error) {
    console.error('[CRYPTO FIX] Error resetting crypto data:', error);
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

// Only start bot if DISCORD_TOKEN is set
if (process.env.DISCORD_TOKEN) {
  startDiscordBot();
} else {
  console.log('DISCORD_TOKEN not set, bot disabled');
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
  // Fix corrupted crypto data before starting server
  await fixCryptoData();
  
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
