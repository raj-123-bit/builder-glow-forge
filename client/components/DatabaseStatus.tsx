import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase, NeuralArchSearchDB } from "@/lib/supabase";
import { extractErrorMessage, logError } from "@/lib/errorUtils";
import { CheckCircle, XCircle, Database, Loader2, Brain } from "lucide-react";

export default function DatabaseStatus() {
  const [connectionStatus, setConnectionStatus] = useState<"checking" | "connected" | "error">("checking");
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      setConnectionStatus("checking");
      setError(null);

      console.log("Checking Supabase configuration...");
      console.log("VITE_SUPABASE_URL:", import.meta.env.VITE_SUPABASE_URL ? "Set" : "Not set");
      console.log("VITE_SUPABASE_ANON_KEY:", import.meta.env.VITE_SUPABASE_ANON_KEY ? "Set" : "Not set");

      // Check if Supabase is configured
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        throw new Error("Supabase environment variables not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env.local file");
      }

      console.log("Testing Supabase connection...");

      // Check if supabase client is properly initialized
      if (!supabase) {
        throw new Error("Supabase client not initialized. Check your configuration.");
      }

      console.log("Supabase client:", supabase);

      // Test basic client functionality
      try {
        console.log("Testing supabase.from method...");
        const table = supabase.from("search_experiments");
        console.log("Table object:", table);

        console.log("Testing select method...");
        const query = table.select("id");
        console.log("Query object:", query);
      } catch (clientError) {
        logError("Supabase Client Test", clientError);
        throw new Error(`Supabase client error: ${extractErrorMessage(clientError)}`);
      }

      // First try a simple connection test
      try {
        console.log("Testing basic table access...");
        const response = await supabase
          .from("search_experiments")
          .select("id")
          .limit(1);

        console.log("Supabase table response:", response);

        const { data, error: healthError } = response;

        if (healthError) {
          console.log("Health error details:", {
            code: healthError.code,
            message: healthError.message,
            details: healthError.details,
            hint: healthError.hint
          });

          if (healthError.code === "42P01") {
            // Table doesn't exist - need to run setup
            throw new Error("Database tables not found. Please run the setup script in Supabase SQL Editor");
          } else {
            throw healthError;
          }
        }

        console.log("Basic connection test passed, data:", data);
      } catch (testError) {
        logError("Connection Test", testError);
        throw testError;
      }

      console.log("Getting global stats...");

      // Get global stats
      const globalStats = await NeuralArchSearchDB.getGlobalStats();
      console.log("Global stats:", globalStats);

      setStats(globalStats);
      setConnectionStatus("connected");
    } catch (err) {
      logError("Database Connection", err);
      const errorMessage = extractErrorMessage(err);
      setError(errorMessage);
      setConnectionStatus("error");
    }
  };

  const testDatabaseOperations = async () => {
    setTesting(true);
    try {
      // Test creating a sample experiment
      const testExperiment = {
        name: "Test Connection",
        description: "Testing Supabase connection from Shaurya's Neural Architecture Search app",
        strategy: "evolutionary" as const,
        dataset: "imagenet" as const,
        search_budget: 10,
        population_size: 5
      };

      const result = await NeuralArchSearchDB.createExperiment(testExperiment);
      console.log("Test experiment created:", result);

      // Clean up - delete the test experiment
      await supabase
        .from("search_experiments")
        .delete()
        .eq("id", result.id);

      // Refresh stats
      await checkConnection();
    } catch (err) {
      logError("Database Test", err);
      const errorMessage = extractErrorMessage(err);
      setError(errorMessage);
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className="border-border bg-card/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          Supabase Database Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Connection Status</span>
          {connectionStatus === "checking" && (
            <Badge variant="secondary">
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              Checking...
            </Badge>
          )}
          {connectionStatus === "connected" && (
            <Badge variant="default" className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="h-3 w-3 mr-1" />
              Connected
            </Badge>
          )}
          {connectionStatus === "error" && (
            <Badge variant="destructive">
              <XCircle className="h-3 w-3 mr-1" />
              Error
            </Badge>
          )}
        </div>

        {connectionStatus === "connected" && stats && (
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-bold text-primary">{stats.total_experiments}</div>
              <div className="text-xs text-muted-foreground">Experiments</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-bold text-primary">{stats.total_architectures}</div>
              <div className="text-xs text-muted-foreground">Architectures</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-bold text-primary">{stats.total_ai_conversations}</div>
              <div className="text-xs text-muted-foreground">AI Chats</div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            <div className="text-sm text-destructive font-medium mb-1">Connection Error</div>
            <div className="text-xs text-muted-foreground">{error}</div>
            {error.includes("environment variables") && (
              <div className="text-xs text-muted-foreground mt-2">
                💡 Create a .env.local file with your Supabase credentials
              </div>
            )}
            {(error.includes("relation") || error.includes("tables not found") || error.includes("42P01")) && (
              <div className="text-xs text-muted-foreground mt-2">
                💡 Tip: Run the database setup script in Supabase SQL Editor
              </div>
            )}
            {error.includes("Invalid API key") && (
              <div className="text-xs text-muted-foreground mt-2">
                💡 Check your VITE_SUPABASE_ANON_KEY in .env.local
              </div>
            )}
            {error.includes("Invalid JWT") && (
              <div className="text-xs text-muted-foreground mt-2">
                💡 Your Supabase API key may be incorrect or expired
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={checkConnection} variant="outline" size="sm" className="flex-1">
            Refresh Status
          </Button>
          <Button 
            onClick={testDatabaseOperations} 
            size="sm" 
            disabled={connectionStatus !== "connected" || testing}
            className="flex-1"
          >
            {testing ? (
              <>
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <Brain className="h-3 w-3 mr-1" />
                Test Database
              </>
            )}
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          Built by Shaurya Upadhyay • Neural Architecture Search Database
        </div>
      </CardContent>
    </Card>
  );
}
