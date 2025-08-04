import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  User,
  Mail,
  Lock,
  UserPlus,
  LogIn,
  LogOut,
  Brain,
  Loader2,
  AlertCircle,
  CheckCircle,
  Github,
} from "lucide-react";

// Authentication Components for Neural Architecture Search
// Built by Shaurya Upadhyay

interface AuthFormProps {
  onSuccess?: () => void;
}

export function AuthModal({ onSuccess }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState("signin");

  const { signIn, signUp, signInWithGoogle, signInWithGitHub, resetPassword } = useAuth();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setMessage(null);

    const { error } = await signIn(email, password);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Successfully signed in!" });
      onSuccess?.();
    }

    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setMessage(null);

    const { error } = await signUp(email, password, { full_name: fullName });

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({
        type: "success",
        text: "Check your email to confirm your account!",
      });
    }

    setLoading(false);
  };

  const handleResetPassword = async () => {
    if (!email) {
      setMessage({ type: "error", text: "Please enter your email address" });
      return;
    }

    setLoading(true);
    setMessage(null);

    const { error } = await resetPassword(email);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Password reset email sent!" });
    }

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setMessage(null);

    const { error } = await signInWithGoogle();

    if (error) {
      setMessage({ type: "error", text: error.message });
      setLoading(false);
    }
    // Note: Don't set loading to false here as OAuth redirects the page
  };

  const handleGitHubSignIn = async () => {
    setLoading(true);
    setMessage(null);

    const { error } = await signInWithGitHub();

    if (error) {
      setMessage({ type: "error", text: error.message });
      setLoading(false);
    }
    // Note: Don't set loading to false here as OAuth redirects the page
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setFullName("");
    setMessage(null);
  };

  return (
    <Card className="w-full max-w-md mx-auto border-border bg-card">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-3 bg-primary/20 rounded-full w-fit">
          <Brain className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-xl">Neural Architecture Search</CardTitle>
        <p className="text-sm text-muted-foreground">
          Built by Shaurya Upadhyay
        </p>
      </CardHeader>
      <CardContent>
        <Tabs
          value={activeTab}
          onValueChange={(tab) => {
            setActiveTab(tab);
            resetForm();
          }}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="•••••���••"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="link"
                onClick={handleResetPassword}
                disabled={loading}
                className="w-full text-sm"
              >
                Forgot your password?
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Full Name (Optional)</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Shaurya Upadhyay"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10"
                    required
                    minLength={6}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Password must be at least 6 characters
                </p>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create Account
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {message && (
          <Alert
            className={`mt-4 ${
              message.type === "success"
                ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20"
                : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription
              className={
                message.type === "success"
                  ? "text-green-800 dark:text-green-200"
                  : "text-red-800 dark:text-red-200"
              }
            >
              {message.text}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

export function UserProfile() {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    await signOut();
    setLoading(false);
  };

  if (!user) return null;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-primary/20 rounded-full">
          <User className="h-4 w-4 text-primary" />
        </div>
        <div className="hidden sm:block">
          <div className="text-sm font-medium">
            {user.user_metadata?.full_name || user.email?.split("@")[0]}
          </div>
          <div className="text-xs text-muted-foreground">{user.email}</div>
        </div>
      </div>

      <Button
        onClick={handleSignOut}
        disabled={loading}
        variant="outline"
        size="sm"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </>
        )}
      </Button>
    </div>
  );
}

export function AuthButton() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  if (user) {
    return <UserProfile />;
  }

  return (
    <>
      <Button onClick={() => setShowModal(true)} variant="outline">
        <LogIn className="h-4 w-4 mr-2" />
        Sign In
      </Button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="relative">
            <Button
              onClick={() => setShowModal(false)}
              variant="ghost"
              size="sm"
              className="absolute -top-2 -right-2 z-10"
            >
              ✕
            </Button>
            <AuthModal onSuccess={() => setShowModal(false)} />
          </div>
        </div>
      )}
    </>
  );
}

export function AuthStatus() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Badge variant="secondary">
        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
        Loading...
      </Badge>
    );
  }

  if (user) {
    return (
      <Badge variant="default" className="bg-green-600 hover:bg-green-700">
        <CheckCircle className="h-3 w-3 mr-1" />
        Authenticated
      </Badge>
    );
  }

  return (
    <Badge variant="secondary">
      <User className="h-3 w-3 mr-1" />
      Not Signed In
    </Badge>
  );
}
