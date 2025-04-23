
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CreditCard,
  FileText,
  BarChart,
  Users,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    // Close sidebar on mobile when changing routes
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [location.pathname, isMobile]);

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Balance & Transfer",
      href: "/dashboard/balance",
      icon: CreditCard,
    },
    {
      name: "Transactions",
      href: "/dashboard/transactions",
      icon: BarChart,
    },
    {
      name: "Invoices",
      href: "/dashboard/invoices",
      icon: FileText,
    },
  ];

  // Admin-only navigation items
  const adminItems = [
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
    },
  ];

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="h-screen flex overflow-hidden bg-fintech-dark-purple">
      {/* Mobile sidebar toggle */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-secondary/50 backdrop-blur-sm"
        >
          {sidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform bg-secondary/30 backdrop-blur-md border-r border-white/10 transition-all duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0 md:relative md:flex"
        )}
      >
        <div className="flex flex-col h-full w-full">
          {/* Logo */}
          <div className="px-6 py-4 border-b border-white/10">
            <Link to="/dashboard" className="flex items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-fintech-purple text-white">
                <FileText className="h-5 w-5" />
              </div>
              <span className="ml-3 text-xl font-bold text-white">
                FinAPI Sandbox
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {navigationItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center px-4 py-3 text-sm rounded-md hover:bg-white/10 transition-colors",
                      location.pathname === item.href
                        ? "bg-fintech-purple/20 text-fintech-purple font-medium"
                        : "text-white/80"
                    )}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                </li>
              ))}

              {/* Admin section */}
              {user?.role === "admin" && (
                <>
                  <li className="pt-4 pb-2">
                    <div className="px-4 text-xs font-semibold text-white/50 uppercase tracking-wider">
                      Admin
                    </div>
                  </li>
                  {adminItems.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={cn(
                          "flex items-center px-4 py-3 text-sm rounded-md hover:bg-white/10 transition-colors",
                          location.pathname === item.href
                            ? "bg-fintech-purple/20 text-fintech-purple font-medium"
                            : "text-white/80"
                        )}
                      >
                        <item.icon className="h-5 w-5 mr-3" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </>
              )}
            </ul>
          </nav>

          {/* User profile */}
          <div className="p-4 border-t border-white/10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start px-4 py-3 text-sm text-white/80 hover:bg-white/10"
                >
                  <Avatar className="h-7 w-7 mr-3 bg-fintech-purple">
                    <AvatarFallback>
                      {user?.name ? getInitials(user.name) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <div className="font-medium truncate max-w-[120px]">
                      {user?.name || "User"}
                    </div>
                    <div className="text-xs text-white/50">
                      {user?.subscriptionTier
                        ? `${user.subscriptionTier} plan`
                        : "Not subscribed"}
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/pricing">Subscription</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="text-red-500 focus:text-red-500 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
