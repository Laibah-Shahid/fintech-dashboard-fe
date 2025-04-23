
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import apiService, { Account } from "@/services/apiService";

const transferSchema = z.object({
  fromAccount: z.string().min(1, "Source account is required"),
  toAccount: z.string().min(1, "Destination account is required"),
  amount: z.preprocess(
    (val) => (val === "" ? 0 : Number(val)),
    z.number().positive("Amount must be positive")
  ),
}).refine(
  (data) => data.fromAccount !== data.toAccount,
  {
    message: "Source and destination accounts must be different",
    path: ["toAccount"],
  }
);

type TransferFormValues = z.infer<typeof transferSchema>;

const BalanceTransfer = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [transferring, setTransferring] = useState(false);
  const { toast } = useToast();

  const form = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      fromAccount: "",
      toAccount: "",
      amount: undefined,
    },
  });

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const accountsData = await apiService.getBalance();
        setAccounts(accountsData);
      } catch (error) {
        console.error("Error fetching accounts:", error);
        toast({
          title: "Error",
          description: "Failed to load accounts. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [toast]);

  const onSubmit = async (values: TransferFormValues) => {
    setTransferring(true);
    try {
      // Call the transfer API
      const result = await apiService.transferFunds(
        values.fromAccount,
        values.toAccount,
        values.amount
      );
      
      // Success toast
      toast({
        title: "Transfer successful",
        description: result.message,
      });
      
      // Reset form
      form.reset();
      
      // Refresh account balances
      const updatedAccounts = await apiService.getBalance();
      setAccounts(updatedAccounts);
    } catch (error) {
      // Error toast
      toast({
        title: "Transfer failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setTransferring(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  };

  // Find account by ID
  const getAccount = (id: string) => {
    return accounts.find(account => account.id === id);
  };

  // Calculate max transfer amount based on selected source account
  const getMaxTransferAmount = () => {
    const fromAccountId = form.getValues("fromAccount");
    if (!fromAccountId) return 0;
    
    const account = getAccount(fromAccountId);
    return account ? account.balance : 0;
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Balance & Transfer</h1>
        <p className="text-gray-400">
          View your account balances and transfer funds between accounts.
        </p>
      </div>

      {/* Account cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {loading ? (
          Array(2).fill(0).map((_, i) => (
            <Card key={i} className="bg-secondary/20 min-h-[200px] flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-fintech-purple" />
            </Card>
          ))
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
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-400">Available Balance</div>
                    <div className="text-3xl font-bold">
                      {formatCurrency(account.balance, account.currency)}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-400">Account Number</div>
                      <div className="font-medium">•••• {account.accountNumber.slice(-4)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Routing Number</div>
                      <div className="font-medium">•••• {account.routingNumber.slice(-4)}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Transfer form */}
      <Card className="bg-secondary/20 mb-8">
        <CardHeader>
          <CardTitle>Transfer Funds</CardTitle>
          <CardDescription>
            Move money between your accounts in the sandbox
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="min-h-[200px] flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-fintech-purple" />
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* From Account */}
                  <FormField
                    control={form.control}
                    name="fromAccount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>From Account</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={transferring}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white/5 border-white/10">
                              <SelectValue placeholder="Select source account" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-secondary border-white/10">
                            {accounts.map((account) => (
                              <SelectItem key={account.id} value={account.id}>
                                {account.name} ({formatCurrency(account.balance)})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* To Account */}
                  <FormField
                    control={form.control}
                    name="toAccount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>To Account</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={transferring}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white/5 border-white/10">
                              <SelectValue placeholder="Select destination account" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-secondary border-white/10">
                            {accounts.map((account) => (
                              <SelectItem key={account.id} value={account.id}>
                                {account.name} ({formatCurrency(account.balance)})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Amount */}
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            $
                          </span>
                          <Input
                            type="number"
                            step="0.01"
                            min="0.01"
                            max={getMaxTransferAmount()}
                            placeholder="0.00"
                            className="pl-8 bg-white/5 border-white/10"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value)}
                            disabled={transferring}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Maximum transfer amount: {formatCurrency(getMaxTransferAmount())}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit button */}
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="bg-fintech-purple hover:bg-fintech-purple/90"
                    disabled={transferring}
                  >
                    {transferring ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Transfer Funds
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>

      {/* Transfer tips */}
      <Card className="bg-fintech-purple/10 border-fintech-purple/30">
        <CardHeader>
          <CardTitle>Transfer Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex">
              <ArrowRight className="h-5 w-5 text-fintech-purple mr-2 flex-shrink-0" />
              <span>Transfers between accounts are processed instantly in this sandbox.</span>
            </li>
            <li className="flex">
              <ArrowRight className="h-5 w-5 text-fintech-purple mr-2 flex-shrink-0" />
              <span>You can't transfer more than the available balance in your account.</span>
            </li>
            <li className="flex">
              <ArrowRight className="h-5 w-5 text-fintech-purple mr-2 flex-shrink-0" />
              <span>All transfers create transaction records that appear in your transaction history.</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default BalanceTransfer;
