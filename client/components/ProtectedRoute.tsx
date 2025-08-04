import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from './AuthComponents';
import { Loader2 } from 'lucide-react';

// Protected Route component for Neural Architecture Search
// Built by Shaurya Upadhyay

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return fallback || (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Authentication Required</h1>
            <p className="text-muted-foreground">
              Please sign in to access Neural Architecture Search features
            </p>
          </div>
          <AuthModal />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Hook to conditionally render content based on auth status
export function useAuthContent() {
  const { user, loading } = useAuth();

  const AuthGate = ({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) => {
    if (loading) {
      return (
        <div className="text-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      );
    }

    if (!user) {
      return fallback || (
        <div className="text-center py-8 px-4">
          <h3 className="text-lg font-semibold mb-2">Sign In Required</h3>
          <p className="text-muted-foreground mb-4">
            Sign in to save your experiments and track your progress
          </p>
        </div>
      );
    }

    return <>{children}</>;
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    AuthGate
  };
}
