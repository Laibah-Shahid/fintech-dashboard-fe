import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { BarChart, Search, Filter, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import apiService, { Transaction } from "@/services/apiService";

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    type: "all",
    status: "all",
    category: "all",
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const result = await apiService.getTransactions(currentPage, pageSize);
        setTransactions(result.data);
        setTotalTransactions(result.total);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        toast({
          title: "Error",
          description: "Failed to load transactions. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [currentPage, pageSize, toast]);

  useEffect(() => {
    let result = [...transactions];

    if (filters.type !== "all") {
      result = result.filter(
        (transaction) => transaction.type === filters.type
      );
    }

    if (filters.status !== "all") {
      result = result.filter(
        (transaction) => transaction.status === filters.status
      );
    }

    if (filters.category !== "all") {
      result = result.filter(
        (transaction) => transaction.category === filters.category
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (transaction) =>
          transaction.description.toLowerCase().includes(query) ||
          transaction.category.toLowerCase().includes(query) ||
          transaction.id.toLowerCase().includes(query)
      );
    }

    setFilteredTransactions(result);
  }, [transactions, filters, searchQuery]);

  const formatCurrency = (amount: number, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  const getUniqueCategories = () => {
    const categories = transactions.map((t) => t.category);
    return [...new Set(categories)];
  };

  const totalPages = Math.ceil(totalTransactions / pageSize);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Transactions</h1>
        <p className="text-gray-400">
          View and manage your transaction history.
        </p>
      </div>

      <Card className="bg-secondary/20 mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </CardTitle>
          <CardDescription>
            Filter and search your transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Transaction Type
              </label>
              <Select
                value={filters.type}
                onValueChange={(value) =>
                  setFilters({ ...filters, type: value })
                }
              >
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-secondary border-white/10">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="credit">Credit</SelectItem>
                  <SelectItem value="debit">Debit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Status
              </label>
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  setFilters({ ...filters, status: value })
                }
              >
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-secondary border-white/10">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Category
              </label>
              <Select
                value={filters.category}
                onValueChange={(value) =>
                  setFilters({ ...filters, category: value })
                }
              >
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-secondary border-white/10">
                  <SelectItem value="all">All Categories</SelectItem>
                  {getUniqueCategories().map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search transactions..."
              className="pl-10 bg-white/5 border-white/10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-secondary/20 mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart className="h-5 w-5 mr-2" />
            Transaction History
          </CardTitle>
          <CardDescription>
            Showing {filteredTransactions.length} of {totalTransactions} transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="min-h-[300px] flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-fintech-purple" />
            </div>
          ) : filteredTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-3 text-sm font-medium text-gray-400">ID</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-400">Date</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-400">Description</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-400">Category</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-400">Status</th>
                    <th className="text-right p-3 text-sm font-medium text-gray-400">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="p-3 text-sm">
                        {transaction.id.substring(0, 8)}...
                      </td>
                      <td className="p-3 text-sm">
                        {formatDate(transaction.date)}
                      </td>
                      <td className="p-3">
                        {transaction.description}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-1 rounded-full text-xs bg-white/10">
                          {transaction.category}
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            transaction.status === "completed"
                              ? "bg-green-500/20 text-green-400"
                              : transaction.status === "pending"
                              ? "bg-amber-500/20 text-amber-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                      <td
                        className={`p-3 text-right font-medium ${
                          transaction.type === "credit"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {transaction.type === "credit" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="min-h-[300px] flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-400 mb-4">No transactions found</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setFilters({
                      type: "all",
                      status: "all",
                      category: "all",
                    });
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {!loading && filteredTransactions.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">Show</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => {
                setPageSize(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-20 bg-white/5 border-white/10">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent className="bg-secondary border-white/10">
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-400">per page</span>
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (page) =>
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                )
                .map((page, i, arr) => (
                  <React.Fragment key={page}>
                    {i > 0 && arr[i - 1] !== page - 1 && (
                      <PaginationItem>
                        <span className="px-4 py-2">...</span>
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={page === currentPage}
                        className={
                          page === currentPage
                            ? "bg-fintech-purple hover:bg-fintech-purple/90 border-fintech-purple/30"
                            : "bg-white/5 hover:bg-white/10 border-white/10"
                        }
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  </React.Fragment>
                ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Transactions;
