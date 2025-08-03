import { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  res.json({
    name: "NeuralArchSearch API",
    version: "1.0.0",
    author: "Shaurya Upadhyay",
    description:
      "Neural Network Architecture Search API with Shaurya AI Assistant - Deployed on Vercel",
    environment: "production",
    platform: "vercel",
    endpoints: {
      "GET /api": "This info",
      "POST /api/chat": "Shaurya AI Chat endpoint",
    },
    chat_example: {
      method: "POST",
      url: "/api/chat",
      body: {
        messages: [
          {
            role: "user",
            content:
              "Hello Shaurya, help me with neural architecture search on Vercel",
          },
        ],
      },
    },
    status: "🚀 NeuralArchSearch is live on Vercel!",
    built_by: "Shaurya Upadhyay",
  });
}
