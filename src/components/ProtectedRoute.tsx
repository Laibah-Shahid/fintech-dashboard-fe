
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireSubscription?: boolean;
  adminOnly?: boolean;
}

const ProtectedRoute = ({
  children,
  requireSubscription = true,
  adminOnly = false,
}: ProtectedRouteProps) => {
  const { user, loading, checkToken } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex-center">
        <Loader2 className="h-8 w-8 animate-spin text-fintech-purple" />
      </div>
    );
  }

  // Check if user is logged in
  if (!checkToken()) {
    return <Navigate to="/login" replace />;
  }

  // Check if admin route
  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  // Check subscription if required
  if (requireSubscription && !user?.isSubscribed) {
    return <Navigate to="/pricing" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
