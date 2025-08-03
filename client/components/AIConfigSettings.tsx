import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VercelAIExample from "./VercelAIExample";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Settings, 
  ExternalLink, 
  Key, 
  Zap, 
  CheckCircle, 
  XCircle, 
  TestTube,
  Save,
  RotateCcw,
  Cloud
} from "lucide-react";

interface AIConfig {
  provider: "custom" | "openai" | "anthropic" | "vercel";
  endpoint: string;
  apiKey: string;
  model: string;
  systemPrompt: string;
  enabled: boolean;
}

interface AIConfigSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigUpdate: (config: AIConfig) => void;
  currentConfig: AIConfig;
}

export default function AIConfigSettings({ 
  isOpen, 
  onClose, 
  onConfigUpdate,
  currentConfig 
}: AIConfigSettingsProps) {
  const [config, setConfig] = useState<AIConfig>(currentConfig);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle");
  const [testResponse, setTestResponse] = useState("");

  useEffect(() => {
    setConfig(currentConfig);
  }, [currentConfig]);

  const handleSave = () => {
    onConfigUpdate(config);
    onClose();
  };

  const handleReset = () => {
    setConfig({
      provider: "custom",
      endpoint: "",
      apiKey: "",
      model: "",
      systemPrompt: "You are Shaurya, an AI assistant specialized in neural network architecture search. Help users with search configurations, architecture analysis, and optimization strategies. You are knowledgeable, helpful, and built by Shaurya Upadhyay.",
      enabled: false
    });
  };

  const testConnection = async () => {
    setIsTestingConnection(true);
    setConnectionStatus("idle");
    setTestResponse("");

    try {
      const testPayload = {
        messages: [
          {
            role: "system",
            content: config.systemPrompt
          },
          {
            role: "user", 
            content: "Test connection: Can you help me with neural architecture search?"
          }
        ],
        model: config.model,
        max_tokens: 100
      };

      const headers: Record<string, string> = {
        "Content-Type": "application/json"
      };

      if (config.provider === "openai") {
        headers["Authorization"] = `Bearer ${config.apiKey}`;
      } else if (config.provider === "anthropic") {
        headers["x-api-key"] = config.apiKey;
        headers["anthropic-version"] = "2023-06-01";
      } else if (config.apiKey) {
        headers["Authorization"] = `Bearer ${config.apiKey}`;
      }

      const response = await fetch(config.endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(testPayload)
      });

      if (response.ok) {
        const data = await response.json();
        setConnectionStatus("success");
        setTestResponse(data.choices?.[0]?.message?.content || data.content?.[0]?.text || "Connection successful!");
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      setConnectionStatus("error");
      setTestResponse(error instanceof Error ? error.message : "Connection failed");
    } finally {
      setIsTestingConnection(false);
    }
  };

  const presetConfigs = {
    vercel: {
      endpoint: "https://your-project.vercel.app/api/chat",
      model: "gpt-3.5-turbo",
      systemPrompt: "You are an AI assistant specialized in neural network architecture search."
    },
    openai: {
      endpoint: "https://api.openai.com/v1/chat/completions",
      model: "gpt-3.5-turbo",
      systemPrompt: "You are an AI assistant specialized in neural network architecture search."
    },
    anthropic: {
      endpoint: "https://api.anthropic.com/v1/messages",
      model: "claude-3-sonnet-20240229",
      systemPrompt: "You are an AI assistant specialized in neural network architecture search."
    }
  };

  const handlePresetSelect = (provider: string) => {
    if (provider in presetConfigs) {
      const preset = presetConfigs[provider as keyof typeof presetConfigs];
      setConfig(prev => ({
        ...prev,
        provider: provider as AIConfig["provider"],
        ...preset
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Settings className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>AI Configuration</CardTitle>
              <p className="text-sm text-muted-foreground">Connect your own AI service</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch 
                checked={config.enabled} 
                onCheckedChange={(enabled) => setConfig(prev => ({ ...prev, enabled }))}
              />
              <Label>Enable Custom AI Integration</Label>
            </div>
            <Badge variant={config.enabled ? "default" : "secondary"}>
              {config.enabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>

          <Tabs defaultValue="configuration" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="configuration">Configuration</TabsTrigger>
              <TabsTrigger value="testing">Test & Verify</TabsTrigger>
              <TabsTrigger value="guide">Vercel Guide</TabsTrigger>
            </TabsList>

            <TabsContent value="configuration" className="space-y-4">
              <div className="space-y-2">
                <Label>AI Provider</Label>
                <Select value={config.provider} onValueChange={handlePresetSelect}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vercel">
                      <div className="flex items-center gap-2">
                        <Cloud className="h-4 w-4" />
                        Vercel AI Project
                      </div>
                    </SelectItem>
                    <SelectItem value="openai">OpenAI GPT</SelectItem>
                    <SelectItem value="anthropic">Anthropic Claude</SelectItem>
                    <SelectItem value="custom">Custom Endpoint</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endpoint">API Endpoint</Label>
                <div className="flex gap-2">
                  <Input
                    id="endpoint"
                    value={config.endpoint}
                    onChange={(e) => setConfig(prev => ({ ...prev, endpoint: e.target.value }))}
                    placeholder="https://your-project.vercel.app/api/chat"
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm" asChild>
                    <a href={config.endpoint} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your AI API endpoint (e.g., Vercel function, OpenAI API, or custom service)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <div className="flex gap-2">
                  <Input
                    id="apiKey"
                    type="password"
                    value={config.apiKey}
                    onChange={(e) => setConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                    placeholder="sk-..."
                    className="flex-1"
                  />
                  <Key className="h-9 w-9 p-2 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={config.model}
                  onChange={(e) => setConfig(prev => ({ ...prev, model: e.target.value }))}
                  placeholder="gpt-3.5-turbo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="systemPrompt">System Prompt</Label>
                <Textarea
                  id="systemPrompt"
                  value={config.systemPrompt}
                  onChange={(e) => setConfig(prev => ({ ...prev, systemPrompt: e.target.value }))}
                  placeholder="You are an AI assistant..."
                  rows={4}
                />
              </div>
            </TabsContent>

            <TabsContent value="testing" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Connection Test</h3>
                <Button
                  onClick={testConnection}
                  disabled={isTestingConnection || !config.endpoint}
                  size="sm"
                >
                  {isTestingConnection ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <TestTube className="h-4 w-4 mr-2" />
                      Test Connection
                    </>
                  )}
                </Button>
              </div>

              {connectionStatus !== "idle" && (
                <Card className={`border ${
                  connectionStatus === "success" ? "border-green-500" : "border-red-500"
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {connectionStatus === "success" ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <span className="font-medium">
                        {connectionStatus === "success" ? "Connection Successful" : "Connection Failed"}
                      </span>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <pre className="text-sm whitespace-pre-wrap">{testResponse}</pre>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-medium mb-2">Vercel AI Setup Guide</h4>
                <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
                  <li>Deploy your AI project to Vercel</li>
                  <li>Create an API route (e.g., /api/chat)</li>
                  <li>Copy your deployment URL + API path</li>
                  <li>Add any required API keys</li>
                  <li>Test the connection above</li>
                </ol>
              </div>
            </TabsContent>

            <TabsContent value="guide" className="space-y-4">
              <VercelAIExample />
            </TabsContent>
          </Tabs>

          <div className="flex gap-2 pt-4 border-t">
            <Button onClick={handleReset} variant="outline" className="flex-1">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button onClick={handleSave} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Save Configuration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
