import React, { Component, ReactNode, useContext } from "react";
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
  // Use useContext directly to safely check if auth context is available
  const authContext = useContext(AuthContext);
  
  // If auth context is not available, just render the basic widget
  if (!authContext) {
    console.log("Auth context not available, rendering basic chat widget");
    return <AIChatWidget />;
  }

  const { user } = authContext;

  // Pass user info to the chat widget via props or context
  return <AIChatWidget />;
}

// Main component that handles auth availability
export default function AuthAwareAIChatWidget() {
  return (
    <AuthErrorBoundary fallback={<AIChatWidget />}>
      <AuthEnabledChatWidget />
    </AuthErrorBoundary>
  );
}
