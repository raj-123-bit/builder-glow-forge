import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleChat } from "./routes/chat";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API info endpoint
  app.get("/api", (_req, res) => {
    res.json({
      name: "NeuralArchSearch API",
      version: "1.0.0",
      author: "Shaurya Upadhyay",
      description:
        "Neural Network Architecture Search API with Shaurya AI Assistant",
      endpoints: {
        "GET /api": "This info",
        "GET /api/ping": "Health check",
        "GET /api/demo": "Demo endpoint",
        "POST /api/chat": "Shaurya AI Chat endpoint",
      },
      chat_example: {
        method: "POST",
        url: "/api/chat",
        body: {
          messages: [
            {
              role: "user",
              content: "Hello Shaurya, help me with neural architecture search",
            },
          ],
        },
      },
    });
  });

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Shaurya AI Chat endpoint
  app.post("/api/chat", handleChat);

  return app;
}
