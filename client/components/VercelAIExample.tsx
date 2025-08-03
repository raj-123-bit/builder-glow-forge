import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, ExternalLink, FileCode, Terminal, Cloud } from "lucide-react";

export default function VercelAIExample() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, label: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(label);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const apiRouteCode = `// pages/api/chat.js or app/api/chat/route.js
import { Configuration, OpenAIApi } from 'openai';
// or import { openai } from '@ai-sdk/openai';
// import { streamText } from 'ai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, model = 'gpt-3.5-turbo', max_tokens = 500 } = req.body;

    const completion = await openai.createChatCompletion({
      model,
      messages,
      max_tokens,
      temperature: 0.7,
    });

    res.status(200).json({
      choices: [{
        message: {
          content: completion.data.choices[0].message.content
        }
      }]
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'AI service error' });
  }
}`;

  const appRouterCode = `// app/api/chat/route.ts (App Router)
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai('gpt-3.5-turbo'),
    messages,
    system: 'You are an AI assistant specialized in neural network architecture search.',
  });

  return result.toAIStreamResponse();
}`;

  const envCode = `# .env.local
OPENAI_API_KEY=sk-your-openai-api-key-here
# or
ANTHROPIC_API_KEY=your-anthropic-key
# or your custom AI service credentials`;

  const packageJsonCode = `{
  "dependencies": {
    "openai": "^4.0.0",
    "ai": "^3.0.0",
    "@ai-sdk/openai": "^0.0.1"
  }
}`;

  const deploymentSteps = [
    "Create a new Next.js project or use existing",
    "Add your API route (pages/api/chat.js or app/api/chat/route.ts)",
    "Install dependencies: npm install openai ai @ai-sdk/openai",
    "Add environment variables to .env.local",
    "Deploy to Vercel: vercel --prod",
    "Copy your deployment URL + /api/chat",
    "Configure in the AI settings above"
  ];

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Cloud className="h-5 w-5 text-primary" />
            <CardTitle>Vercel AI Integration Guide</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Deploy your own AI service to Vercel and connect it to this application
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="setup" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="setup">Setup</TabsTrigger>
              <TabsTrigger value="pages">Pages Router</TabsTrigger>
              <TabsTrigger value="app">App Router</TabsTrigger>
              <TabsTrigger value="deploy">Deploy</TabsTrigger>
            </TabsList>

            <TabsContent value="setup" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">1. Environment Variables</h3>
                  <div className="relative">
                    <pre className="bg-muted/50 rounded-lg p-4 text-sm overflow-x-auto">
                      <code>{envCode}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(envCode, "env")}
                    >
                      {copiedCode === "env" ? "Copied!" : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">2. Package Dependencies</h3>
                  <div className="relative">
                    <pre className="bg-muted/50 rounded-lg p-4 text-sm overflow-x-auto">
                      <code>{packageJsonCode}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(packageJsonCode, "package")}
                    >
                      {copiedCode === "package" ? "Copied!" : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pages" className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileCode className="h-4 w-4" />
                  <h3 className="font-semibold">pages/api/chat.js</h3>
                  <Badge variant="secondary">Pages Router</Badge>
                </div>
                <div className="relative">
                  <pre className="bg-muted/50 rounded-lg p-4 text-sm overflow-x-auto max-h-96">
                    <code>{apiRouteCode}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(apiRouteCode, "pages")}
                  >
                    {copiedCode === "pages" ? "Copied!" : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="app" className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileCode className="h-4 w-4" />
                  <h3 className="font-semibold">app/api/chat/route.ts</h3>
                  <Badge variant="secondary">App Router</Badge>
                </div>
                <div className="relative">
                  <pre className="bg-muted/50 rounded-lg p-4 text-sm overflow-x-auto">
                    <code>{appRouterCode}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(appRouterCode, "app")}
                  >
                    {copiedCode === "app" ? "Copied!" : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="deploy" className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Terminal className="h-4 w-4" />
                  Deployment Steps
                </h3>
                <ol className="space-y-2">
                  {deploymentSteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Badge variant="outline" className="shrink-0">
                        {index + 1}
                      </Badge>
                      <span className="text-sm">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-medium mb-2">Quick Deploy</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Use this button to deploy a template AI API to Vercel:
                </p>
                <Button asChild variant="outline">
                  <a
                    href="https://vercel.com/new/clone?repository-url=https://github.com/vercel/ai-chatbot&env=OPENAI_API_KEY"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Deploy to Vercel
                  </a>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
