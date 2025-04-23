
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Pricing from "./pages/Pricing";
import BalanceTransfer from "./pages/BalanceTransfer";
import Transactions from "./pages/Transactions";
import Invoices from "./pages/Invoices";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/pricing" element={<Pricing />} />
            
            {/* Protected routes (require authentication) */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute requireSubscription={false}>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected routes (require subscription) */}
            <Route 
              path="/dashboard/balance" 
              element={
                <ProtectedRoute>
                  <BalanceTransfer />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/transactions" 
              element={
                <ProtectedRoute>
                  <Transactions />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/invoices" 
              element={
                <ProtectedRoute>
                  <Invoices />
                </ProtectedRoute>
              } 
            />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
