import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, ArrowLeft, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">NeuralArchSearch</h1>
              <p className="text-sm text-muted-foreground">
                AI-Powered Architecture Discovery
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="border-border bg-card/50 text-center">
            <CardHeader className="pb-6">
              <div className="mx-auto mb-4 p-4 bg-destructive/20 rounded-full w-fit">
                <AlertTriangle className="h-12 w-12 text-destructive" />
              </div>
              <CardTitle className="text-3xl mb-2">
                404 - Page Not Found
              </CardTitle>
              <p className="text-muted-foreground text-lg">
                The neural pathway you're looking for doesn't exist in our
                architecture.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/20 rounded-lg p-6">
                <p className="text-sm text-muted-foreground">
                  <strong>Requested path:</strong> {location.pathname}
                </p>
              </div>

              <div className="flex gap-3 justify-center">
                <Link to="/">
                  <Button variant="outline">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
                <Link to="/">
                  <Button>Start Architecture Search</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
