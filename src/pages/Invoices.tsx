
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Loader2, FileText, Download } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import apiService, { InvoiceData } from "@/services/apiService";

const invoiceSchema = z.object({
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }),
}).refine(
  (data) => data.startDate <= data.endDate,
  {
    message: "End date cannot be before start date",
    path: ["endDate"],
  }
);

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

const Invoices = () => {
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const { toast } = useToast();

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      startDate: new Date(new Date().setDate(1)), // First day of current month
      endDate: new Date(), // Today
    },
  });

  const onSubmit = async (values: InvoiceFormValues) => {
    setLoading(true);
    try {
      // Format dates for API
      const startDate = format(values.startDate, "yyyy-MM-dd'T'HH:mm:ss");
      const endDate = format(values.endDate, "yyyy-MM-dd'T'HH:mm:ss");
      
      // Generate invoice
      const invoiceData = await apiService.generateInvoice(startDate, endDate);
      setInvoice(invoiceData);
      
      toast({
        title: "Invoice generated",
        description: "Your invoice has been successfully generated.",
      });
    } catch (error) {
      console.error("Error generating invoice:", error);
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMMM d, yyyy");
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Invoices</h1>
        <p className="text-gray-400">
          Generate and download custom invoices.
        </p>
      </div>

      {/* Invoice generator form */}
      <Card className="bg-secondary/20 mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Generate Invoice
          </CardTitle>
          <CardDescription>
            Specify the date range for your invoice
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Start Date */}
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal bg-white/5 border-white/10",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-secondary border-white/10" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("2000-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* End Date */}
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal bg-white/5 border-white/10",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-secondary border-white/10" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("2000-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit button */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-fintech-purple hover:bg-fintech-purple/90"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Invoice
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Generated Invoice */}
      {invoice && (
        <Card className="bg-white text-black mb-8">
          <CardContent className="p-8">
            <div className="flex justify-between items-start mb-12">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">INVOICE</h2>
                <p className="text-gray-500 mt-1">#{invoice.id}</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-fintech-purple">FinAPI Sandbox</div>
                <div className="text-gray-600 mt-1">123 Fintech Street</div>
                <div className="text-gray-600">San Francisco, CA 94103</div>
                <div className="text-gray-600">contact@finapi-sandbox.com</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div>
                <div className="text-gray-500 font-medium mb-2">Bill To:</div>
                <div className="text-gray-800 font-medium">Demo User</div>
                <div className="text-gray-600">demo@example.com</div>
                <div className="text-gray-600 mt-2">
                  Client ID: DEMO-12345
                </div>
              </div>
              <div className="md:text-right">
                <div className="grid grid-cols-2 gap-1 text-sm">
                  <div className="text-gray-500">Invoice Date:</div>
                  <div className="text-gray-800 md:text-right">
                    {formatDate(invoice.date)}
                  </div>
                  <div className="text-gray-500">Due Date:</div>
                  <div className="text-gray-800 md:text-right">
                    {formatDate(invoice.dueDate)}
                  </div>
                  <div className="text-gray-500">Status:</div>
                  <div className="md:text-right">
                    <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-600 font-medium">
                      {invoice.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-12">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 text-left font-semibold text-gray-600">Description</th>
                    <th className="py-3 text-center font-semibold text-gray-600">Quantity</th>
                    <th className="py-3 text-right font-semibold text-gray-600">Unit Price</th>
                    <th className="py-3 text-right font-semibold text-gray-600">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-4 text-gray-800">{item.description}</td>
                      <td className="py-4 text-center text-gray-600">{item.quantity}</td>
                      <td className="py-4 text-right text-gray-600">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="py-4 text-right text-gray-800">
                        {formatCurrency(item.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col items-end">
              <div className="w-full max-w-xs">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <div className="text-gray-600">Subtotal:</div>
                  <div className="font-medium">{formatCurrency(invoice.total)}</div>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <div className="text-gray-600">Tax (0%):</div>
                  <div className="font-medium">{formatCurrency(0)}</div>
                </div>
                <div className="flex justify-between py-3 text-lg font-bold">
                  <div>Total:</div>
                  <div className="text-fintech-purple">{formatCurrency(invoice.total)}</div>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-gray-500 text-sm mb-2">
                Thank you for using FinAPI Sandbox.
              </p>
              <Button className="bg-fintech-purple hover:bg-fintech-purple/90">
                <Download className="mr-2 h-4 w-4" />
                Download Invoice
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info card */}
      {!invoice && (
        <Card className="bg-fintech-purple/10 border-fintech-purple/30">
          <CardHeader>
            <CardTitle>Create Your First Invoice</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              In this sandbox environment, you can generate test invoices based on
              a date range. The system will create a realistic invoice with random
              line items and amounts.
            </p>
            <p>
              This feature is useful for testing invoice generation and download
              functionality in your financial applications.
            </p>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default Invoices;
