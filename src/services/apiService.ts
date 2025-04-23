
// Mock data generation functions
import { toast } from "@/hooks/use-toast";

// Types
export interface Transaction {
  id: string;
  date: string;
  type: "debit" | "credit";
  amount: number;
  description: string;
  status: "pending" | "completed" | "failed";
  category: string;
}

export interface Account {
  id: string;
  name: string;
  balance: number;
  currency: string;
  accountNumber: string;
  routingNumber: string;
}

export interface InvoiceData {
  id: string;
  date: string;
  dueDate: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }>;
  total: number;
  status: "paid" | "pending" | "overdue";
}

// Mock accounts data
const mockAccounts: Account[] = [
  {
    id: "acc-1",
    name: "Checking Account",
    balance: 5245.75,
    currency: "USD",
    accountNumber: "9374846271",
    routingNumber: "072403952",
  },
  {
    id: "acc-2",
    name: "Savings Account",
    balance: 12735.40,
    currency: "USD",
    accountNumber: "8362719405",
    routingNumber: "072403952",
  },
];

// Generate random transactions
const generateTransactions = (count: number): Transaction[] => {
  const transactions: Transaction[] = [];
  const categories = [
    "Groceries",
    "Entertainment",
    "Transportation",
    "Dining",
    "Shopping",
    "Utilities",
    "Health",
    "Travel",
  ];
  
  const descriptions = [
    "Payment to merchant",
    "Online purchase",
    "Subscription payment",
    "Transfer",
    "Bill payment",
    "Direct deposit",
    "ATM withdrawal",
    "Service fee",
  ];
  
  for (let i = 0; i < count; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    const type = Math.random() > 0.5 ? "debit" : "credit";
    const amount = parseFloat((Math.random() * 500 + 10).toFixed(2));
    const category = categories[Math.floor(Math.random() * categories.length)];
    const description = descriptions[Math.floor(Math.random() * descriptions.length)];
    const status = Math.random() > 0.9 ? "pending" : "completed";
    
    transactions.push({
      id: `tx-${i + 1}`,
      date: date.toISOString(),
      type,
      amount,
      description,
      status,
      category,
    });
  }
  
  // Sort by date, newest first
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Generate mock invoice
const generateInvoice = (startDate: string, endDate: string): InvoiceData => {
  const items = [
    {
      description: "API Calls - Basic Tier",
      quantity: Math.floor(Math.random() * 500) + 100,
      unitPrice: 0.01,
      amount: 0,
    },
    {
      description: "Premium Features Access",
      quantity: 1,
      unitPrice: 29.99,
      amount: 29.99,
    },
    {
      description: "Data Storage (GB)",
      quantity: Math.floor(Math.random() * 20) + 5,
      unitPrice: 0.5,
      amount: 0,
    },
    {
      description: "Support Requests",
      quantity: Math.floor(Math.random() * 5),
      unitPrice: 15,
      amount: 0,
    },
  ];
  
  // Calculate amounts
  items.forEach(item => {
    item.amount = parseFloat((item.quantity * item.unitPrice).toFixed(2));
  });
  
  // Calculate total
  const total = items.reduce((sum, item) => sum + item.amount, 0);
  
  const currentDate = new Date();
  const dueDate = new Date(currentDate);
  dueDate.setDate(dueDate.getDate() + 15);
  
  return {
    id: `inv-${Date.now()}`,
    date: currentDate.toISOString(),
    dueDate: dueDate.toISOString(),
    items,
    total,
    status: "pending",
  };
};

// Mock transactions
const mockTransactions = generateTransactions(50);

// API service with rate limiting simulation
class ApiService {
  private token: string | null = null;
  private requestCount: number = 0;
  private lastRequestTime: number = 0;
  private rateLimitReset: number = 0;

  // Mock rate limiting (10 requests per minute)
  private checkRateLimit(): boolean {
    const now = Date.now();
    
    // Reset counter if more than a minute has passed
    if (now - this.lastRequestTime > 60000) {
      this.requestCount = 0;
      this.rateLimitReset = now + 60000;
    }
    
    this.requestCount++;
    this.lastRequestTime = now;
    
    // Check if rate limit exceeded
    if (this.requestCount > 10) {
      toast({
        title: "Rate limit exceeded",
        description: "You've exceeded the rate limit of 10 requests per minute",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  }

  // Set token from auth context
  setToken(token: string) {
    this.token = token;
  }

  // Clear token on logout
  clearToken() {
    this.token = null;
  }

  // Get account balance
  async getBalance(): Promise<Account[]> {
    if (!this.checkRateLimit()) {
      throw new Error("Rate limit exceeded");
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return [...mockAccounts];
  }

  // Get transactions with pagination
  async getTransactions(page = 1, pageSize = 10): Promise<{ data: Transaction[], total: number }> {
    if (!this.checkRateLimit()) {
      throw new Error("Rate limit exceeded");
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedData = mockTransactions.slice(start, end);
    
    return {
      data: paginatedData,
      total: mockTransactions.length,
    };
  }

  // Create a fund transfer between accounts
  async transferFunds(fromAccountId: string, toAccountId: string, amount: number): Promise<{ success: boolean, message: string }> {
    if (!this.checkRateLimit()) {
      throw new Error("Rate limit exceeded");
    }
    
    // Validate accounts
    const fromAccount = mockAccounts.find(acc => acc.id === fromAccountId);
    const toAccount = mockAccounts.find(acc => acc.id === toAccountId);
    
    if (!fromAccount || !toAccount) {
      throw new Error("One or both accounts not found");
    }
    
    if (fromAccount.balance < amount) {
      throw new Error("Insufficient funds");
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update account balances
    fromAccount.balance = parseFloat((fromAccount.balance - amount).toFixed(2));
    toAccount.balance = parseFloat((toAccount.balance + amount).toFixed(2));
    
    // Create new transaction records
    const txDate = new Date().toISOString();
    const txId = `tx-${Date.now()}`;
    
    mockTransactions.unshift({
      id: `${txId}-debit`,
      date: txDate,
      type: "debit",
      amount,
      description: `Transfer to ${toAccount.name}`,
      status: "completed",
      category: "Transfer",
    });
    
    mockTransactions.unshift({
      id: `${txId}-credit`,
      date: txDate,
      type: "credit",
      amount,
      description: `Transfer from ${fromAccount.name}`,
      status: "completed",
      category: "Transfer",
    });
    
    return {
      success: true,
      message: `Successfully transferred $${amount} from ${fromAccount.name} to ${toAccount.name}`,
    };
  }

  // Generate an invoice for a specific period
  async generateInvoice(startDate: string, endDate: string): Promise<InvoiceData> {
    if (!this.checkRateLimit()) {
      throw new Error("Rate limit exceeded");
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    return generateInvoice(startDate, endDate);
  }
}

export default new ApiService();
