import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { spawn } from "child_process";
import path from "path";

const app = express();

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
