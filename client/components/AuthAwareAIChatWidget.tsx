import React, { Component, ReactNode, useContext, useState, useEffect } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import AIChatWidget from "./AIChatWidget";

// Error boundary for auth-related components
class AuthErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI
    if (error.message.includes("useAuth must be used within an AuthProvider")) {
      console.log("Auth error caught in boundary, using fallback widget");
      return { hasError: true };
    }
    return null;
  }

  componentDidCatch(error: Error, errorInfo: any) {
    if (error.message.includes("useAuth must be used within an AuthProvider")) {
      console.log("Auth context not available, using fallback chat widget");
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

// Safe auth-aware version of the chat widget
function AuthEnabledChatWidget() {
  const [authAvailable, setAuthAvailable] = useState<boolean | null>(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Safely check if auth context is available
    try {
      const authContext = useContext(AuthContext);
      if (authContext) {
        setAuthAvailable(true);
        setUser(authContext.user);
      } else {
        setAuthAvailable(false);
      }
    } catch (error) {
      console.log("Auth context check failed:", error);
      setAuthAvailable(false);
    }
  }, []);

  // Show loading state while checking auth availability
  if (authAvailable === null) {
    return <AIChatWidget />;
  }

  // Auth context is available
  if (authAvailable) {
    return <AIChatWidget />;
  }

  // Auth context not available, use fallback
  return <AIChatWidget />;
}

// Hook-based approach for safer auth usage
function useAuthSafely() {
  try {
    const authContext = useContext(AuthContext);
    return authContext || null;
  } catch (error) {
    console.log("Auth context not available:", error);
    return null;
  }
}

// Alternative implementation using the safe hook
function SafeAuthChatWidget() {
  const authContext = useAuthSafely();
  
  // Just render the chat widget regardless of auth state
  // The chat widget itself handles auth internally
  return <AIChatWidget />;
}

// Main component that handles auth availability
export default function AuthAwareAIChatWidget() {
  return (
    <AuthErrorBoundary fallback={<AIChatWidget />}>
      <SafeAuthChatWidget />
    </AuthErrorBoundary>
  );
}
