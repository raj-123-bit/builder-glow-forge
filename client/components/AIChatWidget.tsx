import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Minimize2,
  Maximize2,
  Sparkles,
  Settings,
  Zap,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import AIConfigSettings from "./AIConfigSettings";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface AIConfig {
  provider: "custom" | "openai" | "anthropic" | "vercel";
  endpoint: string;
  apiKey: string;
  model: string;
  systemPrompt: string;
  enabled: boolean;
}

const defaultConfig: AIConfig = {
  provider: "custom",
  endpoint: "",
  apiKey: "",
  model: "gpt-3.5-turbo",
  systemPrompt: "You are an AI assistant specialized in neural network architecture search. Help users with search configurations, architecture analysis, and optimization strategies.",
  enabled: false
};

const initialMessages: Message[] = [
  {
    id: "1",
    content: "Hi! I'm Shaurya, your AI assistant for Neural Architecture Search. I can help you with search configurations, interpret results, explain architectures, and provide optimization recommendations. How can I assist you today?",
    sender: "ai",
    timestamp: new Date()
  }
];

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [aiConfig, setAiConfig] = useState<AIConfig>(() => {
    const saved = localStorage.getItem("neuralarch-ai-config");
    return saved ? JSON.parse(saved) : defaultConfig;
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  useEffect(() => {
    localStorage.setItem("neuralarch-ai-config", JSON.stringify(aiConfig));
  }, [aiConfig]);

  const callCustomAI = async (userMessage: string): Promise<string> => {
    if (!aiConfig.enabled || !aiConfig.endpoint) {
      throw new Error("AI integration not configured");
    }

    const conversationHistory = messages.slice(-5).map(msg => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.content
    }));

    const payload = {
      messages: [
        { role: "system", content: aiConfig.systemPrompt },
        ...conversationHistory,
        { role: "user", content: userMessage }
      ],
      model: aiConfig.model,
      max_tokens: 500,
      temperature: 0.7
    };

    const headers: Record<string, string> = {
      "Content-Type": "application/json"
    };

    if (aiConfig.provider === "openai") {
      headers["Authorization"] = `Bearer ${aiConfig.apiKey}`;
    } else if (aiConfig.provider === "anthropic") {
      headers["x-api-key"] = aiConfig.apiKey;
      headers["anthropic-version"] = "2023-06-01";
    } else if (aiConfig.apiKey) {
      headers["Authorization"] = `Bearer ${aiConfig.apiKey}`;
    }

    const response = await fetch(aiConfig.endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 
           data.content?.[0]?.text || 
           data.message ||
           "I received your message but couldn't generate a proper response.";
  };

  const generateFallbackResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes("architecture") || input.includes("model")) {
      return "I can help you understand neural architectures! Are you looking for information about specific models like EfficientNet, ResNet, or MobileNet? Or would you like guidance on architecture search strategies?";
    }
    
    if (input.includes("search") || input.includes("configuration")) {
      return "For neural architecture search, I recommend starting with evolutionary search for broad exploration. Consider your target dataset size, computational budget, and performance requirements. Would you like me to suggest optimal parameters?";
    }
    
    if (input.includes("performance") || input.includes("accuracy")) {
      return "Performance analysis involves multiple metrics: accuracy, inference latency, model size, and FLOPs. The Pareto frontier helps identify optimal trade-offs. What specific performance aspect interests you?";
    }
    
    if (input.includes("help") || input.includes("how")) {
      return "I'm here to help! I can assist with:\n• Search configuration and parameter tuning\n• Architecture analysis and comparison\n• Performance optimization strategies\n• Result interpretation\n• Best practices for NAS\n\nWhat would you like to explore?";
    }
    
    return "That's an interesting question about neural architecture search! Could you provide more details about what you're trying to achieve? I can help with search strategies, architecture analysis, or performance optimization.";
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      let aiResponse: string;
      
      if (aiConfig.enabled && aiConfig.endpoint) {
        try {
          aiResponse = await callCustomAI(inputValue);
        } catch (error) {
          console.error("Custom AI failed:", error);
          aiResponse = `❌ AI service error: ${error instanceof Error ? error.message : 'Unknown error'}\n\nFalling back to built-in responses:\n\n${generateFallbackResponse(inputValue)}`;
        }
      } else {
        aiResponse = generateFallbackResponse(inputValue);
      }

      // Simulate typing delay
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: "ai",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        sender: "ai",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleConfigUpdate = (newConfig: AIConfig) => {
    setAiConfig(newConfig);
    
    // Add a system message about the configuration change
    if (newConfig.enabled) {
      const configMessage: Message = {
        id: Date.now().toString(),
        content: `✅ AI integration enabled! Now connected to: ${newConfig.provider === 'vercel' ? 'Your Vercel AI Project' : newConfig.provider}`,
        sender: "ai",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, configMessage]);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="sr-only">Open AI Chat</span>
        </Button>
        <div className="absolute -top-12 right-0 bg-primary text-primary-foreground px-3 py-1 rounded-lg text-sm font-medium shadow-lg animate-pulse">
          {aiConfig.enabled ? "Shaurya AI Connected" : "Ask Shaurya for help"}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Card className={cn(
          "w-80 shadow-2xl border-primary/20 bg-card/95 backdrop-blur-sm transition-all duration-300",
          isMinimized ? "h-16" : "h-96"
        )}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary/20 rounded-full">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-sm">Shaurya AI Assistant</CardTitle>
                <div className="flex items-center gap-1">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    aiConfig.enabled ? "bg-green-500 animate-pulse" : "bg-yellow-500"
                  )}></div>
                  <span className="text-xs text-muted-foreground">
                    {aiConfig.enabled ? "Custom AI" : "Built by Shaurya"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSettingsOpen(true)}
                className="h-8 w-8 p-0"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8 p-0"
              >
                {isMinimized ? (
                  <Maximize2 className="h-4 w-4" />
                ) : (
                  <Minimize2 className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {!isMinimized && (
            <CardContent className="p-0 flex flex-col h-80">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-2",
                        message.sender === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      {message.sender === "ai" && (
                        <div className="p-1.5 bg-primary/20 rounded-full h-fit">
                          <Bot className="h-3 w-3 text-primary" />
                        </div>
                      )}
                      <div
                        className={cn(
                          "max-w-[75%] rounded-lg p-3 text-sm",
                          message.sender === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        <div className="whitespace-pre-wrap">{message.content}</div>
                        <div className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                      {message.sender === "user" && (
                        <div className="p-1.5 bg-primary/20 rounded-full h-fit">
                          <User className="h-3 w-3 text-primary" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex gap-2 justify-start">
                      <div className="p-1.5 bg-primary/20 rounded-full h-fit">
                        <Bot className="h-3 w-3 text-primary" />
                      </div>
                      <div className="bg-muted text-muted-foreground rounded-lg p-3 text-sm">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>

              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about neural architectures..."
                    className="flex-1"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    size="sm"
                    className="px-3"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className={cn(
                    "text-xs",
                    aiConfig.enabled ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-primary/10 text-primary"
                  )}>
                    {aiConfig.enabled ? (
                      <>
                        <Zap className="h-3 w-3 mr-1" />
                        {aiConfig.provider === 'vercel' ? 'Vercel AI' : aiConfig.provider}
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3 w-3 mr-1" />
                        Built-in AI
                      </>
                    )}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Press Enter to send
                  </span>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      <AIConfigSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onConfigUpdate={handleConfigUpdate}
        currentConfig={aiConfig}
      />
    </>
  );
}
