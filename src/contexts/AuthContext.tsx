
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Mock API endpoint for future Supabase integration
const API_BASE_URL = "/api";

type User = {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  isSubscribed: boolean;
  subscriptionTier?: "basic" | "pro" | "enterprise";
  subscriptionExpiresAt?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  logout: () => void;
  checkToken: () => boolean;
  updateSubscription: (tier: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for development
const MOCK_USERS = [
  {
    id: "user-1",
    email: "demo@example.com",
    name: "Demo User",
    password: "password",
    role: "user" as const,
    isSubscribed: false,
  },
  {
    id: "admin-1",
    email: "admin@example.com",
    name: "Admin User",
    password: "password",
    role: "admin" as const,
    isSubscribed: true,
    subscriptionTier: "enterprise" as const,
    subscriptionExpiresAt: "2025-12-31T23:59:59Z",
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check for stored token on initial load
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("fintech_token");
      if (token) {
        const storedUser = localStorage.getItem("fintech_user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication logic
      const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        throw new Error("Invalid credentials");
      }
      
      // Remove password from user object
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Create mock JWT
      const mockToken = btoa(JSON.stringify({ id: foundUser.id, email: foundUser.email, role: foundUser.role }));
      
      // Store in localStorage
      localStorage.setItem("fintech_token", mockToken);
      localStorage.setItem("fintech_user", JSON.stringify(userWithoutPassword));
      
      setUser(userWithoutPassword);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${foundUser.name}!`,
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, name: string, password: string) => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      if (MOCK_USERS.some(u => u.email === email)) {
        throw new Error("Email already registered");
      }
      
      // In a real app, we would make an API call here
      // For now, we'll just pretend it was successful
      
      toast({
        title: "Registration successful",
        description: "You can now log in with your credentials.",
      });
      
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("fintech_token");
    localStorage.removeItem("fintech_user");
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/login");
  };

  const checkToken = () => {
    return !!localStorage.getItem("fintech_token");
  };

  const updateSubscription = (tier: string) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      isSubscribed: true,
      subscriptionTier: tier as "basic" | "pro" | "enterprise",
      subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    };
    
    setUser(updatedUser);
    localStorage.setItem("fintech_user", JSON.stringify(updatedUser));
    
    toast({
      title: "Subscription updated",
      description: `You are now subscribed to the ${tier} plan.`,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        checkToken,
        updateSubscription,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
