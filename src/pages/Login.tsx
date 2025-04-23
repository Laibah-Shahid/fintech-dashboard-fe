
import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FileText, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof formSchema>;

const Login = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    setError(null);
    try {
      await login(data.email, data.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-fintech-dark-purple p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-fintech-purple text-white">
              <FileText className="h-5 w-5" />
            </div>
            <span className="ml-3 text-xl font-bold text-white">FinAPI Sandbox</span>
          </Link>
          <h1 className="mt-6 text-3xl font-bold text-white">Welcome back</h1>
          <p className="mt-2 text-gray-400">
            Log in to continue to FinAPI sandbox
          </p>
        </div>

        <div className="bg-secondary/30 backdrop-blur-sm rounded-xl p-8 border border-white/5 shadow-xl">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="you@example.com" 
                        {...field} 
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...field} 
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-fintech-purple hover:bg-fintech-purple/90"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Log in"
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <Link to="/register" className="text-fintech-purple hover:underline">
                Register
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-sm text-gray-400 mb-4">Demo Accounts:</p>
            <div className="grid grid-cols-1 gap-3 text-xs text-gray-300">
              <div className="bg-white/5 rounded p-2">
                <div><strong>Email:</strong> demo@example.com</div>
                <div><strong>Password:</strong> password</div>
                <div className="text-gray-400 mt-1">Regular user account</div>
              </div>
              <div className="bg-white/5 rounded p-2">
                <div><strong>Email:</strong> admin@example.com</div>
                <div><strong>Password:</strong> password</div>
                <div className="text-gray-400 mt-1">Admin account (pre-subscribed)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
