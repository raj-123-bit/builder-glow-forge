import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Copy,
  ExternalLink,
  Database,
  Key,
  Play,
  CheckCircle,
} from "lucide-react";

export default function SupabaseSetupInstructions() {
  const [copiedStep, setCopiedStep] = useState<string | null>(null);

  const copyToClipboard = (text: string, step: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(step);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const setupSQL = `-- Neural Architecture Search Database Setup
-- Built by Shaurya Upadhyay
-- Copy and paste this into Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'search_strategy') THEN
        CREATE TYPE search_strategy AS ENUM ('evolutionary', 'reinforcement', 'gradient', 'bayesian', 'random');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'architecture_status') THEN
        CREATE TYPE architecture_status AS ENUM ('pending', 'training', 'completed', 'failed', 'cancelled');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'dataset_type') THEN
        CREATE TYPE dataset_type AS ENUM ('imagenet', 'cifar10', 'cifar100', 'custom');
    END IF;
END $$;

-- Create main tables
CREATE TABLE IF NOT EXISTS search_experiments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    strategy search_strategy NOT NULL DEFAULT 'evolutionary',
    dataset dataset_type NOT NULL DEFAULT 'imagenet',
    search_budget INTEGER DEFAULT 100,
    population_size INTEGER DEFAULT 50,
    status architecture_status DEFAULT 'pending',
    created_by VARCHAR(255) DEFAULT 'Shaurya Upadhyay',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    total_architectures_tested INTEGER DEFAULT 0,
    best_accuracy DECIMAL(5,2)
);

CREATE TABLE IF NOT EXISTS neural_architectures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    experiment_id UUID REFERENCES search_experiments(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    architecture_json JSONB NOT NULL,
    total_parameters BIGINT,
    top1_accuracy DECIMAL(5,2),
    inference_latency_ms DECIMAL(8,2),
    overall_score DECIMAL(5,2),
    status architecture_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255),
    message_role VARCHAR(20) NOT NULL,
    message_content TEXT NOT NULL,
    ai_model VARCHAR(100) DEFAULT 'shaurya-ai',
    user_id VARCHAR(255) DEFAULT 'Shaurya Upadhyay',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data
INSERT INTO search_experiments (name, description, strategy, dataset, status, total_architectures_tested, best_accuracy) 
VALUES ('Shaurya ImageNet Search', 'Neural Architecture Search by Shaurya Upadhyay', 'evolutionary', 'imagenet', 'completed', 247, 94.8)
ON CONFLICT DO NOTHING;

SELECT 'Setup Complete! 🚀' as message;`;

  const envTemplate = `# Supabase Configuration for Neural Architecture Search
# Built by Shaurya Upadhyay

VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# For Vercel deployment
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`;

  return (
    <Card className="border-border bg-card/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          Supabase Setup Instructions
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Quick setup guide for your Neural Architecture Search database
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="credentials" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="credentials">1. Get API Keys</TabsTrigger>
            <TabsTrigger value="database">2. Setup Database</TabsTrigger>
            <TabsTrigger value="env">3. Configure App</TabsTrigger>
          </TabsList>

          <TabsContent value="credentials" className="space-y-4">
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Get Your Supabase API Credentials
                </h4>
                <ol className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Badge variant="outline" className="shrink-0">
                      1
                    </Badge>
                    <span>
                      Go to{" "}
                      <a
                        href="https://supabase.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        supabase.com
                      </a>{" "}
                      and sign in
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="outline" className="shrink-0">
                      2
                    </Badge>
                    <span>Create a new project or select existing one</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="outline" className="shrink-0">
                      3
                    </Badge>
                    <span>Go to Settings → API</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="outline" className="shrink-0">
                      4
                    </Badge>
                    <span>Copy the Project URL and anon/public key</span>
                  </li>
                </ol>
              </div>

              <Button asChild variant="outline" className="w-full">
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Supabase Dashboard
                </a>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="database" className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Run Database Setup Script</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Copy this SQL script and run it in your Supabase SQL Editor:
              </p>

              <div className="relative">
                <pre className="bg-muted/50 rounded-lg p-4 text-xs overflow-x-auto max-h-64 border">
                  <code>{setupSQL}</code>
                </pre>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(setupSQL, "sql")}
                >
                  {copiedStep === "sql" ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="mt-3 flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <a
                    href="https://supabase.com/dashboard/project/_/sql"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Open SQL Editor
                  </a>
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="env" className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">
                Configure Environment Variables
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Create a <code>.env.local</code> file with your Supabase
                credentials:
              </p>

              <div className="relative">
                <pre className="bg-muted/50 rounded-lg p-4 text-sm overflow-x-auto border">
                  <code>{envTemplate}</code>
                </pre>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(envTemplate, "env")}
                >
                  {copiedStep === "env" ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mt-3">
                <div className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  ⚠️ Important
                </div>
                <div className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                  Replace <code>your-project-id</code> and the API key with your
                  actual Supabase values
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center gap-2 text-green-800 dark:text-green-200 font-medium text-sm">
            <CheckCircle className="h-4 w-4" />
            Ready to Go!
          </div>
          <div className="text-xs text-green-700 dark:text-green-300 mt-1">
            Once completed, your Neural Architecture Search app will have full
            database persistence for experiments, architectures, and Shaurya AI
            conversations.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
