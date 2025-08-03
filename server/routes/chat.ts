import { RequestHandler } from "express";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  model?: string;
  max_tokens?: number;
  temperature?: number;
}

export interface ChatResponse {
  content?: string;
  text?: string;
  choices?: Array<{
    message: {
      content: string;
    };
  }>;
}

export const handleChat: RequestHandler = async (req, res) => {
  try {
    const {
      messages,
      model = "shaurya-ai",
      max_tokens = 500,
      temperature = 0.7,
    } = req.body as ChatRequest;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: "Invalid request: messages array is required",
      });
    }

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== "user") {
      return res.status(400).json({
        error: "Invalid request: last message must be from user",
      });
    }

    // Generate Shaurya AI response based on neural architecture search context
    const aiResponse = generateShauryaResponse(lastMessage.content, messages);

    // Return response in multiple formats for compatibility
    const response: ChatResponse = {
      content: aiResponse,
      text: aiResponse,
      choices: [
        {
          message: {
            content: aiResponse,
          },
        },
      ],
    };

    res.json(response);
  } catch (error) {
    console.error("Chat API error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Shaurya AI service temporarily unavailable",
    });
  }
};

function generateShauryaResponse(
  userInput: string,
  messageHistory: ChatMessage[],
): string {
  const input = userInput.toLowerCase();

  // Check for greetings
  if (
    input.includes("hello") ||
    input.includes("hi") ||
    input.includes("hey")
  ) {
    return "Hi there! I'm Shaurya, your AI assistant for Neural Architecture Search. I'm here to help you with search configurations, architecture analysis, and optimization strategies. What would you like to explore today?";
  }

  // Neural architecture topics
  if (
    input.includes("architecture") ||
    input.includes("model") ||
    input.includes("network")
  ) {
    return "As Shaurya, I can help you understand neural architectures! Are you interested in:\n\n• Specific models like EfficientNet, ResNet, or MobileNet?\n• Architecture search strategies and algorithms?\n• Performance optimization techniques?\n• Architecture comparison and analysis?\n\nWhat specific aspect would you like to dive into?";
  }

  // Search configuration topics
  if (
    input.includes("search") ||
    input.includes("configuration") ||
    input.includes("nas")
  ) {
    return "For Neural Architecture Search, I recommend considering these key factors:\n\n• **Search Strategy**: Evolutionary, reinforcement learning, or gradient-based\n• **Search Space**: Define your architecture constraints\n• **Objective Function**: Balance accuracy, latency, and model size\n• **Budget**: Computational resources and time limits\n\nWhich search configuration aspect would you like me to help you with?";
  }

  // Performance topics
  if (
    input.includes("performance") ||
    input.includes("accuracy") ||
    input.includes("optimization")
  ) {
    return "Performance optimization in NAS involves multiple dimensions:\n\n• **Accuracy Metrics**: Top-1, Top-5 accuracy, F1-score\n• **Efficiency Metrics**: FLOPs, parameters, memory usage\n• **Latency**: Inference time on target hardware\n• **Pareto Optimization**: Finding optimal trade-offs\n\nWhat performance aspect are you trying to optimize?";
  }

  // Technical help
  if (
    input.includes("help") ||
    input.includes("how") ||
    input.includes("implement")
  ) {
    return "I'm Shaurya, and I'm here to help with all aspects of Neural Architecture Search!\n\n**My expertise includes:**\n• Search space design and constraints\n• Multi-objective optimization strategies\n• Architecture evaluation and ranking\n• Hardware-aware optimization\n• Transfer learning for NAS\n• AutoML pipeline setup\n\nWhat specific challenge can I help you solve?";
  }

  // Error or API topics
  if (
    input.includes("api") ||
    input.includes("error") ||
    input.includes("404")
  ) {
    return "I'm Shaurya, and I can see you're working on API integration! If you're getting 404 errors, make sure:\n\n• Your server is running on the correct port\n• API routes are properly registered\n• The endpoint path matches your request\n\nFor neural architecture search APIs, I can help you design efficient endpoints for model evaluation and search management. What specific API issue are you facing?";
  }

  // Default response with context awareness
  const hasContext = messageHistory.length > 1;
  if (hasContext) {
    return "That's an interesting question! As Shaurya, I'm specialized in neural architecture search and would love to help you further. Could you provide more details about what you're trying to achieve? I can assist with search strategies, architecture analysis, performance optimization, or any other NAS-related topics.";
  }

  return "Hello! I'm Shaurya, your AI assistant built by Shaurya Upadhyay, specialized in Neural Architecture Search. I can help with:\n\n• Architecture search configuration\n• Model performance analysis\n• Search strategy optimization\n• Hardware-aware design\n• Multi-objective optimization\n\nWhat neural architecture challenge can I help you solve today?";
}
