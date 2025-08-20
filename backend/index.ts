import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes.js";
import { serveStatic, log } from "./vite.js";
import { pool, getDatabaseStatus } from "./db-config.js";

const app = express();

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://www.2pbal.online');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Test database connection
async function testDatabaseConnection() {
  try {
    log("🔍 Testing database connection...");
    const dbStatus = getDatabaseStatus();
    log(`📊 Database Provider: ${dbStatus.provider}`);
    log(`📋 Description: ${dbStatus.description}`);
    
    // Test actual connection
    const client = await pool.connect();
    await client.query('SELECT NOW() as current_time');
    client.release();
    
    log("✅ Database connection successful!");
    log("🎯 Database is ready to handle requests");
    return true;
  } catch (error) {
    log("❌ Database connection failed!");
    log(`💥 Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return false;
  }
}

(async () => {
  // Test database connection first
  const dbConnected = await testDatabaseConnection();
  if (!dbConnected) {
    log("⚠️  Server starting without database connection - some features may not work");
  }

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Serve static files
  serveStatic(app);

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen(port, "0.0.0.0", () => {
    log(`🚀 Server started successfully on port ${port}`);
    if (dbConnected) {
      log("🎉 Full system ready - Database connected and server running!");
    } else {
      log("⚠️  Server running but database connection failed");
    }
  });
})();
