import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, ArrowLeft, MessageSquare } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export default function PlaceholderPage({
  title,
  description,
  icon = <Brain className="h-12 w-12 text-primary" />,
}: PlaceholderPageProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Search
              </Button>
            </Link>
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
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="border-border bg-card/50 text-center">
            <CardHeader className="pb-6">
              <div className="mx-auto mb-4 p-4 bg-primary/20 rounded-full w-fit">
                {icon}
              </div>
              <CardTitle className="text-2xl mb-2">{title}</CardTitle>
              <p className="text-muted-foreground text-lg">{description}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/20 rounded-lg p-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <span className="font-medium">Continue the Conversation</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  This page is ready to be built! Continue prompting to add
                  specific functionality and content to this section of the
                  application.
                </p>
              </div>

              <div className="flex gap-3 justify-center">
                <Link to="/">
                  <Button variant="outline">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
                <Button>Start Building This Page</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
