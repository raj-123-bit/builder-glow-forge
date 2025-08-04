import React from "react";
import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import ArchitectureDetails from "./pages/ArchitectureDetails";
import Experiments from "./pages/Experiments";
import Datasets from "./pages/Datasets";
import NotFound from "./pages/NotFound";
import AuthAwareAIChatWidget from "./components/AuthAwareAIChatWidget";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/architecture/:id" element={<ArchitectureDetails />} />
            <Route path="/experiments" element={<Experiments />} />
            <Route path="/datasets" element={<Datasets />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <AuthAwareAIChatWidget />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

// Prevent multiple createRoot calls during development
const rootElement = document.getElementById("root")! as HTMLElement & {
  _reactRoot?: any;
};
if (!rootElement._reactRoot) {
  const root = createRoot(rootElement);
  rootElement._reactRoot = root;
  root.render(<App />);
} else {
  rootElement._reactRoot.render(<App />);
}
