
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, BarChart, FileText, ArrowRight, Loader2 } from "lucide-react";
import apiService, { Account, Transaction } from "@/services/apiService";

const Dashboard = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState({
    accounts: true,
    transactions: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch account balances
        const accountsData = await apiService.getBalance();
        setAccounts(accountsData);
        setLoading(prev => ({ ...prev, accounts: false }));

        // Fetch recent transactions (first 5)
        const transactionsData = await apiService.getTransactions(1, 5);
        setRecentTransactions(transactionsData.data);
        setLoading(prev => ({ ...prev, transactions: false }));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading({ accounts: false, transactions: false });
      }
    };

    fetchData();
  }, []);

  // Format currency
  const formatCurrency = (amount: number, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  return (
    <DashboardLayout>
      {/* Welcome header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name.split(" ")[0]}
        </h1>
        <p className="text-gray-400">
          Here's an overview of your FinAPI sandbox.
        </p>
      </div>

      {/* Subscription status card for non-subscribed users */}
      {!user?.isSubscribed && (
        <Card className="bg-secondary/20 mb-8 border-fintech-purple">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center">
              <div className="flex-1 mb-4 md:mb-0">
                <h3 className="text-xl font-semibold mb-2">
                  Subscribe to Access All Features
                </h3>
                <p className="text-gray-400">
                  You need a subscription to use the FinAPI sandbox features.
                  Choose a plan to continue.
                </p>
              </div>
              <Button asChild className="bg-fintech-purple hover:bg-fintech-purple/90">
                <Link to="/pricing">
                  View Plans
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Account balances */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {loading.accounts ? (
          <Card className="bg-secondary/20 col-span-full min-h-[200px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-fintech-purple" />
          </Card>
        ) : (
          accounts.map((account) => (
            <Card key={account.id} className="bg-secondary/20">
              <CardHeader>
                <CardTitle>{account.name}</CardTitle>
                <CardDescription>
                  Account: •••• {account.accountNumber.slice(-4)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">
                  {formatCurrency(account.balance, account.currency)}
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link to="/dashboard/balance">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Manage Account
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Recent transactions */}
      <Card className="bg-secondary/20 mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest activity</CardDescription>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/dashboard/transactions">
              <BarChart className="mr-2 h-4 w-4" />
              View All
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {loading.transactions ? (
            <div className="min-h-[200px] flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-fintech-purple" />
            </div>
          ) : recentTransactions.length > 0 ? (
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                >
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                        transaction.type === "credit"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {transaction.type === "credit" ? "+" : "-"}
                    </div>
                    <div>
                      <div className="font-medium">{transaction.description}</div>
                      <div className="text-sm text-gray-400">{formatDate(transaction.date)}</div>
                    </div>
                  </div>
                  <div
                    className={`font-bold ${
                      transaction.type === "credit" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {transaction.type === "credit" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              No transactions found
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-secondary/20">
          <CardHeader>
            <CardTitle>Transfer Funds</CardTitle>
            <CardDescription>
              Move money between accounts
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <Button asChild className="w-full bg-fintech-purple hover:bg-fintech-purple/90">
              <Link to="/dashboard/balance">
                <CreditCard className="mr-2 h-4 w-4" />
                Start Transfer
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-secondary/20">
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>
              View your past activity
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <Button asChild className="w-full bg-fintech-purple hover:bg-fintech-purple/90">
              <Link to="/dashboard/transactions">
                <BarChart className="mr-2 h-4 w-4" />
                View Transactions
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-secondary/20">
          <CardHeader>
            <CardTitle>Generate Invoice</CardTitle>
            <CardDescription>
              Create custom invoices
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <Button asChild className="w-full bg-fintech-purple hover:bg-fintech-purple/90">
              <Link to="/dashboard/invoices">
                <FileText className="mr-2 h-4 w-4" />
                Create Invoice
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
