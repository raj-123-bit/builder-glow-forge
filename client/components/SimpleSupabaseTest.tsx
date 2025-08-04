import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@supabase/supabase-js";
import { Database, CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function SimpleSupabaseTest() {
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseKey, setSupabaseKey] = useState("");
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const testConnection = async () => {
    if (!supabaseUrl || !supabaseKey) {
      setResult({ success: false, message: "Please enter both URL and API key" });
      return;
    }

    setTesting(true);
    setResult(null);

    try {
      // Create a test client with the provided credentials
      const testClient = createClient(supabaseUrl, supabaseKey);
      
      console.log("Testing connection with:", { url: supabaseUrl, key: supabaseKey.substring(0, 20) + "..." });
      
      // Try a simple query
      const { data, error } = await testClient
        .from("_supabase_migrations")
        .select("id")
        .limit(1);

      console.log("Test result:", { data, error });

      if (error) {
        if (error.code === "42P01") {
          setResult({ 
            success: true, 
            message: "✅ Connection successful! Database is empty - you need to run the setup script." 
          });
        } else {
          setResult({ 
            success: false, 
            message: `Connection failed: ${error.message}` 
          });
        }
      } else {
        setResult({ 
          success: true, 
          message: "✅ Connection successful! Database is ready." 
        });
      }
    } catch (err) {
      console.error("Connection test error:", err);
      setResult({ 
        success: false, 
        message: `Connection failed: ${err instanceof Error ? err.message : 'Unknown error'}` 
      });
    } finally {
      setTesting(false);
    }
  };

  const saveToEnv = () => {
    const envContent = `# Neural Architecture Search - Supabase Configuration
# Built by Shaurya Upadhyay

VITE_SUPABASE_URL=${supabaseUrl}
VITE_SUPABASE_ANON_KEY=${supabaseKey}

# For Vercel deployment
NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseKey}`;

    // Copy to clipboard
    navigator.clipboard.writeText(envContent);
    alert("Environment variables copied to clipboard! Create a .env.local file and paste this content.");
  };

  return (
    <Card className="border-border bg-card/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          Quick Supabase Connection Test
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Test your Supabase credentials before adding them to .env.local
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="supabase-url">Supabase Project URL</Label>
          <Input
            id="supabase-url"
            data-testid="supabase-url"
            value={supabaseUrl}
            onChange={(e) => setSupabaseUrl(e.target.value)}
            placeholder="https://your-project-id.supabase.co"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="supabase-key">Supabase Anon Key</Label>
          <Input
            id="supabase-key"
            type="password"
            value={supabaseKey}
            onChange={(e) => setSupabaseKey(e.target.value)}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          />
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={testConnection}
            disabled={testing || !supabaseUrl || !supabaseKey}
            className="flex-1"
          >
            {testing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              "Test Connection"
            )}
          </Button>
          
          {result?.success && (
            <Button onClick={saveToEnv} variant="outline">
              Copy .env Config
            </Button>
          )}
        </div>

        {result && (
          <div className={`p-3 rounded-lg border ${
            result.success 
              ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800" 
              : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
          }`}>
            <div className="flex items-center gap-2">
              {result.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <span className={`text-sm font-medium ${
                result.success ? "text-green-800 dark:text-green-200" : "text-red-800 dark:text-red-200"
              }`}>
                {result.message}
              </span>
            </div>
          </div>
        )}

        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-200">📝 Quick Steps:</h4>
          <ol className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
            <li>1. Go to <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="underline">supabase.com/dashboard</a></li>
            <li>2. Create project → Settings → API</li>
            <li>3. Copy Project URL and anon key above</li>
            <li>4. Click "Test Connection"</li>
            <li>5. If successful, click "Copy .env Config"</li>
            <li>6. Create .env.local file and paste the config</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
