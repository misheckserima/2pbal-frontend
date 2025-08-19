import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

// Vite setup removed for backend-only operation
export function setupVite(app: Express) {
  // No-op for backend-only operation
  return app;
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");

  if (!fs.existsSync(distPath)) {
    log("Public directory not found, skipping static file serving (backend-only mode)", "vite");
    // For backend-only deployment, just return a simple message for root route
    app.get("/", (_req, res) => {
      res.json({ 
        message: "2pbal Backend API", 
        status: "running",
        timestamp: new Date().toISOString()
      });
    });
    return;
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
