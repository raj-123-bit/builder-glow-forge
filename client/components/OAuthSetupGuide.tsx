import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Github,
  ExternalLink,
  Copy,
  CheckCircle,
  AlertCircle,
  Settings,
  Globe,
  Key,
} from "lucide-react";

// OAuth Setup Guide for Neural Architecture Search
// Built by Shaurya Upadhyay

export default function OAuthSetupGuide() {
  const [copied, setCopied] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const currentUrl = window.location.origin;
  const redirectUrl = `${currentUrl}/auth/callback`;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const googleSetupSteps = [
    {
      step: 1,
      title: "Go to Google Cloud Console",
      content:
        "Visit console.cloud.google.com and create a new project or select an existing one.",
    },
    {
      step: 2,
      title: "Enable Google+ API",
      content:
        "Navigate to 'APIs & Services' > 'Library' and enable the Google+ API.",
    },
    {
      step: 3,
      title: "Create OAuth Credentials",
      content:
        "Go to 'APIs & Services' > 'Credentials' and create OAuth 2.0 Client IDs.",
    },
    {
      step: 4,
      title: "Configure Authorized Redirect URIs",
      content: `Add the following redirect URI to your Google OAuth client:`,
    },
    {
      step: 5,
      title: "Add to Supabase",
      content:
        "Copy the Client ID and Client Secret to your Supabase project settings under Authentication > Providers > Google.",
    },
  ];

  const githubSetupSteps = [
    {
      step: 1,
      title: "Go to GitHub Settings",
      content:
        "Visit github.com/settings/developers and click 'New OAuth App'.",
    },
    {
      step: 2,
      title: "Fill Application Details",
      content:
        "Provide your application name, homepage URL, and authorization callback URL.",
    },
    {
      step: 3,
      title: "Set Authorization Callback URL",
      content: "Use the redirect URL provided below:",
    },
    {
      step: 4,
      title: "Get Client Credentials",
      content:
        "After creating the app, copy the Client ID and generate a Client Secret.",
    },
    {
      step: 5,
      title: "Configure in Supabase",
      content:
        "Add the Client ID and Client Secret to your Supabase project under Authentication > Providers > GitHub.",
    },
  ];

  if (!isOpen) {
    return (
      <div className="mb-4">
        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          className="w-full"
        >
          <Settings className="h-4 w-4 mr-2" />
          Configure OAuth Providers (Google & GitHub)
        </Button>
      </div>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              OAuth Provider Setup
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Configure Google and GitHub authentication for your Neural
              Architecture Search app
            </p>
          </div>
          <Button onClick={() => setIsOpen(false)} variant="ghost" size="sm">
            ✕
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
          <Globe className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            <strong>Redirect URL for OAuth:</strong>
            <div className="flex items-center gap-2 mt-2">
              <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded text-sm">
                {redirectUrl}
              </code>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(redirectUrl, "redirect")}
                className="h-6 w-6 p-0"
              >
                {copied === "redirect" ? (
                  <CheckCircle className="h-3 w-3 text-green-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="google" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="google" className="flex items-center gap-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </TabsTrigger>
            <TabsTrigger value="github" className="flex items-center gap-2">
              <Github className="h-4 w-4" />
              GitHub
            </TabsTrigger>
          </TabsList>

          <TabsContent value="google" className="mt-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="font-semibold">Google OAuth Setup</h3>
                <Badge variant="secondary">OAuth 2.0</Badge>
              </div>

              {googleSetupSteps.map((step) => (
                <div key={step.step} className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{step.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {step.content}
                    </p>
                    {step.step === 4 && (
                      <div className="flex items-center gap-2 mt-2">
                        <code className="bg-muted px-2 py-1 rounded text-sm">
                          {redirectUrl}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            copyToClipboard(redirectUrl, "google-redirect")
                          }
                          className="h-6 w-6 p-0"
                        >
                          {copied === "google-redirect" ? (
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <Button
                className="w-full mt-4"
                onClick={() =>
                  window.open("https://console.cloud.google.com", "_blank")
                }
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Google Cloud Console
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="github" className="mt-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="font-semibold">GitHub OAuth Setup</h3>
                <Badge variant="secondary">OAuth App</Badge>
              </div>

              {githubSetupSteps.map((step) => (
                <div key={step.step} className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{step.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {step.content}
                    </p>
                    {step.step === 3 && (
                      <div className="flex items-center gap-2 mt-2">
                        <code className="bg-muted px-2 py-1 rounded text-sm">
                          {redirectUrl}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            copyToClipboard(redirectUrl, "github-redirect")
                          }
                          className="h-6 w-6 p-0"
                        >
                          {copied === "github-redirect" ? (
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <Button
                className="w-full mt-4"
                onClick={() =>
                  window.open(
                    "https://github.com/settings/developers",
                    "_blank",
                  )
                }
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open GitHub Developer Settings
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <Alert className="mt-4 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            <strong>Important:</strong> After configuring OAuth providers in
            their respective platforms, make sure to enable them in your
            Supabase project dashboard under Authentication → Providers.
          </AlertDescription>
        </Alert>

        <div className="mt-4 text-xs text-muted-foreground text-center">
          <p>
            Built by Shaurya Upadhyay - Neural Architecture Search with Enhanced
            Authentication
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
