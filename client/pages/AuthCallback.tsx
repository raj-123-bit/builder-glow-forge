import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertCircle, Brain } from "lucide-react";

// OAuth Callback Handler for Neural Architecture Search
// Built by Shaurya Upadhyay

export default function AuthCallback() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the OAuth callback
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (data.session) {
          setSuccess(true);
          // Redirect to home page after a short delay
          setTimeout(() => {
            navigate("/", { replace: true });
          }, 2000);
        } else {
          throw new Error("No session found after OAuth callback");
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        setError(
          error instanceof Error ? error.message : "Authentication failed",
        );
      } finally {
        setLoading(false);
      }
    };

    // Check URL for any error parameters first
    const urlParams = new URLSearchParams(window.location.search);
    const urlError = urlParams.get("error");
    const urlErrorDescription = urlParams.get("error_description");

    if (urlError) {
      setError(urlErrorDescription || urlError);
      setLoading(false);
      return;
    }

    handleAuthCallback();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-primary/20 rounded-full w-fit">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Completing Sign In</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
            <p className="text-muted-foreground">
              Please wait while we complete your authentication...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-green-800">
              Successfully Signed In!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Welcome to Neural Architecture Search! You'll be redirected
              shortly.
            </p>
            <Button
              onClick={() => navigate("/", { replace: true })}
              className="w-full"
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-red-100 rounded-full w-fit">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-red-800">Authentication Error</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Button
                onClick={() => navigate("/", { replace: true })}
                className="w-full"
              >
                Return to Home
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="w-full"
              >
                Try Again
              </Button>
            </div>

            <div className="mt-4 text-xs text-muted-foreground text-center">
              <p>Built by Shaurya Upadhyay</p>
              <p>Neural Architecture Search - Enhanced Authentication</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
